var td_counter = 0;
var global_num_raw_material = 0
var global_num_bases = 0
var global_baseClassName = []
var global_sw = []
var global_data = ''
var _sum_ti = 0.0
var h2o = 0.0
var global_more_rawMaterial = 0
var global_inputValues = []
var global_colorStrength = false
var global_popupNewProd = false

function generateTable(id){
    showGenerateBtn()

    var num_raw_material = document.getElementById('input_grid').value
    var num_bases = document.getElementById('input_grid2').value
    global_num_raw_material = num_raw_material
    global_num_bases = num_bases

    /*
    *       some check before generate the table
    */
    if (num_raw_material.includes(".") || num_raw_material.includes("-") || num_bases.includes(".") || num_bases.includes("-")){
        var msg = "OPS! The value you added in a field contains a dot or a minus.."
        $("#msg-modal").html(msg)
        $("#myModal").modal()
        clean_after_wrong_input()
        return;
    }
    if (num_bases < 2 || num_raw_material < 4 || num_bases == "" || num_raw_material == ""){
        var msg = "OPS! You left some field blank or you typed a lower number for generate Raw Materials or Bases"
        $("#msg-modal").html(msg)
        $("#myModal").modal()
        clean_after_wrong_input()
        return;
    }

    hideGridGenerator()

    /*
    *       generate the table
    */
    var thead_col = ["Raw material", "Specific weight [g/mL]", "RM cost"]
    var thead_col_base = ["%<sub>w/w</sub>", "mL/100g", "%<sub>v/v</sub>", "mL/1000g", "Formula Cost"]
    var thead_col_master = ["TiO<sub>2</sub> removing", "%<sub>v/v</sub>", "g/100mL", "%<sub>w/w</sub>", "Formula Cost"]
    var myTableDiv = document.getElementById("myGeneratedTable")

    var table = document.createElement('TABLE')
    table.id = "generatedTable"
    var tableHead = document.createElement('THEAD')
    var tableBody = document.createElement('TBODY')
    var tableFoot = document.createElement('TFOOT')
    table.appendChild(tableHead)
    table.appendChild(tableBody)
    table.appendChild(tableFoot)

    tableFoot.style.borderStyle = "solid"
    tableFoot.style.borderColor = "black"

        // creation of thead for the table
    var tr_head2 = document.createElement('tr')
    tableHead.appendChild(tr_head2)
    var thead_bases = ["", "", "", "BASE1 (pastel)", "TiO<sub>2</sub> slurry"]  
    addTheadBases(tr_head2, thead_bases)
    var tr_head = document.createElement('tr')
    tableHead.appendChild(tr_head)
    var list_of_thead = returnTheadList(thead_col, thead_col_base)
    creationTHead(tr_head, list_of_thead)

        // creation of tbody for the table
    creationTBody(num_raw_material, tableBody)

        // creation of tfoot for the table
    // var table_tfoot = document.getElementsByTagName('tfoot')
    // if(table_tfoot){
    //     alert("DAMN IT! esisto già")
    // }
    var tr_foot = document.createElement('tr')
    tableFoot.appendChild(tr_foot)
    creationTFoot(tableFoot, tr_foot)

    myTableDiv.appendChild(table)
    setClassesForCalculation()
}

function creationTHead(tr_head, list_of_thead){
    for (var j=0; j < list_of_thead.length; j++){
        for (var i=0; i< list_of_thead[j].length; i++) {
            var td = document.createElement('TD')
            td.innerHTML = list_of_thead[j][i]
            td.style.fontWeight = "bold"
            td.style.minWidth = "80px"
            td.style.textAlign = "center"
            tr_head.appendChild(td)
            td_counter++
        }
    }
}

function creationTBody(num_raw_material, tableBody){
    var defaultRawMaterial = ['H<sub>2</sub>O', 'Binder', 'TiO<sub>2</sub>', 'Ext TiO<sub>2</sub>']

    var indexInput=[1,2,3]
    for(var q = 0; q<global_num_bases; q++){
        var calcTmpValue = 3+(5*(q+1))    //8, 13, 18 ...
        indexInput.push(calcTmpValue)
    }

    for (var i = 0; i< num_raw_material; i ++){
        var tr_body = document.createElement('tr')
        tableBody.appendChild(tr_body)

        for (var j=0; j< td_counter; j++){
            var td = document.createElement('TD')
            td.style.height = "30px"

            if (j == 0 && i < 4){
                td.innerHTML = defaultRawMaterial[i]
                td.contentEditable = false
                td.style.backgroundColor = "transparent";
            }
            if (indexInput.indexOf(j) > -1 || (j == 0 && i >= 4)){
                td.contentEditable = true
                td.style.backgroundColor = "#ffff00"  
            }
            tr_body.appendChild(td)           
        }
    }
}

function creationTFoot(tableFoot, tr_foot){
    console.log("td_counter -> "+td_counter)
    var th = document.createElement('th')
    th.colSpan =  3
    th.innerHTML = 'Total'
    th.style.fontWeight = "bold"
    tr_foot.appendChild(th)

    var baseClassName = generate_baseClassName()
    var list_totName = ["totalww", "totalml100g", "totalvv", "totalml1000g", "totalfcost"]
    var list = returnListClassName(baseClassName, list_totName)

    var table = document.getElementById("tdetail")
    var counter = 0
    if(table){ // if i am in the detail page, add tfoot
        counter = document.getElementById('tdetail').rows[1].cells.length -3
        for (var i=0; i < counter; i++){
            var th = document.createElement('th')
            th.className = list[i]
            tr_foot.appendChild(th)
        }
    }else{
        counter = td_counter
        for (var i=3; i < counter; i++){
            var th = document.createElement('th')
            th.className = list[i-3]
            tr_foot.appendChild(th)
        }
    }

    // for (var i=3; i < counter; i++){
    //     var th = document.createElement('th')
    //     th.className = list[i-3]
    //     tr_foot.appendChild(th)
    // }
}

async function generateTableFillLvl(){

    var el = document.getElementById('generatedTableFillLvl')
    if(el){
        el.remove(); // Removes elem with the 'generatedTableFillLvl' id
    }
    await sleep(200);    // sleep 0.2 sec
    console.log('generateTableFillLvl')

    // generate the table
    var thead_col = ["Volume TiO<sub>2</sub> Slurry (%<sub>v/v</sub>)", "Fill level (%<sub>v/v</sub>)", "Definitive fill level"]
    var myTableDiv = document.getElementById("tableFillCalculation")


    var table = document.createElement('TABLE')
    table.id = "generatedTableFillLvl"
    var tableHead = document.createElement('THEAD')
    var tableBody = document.createElement('TBODY')
    table.appendChild(tableHead)
    table.appendChild(tableBody)

            // creation of caption for the table
    var tableCaption = document.createElement('CAPTION')
    tableCaption.innerHTML = "<b>Fill level calculation</b>"
    tableCaption.style.textAlign = "center"
    table.appendChild(tableCaption)


            // creation of thead for the table
    var tr_head = document.createElement('tr')
    tableHead.appendChild(tr_head)
    var list_of_thead = [thead_col]
    creationTHead(tr_head, list_of_thead)

            // creation of tbody for the table
    var tr_body = document.createElement('tr')
    tableBody.appendChild(tr_body)
    var cells_b1 = document.querySelectorAll('.vv_b1');
    var cells_ti = document.querySelectorAll('.vv_ti');
    var vb1 = cells_b1[2].textContent
    var vti = cells_ti[2].textContent

    var op = ""
    var op2 = ""
    var op3 = ""

    var tableDetailorUpdate = document.getElementById('tdetail')
    if(tableDetailorUpdate){
        // something
        lvl_fill = lvl_fill.slice(1,-1)
        var listofLvl_fill = lvl_fill.split(',').map(Number);
        op = listofLvl_fill[0]
        op2 = listofLvl_fill[1]
        op3 = op2
    }else{
        var _op1 = parseFloat(vb1)
        var _op2 = parseFloat(vti)
        var _op = (100*_op1)/_op2
        op = parseFloat(_op).toFixed(0)
        op2 = 100 - op
        op3 = op2
    }

    var op_listì = [op, op2, op3]
    for (var i = 0; i<op_listì.length; i++){
        var td = document.createElement('TD')
        td.innerHTML = op_listì[i]
        td.style.textAlign = "center"
        tr_body.appendChild(td)  
    }
         
    myTableDiv.appendChild(table)

    // generateColorStrength
    if(window.location.href.indexOf("update") > -1){
        console.log("URL UPDATE")
        if(global_colorStrength){
            $('#startTest').css("visibility", "visible");
        }
        if(global_popupNewProd){
            alert("DEVI CREARE NUOVO PRODOTTO!")
            $('#startTest').css("visibility", "hidden");
            return
        }
    }else{
        $('#startTest').css("visibility", "visible");
    }

    generateTableMaster()
}

async function generateTableMaster(){

    var el = document.getElementById('generatedTableMaster')
    if(el){
        el.remove(); // Removes elem with the 'generateTableMaster' id
    }

    await sleep(200);    // sleep 0.2 sec
    console.log('generateTableMaster')

    var _table = ""
    var cell_table = ""
    if ( $( "#tdetail" ).length ){
        _table = '#tdetail'
        cell_table = 'th'
    } else {
        _table = '#generatedTable'
        cell_table = 'td'
    }

    var formulaCost = $(_table+' thead tr:nth-child(2) '+cell_table+':eq(7)').text()
    var array = formulaCost.split('['),
        fc = '<div>'+array[0]+'</div>', c = '<div>['+array[1]+'</div>';

    // var thead_col_base = ["Raw material","TiO<sub>2</sub> removing [ml]", "%<sub>v/v</sub>","g/100mL", "%<sub>w/w</sub>", fc+c]
    var thead_col_base = ["Raw material","TiO<sub>2</sub> removing [ml]", "%<sub>v/v</sub>","g/100mL", "%<sub>w/w</sub>", formulaCost]

    var myTableDiv = document.getElementById("tableMaster")


    var table = document.createElement('TABLE') 
    table.id = "generatedTableMaster"
    var tableHead = document.createElement('THEAD')
    var tableBody = document.createElement('TBODY')
    var tableFoot = document.createElement('TFOOT')
    table.appendChild(tableHead)
    table.appendChild(tableBody)
    table.appendChild(tableFoot)

            // creation of caption for the table
    var tableCaption = document.createElement('CAPTION')
    tableCaption.innerHTML = "<b>MASTER</b>"
    tableCaption.style.textAlign = "center"
    table.appendChild(tableCaption)

            // creation of thead for the table
    var tr_head = document.createElement('tr')
    tableHead.appendChild(tr_head)
    var list_of_thead = [thead_col_base]
    creationTHead(tr_head, list_of_thead)

            // creation of tbody for the table
    creationTBodyMaster(global_num_raw_material, tableBody)

            // creation of tfoot for the table
    var tr_foot = document.createElement('tr')
    tableFoot.appendChild(tr_foot)
    tableFoot.style.borderStyle = "solid" // css 
    tableFoot.style.borderColor = "black" // css
    creationTFootMaster(tableFoot, tr_foot)

    myTableDiv.appendChild(table)

            // add className
    setClassesForCalculationMaster()

            // populate table with data
    generateDataMaster()
}

function creationTBodyMaster(global_num_raw_material, tableBody){
    var listofRawMaterial = ['H<sub>2</sub>O', 'Binder', 'TiO<sub>2</sub>']
    var listofRawMaterialTmp = $('table tbody tr td:nth-child(1)').get()
    listofRawMaterialTmp.splice(-1, 1)
    listofRawMaterialTmp.splice(0, 3)

    // var listofRawMaterialFinal = []
    listofRawMaterial.push(...listofRawMaterialTmp)

    for (var i = 0; i< global_num_raw_material; i ++){
        var tr_body = document.createElement('tr')
        tableBody.appendChild(tr_body)

        for (var j=0; j< 6; j++){
            var td = document.createElement('TD')
            td.style.height = "30px"
            if (j == 0){
                var value = ""
                if(listofRawMaterial[i].textContent === undefined){
                    value = listofRawMaterial[i]
                } else{
                    value = listofRawMaterial[i].textContent

                }
                td.innerHTML = value
            }
            tr_body.appendChild(td)           
        }
    }
}

function creationTFootMaster(tableFoot, tr_foot){
    var th = document.createElement('th')
    th.innerHTML = 'Total'
    th.style.fontWeight = "bold"
    tr_foot.appendChild(th)

    var list_totName = ["totalrem", "totalvv", "totalg100ml", "totalww", "totalfcost"]

    for (var i=0; i < 5; i++){
        var th = document.createElement('th')
        th.className = list_totName[i]
        th.classList.add("to_update")
        tr_foot.appendChild(th)
    }
}

/*
*
*               Logic concerning data generations into the table 
*
*/

function generateData(){
        
    global_colorStrength = false
    global_popupNewProd = false

    if( $('#updateCalculateBtn').length ){
        // visibility:hidden
        // $(".main").css("display", "block");
        $(".main").css("visibility", "visible");
    }
    var btnDisabled = $("#updateCalculateBtn").is(":disabled")
    console.log("btnDisabled -> " + btnDisabled)
    if(!btnDisabled){
        $(".main").css("visibility", "visible"); //correct one
        var spinHandle = loadingOverlay.activate();
    }

    var form_update_save = document.getElementById("save")
    if(form_update_save){
        form_update_save.style.display = "none"
    }

    // stuff for checkTest
    testOK = false
    up = false
    $("#checkTest").css("visibility", "hidden"); 
    var verifyBtn = $('#verify')
    verifyBtn.css("cursor", "auto")
    verifyBtn.css("pointer-events", "auto")
    verifyBtn.css("opacity", 1)

    var sum_ml100g = 0
    var sum_vv = 0
    var sum_ml1000g = 0
    var sum_fcost = 0
    var baseClassName = generate_baseClassName() //[_b1, _ti, _b2 ...]
    var list_sum = []
    var ww = []
    var sw = []

    var inputClassNameWeight = '.ww'
    var listofInputClassNames = ['.rm_cost', '.sw']
    var listofWeightClassNames = returnInputWeightClassNames(inputClassNameWeight, baseClassName) // example [".ww_b1", ".ww_ti", ".ww_b2" ...]
    listofInputClassNames.push(...listofWeightClassNames)
    var numofWeightClassNames = listofWeightClassNames.length

    var emptyNameInput = false
    var comma = false
    var char = false
    var empty = false
    var noRawName = false
    var swZero = false
    var minus = false
    var matrixWeightInput = createMatrixInputValue(listofWeightClassNames)
    // inputClassNames example -> [".rm_cost", ".sw", ".ww_b1", ".ww_ti" ...]
    for (var i = 0; i < listofInputClassNames.length; i++){
        var tmp = 0;
        var sum = 0;
        $(listofInputClassNames[i]).each(function(){
            var id_table = $(this).closest('table').attr('id')
            if(id_table == "tdetail" || id_table == "generatedTable"){
                if ($(this).attr('class').indexOf('_m') > -1) {
                    return false        // exit from loop
                }
                var input = $(this).text()
                if(input.indexOf('-') > -1){
                    minus = true
                }
                if($.isNumeric(input)){
                    if (listofInputClassNames[i] == '.sw'){
                        sw.push(parseFloat(input))
                    } else if (listofInputClassNames[i] != '.rm_cost'){ //ww_b1 ww_ti ww_b2 ...
                        for (var j=0; j< listofWeightClassNames.length; j++ ){
                            if(listofInputClassNames[i] == listofWeightClassNames[j]){
                                matrixWeightInput[j].push(parseFloat(input))
                                sum += parseFloat(input)
                            }
                        }
                    }
                }else{
                    if (input.indexOf(',') > -1){
                        comma = true
                    }else if (input != ""){
                        char = true
                    } else if( input == null || input.length == 0){
                        empty = true
                    }
                }
            }
        });
        // console.log("tot sum -> "+sum)
        list_sum.push(sum)
    }

    $('#generatedTable tbody td:first-child').each(function() {
        console.log($(this).text());
        if($(this).text() == ""){
            noRawName = true
        }
    });

    var productInput = document.getElementById('nameProduct')
    if(productInput){
        productInputValue = productInput.value
        if(productInputValue == ""){
            emptyNameInput = true
        }
    }
    for (let switem of sw){
        if (switem == 0){
            swZero = true
        }
    }
    var msg=""
    if (emptyNameInput || empty || comma || char || noRawName || swZero || minus){
        if(emptyNameInput && empty){
            msg = "OPS! You must fill all the empty yellow fields and the Product name field.."
        }
        else if(emptyNameInput){
            msg = "OPS! You must fill the Product name field.."
        }
        else if(empty){
            msg = "OPS! You must fill all the empty yellow fields.."
        }
        else if (comma && char){
            msg = "OPS! character detected inside some fields..<br>Floating point numbers need a dot and not a comma.."
        }
        else if (comma){
            msg = "OPS! Floating point numbers need a dot and not a comma..<br>e.g<br>This number is valid -> 1.2<br>This number is invalid -> 1,2"
        }
        else if (char){
            msg = "OPS! character detected inside some fields.."
        }else if (noRawName){
            msg = "OPS! One or more missing Raw material names.."
        }else if (swZero){
            msg="OPS! You have entered a value of 0 in a Specific Weight field..Change it to continue.."
        }else if(comma && minus){
            msg = "OPS! One or more negative floating numbers detected..<br>Floating point numbers need a dot and not a comma..<br>e.g<br>This number is valid -> 1.2<br>This number is invalid -> 1,2"
        }else if(minus){
            msg = "OPS! One or more negative integer numbers detected.."
        }
        else{
            msg = "OPS! UNKNOWN ERROR.."
        }
        loadingOverlay.cancel(spinHandle);
        $("#msg-modal").html(msg)
        $("#myModal").modal()
        return
    }
    
    var listofUpdatedInputB1 = []
    var updatedInputB1 = $("#tdetail tbody tr td:nth-child(4)")
    for (var i=0; i< updatedInputB1.length; i++){
        if(i<4){
            var tmp = updatedInputB1[i].textContent
            listofUpdatedInputB1.push(tmp)
        }
    }
    
    for (var i in global_inputValues) {
        if(i !=0){
            if(listofUpdatedInputB1[i] != global_inputValues[i]){
                console.log(listofUpdatedInputB1[i])
                console.log(global_inputValues[i])
    
                var old_value = global_inputValues[i]
                var new_value = listofUpdatedInputB1[i]
    
                var op =  Math.abs(new_value - old_value);
                var gap = 3*parseFloat(old_value)/100
                console.log("op " +op)
                console.log("gap "+gap)
                var upperBound = parseFloat(old_value) + parseFloat(gap)
                var lowerBound = parseFloat(old_value) - parseFloat(gap)
                if(new_value <= upperBound && new_value >= lowerBound){
                    console.log("Perform ColorStrength ")
                    global_colorStrength = true
                } else {
                    console.log("popup Create new Product")
                    global_popupNewProd = true
                }
            }
        }
    }

    //
    //  here the logic to populate the table
    //

    var baseClassName = generate_baseClassName()                // baseClassName -> ["_b1", "_ti" ...]
    var table = document.getElementById('tdetail')              // table from product/update/pk
    if(table){
        var rowCount = $('#tdetail >tbody >tr').length;
        global_num_raw_material = rowCount                    // override for update action
    }

    var counterWeightClassName = 2
    for(var q=0; q< baseClassName.length; q++){
        sum_ml100g = 0
        sum_vv = 0
        sum_ml1000g = 0
        sum_fcost = 0

            // insert sum of data for cell Total ww
        tmp = document.getElementsByClassName('totalww'+baseClassName[q])[0]
        // dynamic refactor
        if(q < numofWeightClassNames){
            var tmp_value = list_sum[counterWeightClassName]
            var value = parseFloat(tmp_value).toFixed(2)
            tmp.innerHTML = value
            counterWeightClassName ++
        }


            // insert single data for the cell mL/100g
        for (var i = 0; i < global_num_raw_material; i++){
            tmp = document.getElementsByClassName('ml100g'+baseClassName[q])[i]
            var a = matrixWeightInput[q][i]
            var b = sw[i]
            var division = a/b
            var op = parseFloat(division).toFixed(3)
            tmp.innerHTML = op
            sum_ml100g += parseFloat(op)
        }

            // insert sum of data for cell Total mL/100g
        tmp = document.getElementsByClassName('totalml100g'+baseClassName[q])[0]
        tmp.innerHTML = parseFloat(sum_ml100g).toFixed(2)

            // insert single data for the cell %v/v
        for (var i = 0; i < global_num_raw_material; i++){
            var tmp = document.getElementsByClassName('vv'+baseClassName[q])[i]

            var elems = document.getElementsByClassName("ml100g"+baseClassName[q]);

            var elem = elems[i].innerText
            var op = (100*elem)/sum_ml100g
            var _op = parseFloat(op).toFixed(3)
            tmp.innerHTML = _op
            sum_vv += parseFloat(_op)
        }

            // insert sum of data for cell Total %v/v
        tmp = document.getElementsByClassName('totalvv'+baseClassName[q])[0]
        tmp.innerHTML = parseFloat(sum_vv).toFixed(2)

            // insert single data for the cell mL/1000g
        for (var i = 0; i < global_num_raw_material; i++){
            var tmp = document.getElementsByClassName('ml1000g'+baseClassName[q])[i]

            var elems = document.getElementsByClassName("vv"+baseClassName[q]);

            var elem = elems[i].innerText
            var op = (10*elem)
            var _op = parseFloat(op).toFixed(2)
            tmp.innerHTML = _op
            sum_ml1000g += parseFloat(_op)
        }

            // insert sum of data for cell Total mL/1000g
        tmp = document.getElementsByClassName('totalml1000g'+baseClassName[q])[0]
        tmp.innerHTML = parseFloat(sum_ml1000g).toFixed(0)

            // insert single data for the cell Formula Cost
        for (var i = 0; i < global_num_raw_material; i++){
            var tmp = document.getElementsByClassName('fcost'+baseClassName[q])[i]

            var elems_sw = document.getElementsByClassName("sw")
            var elems_rmcost = document.getElementsByClassName("rm_cost")
            var elems_vv = document.getElementsByClassName("vv"+baseClassName[q])


            var elem_vv = elems_vv[i].innerText
            var elem_sw = elems_sw[i].innerText
            var elem_rmcost = elems_rmcost[i].innerText 

            var op1 = elem_sw*elem_rmcost
            var _op = (parseFloat(op1)/1000)*elem_vv*10
            tmp.innerHTML = parseFloat(_op).toFixed(2)
            sum_fcost += parseFloat(_op)
        }

            // insert sum of data for cell Total Formula Cost
        tmp = document.getElementsByClassName('totalfcost'+baseClassName[q])[0]
        tmp.innerHTML = parseFloat(sum_fcost).toFixed(2)
    }
    
    global_sw = sw
    generateTableFillLvl()

    if(typeof prod_admin !== "undefined"){
        if(prod_admin == "False"){
            var table_update = document.getElementsByClassName("btn btn-warning")[0]
            var action = ""
            if(table_update){
                action = "detail"
            } else{
                action = "update"
            }
            showLessDetails(action)
        }
    }

    if(!btnDisabled){
        setTimeout(function() {
            loadingOverlay.cancel(spinHandle);
            $(".main").css("visibility", "visible");
            // $(".main").css("display", "block");
        },1600);
    }
}

function generateDataMaster(){

    _sum_ti = 0.0
    var table_new = document.getElementById("generatedTable")
    var table_update = document.getElementById("tdetail")
    var tableInput = ''
    var index = ''
    var index2cells = ''
    var table_id = ''
    if(table_new){
        tableInput = table_new
        index = 1
        index2cells = 5
        table_id = "generatedTable"
    } else if (table_update){
        tableInput = table_update
        index = 0
        table_id = "tdetail"
        index2cells = 3
    }
    var tableFillLvl = document.getElementById("generatedTableFillLvl")
    var list_vv_ti = []
    var list_vv_b1 = []
    var list_tiRemoving = []
    var sum_tiRemoving = 0
    var sum_vv_m = 0.0
    var sum_test = 0
    var sum_ww = 0
    var sum_fcost = 0
    var swExt = 0
    var resExt = 0
    var tio2add = 0
    var listofSolidRawMat = []

    for (var j=2; j < 12; j++){
        var cells = tableInput.querySelectorAll('td:nth-child('+j+')')
        for(var i = index ; i < cells.length ; i++) {
            if(j == 6){
                if(cells[i].innerText){
                    list_vv_b1.push(cells[i].innerText)
                }
            } else if(j==2){
                console.log(cells[index2cells])
                swExt = cells[index2cells].innerText
                break
            }else if(j==11) {
                if(cells[i].innerText){
                    list_vv_ti.push(cells[i].innerText)
                }
            }
        }
    }

    var cell = tableFillLvl.querySelectorAll('td:nth-child(3)')
    var defLvl = cell[cell.length-1].innerHTML
    console.log("defLvl : "+defLvl)

        // calculate data for cell with className 'tirem_m'
    for(var i=0; i < global_num_raw_material; i++){
        var res = ''
        var indexMaster = i
        if(table_new){
            indexMaster = parseInt(indexMaster)+1
        }
        var idx = parseInt(i)+1
        if(i==2){   //Ti not calculated for MASTER
            res = 0
        } else{
            // res_tableNew = (list_vv_b1[i+1] - list_vv_ti[i]*((100-defLvl)/100))/(defLvl/100)
            // res_tableUpdate = (list_vv_b1[i] - list_vv_ti[i]*((100-defLvl)/100))/(defLvl/100)
            _op1 = list_vv_b1[indexMaster]
            _op2 = list_vv_ti[i]*((100-defLvl)/100)
            _op3 = defLvl/100

            if(i==3 && swExt <= 2){
                res = 0
                resExt = (_op1 - _op2)/_op3
            }else{
                // Normal working behaviour
                res = (_op1 - _op2)/_op3

                // TODO check for solid raw material
                if (i > 3){
                    var specificWeight = $('#'+table_id+' tbody tr:nth-child('+idx+') td:eq(1)').text()
                    res = (_op1 - _op2)/_op3
                    if(parseFloat(specificWeight) >= 2.000){
                        var wwB1 = parseFloat($('#'+table_id+' tbody tr:nth-child('+idx+') td:eq(3)').text())
                        var lengthRow = $('#'+table_id+' >tbody >tr:first>td').length
                        lengthRow -= 5
                        var wwBN = parseFloat($('#'+table_id+' tbody tr:nth-child('+idx+') td:eq('+lengthRow+')').text())
                        var diff = Math.abs(wwBN - wwB1)
                        var limit = wwB1*10/100
                        if(wwBN < wwB1){
                            console.log($('#'+table_id+' tbody tr:nth-child('+idx+') td:eq(0)').text() +" be calculated to ZERO on MASTER TABLE")
                            res = 0
                            calculated_res = (_op1 - _op2)/_op3
                            console.log("calculated res to add to RAW MAT SOLID -> "+calculated_res)
                            tio2add += calculated_res
                        } else { // wwB1 > wwBN
                            if(diff <= limit){
                                console.log($('#'+table_id+' tbody tr:nth-child('+idx+') td:eq(0)').text() +" is a RAW MATERIAL SOLID\nAdd other values")
                                console.log("wwB1 of "+$('#'+table_id+' tbody tr:nth-child('+idx+') td:eq(0)').text()+ " : "+wwB1)
                                var rawMatSolid = []
                                rawMatSolid.push(parseFloat(wwB1), i)
                                listofSolidRawMat.push(rawMatSolid)
                            }else{
                                console.log($('#'+table_id+' tbody tr:nth-child('+idx+') td:eq(0)').text() +" is calculated NORMALLY")
                            }
                            res = (_op1 - _op2)/_op3
                        }
                    }
                }

            }
        }
        list_tiRemoving.push(res)
        sum_tiRemoving += res
    }

    if (resExt != 0){
        sum_tiRemoving += resExt
    }

    if(tio2add > 0){

        console.log("tio2add : "+tio2add)
        console.log(listofSolidRawMat)
        var max = -Infinity;
        var index = -1;
        listofSolidRawMat.forEach(function(a, i){
            if(a[0]>max){
                max = a[0]
                index = a[1]
            }
        });

        console.log("max: "+max + " ; index: "+index)
        console.log("tio2add : "+tio2add)
        var valueAtIndex = list_tiRemoving[index]
        console.log("valueAtIndex -> "+valueAtIndex)
        valueAtIndex += tio2add
        console.log("valueAtIndex modified -> "+valueAtIndex)
        var start_index = parseInt(index),
            number_of_elements_to_remove = 1

        list_tiRemoving.splice(start_index, number_of_elements_to_remove, valueAtIndex);
    }

    console.log("sum_tiRemoving : "+sum_tiRemoving)
        // insert single datum for cell with className 'tirem_m'
    for (var i = 0; i < global_num_raw_material; i++){
        tmp = document.getElementsByClassName('tirem_m')[i+1]
        var _op = list_tiRemoving[i]
        if( i == 0 && resExt !=0){
            _op += parseFloat(resExt)
        }
        var op = parseFloat(_op).toFixed(3)
        tmp.innerHTML = op
        tmp.classList.add("to_update")

    }

        // insert sum of data for cell Total TiO2 removing
    tmp = document.getElementsByClassName('totalrem')[0]
    tmp.innerHTML = parseFloat(sum_tiRemoving).toFixed(3)

        // insert single datum for cell with className 'vv_m'
    for (var i = 0; i < global_num_raw_material; i++){
        tmp = document.getElementsByClassName('vv_m')[i+1] //list cell with classname 'vv_m'
        tmp2 = document.getElementsByClassName('tirem_m')[i+1]
        var _tmp2 = parseFloat(tmp2.innerText).toFixed(3)

        var _op = (100*_tmp2)/sum_tiRemoving
        var op = parseFloat(_op).toFixed(3)

            var index = i+1
            var _lista = []
            var result = []
            if(i == 2){
                tmp.innerHTML = parseFloat(0).toFixed(3)
                tmp.classList.add("to_update") 
                continue
            }
            console.log("op ->"+op)
            if(op <= 1){
                $('#'+table_id+' tbody tr:nth-child('+index+')').each(function() {
                    // for(var i=1; i< global_num_bases; i++){
                    var max = 0
                    if(global_num_bases == 1){
                        max = global_num_bases+1
                    }else{
                        max=global_num_bases
                    }
                    for(var i=1; i< global_num_bases; i++){
                        var value = $(this).find(".vv_b"+i).html();  
                        // console.log("testo  vv_b"+i+"    -->     "+value)
                        _lista.push(value)
                    }
                    });
                //          [val1, val2, val3, val4, ... , valn]
                //          |val1 - val2| < 10% di val1
                //          |val2 - val3| < 10% di val1
                //          ....
                //          |valn - val1| < 10% di val1
                for(var k=0; k< _lista.length; k++){
                    var p1 = _lista[k]
                    var p2 = 0
                    var index2 = k+1
                    // console.log("index2 ---> "+index2)
                    if(index2 >= _lista.length){
                        p2 = _lista[0]
                    }else{
                        p2 = _lista[index2]
                    }

                    var calc = Math.abs(p1-p2)
                    var margin = 0.1*_lista[0]
                    if(calc < margin){
                        result.push(1)          // correct 
                        // console.log("calc < margin")
                    } else{
                        result.push(0)          // uncorrect
                        // console.log("calc > margin")
                    }
                }

                var check_uncorrect = $.inArray(0, result)
                if(check_uncorrect == -1){
                    // tutto è vero result -> [1,1,1,1]; cerco MASTER 'vv_m'
                    // se  base1-10% < VALUE < base1+10%
                    // print VALUE
                    var base1 = _lista[0]
                    var margin = 0.1
                    var leftBound = parseFloat(base1) - parseFloat(base1*margin)
                    var rightBound = parseFloat(base1) + parseFloat(base1*margin)  

                    if(op > leftBound && op < rightBound){
                        // console.log("op > leftBound && op < rightBound")
                        tmp.innerHTML = op                      // populate the cell
                        tmp.style.backgroundColor = "blue";
                        sum_vv_m =  parseFloat(sum_vv_m) + parseFloat(op)
                    }else{
                        // console.log("****   NO **** op > leftBound && op < rightBound")
                        // mostro contenuto vvB1 al posto del valore calcolato
                        tmp.innerHTML=_lista[0]
                        tmp.style.backgroundColor = "yellow";
                        sum_vv_m =  parseFloat(sum_vv_m) + parseFloat(_lista[0])
                    }
                }else{
                    // result -> [1,1,0,1]
                    // non rispetto base1-10% < VALUE < base1+10%
                    tmp.innerHTML= op
                    tmp.style.backgroundColor = "gray";
                    sum_vv_m =  parseFloat(sum_vv_m) + parseFloat(op)
                }

            }else{  // se op >1     | op-> valore calcolato
                tmp.innerHTML= op
                tmp.style.backgroundColor = "lightblue";
                sum_vv_m =  parseFloat(sum_vv_m) + parseFloat(op)
            }

        tmp.classList.add("to_update") 

        $('#generatedTableMaster tbody tr:nth-child('+index+')').each(function() {
                var value = $(this).find(".vv_m").html();  
                if(index == 1){
                    h2o = value
                } else {
                    _sum_ti = parseFloat(_sum_ti) + parseFloat(value)
                }
                // update the total sum of %v/v of Master Table
                sum_vv_m = _sum_ti

            });

    }
    // ricalcola 1st row (h2o) sulla base della somma degli altri valori
    $('#generatedTableMaster tbody tr:nth-child(1)').each(function() {
            var _h2o = 100.00-parseFloat(sum_vv_m)
            _h2o = parseFloat(_h2o).toFixed(3)
            $(this).find(".vv_m").html(_h2o); 
            sum_vv_m = parseFloat(sum_vv_m)+parseFloat(_h2o)
    });


    

        // insert sum of data for cell Total %v/v
    tmp = document.getElementsByClassName('totalvv')[0]
    tmp.innerHTML = parseFloat(sum_vv_m).toFixed(3)

        // insert single datum for cell with className 'g100ml_m'
    for (var i = 0; i < global_num_raw_material; i++){
        tmp = document.getElementsByClassName('g100ml_m')[i+1]
        tmp2 = document.getElementsByClassName('vv_m')[i+1]
        var _tmp2 = parseFloat(tmp2.innerText).toFixed(3)
        var _op = (tmp2.innerText*global_sw[i])
        var op = parseFloat(_op).toFixed(3)
        tmp.innerHTML = op
        tmp.classList.add("to_update")

        sum_test =  parseFloat(sum_test) + parseFloat(op)
    }

        // insert sum of data for cell Total g/100mL
    tmp = document.getElementsByClassName('totalg100ml')[0]
    tmp.innerHTML = parseFloat(sum_test).toFixed(3)

    // insert single datum for cell with className 'ww_m'
    for (var i = 0; i < global_num_raw_material; i++){
        var tmp = document.getElementsByClassName('ww_m')[i+1]
        var tmp2 = document.getElementsByClassName('g100ml_m')[i+1]
        // var _op = (tmp2.innerText*global_sw[i]*100)/(sum_test)
        var _op = (tmp2.innerText*100)/(sum_test)
        var op = parseFloat(_op).toFixed(2)
        // var op = parseFloat(_op)
        tmp.innerHTML = op
        tmp.classList.add("to_update")

        sum_ww =  parseFloat(sum_ww) + parseFloat(op)        
    }

        // insert sum of data for cell Total %w/w
    tmp = document.getElementsByClassName('totalww')[0]
    var somma = parseFloat(sum_ww).toFixed(2)
    tmp.innerHTML = Math.round(somma).toFixed(2)    // round up

        // insert single datum for cell with className 'fc_m'
    for (var i = 0; i < global_num_raw_material; i++){
        var tmp = document.getElementsByClassName('fc_m')[i+1]
        var tmp2 = document.getElementsByClassName('vv_m')[i+1]
        var tmp3 = document.getElementsByClassName('rm_cost')
        var _op = ((global_sw[i]*tmp3[i].innerText)/1000)*tmp2.innerText*10
        var op = parseFloat(_op).toFixed(2)
        tmp.innerHTML = op
        tmp.classList.add("to_update")

        sum_fcost =  parseFloat(sum_fcost) + parseFloat(op)        
    }

        // insert sum of data for cell Total Formula Cost
    tmp = document.getElementsByClassName('totalfcost')[0]
    tmp.innerHTML = parseFloat(sum_fcost).toFixed(2)
    tmp.classList.add("to_update")


    // pre refactor for product update
    var table_detail = document.getElementById("tdetail")
    if(table_detail){
        var form_update_save = document.getElementById("save")
        if(form_update_save){
            form_update_save.style.display = "block"
        }
    }


    if(prod_admin !== "undefined"){
        if(prod_admin == "False"){
            showLessDetailsMaster()
        }
    }
}

/*
*
*               Supporting functions 
*
*/


/**
 * 
 * Check how many bases are passed via input, create Thead for each bases and return a list of THEAD arrays for each section of THEAD
 * arrays for bases and array for 'Raw Material' 'Specific Weight' 'RM cost'
 * 
 * @param {Array<String>} thead_col Array of HTML elems for THead 'Raw Material' 'Specific Weight' 'RM cost'
 * @param {Array<String>} thead_col_base Array of HTML elements for THead Table Base n (including TiO2 Slurry)
 * @returns {Array<Array<String>>} listofTheadArrays -> return list containing Thead Arrays
 */
function returnTheadList(thead_col, thead_col_base){
    var listofTheadArrays = []
    listofTheadArrays.push(thead_col)
    listofTheadArrays.push(thead_col_base)
    listofTheadArrays.push(thead_col_base)

    if(global_num_bases > 1){
        for (var i=1; i<global_num_bases; i++){
            var last = listofTheadArrays[listofTheadArrays.length-1]
            listofTheadArrays.push(last)
        }
    }
    return listofTheadArrays
}

function hideGridGenerator(){
    var grid = document.getElementsByClassName("grid_generator")[0]
    grid.style.display = "none"
}

/**
 * 
 * Set display = "none" to input #nameProduct and to button #btn_calculate
 */
function clean_after_wrong_input(){
    var name_product = document.getElementById('nameProduct')
    name_product.style.display = "none"
    var calculate_btn = document.getElementById('btn_calculate')
    calculate_btn.style.display = "none"
    var select_currencies = document.getElementById('money')
    select_currencies.style.display = "none"
    var addorRemoveRawMatDiv = document.getElementById("addorRemoveRawMat")
    addorRemoveRawMatDiv.style.display = "none"

}

/**
 * 
 * Given in input a list containing classname of the bases, a matrix is generated
 * 
 * e.g.
 *  [Array(0), Array(0), Array(0)]
 *  [[8, 8, 8], [8, 8, 8], [8, 8, 8]]
 * 
 * @param  {Array<String>} listofWeightClassNames list containing generated classname for each base
 * @return  {Array<Array<String>>} matrix returned
 */
function createMatrixInputValue(listofWeightClassNames) {
    var _length = listofWeightClassNames.length
    var lista = []
    for (var i=0; i< _length; i++){
        var list2 = []
        lista.push(list2)
    }

    return lista
}

/**
 * 
 * Create first <tr> populated of <thead>
 * Check how many bases should be created and create the correct number of <td> inside the first <tr> of <thead>. 
 * Additionally it populates each <td> with the corresponding data (some passed by default, 
 * others generated if the bases' number is > 1)
 * 
 * @param  {HTMLTableRowElement} tr_head the first tr inside <thead> of the table with id="generatedTable"
 * @param  {Array<String>} thead_bases list of texts to insert inside each td of the table
 */
function addTheadBases(tr_head, thead_bases){

    if (global_num_bases > 1 ){
        var i = 0
        while(i < global_num_bases-1){
            num = i+2
            thead_bases.push("BASE "+num);
            i++
        }
    }

    for (var j=0; j < thead_bases.length; j++){
        var td = document.createElement('TD')
        if(j < 3){
            td.style.visibility = "hidden"
            tr_head.appendChild(td)
        } else {
            td.innerHTML = thead_bases[j]
            td.style.fontWeight = "bold"
            td.style.minWidth = "80px"
            td.style.textAlign = "center"
            td.colSpan = 5; 
            tr_head.appendChild(td)
        }
    }
}

function generate_baseClassName(){
    var baseClassName = ["_b1", "_ti"]

    // assign for details
    var table_detail = document.getElementById("tdetail")
    if(table_detail){
        global_num_bases = document.getElementById('tdetail').rows[0].cells.length -3
    }

    if(global_num_bases == 1 ){
        return baseClassName
    } else if (global_num_bases > 1){
        var tableToPopulate = document.getElementById('tdetail')
        var counter = 0
        if(tableToPopulate){
            counter = global_num_bases-1
        } else {
            counter = global_num_bases
        }
        for (var i = 1; i < counter; i++){
            var value = parseInt(i)+1
            var _baseClassName = '_b'+value
            baseClassName.push(_baseClassName)
        }
        return baseClassName
    } else{ // used on product update (for testing)
        return baseClassName
    }
}

function returnInputWeightClassNames(inputClassNameWeight, baseClassName){
    var list = []
    var tmp = ''
    for (var i = 0; i <baseClassName.length; i++ ){
        tmp = inputClassNameWeight + baseClassName[i]
        list.push(tmp)
    }
    return list
}

/**
 * 
 * Parse each cells of the TBody and TFooter starting from 2nd child and put the correct ClassName to them.
 * The ClassName basic is ['ww','ml100g', 'vv' , 'ml1000g' , 'fcost']
 * to it are added the suffixes corresponding to the bases created (e.g. ["_b1", "_ti", "_b2", ...])
 */
function setClassesForCalculation(){

    var listClassNameBase = ['sw', 'rm_cost']
    var generatedSuffixByClassesNum = generate_baseClassName()
    var basicBaseClassName = ['ww','ml100g', 'vv' , 'ml1000g' , 'fcost']
    var listClassNameFinal = []
    for (var i=0; i<generatedSuffixByClassesNum.length; i++){
        for(var k=0; k<basicBaseClassName.length; k++){
            var tmp = basicBaseClassName[k] + generatedSuffixByClassesNum[i]
            listClassNameFinal.push(tmp)
        }
    }

    listClassNameBase.push(...listClassNameFinal)

    // td_counter for details
    if (td_counter == 0){
        td_counter = $("table > tbody > tr:first > td").length
    }

    for (var j=2; j < td_counter+1; j++){
        $('table tbody tr td:nth-child('+j+')').addClass(listClassNameBase[j-2]);
    }
}

    // class name for #generatedTableMaster
function setClassesForCalculationMaster(){

    var list_class = ["tirem_m", "vv_m", "g100ml_m", "ww_m", "fc_m"]
    var t = 0;
    var table = document.getElementById("generatedTableMaster")

    for (var j=2; j < 7; j++){
        var cells = table.querySelectorAll('td:nth-child('+j+')')
        for(var i = 0 ; i < cells.length ; i++) {
            var _class = list_class[t]
            cells[i].classList.add(_class)
        }
        t++
    }
}

function returnListClassName(baseClassName, list_totName){
    var list = []
    for (var i=0; i < baseClassName.length; i++){
        for (var j=0; j < list_totName.length; j++){
            list.push(list_totName[j]+baseClassName[i])
        }
    }
    return list
}

function showGenerateBtn(){
    var elem = document.getElementById("money")
    if(elem){
        elem.style.display = "block";
    }


    var btn = document.getElementById("btn_calculate")
    if(btn){
        btn.style.display = "block";
    }

    var btn_prodName = document.getElementById("nameProduct")
    if(btn_prodName){
        btn_prodName.style.display = "block"
    }

    var btn_update_save = document.getElementById("btn_update_save")
    if(btn_update_save){
        btn_update_save.style.display = "block"
    }

    var addorRemoveRawMatDiv = document.getElementById("addorRemoveRawMat")
    if(addorRemoveRawMatDiv){
        addorRemoveRawMatDiv.style.display = "block"
    }
}

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function saveProduct(rev,currency) {
    console.log("currency  ->   "   +   currency)
    var jsonData = createJson()
    var input_test = document.getElementsByName("name")[0]
    var input_prod_name = document.getElementById("nameProduct")
    if (input_prod_name){
        var value = input_prod_name.value
        input_test.value = value
    }
    // } else {
    //     var value = $("h2").html()
    //     console.log(value)
    //     input_test.value = value
    // }

    var _input_test = document.getElementsByName("pk")[0]
    if(typeof pk !== "undefined"){
        if(pk){
            _input_test.value = pk
        }
    }

    var input_test2 = document.getElementsByName("data")[0]
    input_test2.value = jsonData

    console.log("revision -> "+rev)
    var input_test3 =  document.getElementsByName("revision")[0]
    if(input_test3){
        input_test3.value = rev
    }

    if(currency == null || currency == ''){
        currency = $( "#currencies option:selected" ).text();
    }
    var input_test4 =  document.getElementsByName("currency")[0]
    if(input_test4){
        input_test4.value = currency
    } else if(prod_currency){
        input_test4.value = prod_currency
    }

    var rowtableFillCalculation = $('#tableFillCalculation tr:last')
    if(rowtableFillCalculation){
        var text1 = $('#tableFillCalculation tr:last td:nth-child(1)').text()
        var text2 = $('#tableFillCalculation tr:last td:nth-child(2)').text()
        // var text3 = $('#tableFillCalculation tr:last td:nth-child(3)').text()
        var lvl_fill = text1+" "+text2+" "+ text2
        var input_test5 =  document.getElementsByName("lvl_fill")[0]
        if(input_test5){
            input_test5.value = lvl_fill
        }
    }

}

function createJson(){

    var update_table = document.getElementById('tdetail')
    var new_table = document.getElementById('generatedTable')
    var table_name = ""
    var numberofBases = 0
    if(update_table){
        table_name = "tdetail"
        numberofBases = document.getElementById('tdetail').rows[0].cells.length -3
    } else if(new_table){
        table_name = "generatedTable"
        numberofBases = global_num_bases
    }
    var listofRawMaterialNames = $('#'+table_name+' tbody tr td:nth-child(1)').get()
    var listofIndexInput = [2,3,4,9]
    console.log(numberofBases)
    if(numberofBases >1){
        for(var i=2; i<=numberofBases; i++){
            var lastIndex = listofIndexInput[listofIndexInput.length-1]
            var newIndex = lastIndex+5
            listofIndexInput.push(newIndex)
        }
    }
    var listofImputs = []
    for(var i=0; i<listofIndexInput.length; i++){
        if($('#'+table_name+' tbody tr td:nth-child('+listofIndexInput[i]+')').length){ 
            var listofSingleBaseInput = $('#'+table_name+' tbody tr td:nth-child('+listofIndexInput[i]+')').get()
            listofImputs.push(listofSingleBaseInput)
        }
    }

    
            // loop for the creation of the JSON
    var _q = ""
    for(var i=0; i < global_num_raw_material; i++){
        var q = `
        {
            "raw_material": "`+ listofRawMaterialNames[i].textContent+`",
            "specific_weight": "`+ listofImputs[0][i].textContent+`",
            "RM_cost": "`+ listofImputs[1][i].textContent+`",
            "bases":[`
            for(var j=2; j<listofImputs.length; j++){
                var base = '{"g_100g": "'+listofImputs[j][i].textContent+'"}'
                if(j != listofImputs.length-1){
                    base += ","
                }
                q+=base
            }
        q += `]
            }`  
        if(global_num_raw_material > 1 && i != global_num_raw_material-1){
            q += ',' 
            _q += q
        }
        else{
            _q += q
        }
    }
    var jsonData = '{"data":['+_q+']}'
    console.log(jsonData)
    return jsonData
}

function download_csv(rev){
    var title = document.getElementsByTagName("h2")
    var name = title[0].innerText

    // table #tdetail 
    var body_tbl1 = []
    var table1 = document.getElementById("tdetail");
    for (var i = 0, row; row = table1.rows[i]; i++) {
        var lista = []
        for (var j = 0, col; col = row.cells[j]; j++) {
            lista.push(col.innerText)
            if(i==0 && j>2){
                var tmp = Array(4).join("")
                lista.push(tmp)
            }
            if(i==table1.rows.length - 1 && j == 0){
                var tmp = Array(2).join("")
                var tmp2 = Array(2).join("")
                lista.push(tmp, tmp2)
            }
        }
        body_tbl1.push(lista)
    }

    // table #generatedTableFillLvl
    var body_tbl2 = []
    var table2 = document.getElementById("generatedTableFillLvl");
    for (var i = 0, row; row = table2.rows[i]; i++) {
        var lista = []
        for (var j = 0, col; col = row.cells[j]; j++) {
            lista.push(col.innerText)
        }
        body_tbl2.push(lista)
    }

    // table #generatedTableMaster
    var body_tbl3 = []
    var table3 = document.getElementById("generatedTableMaster");
    for (var i = 0, row; row = table3.rows[i]; i++) {
        var lista = []
        for (var j = 0, col; col = row.cells[j]; j++) {
            lista.push(col.innerText)
        }
        body_tbl3.push(lista)
    }

        // https://stackoverflow.com/questions/18848860/javascript-array-to-csv
    var csv = ''
    csv += name+'\tRevision: '+rev
    csv +='\n'
    csv +='\n'
    csv +='\n'
    csv += body_tbl1.map(function(d){
        return d.join();
    }).join('\n');
    csv+= '\n'
    csv +='\n'
    csv +='\n'
    csv += 'Fill level calculation\n'
    csv += body_tbl2.map(function(d){
        return d.join();
    }).join('\n');
    csv +='\n'
    csv +='\n'
    csv +='\n'
    csv += 'MASTER\n'
    csv += body_tbl3.map(function(d){
        return d.join();
    }).join('\n');

    console.log(csv)



    var hiddenElement = document.createElement('a')
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv)
    hiddenElement.target = '_blank'
    hiddenElement.download = name+'.csv'
    hiddenElement.click()

}

/**
 * 
 * If the user authenticated is not an admin user, show less details (hide mL/100g; mL/1000g) on table #tdetail
 */
function showLessDetails(action){
  
    console.log("ACTION -> "+action)
    var listofIndexTHead = [4,5,7,8]
    var listofIndexTotal = [2,3,5,6]
    if(global_num_bases>2){
        for(var i=2; i<global_num_bases;i++){
            var lastHead = listofIndexTHead[listofIndexTHead.length - 1]
            var newItem1 = parseInt(lastHead)+2         // e.g -> 10
            var newItem2 = parseInt(newItem1)+1         // e.g -> 11
            listofIndexTHead.push(newItem1, newItem2)

            var lastTotal = listofIndexTotal[listofIndexTotal.length - 1]
            var _newItem1 = parseInt(lastTotal)+2           // e.g -> 8
            var _newItem2 = parseInt(_newItem1)+1           // e.g -> 9
            listofIndexTotal.push(_newItem1, _newItem2)
            console.log(listofIndexTotal)
        }
    }

    var table = document.getElementById("tdetail")

    if(table){
        for (var i = 0; i<= global_num_raw_material+2; i ++){
            var row = table.rows[i]

            if(i==0){
                // dynamic required!
                var lenTheadCells = row.cells.length
                for(var k=3; k<lenTheadCells; k++){
                    row.cells[k].colSpan = "3"
                }
            }else if(i!=global_num_raw_material+2){
                for(var k=0; k<listofIndexTHead.length;k++){
                    if(action == "detail"){
                        row.deleteCell(listofIndexTHead[k])
                    }else{  
                        row.cells[listofIndexTHead[k]].style.display="none"
                    }
                }
            }else if(i == global_num_raw_material+2){
                for(var k=0; k<listofIndexTotal.length;k++){
                    if(action == "detail"){
                        row.deleteCell(listofIndexTotal[k])
                    }else{
                        row.cells[listofIndexTotal[k]].style.display="none"
                    }
                }
            }
        }
    }
}

/**
 * 
 * If the user authenticated is not an admin user, show less details on table #generatedTableMaster
 */
function showLessDetailsMaster(){
    var table2 = document.getElementById("generatedTableMaster")

    if(table2){
        for (var i = 0; i<= global_num_raw_material+2; i ++){
            var row = table2.rows[i]
            if(row === undefined){
                break
            }else{
                row.deleteCell(3)
            }
        }
    }
}


function addMoreLines(){

    var tableBody = $('#generatedTable').find("tbody")
    var trLast = tableBody.find("tr:last")
    var trNew = trLast.clone()
    trNew.children().text("")
    if(global_num_raw_material >= 3){
        var tdNew = trNew.find("td:first")
        tdNew.attr("contentEditable","true");
        tdNew.css( "background-color", "rgb(255, 255, 0)")
    }
    trLast.after(trNew)

    global_more_rawMaterial += 1
    if(global_more_rawMaterial > 0){
        var remBtn = $('#removeRawMat')
        remBtn.css("cursor", "auto")
        remBtn.css("pointer-events", "auto")
        remBtn.css("opacity", 1)
    }
    global_num_raw_material ++
}

function removeLastRawMatAdded(){
    var tableBody = $('#generatedTable').find("tbody")
    var trLast = tableBody.find("tr:last")
    trLast.remove()
    global_more_rawMaterial -= 1

    if(global_more_rawMaterial < 1){
        var remBtn = $('#removeRawMat')
        remBtn.css("cursor", "not-allowed")
        remBtn.css("pointer-events", "none")
        remBtn.css("opacity", 0.65)
    }
    global_num_raw_material --
}

var supInput = ""
var infInput = ""
var counterTest = 2
var testOK = false
var up = false

function startLabTest(){
    supInput = $('#rangesup').val()
    infInput = $('#rangeinf').val() 

    if(supInput == "" || infInput == ""){
        alert("fill all the input fields")
    }else{
        $('#checkTest').css("visibility", "visible");
    }
    counterTest = 2

    var verifyBtn = $('#verify')
    verifyBtn.css("cursor", "not-allowed")
    verifyBtn.css("pointer-events", "none")
    verifyBtn.css("opacity", 0.65)

    $( ".test" ).remove();
    var divCheckTest = $('#checkTest')
    divCheckTest.append('<div class="test">Test result n°1 <input id="r1" type="number" style="margin-left:20px; width: 51 !important;text-align: center;"> <button style="margin-left:1;" onclick="verify(event)">Verify</button></div>')
}

function verify(event){
    var resultTest = $("#checkTest input:last")

    if(resultTest.val() != ""){
        if(resultTest.val() <= parseInt(supInput) && resultTest.val() >= parseInt(infInput)){
            testOK=true
        }else if (resultTest.val() < parseInt(infInput)){
            testOK=false
            up = true
        }else if(resultTest.val() > parseInt(supInput)){
            testOK=false
        }

        var check = $('#checkTest')
        var row = $('#checkTest').find("div:last")
        if(!testOK){
            var newRow = row.clone()
    
            $(event.target).css("opacity", 0.65)    
            $(event.target).css("pointer-events", "none")

            inputt =  newRow.find("input").val("")
            inputt.css("margin-left", "24px")
            btnn = newRow.find("button")
            btnn.css("margin-left", "5px")
            newRow.html("Test result n°"+counterTest)
            newRow.append(inputt)
            newRow.append(btnn)
            check.append(newRow)
            row.append("    TEST FAILED")

            var rowtableFillCalculation = $('#tableFillCalculation tr:last')
            var text1 = $('#tableFillCalculation tr:last td:nth-child(1)').text()
            var text2 = $('#tableFillCalculation tr:last td:nth-child(2)').text()
            var text3 = $('#tableFillCalculation tr:last td:nth-child(3)').text()

            $('#generatedTableFillLvl tr:last').remove();
            $("#generatedTableFillLvl").append('<tr><td><del>'+text1+'</del></td><td><del>'+text2+'</del></td><td><del>'+text3+'</del></td></tr>');

            if(up){
                text1 = parseInt(text1) + 1
                text2 = parseInt(text2) - 1
                text3 = text2
            }else{
                text1 = parseInt(text1) - 1
                text2 = parseInt(text2) + 1
                text3 = text2
            }
            $("#generatedTableFillLvl").append('<tr><td>'+text1+'</td><td>'+text2+'</td><td>'+text3+'</td></tr>');

            counterTest++
            flag = false
            generateDataMaster()
        }else{
            $(event.target).css("opacity", 0.65)    
            $(event.target).css("pointer-events", "none")
            row.append("    TEST PASSED")

            var form_update_save = document.getElementById("save")
            if(form_update_save){
                form_update_save.style.display = "block"
            }
            $('#btn_update_save').css("visibility", "visible");
        }
    }
}
/*
*
*               Document ready 
*
*/

$( document ).ready(function() {

    var numbers = [
        'EUR - €',
        'NOK - kr',
        'USD - $',
        'AUD - $',
        'CAD - $',
        'COP - $',        
        'CLP - $',
        'MXN - $',
        'PHP - ₱',
        'KRW - ₩',
        'THB - ฿',
        'MYR - RM',
        'IDR - Rp',
        'PLN - zł',
        'CNY - 元',
        'JPY - ¥',
        'RUB - ₽',
        'ILS - ₪'
    ];

    var option = '';
    for (var i=0;i<numbers.length;i++){
       option += '<option value="'+ numbers[i] + '">' + numbers[i] + '</option>';
    }
    $('#currencies').append(option);

    console.log("doc ready!")

    var inputB1 = $("#tdetail tbody tr td:nth-child(4)")
    for (var i=0; i< inputB1.length; i++){
        if(i<4){
            var tmp = inputB1[i].textContent
            global_inputValues.push(tmp)
        }
    }

});


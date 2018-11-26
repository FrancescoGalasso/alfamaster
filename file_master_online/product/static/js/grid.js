var td_counter = 0;
var global_num_raw_material = 0
var global_num_bases = 0
var global_baseClassName = []
var global_sw = []
var global_data = ''

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
    if (num_bases < 1 || num_raw_material < 3 || num_bases == "" || num_raw_material == ""){
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
    var defaultRawMaterial = ['H<sub>2</sub>O', 'Binder', 'TiO<sub>2</sub>']

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

            if (j == 0 && i < 3){
                td.innerHTML = defaultRawMaterial[i]
                td.contentEditable = false
                td.style.backgroundColor = "transparent";
            }
            if (indexInput.indexOf(j) > -1 || (j == 0 && i >= 3)){
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
    if(table){
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

    var _op1 = parseFloat(vb1)
    var _op2 = parseFloat(vti)
    var _op = (100*_op1)/_op2
    var op = parseFloat(_op).toFixed(0)
    var op2 = 100 - op
    var op3 = op2

    var op_listì = [op, op2, op3]
    for (var i = 0; i<op_listì.length; i++){
        var td = document.createElement('TD')
        td.innerHTML = op_listì[i]
        td.style.textAlign = "center"
        tr_body.appendChild(td)  
    }
         
    myTableDiv.appendChild(table)
    console.log(table)
    generateTableMaster()
}

async function generateTableMaster(){

    var el = document.getElementById('generatedTableMaster')
    if(el){
        el.remove(); // Removes elem with the 'generateTableMaster' id
    }

    await sleep(200);    // sleep 0.2 sec
    console.log('generateTableMaster')

    var thead_col_base = ["Raw material","TiO<sub>2</sub> removing [ml]", "%<sub>v/v</sub>","g/100mL", "%<sub>w/w</sub>", "Formula Cost"]
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

    console.log(listofRawMaterialTmp)

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

    var form_update_save = document.getElementById("save")
    if(form_update_save){
        form_update_save.style.display = "none"
    }

    var sum_sw = 0
    var sum_rmcost = 0
    var sum_ww = 0;
    var sum_ml100g = 0
    var sum_vv = 0
    var sum_ml1000g = 0
    var sum_fcost = 0
    var sum_ww_ti = 0

    var list_classNameSum = ['sum_ww', 'sum_ml100g', 'sum_vv', 'sum_ml1000g', 'sum_fcost']
    var baseClassName = generate_baseClassName() //[_b1, _ti, _b2 ...]
    var list_sum = []
    var ww = []
    var sw = []

    var inputClassNameWeight = '.ww'
    var listofInputClassNames = ['.rm_cost', '.sw']
    var listofWeightClassNames = returnInputWeightClassNames(inputClassNameWeight, baseClassName) // example [".ww_b1", ".ww_ti", ".ww_b2" ...]
    listofInputClassNames.push(...listofWeightClassNames)
    var numofWeightClassNames = listofWeightClassNames.length

    var matrixWeightInput = createMatrixInputValue(listofWeightClassNames)
    // inputClassNames example -> [".rm_cost", ".sw", ".ww_b1", ".ww_ti" ...]
    for (var i = 0; i < listofInputClassNames.length; i++){
        var tmp = 0;
        var sum = 0;
        $(listofInputClassNames[i]).each(function(){
            var input = $(this).text()
            if (listofInputClassNames[i] == '.sw'){
                sw.push(parseFloat(input))
            } else if (listofInputClassNames[i] != '.rm_cost'){ //ww_b1 ww_ti ww_b2 ...
                for (var j=0; j< listofWeightClassNames.length; j++ ){
                    if(listofInputClassNames[i] == listofWeightClassNames[j]){
                        // ww.push(parseFloat(input))
                        matrixWeightInput[j].push(parseFloat(input))
                        sum += parseFloat(input)
                    }
                }
            }
        });
        console.log("tot sum -> "+sum)
        list_sum.push(sum)
    }

    var emptyListCheck = checkEmptyData(list_sum)
    var productInput = document.getElementById('nameProduct')

    if(productInput){
        productInputValue = productInput.value
        if (emptyListCheck || productInput==null || productInputValue==""){
            
            var msg = ""
            if(emptyListCheck && productInputValue==""){
                msg = "OPS! You must fill all the empty yellow fields and the Product name field.."
            }
            else if(emptyListCheck){
                msg = "OPS! You must fill all the empty yellow fields.."
            }else if (productInputValue==""){
                msg = "OPS! You must fill the Product name field.."
            }
            $("#msg-modal").html(msg)
            $("#myModal").modal()
            return
        }
    }

    //
    //  here the logic to populate the table
    //

    var baseClassName = generate_baseClassName()                // baseClassName -> ["_b1", "_ti" ...]
    console.log("baseClassName")
    console.log(baseClassName)
    var table = document.getElementById('tdetail')              // table from product/update/pk
    if(table){
        var rowCount = $('#tdetail >tbody >tr').length;
        console.log("num row from tdetail table ~> "+rowCount-1)
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
            console.log(tmp)
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
            var _op = parseFloat(op).toFixed(2)
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
            var _op = (parseFloat(op1)/1000)*elem_vv
            tmp.innerHTML = parseFloat(_op).toFixed(4)
            sum_fcost += parseFloat(_op)
        }

            // insert sum of data for cell Total Formula Cost
        tmp = document.getElementsByClassName('totalfcost'+baseClassName[q])[0]
        console.log(baseClassName[q])
        console.log(tmp)
        tmp.innerHTML = parseFloat(sum_fcost).toFixed(4)
    }
    
    global_sw = sw
    generateTableFillLvl()

}

function generateDataMaster(){

    var table_new = document.getElementById("generatedTable")
    var table_update = document.getElementById("tdetail")
    var tableInput = ''
    var index = ''
    if(table_new){
        tableInput = table_new
        index = 1
    } else if (table_update){
        tableInput = table_update
        index = 0
    }
    var tableFillLvl = document.getElementById("generatedTableFillLvl")
    var list_vv_ti = []
    var list_vv_b1 = []
    var list_tiRemoving = []
    var sum_tiRemoving = 0
    var sum_vv_m = 0
    var sum_g100ml_m = 0
    var sum_test = 0
    var sum_ww = 0
    var sum_fcost = 0

    for (var j=4; j < 12; j++){
        var cells = tableInput.querySelectorAll('td:nth-child('+j+')')
        for(var i = index ; i < cells.length ; i++) {
            if(j == 5){
                list_vv_b1.push(cells[i].innerText)
            } else if(j==10) {
                list_vv_ti.push(cells[i].innerText)
            }
        }
    }

    var cell = tableFillLvl.querySelectorAll('td:nth-child(3)')
    var defLvl = cell[1].innerHTML

    for(var i=0; i < global_num_raw_material; i++){
        var res = ''
        if(table_new){
            res = (list_vv_b1[i+1] - list_vv_ti[i]*((100-defLvl)/100))/(defLvl/100)
        }else if (table_update){
            res = (list_vv_b1[i] - list_vv_ti[i]*((100-defLvl)/100))/(defLvl/100)
        }
        list_tiRemoving.push(res)
        sum_tiRemoving += res
    }

        // insert single datum for cell with className 'tirem_m'
    for (var i = 0; i < global_num_raw_material; i++){
        tmp = document.getElementsByClassName('tirem_m')[i+1]
        var _op = list_tiRemoving[i]
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
        tmp.innerHTML = op
        tmp.classList.add("to_update")

        sum_vv_m += op
    }

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
        var _op = (tmp2.innerText*global_sw[i]*100)/(sum_test)
        var op = parseFloat(_op).toFixed(3)
        tmp.innerHTML = op
        tmp.classList.add("to_update")

        sum_ww =  parseFloat(sum_ww) + parseFloat(op)        
    }

        // insert sum of data for cell Total %w/w
    tmp = document.getElementsByClassName('totalww')[0]
    tmp.innerHTML = parseFloat(sum_ww).toFixed(3)

        // insert single datum for cell with className 'fc_m'
    for (var i = 0; i < global_num_raw_material; i++){
        var tmp = document.getElementsByClassName('fc_m')[i+1]
        var tmp2 = document.getElementsByClassName('vv_m')[i+1]
        var tmp3 = document.getElementsByClassName('rm_cost')
        var _op = ((global_sw[i]*tmp3[i].innerText)/1000)*tmp2.innerText
        var op = parseFloat(_op).toFixed(3)
        tmp.innerHTML = op
        tmp.classList.add("to_update")

        sum_fcost =  parseFloat(sum_fcost) + parseFloat(op)        
    }

        // insert sum of data for cell Total Formula Cost
    tmp = document.getElementsByClassName('totalfcost')[0]
    tmp.innerHTML = parseFloat(sum_fcost).toFixed(3)
    tmp.classList.add("to_update")

    var form_update_save = document.getElementById("save")
    if(form_update_save){
        form_update_save.style.display = "block"
    }

}

/*
*
*               Supporting functions 
*
*/


/**
 * Parse the array containing the amount of each sum for input %w/w columns. If you find even a single NaN assigned to a generic sum, the function returns False.
 * 
 * @param {Array<String>} list_sum list of total sum on each input %w/w columns 
 * @returns True if a NaN sum value is found; False otherwise
 */
function checkEmptyData(list_sum){
    var emptyData = false

    for (i=0; i < list_sum.length; i++){
        if (Number.isNaN(list_sum[i])) {
            emptyData = true
        }
      }
    return emptyData
}

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
    console.log("list")
    console.log(list)
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
        console.log(td_counter)
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
            // console.log(list_totName[j]+baseClassName[i])
            list.push(list_totName[j]+baseClassName[i])
        }
    }
    return list
}

function showGenerateBtn(){
    console.log("I'm going to show the generateBtn")
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
}

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function saveProduct(rev) {
    var jsonData = createJson()
    var input_test = document.getElementsByName("name")[0]
    var input_prod_name = document.getElementById("nameProduct")
    if (input_prod_name){
        var value = input_prod_name.value
        input_test.value = value
    }

    var input_test2 = document.getElementsByName("data")[0]
    input_test2.value = jsonData

    console.log("revision -> "+rev)
    var input_test3 =  document.getElementsByName("revision")[0]
    if(input_test3){
        input_test3.value = rev
    }
}

function createJson(){

    var listofRawMaterialNames = $('#generatedTable tbody tr td:nth-child(1)').get()
    var listofIndexInput = [2,3,4,9]
    if(global_num_bases >1){
        for(var i=2; i<=global_num_bases; i++){
            var lastIndex = listofIndexInput[listofIndexInput.length-1]
            var newIndex = lastIndex+5
            listofIndexInput.push(newIndex)
        }
    }
    var listofImputs = []
    for(var i=0; i<listofIndexInput.length; i++){
        var listofSingleBaseInput = $('#generatedTable tbody tr td:nth-child('+listofIndexInput[i]+')').get()
        listofImputs.push(listofSingleBaseInput)
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
                console.log("print input test")
                console.log(listofImputs[j][i].textContent)
                var base = '{"g_100g": "'+listofImputs[j][i].textContent+'"}'
                console.log(base)
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

// notes
// https://www.youtube.com/watch?v=sYNDXrLu57k
// https://rk.edu.pl/en/making-django-and-javascript-work-nicely-together/
// https://stackoverflow.com/questions/37104604/adding-a-django-model-instance-without-a-form-button-only
// https://stackoverflow.com/questions/14026750/django-model-filtering-by-user-always
// https://simpleisbetterthancomplex.com/tutorial/2016/06/27/how-to-use-djangos-built-in-login-system.html

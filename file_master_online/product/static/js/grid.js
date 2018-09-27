$( document ).ready(function() {
    console.log( "page HTML product_edit3 ready!" );   
});

var td_counter = 0;
var global_num_raw_material = 0
var global_num_bases = 0
var global_baseClassName = []
var global_sw = []

function generateTable(id){
    console.log("I'm going to generate the table for the customer")
    console.log("id of clicked btn -> "+id)
    showGenerateBtn()

    var num_raw_material = document.getElementById('input_grid').value
    var num_bases = document.getElementById('input_grid2').value
    console.log(num_raw_material)
    console.log(num_bases)
    global_num_raw_material = num_raw_material
    global_num_bases = num_bases

    // some check before generate the table
    if (num_raw_material.includes(".") || num_raw_material.includes("-") || num_bases.includes(".") || num_bases.includes("-")){
        alert("OPS! The value you added in a field contains a dot or a minus..")
        return;
    }
    //  TODO - remove the following comment. Added to speedup the tests
    // if (num_bases < 2 || num_raw_material < 3 || num_bases == "" || num_raw_material == ""){
    //     alert("OPS! You left some field blank or you typed a lower number for generate Raw Materials or Bases")
    //     return;
    // }


    // info-test used in development
    var test = document.getElementById("info-test")
    test.innerText = "num_bases added not used for this testing purpose"


    // generate the table
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

        // css style added via js
        // style="border-top: 4.2px solid black;"
    tableFoot.style.borderStyle = "solid"
    tableFoot.style.borderColor = "black"

        // creation of thead for the table
    var tr_head2 = document.createElement('tr')
    tableHead.appendChild(tr_head2)
    var thead_bases = ["", "", "", "BASE1 (pastel)", "TiO<sub>2</sub> slurry"]
    console.log("addTheadBases")
    addTheadBases(tr_head2, thead_bases)
    var tr_head = document.createElement('tr')
    tableHead.appendChild(tr_head)
    var list_of_thead = [thead_col,thead_col_base,thead_col_base]
    creationTHead(tr_head, list_of_thead)
    console.log(td_counter)

        // creation of tbody for the table
    // var tr_body = document.createElement('tr')
    // tableBody.appendChild(tr_body)
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
            // td.appendChild(document.createTextNode(thead_col_master[i]))
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

    for (var i = 0; i< num_raw_material; i ++){
        var tr_body = document.createElement('tr')
        tableBody.appendChild(tr_body)

        for (var j=0; j< td_counter; j++){
            var td = document.createElement('TD')
            // td.appendChild(document.createTextNode("Cell " + i + "," + j))
            td.style.height = "30px"
            if (j < 4 || j == 8){
                td.contentEditable = true
                td.style.backgroundColor = "#ffff00"
            }
            if (j == 0 && i < 3){
                td.innerHTML = defaultRawMaterial[i]
                td.contentEditable = false
                td.style.backgroundColor = "transparent";
            }
            tr_body.appendChild(td)           
        }
    }
}

function creationTFoot(tableFoot, tr_foot){
    console.log("td_counter -> "+td_counter)
    var th = document.createElement('th')
    // th.style.columnSpan = 3
    th.colSpan =  3
    th.innerHTML = 'Total'
    th.style.fontWeight = "bold"
    tr_foot.appendChild(th)

    var baseClassName = generate_baseClassName()
    var list_totName = ["totalww", "totalml100g", "totalvv", "totalml1000g", "totalfcost"]
    var list = returnListClassName(baseClassName, list_totName)

    for (var i=3; i < td_counter; i++){
        var th = document.createElement('th')
        th.className = list[i-3]
        tr_foot.appendChild(th)
    }
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
    var defaultRawMaterial = ['H<sub>2</sub>O', 'Binder', 'TiO<sub>2</sub>']

    for (var i = 0; i< global_num_raw_material; i ++){
        var tr_body = document.createElement('tr')
        tableBody.appendChild(tr_body)

        for (var j=0; j< 6; j++){
            var td = document.createElement('TD')
            // td.appendChild(document.createTextNode("Cell " + i + "," + j))
            td.style.height = "30px"
            if (j == 0 && i < 3){
                td.innerHTML = defaultRawMaterial[i]
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
        tr_foot.appendChild(th)
    }
}

/*
*
*               Logic concerning data generations into the table
*
*/

function generateData(){
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
    var inputClassNames = ['.rm_cost', '.sw']
    var return_weightClassNames = returnInputWeightClassNames(inputClassNameWeight, baseClassName) // example [".ww_b1", ".ww_ti"]
    inputClassNames.push(...return_weightClassNames)

    var matrixWeightInput = createMatrixInputValue(returnInputWeightClassNames)
    // inputClassNames example -> [".rm_cost", ".sw", ".ww_b1", ".ww_ti"]
    for (var i = 0; i < inputClassNames.length; i++){
        var tmp = 0;
        var sum = 0;
        console.log("inputClassNames[i] -> "+inputClassNames[i])
        $(inputClassNames[i]).each(function(){
            var input = $(this).text()
            if (inputClassNames[i] == '.sw'){
                sw.push(parseFloat(input))
            } else if (inputClassNames[i] != '.rm_cost'){ //ww_b1 ww_ti ww_b2 ...
                for (var j=0; j< return_weightClassNames.length; j++ ){
                    if(inputClassNames[i] == return_weightClassNames[j]){
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

    console.log("ww")
    console.log(ww)

    if (isNaN(sum_ww) || isNaN(sum_rmcost) || isNaN(sum_sw) || isNaN(sum_ww_ti)){
        alert("fill all the empty fields")
    } else {
        //
        //  here the logic to populate the table
        //

        var baseClassName = generate_baseClassName()
        console.log("######")
        console.log(matrixWeightInput)
        console.log("######")
        // baseClassName -> ["_b1", "_ti" ...]
        for(var q=0; q< baseClassName.length; q++){
            sum_ml100g = 0
            sum_vv = 0
            sum_ml1000g = 0
            sum_fcost = 0

            tmp = document.getElementsByClassName('totalww'+baseClassName[q])[0]
            if(q == 0){
                var tmp_value = list_sum[2]
                var value = parseFloat(tmp_value).toFixed(2)
                console.log(value)
                tmp.innerHTML = value
                console.log(tmp)
            } else if (q == 1){
                var tmp_value = list_sum[3]
                var value = parseFloat(tmp_value).toFixed(2)
                console.log(value)
                tmp.innerHTML = value
                console.log(tmp)
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
            console.log(sum_ml100g)
            tmp.innerHTML = parseFloat(sum_ml100g).toFixed(2)

                // insert single data for the cell %v/v
            for (var i = 0; i < global_num_raw_material; i++){
                var tmp = document.getElementsByClassName('vv'+baseClassName[q])[i]

                var elems = document.getElementsByClassName("ml100g"+baseClassName[q]);

                var elem = elems[i].innerText
                console.log(elem)
                var op = (100*elem)/sum_ml100g
                var _op = parseFloat(op).toFixed(2)
                tmp.innerHTML = _op
                sum_vv += parseFloat(_op)
            }

                // insert sum of data for cell Total %v/v
            tmp = document.getElementsByClassName('totalvv'+baseClassName[q])[0]
            console.log(sum_vv)
            tmp.innerHTML = parseFloat(sum_vv).toFixed(2)

                // insert single data for the cell mL/1000g
            for (var i = 0; i < global_num_raw_material; i++){
                var tmp = document.getElementsByClassName('ml1000g'+baseClassName[q])[i]

                var elems = document.getElementsByClassName("vv"+baseClassName[q]);

                var elem = elems[i].innerText
                console.log(elem)
                var op = (10*elem)
                var _op = parseFloat(op).toFixed(2)
                console.log(_op)
                tmp.innerHTML = _op
                sum_ml1000g += parseFloat(_op)
            }

                // insert sum of data for cell Total mL/1000g
            tmp = document.getElementsByClassName('totalml1000g'+baseClassName[q])[0]
            console.log(sum_ml1000g)
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
            tmp.innerHTML = parseFloat(sum_fcost).toFixed(4)
        }
    }
    global_sw = sw
    generateTableFillLvl()

}

function generateDataMaster(){
    var tableInput = document.getElementById("generatedTable")
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
        for(var i = 1 ; i < cells.length ; i++) {
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
        var res = (list_vv_b1[i+1] - list_vv_ti[i]*((100-defLvl)/100))/(defLvl/100)
        list_tiRemoving.push(res)
        sum_tiRemoving += res
    }

        // insert single datum for cell with className 'tirem_m'
    for (var i = 0; i < global_num_raw_material; i++){
        tmp = document.getElementsByClassName('tirem_m')[i+1]
        var _op = list_tiRemoving[i]
        var op = parseFloat(_op).toFixed(3)
        tmp.innerHTML = op
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

        sum_ww =  parseFloat(sum_ww) + parseFloat(op)        
        console.log(sum_ww)
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

        sum_fcost =  parseFloat(sum_fcost) + parseFloat(op)        
    }

        // insert sum of data for cell Total Formula Cost
    tmp = document.getElementsByClassName('totalfcost')[0]
    tmp.innerHTML = parseFloat(sum_fcost).toFixed(3)
}

/*
*
*               Supporting functions
*
*/

function createMatrixInputValue(returnInputWeightClassNames) {
    var _length = returnInputWeightClassNames.length
    var list = []
    for (var i=0; i< _length; i++){
        var list2 = []
        list.push(list2)
    }
    console.log(list)
    return list
}

function addTheadBases(tr_head, thead_bases){
    // var tblHeadObj = document.getElementById('generatedTable'); //table head
    for (var j=0; j < thead_bases.length; j++){
        var td = document.createElement('TD')
        // td.appendChild(document.createTextNode(thead_col_master[i]))
        if(j < 3){
            td.style.visibility = "hidden"
            console.log("here "+j)
            tr_head.appendChild(td)
        } else {
            td.innerHTML = thead_bases[j]
            td.style.fontWeight = "bold"
            td.style.minWidth = "80px"
            td.style.textAlign = "center"
            if(j==3 || j==4){
                td.colSpan = 5; 
            }
            tr_head.appendChild(td)
        }
    }
}

function generate_baseClassName(){
    var baseClassName = ["_b1", "_ti"]
    if(global_num_bases == 2 ){
        return baseClassName
    } else if (global_num_bases > 2){
        for (var i = 2; i < global_num_bases; i++){
            var _baseClassName = '_b'+i
            console.log(_baseClassName)
            baseClassName.push(_baseClassName)
        }
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

function setClassesForCalculation(){
    console.log("prepare cells with class for calculation")

    var cells = document.querySelectorAll('td:nth-child(2)');
    for(var i = 2 ; i < cells.length ; i++) {
        // console.log(cells[i])
        cells[i].classList.add('sw')
    }

    var cells = document.querySelectorAll('td:nth-child(3)');
    for(var i = 2 ; i < cells.length ; i++) {
        cells[i].classList.add('rm_cost')
    }

        // class for Base1
    var cells = document.querySelectorAll('td:nth-child(4)');
    for(var i = 2 ; i < cells.length ; i++) {
        cells[i].classList.add('ww_B1')
    }

    var cells = document.querySelectorAll('td:nth-child(5)');
    for(var i = 2 ; i < cells.length ; i++) {
        cells[i].classList.add('ml100g_B1')
    }

    var cells = document.querySelectorAll('td:nth-child(6)');
    for(var i = 1 ; i < cells.length ; i++) {
        cells[i].classList.add('vv_B1')
    }

    var cells = document.querySelectorAll('td:nth-child(7)');
    for(var i = 1 ; i < cells.length ; i++) {
        cells[i].classList.add('ml1000g_B1')
    }

    var cells = document.querySelectorAll('td:nth-child(8)');
    for(var i = 1 ; i < cells.length ; i++) {
        cells[i].classList.add('fcost_B1')
    }

    // class for Ti Slurry
    var cells = document.querySelectorAll('td:nth-child(9)');
    for(var i = 1 ; i < cells.length ; i++) {
        cells[i].classList.add('ww_TI')
    }

    var cells = document.querySelectorAll('td:nth-child(10)');
    for(var i = 1 ; i < cells.length ; i++) {
        cells[i].classList.add('ml100g_TI')
    }

    var cells = document.querySelectorAll('td:nth-child(11)');
    for(var i = 1 ; i < cells.length ; i++) {
        cells[i].classList.add('vv_TI')
    }

    var cells = document.querySelectorAll('td:nth-child(12)');
    for(var i = 1 ; i < cells.length ; i++) {
        cells[i].classList.add('ml1000g_TI')
    }

    var cells = document.querySelectorAll('td:nth-child(13)');
    for(var i = 1 ; i < cells.length ; i++) {
        cells[i].classList.add('fcost_TI')
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
    btn.style.display = "block";

    var btn_prodName = document.getElementById("nameProduct")
    btn_prodName.style.display = "block"
}

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  function test() {
    console.log("clicked!")

        // get the table -> return a map
    var tbl = $('#generatedTable tr').get().map(function(row) {
        return $(row).find('td').get().map(function(cell) {
          return $(cell).html();
        });
      });

    raw_m = []
    specific_w = []
    rm_cost = []
    bases=[]

    var base = tbl[2].length -3
    console.log(base)

    //                  https://lodash.com/docs/4.17.10#chunk

    var t = 3
    var tmp2 = _.drop(tbl[2],t) // array con tutti valori delle basi presenti
    var length_tmp2 = tmp2.length
    var num_cycle = length_tmp2/5
    var __base = ["name", "g_100g", "ml_100g", "v_100v", "ml_1000ml", "formula_cost"]
    var test = []

      // create matrix of base values
      // [Array(5), Array(5), Array(5), Array(5), Array(5), Array(5)]
      //     ⮡ [""g_100g":"25"", ""ml_100g":"25.000"", ""v_100v":"67.37"", ""ml_1000ml":"673.70"", ""formula_cost":"0.0000""]
    for (var j = 2; j <tbl.length -1; j++ ){
        var t = 3
        var tmp2 = _.drop(tbl[j],t)
        console.log(tmp2)
        for(var i=0; i<num_cycle; i++){
            var end = (i*5)+5
            var sliced = tmp2.slice(i*5, end)
            console.log(sliced)
            var x = []
            for(var k=0; k < sliced.length; k++){
                console.log(__base[k+1] + " : " + sliced[k])
                x.push('"'+__base[k+1]+'"' +':'+'"'+sliced[k]+'"')
            }
            test.push(x)
        }
    }

    for(var i=2; i < tbl.length -1; i++){
        raw_m.push(tbl[i][0])
        specific_w.push(tbl[i][1])
        rm_cost.push(tbl[i][2])
    }

    var data_init = '{ "data":['
    var data_end = ']}'

    var x1 = `
        {
            "raw_material": "`+ raw_m[0]+`",
            "specific_weight": "`+ specific_w[0]+`",
            "RM_cost": "`+ rm_cost[0]+`",
            "bases": [`

    var _temp = ""
    for (var i=0; i< global_num_bases; i++){
        var tmp = '{'+test[i]+'}'
        if(global_num_bases > 1 && i != global_num_bases-1){
            tmp += ',' 
            _temp += tmp
        }
        else{
            _temp += tmp
        }
    }

    var x2 = `]}
    `

    // console.log(data_init+x1+_temp+x2+data_end)

        // EOL
    var _temp = ""
    var i = 0
    while (i < test.length) {

        for (var j = i; j< i+2; j++){
            var tmp = '{'+test[j]+'}'
            console.log(tmp)
            if(j > 1 && j != i-1){
                tmp += ',' 
                _temp += tmp
            }
            else{
                _temp += tmp
            }
        }
        console.log("end tmp")
        // console.log(_temp)
        i+=2;
    }
    // EOL

    // working correct test
    var _q = ""
    var counter = 0
    var val = 0
    for(var i=0; i < global_num_raw_material; i++){
        var q = `
        {
            "raw_material": "`+ raw_m[i]+`",
            "specific_weight": "`+ specific_w[i]+`",
            "RM_cost": "`+ rm_cost[i]+`",
            "bases":[`
        var _temp = ""
        var max = val+1
        for (var j = val; j< val+2; j++){
            var tmp = '{'+test[j]+'}'
            if(j != max){
                tmp += ',' 
                _temp += tmp
            } else {
                _temp += tmp
            }
        }
        q += _temp
        q += `]
            }`  
        if(global_num_raw_material > 1 && i != global_num_raw_material-1){
            q += ',' 
            _q += q
        }
        else{
            _q += q
        }
        val += 2
    }

    console.log("created json")
    console.log('{"data":['+_q+']}')
}

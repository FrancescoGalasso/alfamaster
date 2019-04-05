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
var show_save_form = false

function generateTable(id){

    var num_raw_material = document.getElementById('main-dashboard-inner-grid-input-1').value
    var num_bases = document.getElementById('main-dashboard-inner-grid-input-2').value
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
    if (num_bases < 2 || num_raw_material < 5 || num_bases == "" || num_raw_material == ""){
        var msg = "OPS! You left some field blank or you typed a lower number for generate Raw Materials or Bases"
        $("#msg-modal").html(msg)
        $("#myModal").modal()
        clean_after_wrong_input()
        return;
    }

    hideOrShowElements("hideGridContainer")
    hideOrShowElements("showBtnsForUser")

    /*
    *       generate the table
    */
    var thead_col = ["Raw material", "Specific weight [g/mL]", "RM cost"]
    var thead_col_base = ["%<sub>w/w</sub>", "mL/100g", "%<sub>v/v</sub>", "mL/1000g", "Formula Cost"]
    var thead_col_master = ["TiO<sub>2</sub> removing", "%<sub>v/v</sub>", "g/100mL", "%<sub>w/w</sub>", "Formula Cost"]
    var myTableDiv = document.getElementById("main-dashboard-inner-table-bases")

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
    var defaultRawMaterial = ['H<sub>2</sub>O', 'Binder', 'TiO<sub>2</sub>', 'Binder 2', 'TiO<sub>2</sub> 2', 'Ext TiO<sub>2</sub> 3' ]

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

            if (j == 0 && i < 5){
                td.innerHTML = defaultRawMaterial[i]
                td.contentEditable = false
                td.style.backgroundColor = "transparent";
            }
            if (indexInput.indexOf(j) > -1 || (j == 0 && i >= 5)){
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
        if (lvl_fill_prod.indexOf('[') > -1 && lvl_fill_prod.indexOf(']') > -1){
            lvl_fill_prod = lvl_fill_prod.slice(1,-1)
        }
        var listofLvl_fill = lvl_fill_prod.split(',').map(Number);
        op = listofLvl_fill[0]
        op2 = 100 - op
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
            $('#main-dashboard-inner-colorstrength').css("visibility", "visible");
        }else if(global_popupNewProd){
            alert("DEVI CREARE NUOVO PRODOTTO!")
            $('#main-dashboard-inner-colorstrength').css("visibility", "hidden");
            return
        } else {
            if(typeof show_save_form !== "undefined" && show_save_form == true){
                $('#main-dashboard-form-save').css("display", "block");  
                $('#btn_update_save').css("visibility", "visible");
            }          
        }
    }else{
        $('#main-dashboard-inner-colorstrength').css("visibility", "visible");
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

/**
 * 
 * Set display = "none" to input #nameProduct and to button #btn_calculate
 */
function clean_after_wrong_input(){
    var name_product = document.getElementById('main-dashboard-inner-grid-container-input-formula-name')
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

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

$.fn.elemExists = function() { 
    return this.length; 
}

function saveProduct() {

    if ($('[name="main-dashboard-form-save-input-name"]').elemExists()) {
        var formulaName = $('#main-dashboard-inner-grid-container-input-formula-name').val()
        $('[name="main-dashboard-form-save-input-name"]').val(formulaName)
    }

    if ($('[name="main-dashboard-form-save-input-data"]').elemExists()) {

        var arrData = []
        $('#main-dashboard-inner-table-bases > table > tbody  > tr').each(function(index, trow){
			var currentRow=$(this);
            var tmp = currentRow.find('td')
            var cellData = [] 
            tmp.each(function(subindex, cell){
                var currentCell=$(this)
                // console.log(currentCell.text())
                cellData.push(currentCell.text())
            });
            arrData.push(cellData)
        });
        
        $('[name="main-dashboard-form-save-input-data"]').val(JSON.stringify(arrData, undefined, 2))
    }

    if ($('[name="main-dashboard-form-save-input-currency"]').elemExists()) {
        var currency = ''
        if($( "#main-dashboard-inner-grid-container-select-formula-currency").elemExists()) {
            currency = $( "#main-dashboard-inner-grid-container-select-formula-currency option:selected" ).text();
        } else {
            currency = "default"
        }
        $('[name="main-dashboard-form-save-input-currency"]').val(currency)
    }

    if ($('[name="main-dashboard-form-save-input-fillvl"]').elemExists()) {
        var slurryVol = $('#main-dashboard-inner-newpage-table-fillcalculation table tbody tr:last td:nth-child(1)').text()
        var fillvl = 100 - parseInt(slurryVol)
        var listofFillvl = slurryVol+" "+fillvl+" "+ fillvl
        $('[name="main-dashboard-form-save-input-fillvl"]').val(listofFillvl)
    }

    if ($('[name="main-dashboard-form-save-input-revision"]').elemExists()) {
        var revision = ''
        if ($('h4 > strong').elemExists()){
            revision = $('h4 > strong').text()
        } else {
            revision = 0
        }
        $('[name="main-dashboard-form-save-input-revision"]').val(revision)
    }

    if ($('[name="main-dashboard-form-save-input-pk"]').elemExists()) {
        if(typeof pk !== "undefined"){
            if(pk){
                $('[name="main-dashboard-form-save-input-pk"]').val(pk)
            }
        }
    }

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
    infInput = $('#main-dashboard-inner-grid-input-3').val()
    supInput = $('#main-dashboard-inner-grid-input-4').val()
 

    if(supInput == "" || infInput == ""){
        alert("fill all the input fields")
    }else{
        $('#main-dashboard-inner-colorstrength-checktest').css("visibility", "visible");
    }
    counterTest = 2

    var verifyBtn = $('#main-dashboard-inner-colorstrength-btn-verify')
    verifyBtn.css("cursor", "not-allowed")
    verifyBtn.css("pointer-events", "none")
    verifyBtn.css("opacity", 0.65)

    $( ".test" ).remove();
    var divCheckTest = $('#main-dashboard-inner-colorstrength-checktest')
    divCheckTest.append('<div class="test">Test result n°1 <input id="r1" type="number" style="margin-left:20px; width: 51 !important;text-align: center;"> <button style="margin-left:1;" onclick="verify(event)">Verify</button></div>')
}

function verify(event){
    var resultTest = $("#main-dashboard-inner-colorstrength-checktest input:last")
    if(resultTest.val() != ""){
        if(resultTest.val() <= parseInt(supInput) && resultTest.val() >= parseInt(infInput)){
            testOK=true
        }else if (resultTest.val() < parseInt(infInput)){
            testOK=false
            up = true
        }else if(resultTest.val() > parseInt(supInput)){
            testOK=false
        }

        var check = $('#main-dashboard-inner-colorstrength-checktest')
        var row = $('#main-dashboard-inner-colorstrength-checktest').find("div:last")
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

            var text1 = $('#main-dashboard-inner-newpage-table-fillcalculation tr:last td:nth-child(1)').text()
            var text2 = $('#main-dashboard-inner-newpage-table-fillcalculation tr:last td:nth-child(2)').text()
            var text3 = $('#main-dashboard-inner-newpage-table-fillcalculation tr:last td:nth-child(3)').text()

            $('#main-dashboard-inner-newpage-table-fillcalculation tr:last').remove();
            $("#main-dashboard-inner-newpage-table-fillcalculation table tbody").append('<tr><td><del>'+text1+'</del></td><td><del>'+text2+'</del></td><td><del>'+text3+'</del></td></tr>');

            if(up){
                text1 = parseInt(text1) + 1
                text2 = parseInt(text2) - 1
                text3 = text2
            }else{
                text1 = parseInt(text1) - 1
                text2 = parseInt(text2) + 1
                text3 = text2
            }
            $("#main-dashboard-inner-newpage-table-fillcalculation table tbody").append('<tr><td>'+text1+'</td><td>'+text2+'</td><td>'+text3+'</td></tr>');

            counterTest++
            flag = false
        }else{
            $(event.target).css("opacity", 0.65)    
            $(event.target).css("pointer-events", "none")
            row.append("    TEST PASSED")
            generateDataMasterFromServer()
        }
    }
}

/*
*
*               Document ready 
*
*/

$( document ).ready(function() {

    var coinages = [
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
    for (var i=0;i<coinages.length;i++){
       option += '<option value="'+ coinages[i] + '">' + coinages[i] + '</option>';
    }
    $('#main-dashboard-inner-grid-container-select-formula-currency').append(option);

    console.log("doc ready!")

    var inputB1 = $("#tdetail tbody tr td:nth-child(4)")
    for (var i=0; i< inputB1.length; i++){
        if(i<4){
            var tmp = inputB1[i].textContent
            global_inputValues.push(tmp)
        }
    }

    if(window.location.href.indexOf("update") > -1){
        console.log("URL UPDATE")
            // insert correct innerHTML for the first 3 rows of table tdetail
    var body = document.getElementById("tdetail")
    var materials = ['H<sub>2</sub>O', 'Binder', 'TiO<sub>2</sub>']
    for(var i=0; i<3; i++){
        body.rows[i+2].cells[0].innerHTML = materials[i]
        }

    // adding classname and content editable for update operation
    var amountOfRows = $("#tdetail  tbody  tr").length

    var numberofBases = document.getElementById('tdetail').rows[0].cells.length -3
    var listofIndexInput = [2,3,4,9]
    if(numberofBases >1){
        for(var i=2; i<numberofBases; i++){
            var lastIndex = listofIndexInput[listofIndexInput.length-1]
            var newIndex = lastIndex+5
            listofIndexInput.push(newIndex)
        }
    }
    
    for(var i=2; i<amountOfRows+2; i++){
        for (var j=0; j<listofIndexInput.length; j++){
            var el = body.rows[i].cells[listofIndexInput[j]-1]
            el.contentEditable = true
            el.style.backgroundColor = "#ffff00"
            el.className = "update"
            if(j == 1){
                el.classList.add("rm_cost", "update")
            }else if(j == 0){
                el.classList.add("sw", "update")
            }
        }
    }

    // function activated with the keyup event on the cells with class update
    $('.update').keyup(function(){

        $(this).css('font-weight', 'bold');

        // clear all the cells with className 'to_update'
        var cells = document.getElementsByClassName('to_update')
        for(var i=0; i<cells.length; i++){
            cells[i].innerHTML = ""
        }

        setClassesForCalculation()

        document.getElementById("updateCalculateBtn").disabled = false;

        var table = document.getElementById("generatedTableFillLvl")
        // if table exists, clear the cells of last rows
        if (table){
            var count = table.rows[0].cells.length
            for (var i=0; i<count; i++){
                var cell = table.rows[table.rows.length - 1].cells[i]
                cell.innerHTML = " "
            }
        }
        keyupAction = true

        // var show_save_form = false
        if($(this).hasClass("sw")){
            show_save_form = true
        }
        if($(this).hasClass("rm_cost")){
            show_save_form = true
        }    
    }); 

    $('#main-dashboard-inner-colorstrength').css("visibility", "hidden");
    $('#btn_update_save').css("visibility", "hidden");
    var keyupAction = false
    }
});

function hideOrShowElements(action){

    switch(action) {
        case "calculateBases":
            $("#main-dashboard-inner-newpage-table-fillcalculation").css("display", "none")
            $('#main-dashboard-inner-colorstrength').css("visibility", "hidden")
            $('#main-dashboard-inner-colorstrength-checktest').css("visibility", "hidden")
            $('#main-dashboard-inner-newpage-table-fillcalculation tbody').empty()
            $('#main-dashboard-inner-newpage-table-fillcalculation tbody').append('<tr><td></td><td></td><td></td></tr>')
            $('#main-dashboard-inner-newpage-table-master').css('display', 'none')
            $('#main-dashboard-inner-newpage-table-master tbody').empty()
            $("#main-dashboard-inner-colorstrength-btn-verify").css({ 'cursor' : '', 'pointer-events' : '' , 'opacity' : ''});
            $('#main-dashboard-form-save').css('display', 'none')
          break;
        case "hideGridContainer":
            $('.main-dashboard-inner-grid-container').css('display', 'none')
            break;
        case "showBtnsForUser":
            $('#main-dashboard-inner-grid-container-input-formula-name').css('display', 'block')
            $('#btn_update_save').css('display', 'block')
            $('#main-dashboard-inner-grid-container-btn-addremove').css('display', 'block')
            $('#btn_calculate').css('display', 'block')
            $('#main-dashboard-inner-grid-container-select').css('display', 'block')
            break;
        default:
          // code block
          alert("default")

      }
}

function retrivePayloadFromTableBases() {

    var nofRawMat = $("#generatedTable > tbody > tr").length

    inputMatrix = []
    for (var i=0; i < nofRawMat; i++) {
        rowsData = []
        var colValue = $("#generatedTable tbody tr:eq("+i+")");
        var numofCellsRow = colValue.find('td').length
        for (var j=0; j < numofCellsRow; j++) {
            value = colValue.find('td:eq('+j+')')
            rowsData.push(value.text())
        }
    inputMatrix.push(rowsData)
    }

    return JSON.stringify(inputMatrix, undefined, 2)

}

function generateDataFromServer() {

    hideOrShowElements("calculateBases")

    var matrix = retrivePayloadFromTableBases()
    var payload = {'payload':matrix}

    $.ajax({
        url: '/bases/',
        type: 'POST',
        data: payload,
    })
    .done(function (data) {
        console.log("SUCCESS callback")
        var payloadBases = data['payloadBases']
        populateTableBasesWithDataFromServer(payloadBases)
        var payloadFillvl = data['payloadFillvl']
        populateTableFillvlWithDataFromServer(payloadFillvl)

        // TODO: check if this must be moved outsite in some specific function
        $('#main-dashboard-inner-colorstrength').css("visibility", "visible")
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        //  serrorFunction();
        console.log("ERROR callback")
        alert("ERROR!") }
    );
}

function generateDataMasterFromServer() {

    var matrix = retrivePayloadFromTableBases()
    var defLvl = $('#main-dashboard-inner-newpage-table-fillcalculation tbody tr:last td:nth-child(3)').text()
    console.log(defLvl)
    var payload = {'payloadBases': matrix, 'payloadLvl': defLvl}

    $.ajax({
        url: '/master/',
        type: 'POST',
        data: payload,
    })
    .done(function (data) {
        var reply = data['replyFromServer']
        if ( reply.length > 0 ) {
            console.log("SUCCESS Master callback")
            $('#main-dashboard-inner-newpage-table-master').css("display", "inline")
            // $('#btn_update_save').css("visibility", "visible");
            $('#main-dashboard-form-save').css('display', 'inline')
            populateTableMasterWithDataFromServer(reply)
        } else {
            alert("ERROR on calc MASTER values ...")
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        //  serrorFunction();
        console.log("ERROR callback")
        alert("ERROR!") }
    );
}

function populateTableBasesWithDataFromServer(payload) {
    var nofRawMat = $("#generatedTable > tbody > tr").length
    for (var i=0; i < nofRawMat; i++) {
        var colValue = $("#generatedTable tbody tr:eq("+i+")");
        var numofCellsRow = colValue.find('td').length
        for (var j=0; j < numofCellsRow; j++) {
            // oldValue = colValue.find('td:eq('+j+')')
            newValue = payload[i][j]
            colValue.find('td:eq('+j+')').text(newValue)
        }
    }
}

function populateTableFillvlWithDataFromServer(payload) {
    $("#main-dashboard-inner-newpage-table-fillcalculation").css("display", "inline-grid")
    var colValue = $("#main-dashboard-inner-newpage-table-fillcalculation > table > tbody > tr:eq(0)");
    var numofCellsRow = colValue.find('td').length
    for (var j=0; j < numofCellsRow; j++) {
        newValue = payload[j]
        colValue.find('td:eq('+j+')').text(newValue)
    }
}

function populateTableMasterWithDataFromServer(reply) {
    $.each(reply, function(index, array) {
        $('#main-dashboard-inner-newpage-table-master tbody').append('<tr></tr>')
        $.each(array, function(subindex, value) {
          $row = $('#main-dashboard-inner-newpage-table-master tbody tr:last')
          $row.append('<td>'+value+'</td>')
        });
    });
}

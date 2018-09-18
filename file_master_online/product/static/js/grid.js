$( document ).ready(function() {
    console.log( "page HTML product_edit3 ready!" );   
});

var td_counter = 0;
var global_num_raw_material = 0

function generateTable(){
    console.log("I'm going to generate the table for the customer")
    showGenerateBtn()

    var num_raw_material = document.getElementById('input_grid').value
    var num_bases = document.getElementById('input_grid2').value
    console.log(num_raw_material)
    console.log(num_bases)
    global_num_raw_material = num_raw_material

    // some check before generate the table
    if (num_raw_material.includes(".") || num_raw_material.includes("-") || num_bases.includes(".") || num_bases.includes("-")){
        alert("OPS! The value you added in a field contains a dot or a minus..")
        return;
    }
    if (num_bases == 0 || num_raw_material == 0 || num_bases == "" || num_raw_material == ""){
        alert("OPS! You typed 0 or you left some field blank")
        return;
    }


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
    var tr_head = document.createElement('tr')
    tableHead.appendChild(tr_head)
    var list_of_thead = [thead_col,thead_col_base,thead_col_master]
    creationTHead(tr_head, list_of_thead)
    console.log(td_counter)

        // creation of tbody for the table
    var tr_body = document.createElement('tr')
    tableBody.appendChild(tr_body)
    creationTBody(num_raw_material, tableBody)

        // creation of tfoot for the table
    var tr_foot = document.createElement('tr')
    tableFoot.appendChild(tr_foot)
    creationTFoot(tableFoot, tr_foot)

    myTableDiv.appendChild(table)
    setClassesForCalculation()
}

function setClassesForCalculation(){
    console.log("prepare cells with class for calculation")

    var cells = document.querySelectorAll('td:nth-child(2)');
    for(var i = 1 ; i < cells.length ; i++) {
        // console.log(cells[i])
        cells[i].classList.add('sw')
    }

    var cells = document.querySelectorAll('td:nth-child(3)');
    for(var i = 1 ; i < cells.length ; i++) {
        cells[i].classList.add('rm_cost')
    }

        // class for Base1
    var cells = document.querySelectorAll('td:nth-child(4)');
    for(var i = 1 ; i < cells.length ; i++) {
        cells[i].classList.add('ww')
    }

    var cells = document.querySelectorAll('td:nth-child(5)');
    for(var i = 1 ; i < cells.length ; i++) {
        cells[i].classList.add('ml100g')
    }

    var cells = document.querySelectorAll('td:nth-child(6)');
    for(var i = 1 ; i < cells.length ; i++) {
        cells[i].classList.add('vv')
    }

    var cells = document.querySelectorAll('td:nth-child(7)');
    for(var i = 1 ; i < cells.length ; i++) {
        cells[i].classList.add('ml1000g')
    }

    var cells = document.querySelectorAll('td:nth-child(8)');
    for(var i = 1 ; i < cells.length ; i++) {
        cells[i].classList.add('fcost')
    }

    // class for Master
    var cells = document.querySelectorAll('td:nth-child(9)');
    for(var i = 1 ; i < cells.length ; i++) {
        cells[i].classList.add('fcost')
    }
    var cells = document.querySelectorAll('td:nth-child(10)');
    for(var i = 1 ; i < cells.length ; i++) {
        cells[i].classList.add('fcost')
    }
    var cells = document.querySelectorAll('td:nth-child(11)');
    for(var i = 1 ; i < cells.length ; i++) {
        cells[i].classList.add('fcost')
    }
    var cells = document.querySelectorAll('td:nth-child(12)');
    for(var i = 1 ; i < cells.length ; i++) {
        cells[i].classList.add('fcost')
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
    for (var i=3; i < td_counter; i++){
        var th = document.createElement('th')

            // adding className for Base1 
        if (i == 3){
            th.className = "totalww_b1"
        } else if (i == 4){
            th.className = "totalml100g_b1"
        } else if (i == 5){
            th.className = "totalvv_b1"
        } else if (i == 6){
            th.className = "totalml1000g_b1"
        } else if (i == 7){
            th.className = "totalfcost_b1"
        }
            // adding className for Master
        else if (i == 8){
            th.className
        }
        tr_foot.appendChild(th)
    }
}

function creationTHead(tr_head, list_of_thead){
    console.log(list_of_thead)
    console.log(tr_head)
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
    for (var i = 0; i< num_raw_material; i ++){
        var tr_body = document.createElement('tr')
        tableBody.appendChild(tr_body)

        for (var j=0; j< td_counter; j++){
        var td = document.createElement('TD')
        // td.appendChild(document.createTextNode("Cell " + i + "," + j))
        td.style.height = "30px"
        if (j < 4){
            td.contentEditable = true
        }
        tr_body.appendChild(td)           
        }
    }
}

function showGenerateBtn(){
    console.log("I'm going to show the generateBtn")
    var btn = document.getElementById("btn_calculate")
    btn.style.display = "block";

}

function generateData(){
    var sum_ww = 0;
    var sum_rmcost = 0
    var sum_sw = 0
    var sum_ml100g = 0
    var sum_vv = 0
    var sum_ml1000g = 0
    var sum_fcost = 0

    var ww = []
    var sw = []

    $('.ww').each(function()
    {
        sum_ww += parseFloat($(this).text());
        ww.push(parseFloat($(this).text()));
    });

    $('.rm_cost').each(function()
    {
        sum_rmcost += parseFloat($(this).text());
    });

    $('.sw').each(function()
    {
        sum_sw += parseFloat($(this).text());
        sw.push(parseFloat($(this).text()))
    });

    if (isNaN(sum_ww) || isNaN(sum_rmcost) || isNaN(sum_sw)){
        alert("fill all the empty fields")
    } else {

        //here the logic to populate the table
        tmp = document.getElementsByClassName('totalww_b1')[0]
        var ww_sum = parseFloat(sum_ww).toFixed(2)
        tmp.innerHTML = ww_sum

            // insert single data for the cell mL/100g
        for (var i = 0; i < global_num_raw_material; i++){
            tmp = document.getElementsByClassName('ml100g')[i]
            var a = ww[i]
            var b = sw[i]
            var division = a/b
            var op = parseFloat(division).toFixed(2)
            tmp.innerHTML = op
            sum_ml100g += parseFloat(op)
        }

            // insert sum of data for cell Total mL/100g
        tmp = document.getElementsByClassName('totalml100g_b1')[0]
        console.log(tmp)
        console.log(sum_ml100g)
        tmp.innerHTML = sum_ml100g

            // insert single data for the cell %v/v
        for (var i = 0; i < global_num_raw_material; i++){
            var tmp = document.getElementsByClassName('vv')[i]

            var elems = document.getElementsByClassName("ml100g");

            var elem = elems[i].innerText
            console.log(elem)
            var op = (100*elem)/sum_ml100g
            var _op = parseFloat(op).toFixed(2)
            console.log(_op)
            tmp.innerHTML = _op
            sum_vv += parseFloat(_op)
        }

            // insert sum of data for cell Total %v/v
        tmp = document.getElementsByClassName('totalvv_b1')[0]
        console.log(sum_vv)
        tmp.innerHTML = sum_vv

            // insert single data for the cell mL/1000g
        for (var i = 0; i < global_num_raw_material; i++){
            var tmp = document.getElementsByClassName('ml1000g')[i]

            var elems = document.getElementsByClassName("vv");

            var elem = elems[i].innerText
            console.log(elem)
            var op = (10*elem)
            var _op = parseFloat(op).toFixed(2)
            console.log(_op)
            tmp.innerHTML = _op
            sum_ml1000g += parseFloat(_op)
        }

            // insert sum of data for cell Total mL/1000g
        tmp = document.getElementsByClassName('totalml1000g_b1')[0]
        console.log(sum_ml1000g)
        tmp.innerHTML = sum_ml1000g

            // insert single data for the cell Formula Cost
        for (var i = 0; i < global_num_raw_material; i++){
            var tmp = document.getElementsByClassName('fcost')[i]

            var elems_vv = document.getElementsByClassName("vv")
            var elems_sw = document.getElementsByClassName("sw")
            var elems_rmcost = document.getElementsByClassName("rm_cost")

            var elem_vv = elems_vv[i].innerText
            var elem_sw = elems_sw[i].innerText
            var elem_rmcost = elems_rmcost[i].innerText

            var op1 = elem_sw*elem_rmcost
            var _op = (parseFloat(op1).toFixed(2)/1000)*elem_vv
            tmp.innerHTML = parseFloat(_op).toFixed(2)
            sum_fcost += parseFloat(_op)
        }

            // insert sum of data for cell Total Formula Cost
        tmp = document.getElementsByClassName('totalfcost_b1')[0]
        console.log(sum_fcost)
        tmp.innerHTML = parseFloat(sum_fcost).toFixed(2)
    }
}

$('tbody').on('focus', '[contenteditable]', function() {
    const $this = $(this);
    $this.data('before', $this.html());
    console.log("test")
});
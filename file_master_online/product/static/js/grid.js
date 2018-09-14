$( document ).ready(function() {
    console.log( "page HTML product_edit3 ready!" );   
});

var td_counter = 0;

function generateTable(){
    console.log("I'm going to generate the table for the customer")

    var num_raw_material = document.getElementById('input_grid').value
    var num_bases = document.getElementById('input_grid2').value
    console.log(num_raw_material)
    console.log(num_bases)

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
    var tableHead = document.createElement('THEAD')
    var tableBody = document.createElement('TBODY')
    var tableFoot = document.createElement('TFOOT')
    table.appendChild(tableHead)
    table.appendChild(tableBody)
    table.appendChild(tableFoot)

    // TODO REFACTORING
    // creation of thead for the table
    var tr_head = document.createElement('tr')
    tableHead.appendChild(tr_head)

    // for (var i=0; i< thead_col.length; i++) {
    //     var td = document.createElement('TD')
    //     // td.appendChild(document.createTextNode(thead_col_master[i]))
    //     td.innerHTML = thead_col[i]
    //     td.style.fontWeight = "bold"
    //     td.style.minWidth = "80px"
    //     td.style.textAlign = "center"
    //     tr_head.appendChild(td)
    // }
    // for (var i=0; i< thead_col_base.length; i++) {
    //     var td = document.createElement('TD')
    //     // td.appendChild(document.createTextNode(thead_col_master[i]))
    //     td.innerHTML = thead_col_base[i]
    //     td.style.fontWeight = "bold"
    //     td.style.minWidth = "80px"
    //     td.style.textAlign = "center"
    //     tr_head.appendChild(td)
    // }
    // for (var i=0; i< thead_col_master.length; i++) {
    //     var td = document.createElement('TD')
    //     // td.appendChild(document.createTextNode(thead_col_master[i]))
    //     td.innerHTML = thead_col_master[i]
    //     td.style.fontWeight = "bold"
    //     td.style.minWidth = "80px"
    //     td.style.textAlign = "center"
    //     tr_head.appendChild(td)
    // }

    // for (var i = 0; i < 3; i++) {
    //     var tr = document.createElement('TR')
    //     tableBody.appendChild(tr)

    //     for (var j = 0; j < 4; j++) {
    //         var td = document.createElement('TD')
    //         td.width = '75'
    //         td.appendChild(document.createTextNode("Cell " + i + "," + j))
    //         tr.appendChild(td)
    //     }
    // }

    // REFACTORING DONE
    var list_of_thead = [thead_col,thead_col_base,thead_col_master]
    creationTHead(tr_head, list_of_thead)
    console.log(td_counter)

    myTableDiv.appendChild(table)
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

function creationTBody(){
    
}
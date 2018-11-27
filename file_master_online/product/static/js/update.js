$( document ).ready(function() {

    // insert correct innerHTML for the first 3 rows of table tdetail
    var body = document.getElementById("tdetail")
    var materials = ['H<sub>2</sub>O', 'Binder', 'TiO<sub>2</sub>']
    for(var i=0; i<3; i++){
        body.rows[i+2].cells[0].innerHTML = materials[i]
        console.log(body.rows[i+2].cells[0])
        }

    // adding classname and content editable for update operation
    var amountOfRows = $("#tdetail  tbody  tr").length
    var amountOfColums = document.getElementById('tdetail').rows[1].cells.length
    // for(var i=2; i<amountOfRows+2; i++){
    //     for (var j=1; j < amountOfColums; j++){
    //         if(i<5 && (j<4 || j==8)){
    //             body.rows[i].cells[j].contentEditable = true
    //             body.rows[i].cells[j].style.backgroundColor = "#ffff00"
    //             body.rows[i].cells[j].className = "update"
    //         } else {
    //             body.rows[i].cells[j].className = "to_update"
    //         }
    //     }
    // }

    /// test existing code
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
            body.rows[i].cells[listofIndexInput[j]-1].contentEditable = true
            body.rows[i].cells[listofIndexInput[j]-1].style.backgroundColor = "#ffff00"
            body.rows[i].cells[listofIndexInput[j]-1].className = "update"
        }
        // for (var j=1; j < amountOfColums; j++){
        //     if(body.rows[i].cells[j].contains('update')){
        //         console.log("CONTENGO")
        //     }else{
        //         console.log("NON CONTENGO!")
        //     }
        // }
    }

    // for(var i=2; i<amountOfRows+2; i++){
    //     for (var j=1; j < amountOfColums; j++){
    //         if(i<5 && (j<4 || j==8)){
    //             body.rows[i].cells[j].contentEditable = true
    //             body.rows[i].cells[j].style.backgroundColor = "#ffff00"
    //             body.rows[i].cells[j].className = "update"
    //         } else {
    //             body.rows[i].cells[j].className = "to_update"
    //         }
    //     }
    // }

    // function activated with the keyup event on the cells with class update
    $('.update').keyup(function(){

        $(this).css('font-weight', 'bold');

        // clear all the cells with className 'to_update'
        var cells = document.getElementsByClassName('to_update')
        for(var i=0; i<cells.length; i++){
            cells[i].innerHTML = ""
        }

        // setClassesForCalculationUpdate()
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

    
    }); 

    // add the foot
    // var code = '<tr><th colspan="3" style="font-weight: bold;">Total</th><th class="totalww_b1 to_update"></th><th class="totalml100g_b1 to_update"></th><th class="totalvv_b1 to_update"></th><th class="totalml1000g_b1 to_update"></th><th class="totalfcost_b1 to_update"></th><th class="totalww_ti to_update"></th><th class="totalml100g_ti to_update"></th><th class="totalvv_ti to_update"></th><th class="totalml1000g_ti to_update"></th><th class="totalfcost_ti to_update"></th></tr>'
    // $( "#tdetail" ).append( code );
    // $('#tdetail tr:last').remove();

});


// function setClassesForCalculationUpdate(){

//     var cells = document.querySelectorAll('td:nth-child(2)');
//     for(var i = 0 ; i < cells.length ; i++) {
//         cells[i].classList.add('sw')
//     }

//     var cells = document.querySelectorAll('td:nth-child(3)');
//     for(var i = 0 ; i < cells.length ; i++) {
//         cells[i].classList.add('rm_cost')
//     }

//         // class for Base1
//     var cells = document.querySelectorAll('td:nth-child(4)');
//     for(var i = 0 ; i < cells.length ; i++) {
//         cells[i].classList.add('ww_B1')
//     }

//     var cells = document.querySelectorAll('td:nth-child(5)');
//     for(var i = 0 ; i < cells.length ; i++) {
//         cells[i].classList.add('ml100g_B1')
//     }

//     var cells = document.querySelectorAll('td:nth-child(6)');
//     for(var i = 0 ; i < cells.length ; i++) {
//         cells[i].classList.add('vv_B1')
//     }

//     var cells = document.querySelectorAll('td:nth-child(7)');
//     for(var i = 0 ; i < cells.length ; i++) {
//         cells[i].classList.add('ml1000g_B1')
//     }

//     var cells = document.querySelectorAll('td:nth-child(8)');
//     for(var i = 0 ; i < cells.length ; i++) {
//         cells[i].classList.add('fcost_B1')
//     }

//     // class for Ti Slurry
//     var cells = document.querySelectorAll('td:nth-child(9)');
//     for(var i = 0 ; i < cells.length ; i++) {
//         cells[i].classList.add('ww_TI')
//     }

//     var cells = document.querySelectorAll('td:nth-child(10)');
//     for(var i = 0 ; i < cells.length ; i++) {
//         cells[i].classList.add('ml100g_TI')
//     }

//     var cells = document.querySelectorAll('td:nth-child(11)');
//     for(var i = 0 ; i < cells.length ; i++) {
//         cells[i].classList.add('vv_TI')
//     }

//     var cells = document.querySelectorAll('td:nth-child(12)');
//     for(var i = 0 ; i < cells.length ; i++) {
//         cells[i].classList.add('ml1000g_TI')
//     }

//     var cells = document.querySelectorAll('td:nth-child(13)');
//     for(var i = 0 ; i < cells.length ; i++) {
//         cells[i].classList.add('fcost_TI')
//     }
// }
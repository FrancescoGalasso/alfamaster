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
            if(j == 1){
                body.rows[i].cells[listofIndexInput[j]-1].className = "rm_cost"
            }else if(j == 0){
                body.rows[i].cells[listofIndexInput[j]-1].className = "sw"
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
    
    }); 

});

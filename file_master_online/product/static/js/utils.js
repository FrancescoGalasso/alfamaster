$( document ).ready(function() {

    var body = document.getElementsByTagName("TBODY")[0]
    console.log(body)

    var amountOfRows = $("#tdetail  tbody  tr").length
    console.log(amountOfRows)
    var materials = ['H<sub>2</sub>O', 'Binder', 'TiO<sub>2</sub>']
    for(var i=0; i<3; i++){
        body.rows[i].cells[0].innerHTML = materials[i]
    }
    // body.rows[0].cells[0].innerHTML = "test!"

    var table = document.getElementById('tdetail')
    var tableFoot = document.createElement('TFOOT')
    table.appendChild(tableFoot)
    var tr_foot = document.createElement('tr')
    tableFoot.appendChild(tr_foot)
    tableFoot.style.borderStyle = "solid" // css 
    tableFoot.style.borderColor = "black" // css
    creationTFoot(tableFoot, tr_foot)

    // $(function($){
    //     var foot = $("#tdetail").find('tfoot');
    //     if (!foot.length) foot = $('<tfoot>').appendTo("#tdetail");
    //     num_bases = document.getElementById('tdetail').rows[0].cells.length -3
    //     foot.append($('<td colspan="3"><b>Total</b></td><td>a</td><td>b</td>'));
    //     $('#tdetail tfoot tr:first').remove();
    // })

    setClassesForCalculation()

    generateData()
});

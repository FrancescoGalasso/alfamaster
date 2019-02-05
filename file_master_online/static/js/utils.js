$( document ).ready(function() {

    var body = document.getElementsByTagName("TBODY")[0]
    // console.log(body)

    var amountOfRows = $("#tdetail  tbody  tr").length
    // console.log(amountOfRows)
    var materials = ['H<sub>2</sub>O', 'Binder', 'TiO<sub>2</sub>']
    for(var i=0; i<3; i++){
        body.rows[i].cells[0].innerHTML = materials[i]
    }

    var table = document.getElementById('tdetail')
    var tableFoot = document.createElement('TFOOT')
    table.appendChild(tableFoot)
    var tr_foot = document.createElement('tr')
    tableFoot.appendChild(tr_foot)
    tableFoot.style.borderStyle = "solid" // css 
    tableFoot.style.borderColor = "black" // css
    creationTFoot(tableFoot, tr_foot)

    setClassesForCalculation()

    generateData()
});

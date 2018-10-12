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

});

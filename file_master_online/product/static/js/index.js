/*   
 Template Name: AlfaMaster - No Responsive Dashboard Template
 Version: Alpha release
 Author: Francesco Galasso
 ----------------------------
 APPS CONTENT TABLE
 ----------------------------
 
 <!-- ======== GLOBAL SCRIPT SETTING ======== -->
 01. Handle document (ready and resize)
 02. Handle Input searching
 03. Handle Sidebar - Minify / Expand
 04. Utility Scripts
 05. Handle Modal

 05. Handle Page Load - Fade in
 06. Handle Panel - Remove / Reload / Collapse / Expand
 07. Handle Panel - Draggable
 08. Handle Tooltip & Popover Activation
 09. Handle Scroll to Top Button Activation
 
 
 */



 /* 01. Handle document
 ------------------------------------------------ */
$(document).ready(function(){
    console.log("index HTML ready!")
    setCssProperty('.main-dashboard-sidebar-nav', '#main-dashboard', 'max-height')
    setCssProperty('.main-dashboard-sidebar-nav', '#main-dashboard', 'height')
})

// https://stackoverflow.com/questions/11981174/how-to-resize-a-divs-max-height-upon-window-resize

$(window).resize(function() {
    if(this.resizeTO) clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(function() {
          $(this).trigger('windowResize');
        }, 150); 
    });

$(window).on('windowResize', function() {
    setCssProperty('.main-dashboard-sidebar-nav', '#main-dashboard', 'max-height')
});

$(window).bind("load", function() {
        var $input = $("#main-dashboard-listpage-input");
        $input.val('')
});  

/* 02. Handle Input searching
 ------------------------------------------------ */
function seekingForOwner() {
    // Declare variables 
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("main-dashboard-listpage-input");
    filter = input.value.toUpperCase();
    table = document.getElementById("main-dashboard-listpage-table");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        } 
    }
    setCssProperty('.main-dashboard-sidebar-nav', '#main-dashboard', 'height')         
}

/* 03. Handle Sidebar - Minify / Expand
 ------------------------------------------------ */

$(document).on('click','#main-dashboard-sidebar-nav-item-handler',function(){
    console.log('clicked');
    var widthSidebar = $('.main-dashboard-sidebar-nav').width()
    switch(parseInt(widthSidebar)){
        case 210:
            $('.main-dashboard-sidebar-nav').animate({"width": 75});
            $('#main-dashboard').animate({"margin-left": '-=135'});      
            $('.main-dashboard-sidebar-nav-item').find('a').css('font-size', 0)
            $('.main-dashboard-sidebar-nav-item').find('a').css('height', 47)
            $('#main-dashboard-sidebar-nav-item-handler').css('margin-left', 0)
            $('#main-dashboard-sidebar-nav-item-handler').css('height', 47)
            $('#main-dashboard-sidebar-nav-item-handler').find('span').removeClass('glyphicon-menu-left')
            $('#main-dashboard-sidebar-nav-item-handler').find('span').addClass('glyphicon-menu-right')
            break;
        case 75:
            $('.main-dashboard-sidebar-nav').animate({"width": 210},function() {
                $('.main-dashboard-sidebar-nav-item').find('a').css('font-size', 25)
                $('.main-dashboard-sidebar-nav-item').find('a').last().css('margin-left', 120)
            });
            $('#main-dashboard').animate({"margin-left": '+=135'});
            $('.main-dashboard-sidebar-nav-item').find('a').css('height', 47)
            $('#main-dashboard-sidebar-nav-item-handler').find('span').removeClass('glyphicon-menu-right')
            $('#main-dashboard-sidebar-nav-item-handler').find('span').addClass('glyphicon-menu-left')
            $('#main-dashboard-sidebar-nav-item-handler').css('margin-left', 120)
            break;
        default:
            console.log("default")
    }
})

/* 05. Handle modal 
 ------------------------------------------------ */

var url = ""
$(document).on('click','#btn-list-delete',function(event){
    event.preventDefault()
    url = $(this).attr('href');
    var parent = $(this).parent().parent()
    var felem = parent.children(":first")
    var name_prod = felem.text()
    $('.modal-title').text('DELETE '+name_prod)
    $('#myModal').modal('show');
});

// on load of modal
$(document).on('show.bs.modal',function(){
    var htmlForm = document.getElementById('eraseForm')
    if(htmlForm){
        htmlForm.action = url
    }
})

/* 04. Utility Scripts
 ------------------------------------------------ */
function setCssProperty(elem1, elem2, css){

    function calculate_maxHeight(elem1) {
        var currentHeight = $(elem1).height()
        currentHeight += 18
        var maxHeightCalculated = currentHeight
        return maxHeightCalculated;
    }

    var maxh = calculate_maxHeight(elem1)
    $(elem2).css(css, maxh)
}
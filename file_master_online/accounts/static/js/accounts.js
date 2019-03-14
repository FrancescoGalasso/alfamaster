
$( document ).ready(function() {
    console.log( "login HTML ready!" );
    $("p").last().has("#id_password").append(" <span id='login-dashboard-inner-span-pwd'>Show</span>");

    $("#login-dashboard-inner-span-pwd").click(function (e) {
        e.preventDefault();
        var type = $("#id_password").attr('type');
        switch (type) {
            case 'password':
            {
                $("#id_password").attr('type', 'text');
                $("#login-dashboard-inner-span-pwd").text('Hide')
                return;
            }
            case 'text':
            {
                $("#id_password").attr('type', 'password');
                $("#login-dashboard-inner-span-pwd").text('Show')
                return;
            }
        }
    });
});
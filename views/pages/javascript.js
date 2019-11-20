//this function will change the state of the sidebar
var active = false;
function toggleSideBar() {

    console.log("toggling");
    $('#sidebar').toggleClass('active');

    //change the arrow to face the right direction
    if (active) {
        $('#sidebarIcon').removeClass('fas fa-angle-left');
        $('#sidebarIcon').addClass('fas fa-angle-right');
    } 
    else {
        $('#sidebarIcon').removeClass('fas fa-angle-right');
        $('#sidebarIcon').addClass('fas fa-angle-left');
    }
    

    if (active) {
        active = false;
    }
    else {
        active = true;
    }
    
}
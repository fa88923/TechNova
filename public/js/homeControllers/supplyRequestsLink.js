
//linked to home.ejs
//script for controlling supplier link on the home page

document.addEventListener('DOMContentLoaded', function() {
    // Wait for the DOM to be fully loaded before adding event listeners
    var supplyRequestsLink = document.getElementById('supplyRequestsLink');
    if (supplyRequestsLink) 
    {
        supplyRequestsLink.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/supplyRequests';
    });
    }
});
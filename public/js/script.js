
//linked to home.ejs
//script for controlling supplier link on the home page

document.addEventListener('DOMContentLoaded', function() {
    // Wait for the DOM to be fully loaded before adding event listeners
    var supplierLink = document.getElementById('supplierLink');
    if (supplierLink) 
    {
        supplierLink.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/supplier';
    });
    }
});
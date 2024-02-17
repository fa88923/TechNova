document.addEventListener('DOMContentLoaded', function() {
    // Wait for the DOM to be fully loaded before adding event listeners

    var transportLink = document.getElementById('transportLink');
    if (transportLink) 
    {
        transportLink.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/transports';
    });
    }
});
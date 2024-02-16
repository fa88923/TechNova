document.addEventListener('DOMContentLoaded', function() {
    // Wait for the DOM to be fully loaded before adding event listeners

    var clientLink = document.getElementById('clientLink');
    if (clientLink) 
    {
        clientLink.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/clients';
    });
    }
});
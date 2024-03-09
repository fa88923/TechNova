document.addEventListener('DOMContentLoaded', function() {
    // Wait for the DOM to be fully loaded before adding event listeners

    var logsLink = document.getElementById('logsLink');
    if (logsLink) 
    {
        logsLink.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/logs';
    });
    }
});
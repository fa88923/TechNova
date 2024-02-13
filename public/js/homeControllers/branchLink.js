document.addEventListener('DOMContentLoaded', function() {
    // Wait for the DOM to be fully loaded before adding event listeners

    var branchLink = document.getElementById('branchLink');
    if (branchLink) 
    {
        branchLink.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/branches';
    });
    }
});
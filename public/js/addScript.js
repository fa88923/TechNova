
document.addEventListener('DOMContentLoaded', function() {
    // Wait for the DOM to be fully loaded before adding event listeners
    var add_button = document.getElementById('add_button');
    if (add_button) 
    {
        add_button.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/addSupplier';
    });
    }
});


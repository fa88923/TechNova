document.addEventListener('DOMContentLoaded', function() {
    // Wait for the DOM to be fully loaded before adding event listeners

    var productLink = document.getElementById('productLink');
    if (productLink) 
    {
        productLink.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/products';
    });
    }
});
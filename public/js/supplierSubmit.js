document.addEventListener('DOMContentLoaded', function() {
    // Wait for the DOM to be fully loaded before adding event listeners
    // var add_button = document.getElementById('add_button');
    // if (add_button) 
    // {
    //     add_button.addEventListener('click', function(event) {
    //     event.preventDefault();
    //     var form = document.getElementById("supplierForm");
        
    //     window.location.href = '/supplier/add/submit';
    //     form.submit();
    // });
    // }
    // supplierSubmit.js

    document.getElementById('add_button').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default anchor tag behavior (e.g., navigating to the href)

        // Trigger form submission
        document.getElementById('addingForm').submit();
    });

});

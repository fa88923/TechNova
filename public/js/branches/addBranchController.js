document.addEventListener('DOMContentLoaded', function() {
    //listening for when the anchor tag called add_button is clicked
    document.getElementById('add_button').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default anchor tag behavior (e.g., navigating to the href)

        // Trigger form submission
        //addingForm is the form tag filled with supplier info i wanna add
        document.getElementById('addingForm').submit();
    });

    document.querySelectorAll('.add_contact').forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.preventDefault();

            // Get the container ID from the data-container attribute
            const containerId = this.getAttribute('data-container');

            // Clone the first child of the container (the blank space)
            const newBlankSpace = document.getElementById(containerId).children[0].cloneNode(true);

            // Insert the new blank space above the add_contact button
            this.parentNode.insertBefore(newBlankSpace, this);
        });
    });

});


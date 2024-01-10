document.addEventListener('DOMContentLoaded', function() {
    //listening for when the anchor tag called add_button is clicked
    document.getElementById('add_button').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default anchor tag behavior (e.g., navigating to the href)

        // Trigger form submission
        //addingForm is the form tag filled with supplier info i wanna add
        document.getElementById('addingForm').submit();
    });

});

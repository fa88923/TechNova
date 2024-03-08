document.addEventListener('DOMContentLoaded', function () {
    //get the  form inside which is the input and button tag
    
    //searching
    const searchForm = document.getElementById('searchForm');
    if(searchForm)
    {
        searchForm.addEventListener('submit', function (event) {
        // Prevent the default form submission behavior
        event.preventDefault(); 
        //get the input tag
        const searchInput = document.getElementById('searchkey');
        //access the search key word inserted in the input tag
        const searchValue = searchInput.value;
        //send it to get(/search) route with the searchkey as query
        window.location.href =`/clients?searchkey=${searchValue}` ;
    });
    }

    //product details reroute
    var buttons = document.querySelectorAll('.client-details-button');

    // Add a click event listener to each button
    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Get the productId from the 'data-product-id' attribute
            var clientId = button.getAttribute('data-client-id');

            // Redirect to the 'supplierDetails' page with the supplierId
            window.location.href = '/clients/details?clientId=' + clientId;
        });
    });

    var deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var clientId = button.getAttribute('data-client-id');
            // Redirect to /branches with the delete parameter
            window.location.href = '/clients?delete=' + clientId;
        });
    });

});
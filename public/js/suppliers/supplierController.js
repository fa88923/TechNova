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
        window.location.href =`/suppliers?searchkey=${searchValue}` ;
    });
    }

    //product details reroute
    var buttons = document.querySelectorAll('.supplier-details-button');

    // Add a click event listener to each button
    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Get the productId from the 'data-product-id' attribute
            var supplierId = button.getAttribute('data-supplier-id');
            console.log(supplierId);

            // Redirect to the 'supplierDetails' page with the supplierId
            window.location.href = '/suppliers/details?supplierId=' + supplierId;
        });
    });

    var add_button = document.getElementById('add_button');
    if (add_button) 
    {
        add_button.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/suppliers/add';
    });
    }

    var deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var supplierId = button.getAttribute('data-supplier-id');
            // Redirect to /branches with the delete parameter
            window.location.href = '/suppliers?delete=' + supplierId;
        });
    });

});
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
        window.location.href =`/supplyRequests?searchkey=${searchValue}` ;
    });
    }

    var buttons = document.querySelectorAll('.details-button');

    // Add a click event listener to each button
    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Get the productId from the 'data-product-id' attribute
            var requestId = button.getAttribute('supplyid');
            //console.log(supplierId);
            //console.log('controller'+requestId);
            // Redirect to the 'supplierDetails' page with the supplierId
            window.location.href = '/supplyRequests/details?requestId=' + requestId;
        });
    });

    

});
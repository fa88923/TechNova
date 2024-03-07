document.addEventListener('DOMContentLoaded', function () {
    //get the  form inside which is the input and button tag

    console.log("controller starts");
    
    //searching
    const supplierId = document.body.getAttribute('data-supplier-id');
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
      
        window.location.href = `/suppliers/products/add?searchkey=${searchValue}&supplierId=${supplierId}`;
    });
    }
    
   

    //product details reroute
    var buttons = document.querySelectorAll('.product-details-button');

    // Add a click event listener to each button
    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Get the productId from the 'data-product-id' attribute
            var productId = button.getAttribute('data-product-id');

            // Redirect to the 'supplierDetails' page with the supplierId
            window.location.href = '/products/details?productId=' + productId;
        });
    });

    const add_button = document.querySelector('#add_button');
    const itemForm = document.querySelector('#itemForm');
    console.log(add_button);
    console.log("oolala");

    add_button.addEventListener('click', function (event) {
        console.log("the add button was clicked");
        event.preventDefault();
        // itemForm.submit();
        // Create an array to store selected products and their prices
        const selectedProducts = [];

        // Iterate over all select checkboxes to gather selected products and prices
        const selectCheckboxes = document.querySelectorAll('.select-checkbox');
        selectCheckboxes.forEach(checkbox => {
            const productId = checkbox.getAttribute('data-product-id');
            const offeringPriceContainer = checkbox.parentElement.parentElement.nextElementSibling.querySelector('.offering-price-container');
            const offeringPriceInput = offeringPriceContainer.querySelector('.offering-price-input');

            if (checkbox.checked) {
                // Product is selected, add to the array
                const offeringPrice = offeringPriceInput.value;
                selectedProducts.push({ productId, offeringPrice });
            }
        });

        if (selectedProducts.length > 0) {
            // Update the form with selected products and prices
            const selectedProductsInput = document.createElement('input');
            selectedProductsInput.type = 'hidden';
            selectedProductsInput.name = 'selectedProducts';
            selectedProductsInput.value = JSON.stringify(selectedProducts);
            itemForm.appendChild(selectedProductsInput);

            // Submit the form
            itemForm.submit();
        }
    });

});



/*
document.addEventListener('DOMContentLoaded', function () {
    //get the  form inside which is the input and button tag
    
    //searching
    const supplierId = document.body.getAttribute('data-supplier-id');
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
      
        window.location.href = `/suppliers/products?searchkey=${searchValue}&supplierId=${supplierId}`;
    });
    }
    
    var add_button = document.getElementById('add_button');
    if (add_button) 
    {
        add_button.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = `/suppliers/products/add?supplierId=${supplierId}`;
    });
    }

    //product details reroute
    var buttons = document.querySelectorAll('.product-details-button');

    // Add a click event listener to each button
    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Get the productId from the 'data-product-id' attribute
            var productId = button.getAttribute('data-product-id');

            // Redirect to the 'supplierDetails' page with the supplierId
            window.location.href = '/products/details?productId=' + productId;
        });
    });

});*/
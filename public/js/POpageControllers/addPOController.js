document.addEventListener('DOMContentLoaded', function() {
    //listening for when the anchor tag called add_button is clicked
  
    document.getElementById('add_button').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default anchor tag behavior (e.g., navigating to the href)
        console.log('hellooooo1');

        var selectedProductData = [];
        var checkboxes = document.getElementsByClassName('productCheckbox');

            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    var productId = checkboxes[i].id;
                    var quantity = document.getElementById('quantity' + productId).value;
                    var price = document.getElementById('price' + productId).value;

                    // Create an object to store data for each selected product
                    var productData = {
                        productId: productId,
                        quantity: quantity,
                        price: price
                        // Add more properties if needed
                    };

                    selectedProductData.push(productData);

                }
            }

            var selectedProductDataJson = JSON.stringify(selectedProductData);

            // Set the value of the hidden input in the main form
            document.getElementById('selectedProductData').value = selectedProductDataJson;
            console.log('hellooooo');

        document.getElementById('addingForm').submit();
    });

    
});

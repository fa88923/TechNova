


document.addEventListener('DOMContentLoaded', function() {
    // Wait for the DOM to be fully loaded before adding event listeners
    var productCatalogueButton = document.getElementById('productCatalogueButton');
    if (productCatalogueButton) 
    {
        productCatalogueButton.addEventListener('click', function(event) {
        event.preventDefault();
        var supplierId = productCatalogueButton.getAttribute('supplierId');
        window.location.href = '/supplier/supplierDetails/productCatalogue?supplierId='+supplierId;
    });
    }
});
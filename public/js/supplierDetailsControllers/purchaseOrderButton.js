//linked to supplierDetails.ejs
//controls what happens when view purchase order button is clicked


document.addEventListener('DOMContentLoaded', function() {
    // Wait for the DOM to be fully loaded before adding event listeners
    var purchaseOrderButton = document.getElementById('purchaseOrderButton');
    if (purchaseOrderButton) 
    {
        purchaseOrderButton.addEventListener('click', function(event) {
        event.preventDefault();
        var supplierId = purchaseOrderButton.getAttribute('supplierId');
        window.location.href = '/supplier/supplierDetails/purchaseOrders?supplierId='+supplierId;
    });
    }
});
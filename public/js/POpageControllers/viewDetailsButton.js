//linked to purchaseOrders.ejs
//controls what happens when the view details button is clicked there

document.addEventListener('DOMContentLoaded', function () {
    // Get all elements with the class 'supplier-details-button'
    var buttons = document.querySelectorAll('.view-details-button');

    // Add a click event listener to each button
    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Get the supplierId from the 'data-supplier-id' attribute
            var supplierId = button.getAttribute('supplierId');
            var orderId = button.getAttribute('orderId');

            // Redirect to the 'supplierDetails' page with the supplierId
            window.location.href = '/supplier/supplierDetails/purchaseOrders/POdetails?supplierId=' + supplierId +'&orderId=' + orderId;
        });
    });
});
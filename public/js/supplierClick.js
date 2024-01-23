document.addEventListener('DOMContentLoaded', function () {
    // Get all elements with the class 'supplier-details-button'
    var buttons = document.querySelectorAll('.supplier-details-button');

    // Add a click event listener to each button
    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Get the supplierId from the 'data-supplier-id' attribute
            var supplierId = button.getAttribute('data-supplier-id');

            // Redirect to the 'supplierDetails' page with the supplierId
            window.location.href = '/supplier/supplierDetails?supplierId=' + supplierId;
        });
    });
});
document.addEventListener('DOMContentLoaded', function () {
    
    var payment_button=document.getElementById('payment_done_button');
    
    payment_button.addEventListener('click', function(event) {
        event.preventDefault(); 
        //var transactionId = document.getElementById('transactionId').dataset.value;
        var transactionId=payment_button.getAttribute('transactionId');
        const payment_complete=1;
        window.location.href =  '/clientOrders/details?transactionId=' + transactionId + '&payment_complete=' + payment_complete;
    });

    document.getElementById('add_button').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default anchor tag behavior (e.g., navigating to the href)
        //console.log('hellooooo1');
        document.getElementById('confirmedSupplyForm').submit();
    });

    
});
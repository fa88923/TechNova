document.addEventListener('DOMContentLoaded', function () {
    
    var payment_button=document.getElementById('payment_done_button');
    var shipment_button=document.getElementById('shipment_done_button');
    payment_button.addEventListener('click', function(event) {
        event.preventDefault(); 
        //var transactionId = document.getElementById('transactionId').dataset.value;
        var transactionId=payment_button.getAttribute('transactionId');
        const payment_complete=1;
        window.location.href =  '/purchaseOrder/details?transactionId=' + transactionId + '&payment_complete=' + payment_complete;
    });

    shipment_button.addEventListener('click', function(event) {
        event.preventDefault(); 
        // var transactionId = document.getElementById('transactionId').innerText;
        var transactionId=shipment_button.getAttribute('transactionId');
        var arr_time=document.getElementById('arr_time').value;
        var arr_date=document.getElementById('arr_date').value;
        // sessionStorage.setItem('arr_time', arr_time);
        // sessionStorage.setItem('arr_date', arr_date);a
        const shipment_complete=1;
        window.location.href =  '/purchaseOrder/details?transactionId=' + transactionId + '&shipment_complete=' + shipment_complete + '&arr_time=' + arr_time + '&arr_date=' + arr_date;
    });
});
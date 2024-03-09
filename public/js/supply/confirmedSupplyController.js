document.addEventListener('DOMContentLoaded', function () {
    
    var shipment_button=document.getElementById('shipment_done_button');

    shipment_button.addEventListener('click', function(event) {
        event.preventDefault(); 
        // var transactionId = document.getElementById('transactionId').innerText;
        var transactionId=shipment_button.getAttribute('transactionId');
        var arr_time=document.getElementById('arr_time').value;
        var arr_date=document.getElementById('arr_date').value;
        // sessionStorage.setItem('arr_time', arr_time);
        // sessionStorage.setItem('arr_date', arr_date);a
        const shipment_complete=1;
        window.location.href =  '/supplyRequests/details/confirmedDetails?transactionId=' + transactionId + '&shipment_complete=' + shipment_complete + '&arr_time=' + arr_time + '&arr_date=' + arr_date;
    });
});
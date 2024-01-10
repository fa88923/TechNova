document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('searchForm');

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        
        const searchInput = document.getElementById('searchkey');
        const searchValue = searchInput.value;
        window.location.href =`/supplier/search?query=${searchValue}` ;
        // Perform AJAX request or redirect to the search route on the server
        // Send the searchValue to the server for processing
        // fetch(`/supplier/search?query=${searchValue}`)
        //     .then(response => response.json())
        //     .then(data => {
        //         // Update the table with the search results
        //         updateTable(data);
        //     })
        //     .catch(error => console.error('Error:', error));
    });

    // function updateTable(data) {
    //     const tbody = document.querySelector('tbody');
    //     tbody.innerHTML = ''; // Clear existing table data
    //     data.forEach(supplier => {
    //         const row = `<tr>
    //                         <td>${supplier.SUPPLIER_ID}</td>
    //                         <td><a href="${supplier.URL}">${supplier.NAME}</a></td>
    //                         <td>${supplier.CITY}</td>
    //                         <td>${supplier.COUNTRY}</td>
    //                         <td>${supplier.EMAIL}</td>
    //                     </tr>`;
    //         tbody.innerHTML += row;
    //     });
    // }
});

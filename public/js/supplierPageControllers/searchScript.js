//linked to supplier.ejs
//controls the searching

document.addEventListener('DOMContentLoaded', function () {
    //get the  form inside which is the input and button tag
    const searchForm = document.getElementById('searchForm');

    searchForm.addEventListener('submit', function (event) {
        // Prevent the default form submission behavior
        event.preventDefault(); 
        //get the input tag
        const searchInput = document.getElementById('searchkey');
        //access the search key word inserted in the input tag
        const searchValue = searchInput.value;
        //send it to get(/search) route with the searchkey as query
        window.location.href =`/supplier/search?query=${searchValue}` ;
    });

});

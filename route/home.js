const connection=require("../app/app.js");
// file name is home.js

document.addEventListener("DOMContentLoaded", function () {
    console.log("connected");
    // Access the HTML element with the ID "output"
    var outputElement = document.getElementById("output");

    // Check if the element exists before attempting to update its content
    if (outputElement) {
        // Update the content of the element
        outputElement.innerHTML = "Hello from myscript.js!";
    } else {
        // Log an error if the element is not found
        console.error("Element with ID 'output' not found.");
    }
});
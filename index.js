// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase configuration
const appSettings = {
    databaseURL: "https://real-time-database-1cdb2-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase app
const app = initializeApp(appSettings);
const database = getDatabase(app);

// Reference to the checklist in the database
const checkListRef = ref(database, "checklist");

// DOM elements
const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const checkListEl = document.getElementById("checklist");

// Event listener for adding checklist items
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;

    // Add the new item to the checklist in the database
    push(checkListRef, inputValue)
        .then(() => {
            console.log(`${inputValue} added to database`);
            inputFieldEl.value = ""; // Clear the input field after adding
        });
});

// Event listener for handling changes in the checklist
onValue(checkListRef, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());
        clearCheckListEl();

        // Populate the checklist with items from the database
        for (let i = 0; i < itemsArray.length; i++) {
            appendItemToCheckListEl(itemsArray[i]);
        }
    } else {
        // Display a message if there are no items in the checklist
        checkListEl.innerHTML = "Nothing planned... Yet";
    }
});

// Function to clear the checklist
function clearCheckListEl() {
    checkListEl.innerHTML = "";
}

// Function to append an item to the checklist
function appendItemToCheckListEl(item) {
    let itemID = item[0];
    let itemValue = item[1];
    let newEl = document.createElement("li");
    newEl.textContent = itemValue;
    
    // Event listener to remove an item from the checklist when clicked
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `checklist/${itemID}`);
        remove(exactLocationOfItemInDB);
    });
    
    // Append the new item to the checklist
    checkListEl.append(newEl);
}

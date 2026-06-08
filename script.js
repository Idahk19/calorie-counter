
// ===============================
// GLOBAL STATE
// ===============================

// Load saved foods from localStorage (if any exist)
// If nothing exists, start with an empty array
let foods = JSON.parse(localStorage.getItem("foods")) || [];

// This will store foods loaded from foods.json (our "API database")
let foodDatabase = [];

// This flag ensures we don't search before data is loaded
let isDatabaseReady = false;


// ===============================
// WAIT FOR HTML TO LOAD FIRST
// ===============================
document.addEventListener("DOMContentLoaded", function () {

    // Get form elements from HTML
    const foodForm = document.getElementById("foodForm");
    const foodNameInput = document.getElementById("foodName");
    const foodList = document.getElementById("foodList");
    const resetBtn = document.getElementById("resetBtn");


    // ===============================
    // FETCH FOOD DATABASE (foods.json)
    // ===============================

    fetch("food.json")
    .then(res => res.json())
    .then(data => {

        // Store the loaded data into our global database variable
        foodDatabase = data;

       // Mark database as ready so other parts of the app can use it safely
        isDatabaseReady = true;

        console.log("Database loaded");

    })
    .catch(err => {
           console.log("Failed to load database:", err);
            submitBtn.textContent = "Failed to load data";
    });


// Stores the name of a food that was NOT found in the database
// This is used later when user enters calories manually
let pendingManualFood = null;


// Runs whenever the user submits the form
foodForm.addEventListener("submit", function (event) {

    // Prevent page refresh on form submission
    event.preventDefault();

    // Get the food name entered by the user and remove extra spaces
    const name = foodNameInput.value.trim();

    // Search for the food in the loaded database (JSON file)
    const foundFood = foodDatabase.find(food =>
        food.name.toLowerCase().includes(name.toLowerCase())
    );

    // ===============================
    // IF FOOD IS FOUND IN DATABASE
    // ===============================
    if (foundFood) {

        // Create a food object using data from database
        const foodItem = {
            id: Date.now(),              // unique ID for deletion
            name: foundFood.name,        // official food name from database
            calories: foundFood.calories // calories from database
        };

        // Add food to today's list
        foods.push(foodItem);

        // Save updated list to localStorage
        saveToLocalStorage();

        // Update UI list on screen
        displayFoods();

        // Recalculate total calories
        updateTotalCalories();

        // Clear input field
        foodForm.reset();

        // Hide manual input box (in case it was open before)
        hideManualBox();

        updateProgressBar();

        return; // stop function here
    }

    // ===============================
    // IF FOOD IS NOT FOUND IN DATABASE
    // ===============================

    // Store the unknown food name so we can use it later
    pendingManualFood = name;

    // Show manual input box for user to enter calories
    showManualBox(name);
});


    // ===============================
    // RESET BUTTON
    // ===============================
    resetBtn.addEventListener("click", function () {

        // Ask user for confirmation
        const confirmReset = confirm("Reset all data?");

        if (!confirmReset) return;

        // Clear all foods from memory
        foods = [];

        // Remove from localStorage
        localStorage.removeItem("foods");

        // Update UI
        displayFoods();

        updateTotalCalories();

        updateProgressBar();


    });


    // Initial render when page loads
    displayFoods();

    updateTotalCalories();

    updateProgressBar();


});


// ===============================
// DISPLAY FOODS ON SCREEN
// ===============================
function displayFoods() {

    const foodList = document.getElementById("foodList");

    // Clear list before re-rendering
    foodList.innerHTML = "";

    // Loop through all foods in array
    foods.forEach(function (food) {

        // Create a new list item
        const li = document.createElement("li");

        // Add styling 
        li.classList.add(
            "flex",
            "justify-between",
            "items-center",
            "bg-gray-100",
            "p-2",
            "rounded"
        );

        // Insert food data into HTML
        li.innerHTML = `
            <span>${food.name} - ${food.calories} cal</span>

            <!-- Delete button -->
            <button onclick="deleteFood(${food.id})"
                class="bg-red-500 text-white px-2 py-1 rounded">
                Delete
            </button>
        `;

        // Add item to list
        foodList.appendChild(li);
    });
}


// ===============================
// DELETE FOOD ITEM
// ===============================
function deleteFood(id) {

    // Ask before deleting
    const confirmDelete = confirm("Delete this item?");

    if (!confirmDelete) return;

    // Remove item from array
    foods = foods.filter(function (food) {
        return food.id !== id;
    });

    // Save updated list
    saveToLocalStorage();

    // Refresh UI
    displayFoods();

    updateTotalCalories();

    updateProgressBar();
}


// ===============================
// TOTAL CALORIES CALCULATION
// ===============================
function updateTotalCalories() {

    let total = 0;

    // Add all calories together
    foods.forEach(function (food) {
        total += food.calories;
    });

    // Show total on screen
    document.getElementById("totalCalories").textContent = total;
}


// ===============================
// SAVE TO LOCAL STORAGE
// ===============================
function saveToLocalStorage() {

    // Convert array to string and store in browser memory
    localStorage.setItem("foods", JSON.stringify(foods));
}

// Shows the manual calorie input box when food is not found
function showManualBox(foodName) {

    // Store the unknown food name so we can use it later when saving
    pendingManualFood = foodName;

    // Make the hidden manual input box visible on the page
    document.getElementById("manualCaloriesBox").classList.remove("hidden");

    // Display a message telling the user the food was not found
    document.getElementById("notFoundMsg").textContent =
        `"${foodName}" not found. Please enter calories manually.`;
}


// Hides the manual input box and resets its values
function hideManualBox() {

    // Clear the stored food name
    pendingManualFood = null;

    // Hide the manual input box again
    document.getElementById("manualCaloriesBox").classList.add("hidden");

    // Clear any previously entered calories in the input field
    document.getElementById("manualCaloriesInput").value = "";
}
document.getElementById("saveCaloriesBtn").addEventListener("click", function () {

    // Get calories from input field 
    const calories = Number(document.getElementById("manualCaloriesInput").value);

    // Validate input
    if (!calories || calories <= 0) {
        alert("Enter valid calories");
        return;
    }

    // Create food object 
    const foodItem = {
        id: Date.now(),
        name: pendingManualFood, 
        calories: calories
    };

    // Add to list
    foods.push(foodItem);

    // Save and update UI
    saveToLocalStorage();

    displayFoods();

    updateTotalCalories();

    // Clear modal + reset state
    hideManualBox();

    updateProgressBar();
});

// progress bar

const DAILY_GOAL = 2000;

function updateProgressBar() {

    let total = 0;

    // calculate total calories
    foods.forEach(food => {
        total += food.calories;
    });

    // calculate percentage
    let percent = (total / DAILY_GOAL) * 100;

    // prevent going above 100%
    if (percent > 100) percent = 100;

    // update bar width
    document.getElementById("progressBar").style.width = percent + "%";

    // update text
    document.getElementById("progressText").textContent =
        `${total} / ${DAILY_GOAL} calories (${Math.round(percent)}%)`;
}
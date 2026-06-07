
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

    // ===============================
    // ADD FOOD (FORM SUBMISSION)
    // ===============================
    foodForm.addEventListener("submit", function (event) {

        // Stop page from refreshing when form is submitted
        event.preventDefault();

        // Prevent user from searching before data is ready
        if (!isDatabaseReady) {
            alert("Food database is still loading. Please wait...");
            return;
        }

        // Get user input and remove extra spaces
        const name = foodNameInput.value.trim();

        // ===============================
        // SEARCH FOOD IN DATABASE
        // ===============================
        const foundFood = foodDatabase.find(function (food) {

            // Compare ignoring case and spaces
            return food.name.toLowerCase().includes(name.toLowerCase());
        });

        // If no match is found
        if (!foundFood) {
            alert("Food not found in database");
            foodForm.reset();
            return;
        }

        // ===============================
        // CREATE FOOD OBJECT
        // ===============================
        const foodItem = {
            id: Date.now(),               // unique ID for deletion
            name: foundFood.name,         // name from database
            calories: foundFood.calories  // calories from database
        };

        // Add new food to today's list
        foods.push(foodItem);

        // Save updated list to localStorage
        saveToLocalStorage();

        // Update UI
        displayFoods();
        updateTotalCalories();

        // Clear input field
        foodForm.reset();
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
    });


    // Initial render when page loads
    displayFoods();
    updateTotalCalories();
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

        // Add styling classes (Tailwind)
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
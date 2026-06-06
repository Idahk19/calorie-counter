

// This array stores all food items added by the user
// It is global so it can be accessed by all functions (add, delete, display)

let foods = [];


// Ensures all HTML elements are ready before we try to access them

document.addEventListener("DOMContentLoaded", function () {

    // Get form element (used for submitting food items)
    const foodForm = document.getElementById("foodForm");

    // Input for food name
    const foodNameInput = document.getElementById("foodName");

    // Input for calorie value
    const foodCaloriesInput = document.getElementById("foodCalories");

    // UL container where food items will be displayed
    const foodList = document.getElementById("foodList");


    // Runs every time the form is submitted

    foodForm.addEventListener("submit", function (event) {

        // Prevent page refresh on submit
        event.preventDefault();

        // Get values from input fields
        const name = foodNameInput.value;
        const calories = foodCaloriesInput.value;

        // Create a food object to store both values together
        const foodItem = {
            id: Date.now(),          // unique ID for deleting
            name: name,              // food name
            calories: Number(calories) // convert calories to number
        };

        // Add food object into array
        foods.push(foodItem);

        // Update UI to show new food
        displayFoods();

        updateTotalCalories();

        // Clear form inputs after submission
        foodForm.reset();
    });

    // Runs once when page loads to show existing items (if any)

    displayFoods();
    updateTotalCalories();
});

// This function updates the UI and shows all food items

function displayFoods() {

    // Get the UL element from HTML
    const foodList = document.getElementById("foodList");

    // Clear previous list to avoid duplicates
    foodList.innerHTML = "";

    // Loop through all food items in the array
    foods.forEach(function (food) {

        // Create a new list item
        const li = document.createElement("li");

        // Add Tailwind styling for better UI
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

            <!-- Delete button for each item -->
            <button 
                onclick="deleteFood(${food.id})"
                class="bg-red-500 text-white px-2 py-1 rounded"
            >
                Delete
            </button>
        `;

        // Add item to the list
        foodList.appendChild(li);
    });
}



// Runs when user clicks delete button

function deleteFood(id) {

    // Ask user for confirmation before deleting
    const confirmDelete = confirm("Are you sure you want to delete this food item?");

    // If user clicks Cancel, stop function
    if (!confirmDelete) return;

    // Remove selected food item from array
    foods = foods.filter(function (food) {
        return food.id !== id;
    });

    // Update UI after deletion
    displayFoods();
   
    // update calories
    updateTotalCalories();
}

function updateTotalCalories() {

    let total = 0;

    // Loop through all food items
    foods.forEach(function (food) {
        total += food.calories;
    });

    // Display total in HTML
    document.getElementById("totalCalories").textContent = total;
}

updateTotalCalories();
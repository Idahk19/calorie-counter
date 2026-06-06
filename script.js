// DOM manipulation 
document.addEventListener("DOMContentLoaded", function () {
const foodForm = document.getElementById("foodForm");
const foodNameInput = document.getElementById("foodName");
const foodCaloriesInput = document.getElementById("foodCalories");
const foodList = document.getElementById("foodList");

// store foods in an array
let foods = [];
 
//This runs when the user submits the form
foodForm.addEventListener("submit", function(event){
    event.preventDefault();
    
    // Get values from the input fields
    const name = foodNameInput.value;
    const calories = foodCaloriesInput.value;

    // create a food object to store both values together
    const foodItem = {
        id: Date.now(),
        name: name,
        calories: Number(calories)
       
    };
     // Add the new food object into the foods array
    foods.push(foodItem);

    // Update the UI to show the new food item
    displayFoods();

    // Clear the form after submission
    foodForm.reset();
  
});

function displayFoods() {

    // Clear the list first so we don't duplicate items
    foodList.innerHTML = "";

    // Loop through each food item in the array
    foods.forEach(function (food) {

        // Create a new list item (<li>)
        const li = document.createElement("li");

    
        // Insert food name and calories into the list item
        li.innerHTML = `
            <span>${food.name} - ${food.calories} cal</span>
        `;

        // Add the list item to the food list in HTML
        foodList.appendChild(li);
    });
}
})
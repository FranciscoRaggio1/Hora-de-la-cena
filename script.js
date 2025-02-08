document.addEventListener("DOMContentLoaded", () => {
  const ingredientSelect = document.getElementById("ingredient-select");

  // Mapa de traducción español-inglés para los ingredientes
  const ingredientTranslation = {
    "Pollo": "Chicken",
    "Res": "Beef",
    "Cerdo": "Pork",
    "Pescado": "Fish",
    "Arroz": "Rice",
    "Queso": "Cheese",
    "Tomate": "Tomato",
    "Papa": "Potato",
    "Cebolla": "Onion",
    "Lechuga": "Lettuce",
    "Ajo": "Garlic",
    "Manzana": "Apple",
    "Banana": "Banana",
    "Fresa": "Strawberry",
    "Frijoles": "Beans",
    "Zanahoria": "Carrot",
    "Mantequilla": "Butter",
    "Harina": "Flour",
    "Azúcar": "Sugar",
    "Sal": "Salt",
    "Pimienta": "Pepper",
    "Aceite": "Oil",
    "Vinagre": "Vinegar",
    "Huevos": "Eggs",
    "Leche": "Milk",
    "Crema": "Cream",
    "Yogur": "Yogurt",
    "Nuez": "Nut",
    "Almendra": "Almond",
    "Avellana": "Hazelnut",
    "Chocolate": "Chocolate",
    "Miel": "Honey",
    "Champiñones": "Mushrooms",
    "Espinaca": "Spinach",
    "Calabacín": "Zucchini",
    "Brócoli": "Broccoli",
    "Maíz": "Corn",
    "Pan": "Bread",
    "Pasta": "Pasta",
    "Carne de cordero": "Lamb",
    "Mariscos": "Seafood",
    "Camarones": "Shrimp",
    "Salmón": "Salmon",
    "Atún": "Tuna",
    "Albahaca": "Basil",
    "Perejil": "Parsley",
    "Cilantro": "Coriander",
    "Romero": "Rosemary",
    "Tomillo": "Thyme",
    "Orégano": "Oregano",
    "Lentejas": "Lentils"
  };

  // Llenar el combobox con los ingredientes en español
  Object.keys(ingredientTranslation).forEach(ingredient => {
    const option = document.createElement("option");
    option.value = ingredient;
    option.textContent = ingredient;
    ingredientSelect.appendChild(option);
  });

  // Crear la ventana modal
  const dialog = document.getElementById("ventana-modal");
  const modal = document.createElement("div");
  modal.id = "recipe-modal";
  modal.className = "modal hidden";  
  modal.innerHTML = `
    <div class="modal-content">      
      <div id="modal-recipe-details"></div>
    </div>
  `;
 
  
  dialog.appendChild(modal);



  const closeButton = dialog.querySelector(".boton-cerrar ");
  closeButton.addEventListener("click", () => {
    dialog.close();
    document.body.style.overflow = "";
  });

  // Buscar recetas al seleccionar un ingrediente
  window.searchMeals = function () {
    const selectedIngredient = ingredientSelect.value;

    if (selectedIngredient) {
      const translatedIngredient = ingredientTranslation[selectedIngredient];

      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${translatedIngredient}`)
        .then(response => response.json())
        .then(data => {
          const resultsContainer = document.getElementById("results");
          resultsContainer.innerHTML = "";

          if (data.meals) {
            const meals = data.meals.slice(0, 10);

            meals.forEach(meal => {
              fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                .then(response => response.json())
                .then(details => {
                  const mealDetails = details.meals[0];

                  const mealCard = document.createElement("div");
                  mealCard.className = "meal-card";

                  mealCard.innerHTML = `
                    <img class="meal-img" src="${mealDetails.strMealThumb}" alt="${mealDetails.strMeal}">
                    <div class="meal-info">
                      <h3>${mealDetails.strMeal}</h3>
                      <button class="view-recipe" data-id="${mealDetails.idMeal}">Ver receta</button>
                    </div>
                  `;

                  resultsContainer.appendChild(mealCard);

                  mealCard.querySelector(".view-recipe").addEventListener("click", () => {
                    const modalDetails = document.getElementById("modal-recipe-details");
                    modalDetails.innerHTML = `
                      <h2>${mealDetails.strMeal}</h2>
                      <img src="${mealDetails.strMealThumb}" alt="${mealDetails.strMeal}" class="modal-img">
                      <p>${mealDetails.strInstructions}</p>
                      <h3>Ingredientes:</h3>
                      <ul>
                        ${Object.keys(mealDetails)
                          .filter(key => key.startsWith("strIngredient") && mealDetails[key])
                          .map(key => {
                            const measureKey = key.replace("Ingredient", "Measure");
                            return `<li>${mealDetails[key]} - ${mealDetails[measureKey]}</li>`;
                          })
                          .join("")}
                      </ul>
                    `;
                    modal.classList.remove("hidden");                    
                    dialog.showModal();
                    document.body.style.overflow = "hidden";
                    //dialog.scrollIntoView({ behavior: "smooth" });
                  });
                })
                .catch(error => console.error("Error al obtener detalles de la receta:", error));
            });
          } else {
            resultsContainer.innerHTML = "<p>No se encontraron recetas con este ingrediente.</p>";
          }
        })
        .catch(error => console.error("Error al buscar recetas:", error));
    } else {
      alert("¡Por favor, selecciona un ingrediente!");
    }
  };
});

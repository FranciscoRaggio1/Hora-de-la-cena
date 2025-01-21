document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("boton-buscar").addEventListener("click", () => {
    const ingrediente = document.getElementById("entrada-ingrediente").value.trim();

    if (ingrediente) {
      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediente}`)
        .then(response => response.json())
        .then(data => {
          const contenedorResultados = document.getElementById("resultados");
          contenedorResultados.innerHTML = "";

          if (data.meals) {
            const comidas = data.meals.slice(0, 10);

            comidas.forEach(comida => {
              fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${comida.idMeal}`)
                .then(response => response.json())
                .then(detalles => {
                  const detallesComida = detalles.meals[0];

                  const tarjetaComida = document.createElement("div");
                  tarjetaComida.className = "tarjeta-comida";

                  tarjetaComida.innerHTML = `
                    <img class="imagen-comida" src="${detallesComida.strMealThumb}" alt="${detallesComida.strMeal}">
                    <div class="info-comida">
                      <h3>${detallesComida.strMeal}</h3>
                      <p>${detallesComida.strInstructions.substring(0, 100)}...</p>
                      <a href="${detallesComida.strSource || "#"}" class="enlace-comida" target="_blank">Ver Receta</a>
                    </div>
                  `;

                  contenedorResultados.appendChild(tarjetaComida);
                })
                .catch(error => console.error("Error al obtener detalles de la comida:", error));
            });
          } else {
            contenedorResultados.innerHTML = "<p>No se encontraron recetas con ese ingrediente.</p>";
          }
        })
        .catch(error => {
          console.error("Error al buscar comidas:", error);
        });
    } else {
      alert("¡Por favor, ingresa un ingrediente!");
    }
  });
});

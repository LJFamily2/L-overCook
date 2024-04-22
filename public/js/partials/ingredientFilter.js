let expandIcon = document.querySelector(".expand-icon-container");

let ingredientFilter = document.querySelector(".ingredient-filter");

expandIcon.addEventListener("click", () => {
    expandIcon.classList.toggle("moveRight");
    ingredientFilter.classList.toggle("moveRight");
  });

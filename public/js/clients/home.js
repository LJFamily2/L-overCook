let filterIcon = document.querySelector(".filter-icon-container");

let filterCriteria = document.querySelector(".filter-criteria");

let pantryIcon = document.querySelector(".pantry-icon");

let pantryContents = document.querySelector(".pantry-contents");

let expandIcon = document.querySelector(".expand-icon-container");

let ingredientFilter = document.querySelector(".ingredient-filter");

filterIcon.addEventListener("click", () => {
  filterCriteria.classList.toggle("show");
});

pantryIcon.addEventListener("click", () => {
  pantryIcon.classList.toggle("moveUp");
  pantryContents.classList.toggle("show");
});

expandIcon.addEventListener("click", () => {
  expandIcon.classList.toggle("moveRight");
  ingredientFilter.classList.toggle("moveRight");
});

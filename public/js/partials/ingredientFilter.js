let expandIcon = document.querySelector(".expand-icon-container");

let ingredientFilter = document.querySelector(".ingredient-filter");

expandIcon.addEventListener("click", () => {
    expandIcon.classList.toggle("moveRight");
    ingredientFilter.classList.toggle("moveRight");
  });

window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      ingredientFilter.classList.remove("moveRight");
      expandIcon.classList.remove("moveRight");
    }
  });

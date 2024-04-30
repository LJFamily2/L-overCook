let filterIcon = document.querySelector(".filter-icon-container");

let filterCriteria = document.querySelector(".filter-criteria");

let pantryIcon = document.querySelector(".pantry-icon");

let pantryContents = document.querySelector(".pantry-contents");

filterIcon.addEventListener("click", () => {
  filterCriteria.classList.toggle("show");
});

pantryIcon.addEventListener("click", () => {
  pantryIcon.classList.toggle("moveUp");
  pantryContents.classList.toggle("show");
});




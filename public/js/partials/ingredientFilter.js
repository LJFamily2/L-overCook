let expandIcon = document.querySelector(".expand-icon");

let ingredientFilter = document.querySelector(".ingredient-filter-container");

let background = document.querySelector(".main-content-container");

expandIcon.addEventListener("click", () => {
    expandIcon.classList.toggle("moveRight");
    ingredientFilter.classList.toggle("moveRight");
    background.classList.toggle("bg-darken");
  });

window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      ingredientFilter.classList.remove("moveRight");
      expandIcon.classList.remove("moveRight");
      background.classList.remove("bg-darken");
    }
  });

function toggleChevron(icon) {
  const isDown = icon.classList.contains("bi-chevron-down");
  if (isDown) {
    displayAllIngredients(icon);
  } else {
    hideIngredients(icon);
  }
}

function displayAllIngredients(icon) {
  const parent = icon.closest(".ingredient-header").parentElement;
  const ingredientsBtn = parent.querySelectorAll(".selectable-button.hidden");

  // Toggle visibility of hidden ingredients buttons
  ingredientsBtn.forEach((btn) => {
    btn.classList.toggle("hidden");
  });

  // Toggle visibility of more-btn and less-btn
  const moreBtn = parent.querySelector(".more-btn");
  const lessBtn = parent.querySelector(".less-btn");
  moreBtn.classList.add("hidden");
  lessBtn.classList.remove("hidden");

  // Toggle chevron icon
  icon.classList.replace("bi-chevron-down", "bi-chevron-up");
}

function hideIngredients(icon) {
  const parent = icon.closest(".ingredient-header").parentElement;
  const ingredientsBtn = parent.querySelectorAll(".selectable-button");

  // Hide ingredients except for the first 4
  for (let i = 4; i < ingredientsBtn.length; i++) {
    ingredientsBtn[i].classList.add("hidden");
  }

  // Toggle visibility of more-btn and less-btn
  const moreBtn = parent.querySelector(".more-btn");
  const lessBtn = parent.querySelector(".less-btn");
  moreBtn.classList.remove("hidden");
  lessBtn.classList.add("hidden");

  // Toggle chevron icon
  icon.classList.replace("bi-chevron-up", "bi-chevron-down");
}

// Event listener for more-btn
document.querySelectorAll(".more-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const icon = btn.parentElement.querySelector(".bi-chevron-down");
    toggleChevron(icon);
  });
});

// Event listener for less-btn
document.querySelectorAll(".less-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const icon = btn.parentElement.querySelector(".bi-chevron-up");
    toggleChevron(icon);
  });
});

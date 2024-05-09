let expandIcon = document.querySelector(".expand-icon");

let ingredientFilter = document.querySelector(".ingredient-filter");

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
    }
  });

function showMore(button) {
  const maxVisible = parseInt(button.getAttribute("data-max-visible"));
  const parent = button.parentElement;
  const hiddenButtons = parent.querySelectorAll(".selectable-button.hidden");
  hiddenButtons.forEach((btn, index) => {
    if (index < maxVisible) {
      btn.classList.remove("hidden");
    }
  });
  button.style.display = "none"; // Hide the "Show More" button

  // Toggle the chevron icon
  const icon = parent.querySelector(".bi-chevron-down");
  if (icon) {
    icon.classList.replace("bi-chevron-down", "bi-chevron-up");
    icon.onclick = function () {
      hideSelection(button, parent, maxVisible);
    };
  }
}

function hideSelection(button, parent, maxVisible) {
  const buttons = parent.querySelectorAll(".selectable-button");
  buttons.forEach((btn, index) => {
    if (index >= maxVisible) {
      btn.classList.add("hidden");
    }
  });
  const icon = parent.querySelector(".bi-chevron-up");
  if (icon) {
    icon.classList.replace("bi-chevron-up", "bi-chevron-down");
    icon.onclick = function () {
      showMore(button);
    };
  }
  button.style.display = ""; // Show the "Show More" button again
}

function toggleChevron(icon) {
  const parent = icon.closest(".ingredients");
  console.log(parent);
  const moreButton = parent.querySelector(".more-btn");
  const maxVisible = parseInt(moreButton.getAttribute("data-max-visible"));
  if (icon.classList.contains("bi-chevron-down")) {
    showMore(moreButton);
  } else {
    hideSelection(moreButton, parent, maxVisible);
  }
}

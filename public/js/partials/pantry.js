let pantryIcon = document.querySelector('.pantry-icon');

let pantryContents = document.querySelector('.pantry-contents');

pantryIcon.addEventListener('click', () => {
    pantryIcon.classList.toggle('moveUp');
    pantryContents.classList.toggle('hidden');
    pantryContents.classList.toggle('show');
 });

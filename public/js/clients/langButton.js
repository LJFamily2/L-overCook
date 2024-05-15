const dropdown = document.querySelector('.drop-down');

const list = document.querySelector('.list');

const selectedImg = document.querySelector('.selected-img');

dropdown.addEventListener('click', () => {
  list.classList.toggle('hidden');
  list.classList.toggle('fadeIn');
});

list.addEventListener('click', (e)=> {
    const img = e.target.querySelector('img');

    selectedImg.src = img.src;
})

function searchItems(inputId, list, containerID) {
   const input = document.getElementById(inputId);
   const searchTerm = input.value.toLowerCase();
   const items = document.getElementById(list).getElementsByTagName('li');
   const searchDropDown = document.getElementById(containerID);
   let timeout;
   const debouncedSearch = () => {
      if (searchTerm) {
         searchDropDown.classList.remove('hidden');
         for (const result of items) {
            const item = result.textContent.toLowerCase();
            if (item.includes(searchTerm)) {
               result.style.display = 'block';
            } else {
               result.style.display = 'none';
            }
         }
      } else {
         searchDropDown.classList.add('hidden');
      }
   };
   clearTimeout(timeout);

   setTimeout(debouncedSearch, 100);
}

function toggleSelectionInFilter(inputId, ingredient, list) {
   const button = document.getElementById(ingredient);
   console.log('Button:', button);
   toggleSelection(button);
   const activeStatus = document.querySelector('li .active-status');
   console.log('Active status:', activeStatus);
   if (button.classList.contains('selected')) {
      activeStatus.textContent = '-';
   } else {
      activeStatus.textContent = '+';
   }
   document.getElementById(list).classList.toggle('hidden');
   document.getElementById(inputId).value = '';
}


function setValue(inputId, value, list) {
   document.getElementById(inputId).value = value;
   document.getElementById(list).classList.toggle('hidden');
}

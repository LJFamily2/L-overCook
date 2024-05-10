function searchItems(inputId, list, containerID) {
   const input = document.getElementById(inputId);
   const searchTerm = input.value.toLowerCase();
   const items = document.getElementById(list).getElementsByTagName('li');
   const searchDropDown = document.getElementById(containerID);
   let timeout;
   const debouncedSearch = () => {
      if (searchTerm) {
         searchDropDown.classList.remove('hidden');
         let matchCount = 0;
         for (const result of items) {
            const item = result.textContent.toLowerCase();
            if (item.includes(searchTerm)) {
               if (matchCount < 4) {
                  result.style.display = 'block';
                  matchCount++;
               } else {
                  result.style.display = 'none';
               }
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
   toggleSelection(document.getElementById(ingredient));
   document.getElementById(list).classList.toggle('hidden');
   document.getElementById(inputId).value = '';
}


function setValue(inputId, value, list) {
   document.getElementById(inputId).value = value;
   document.getElementById(list).classList.toggle('hidden');
}

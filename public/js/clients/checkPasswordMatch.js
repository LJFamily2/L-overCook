function checkTheSame(newPasswordID, reenterPasswordID, btnID) {
   const newPassword = document.getElementById(newPasswordID);
   const reenterPassword = document.getElementById(reenterPasswordID);
   let btnSave = document.getElementById(btnID);
   if (newPassword.value !== reenterPassword.value) {
      reenterPassword.style.borderColor = 'red';
      btnSave.hidden = true;
      
    } else {
        reenterPassword.style.borderColor = 'green';
        btnSave.hidden = false;
   }
}

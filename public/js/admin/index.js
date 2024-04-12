// JavaScript code to display alerts
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const successMessage = urlParams.get('success');
    const errorMessage = urlParams.get('error');
    const message = urlParams.get('message');

    const alertContainer = document.getElementById('alertContainer');

    if (successMessage === 'true') {
          showAlert('success', 'Ingredient successfully added!');
    } else if (errorMessage === 'true' && message) {
          showAlert('danger', 'Failed to add ingredient: ' + decodeURIComponent(message));
    }

    function showAlert(type, text) {
          const alert = document.createElement('div');
          alert.classList.add('alert', 'alert-' + type, 'alert-dismissible', 'fade', 'show');
          alert.setAttribute('role', 'alert');
          alert.innerHTML = `
             <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
             ${text}
          `;
          alertContainer.appendChild(alert);
    }
 });
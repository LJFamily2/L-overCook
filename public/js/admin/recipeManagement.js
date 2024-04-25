document.addEventListener('DOMContentLoaded', function() {
    $('.search-select-box select').selectpicker();
});

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const successMessage = urlParams.get('success');
    const errorMessage = urlParams.get('error');
    const message = urlParams.get('message');

    const alertContainer = document.getElementById('alertContainer');

    if (successMessage) {
        showAlert('success', decodeURIComponent(successMessage));
    } else if (errorMessage === 'true' && message) {
        showAlert('danger', decodeURIComponent(message));
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


  
  
  
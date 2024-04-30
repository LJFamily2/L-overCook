function initializeDataTable(selector) {
    $(selector).DataTable({
        lengthMenu: [4, 8, 15],
        language: {
            entries: {
                _: 'users',
                1: 'user'
            }
        }
    });
}

$(document).ready(function () {
    initializeDataTable('#table');
    initializeDataTable('#admin-table');
});
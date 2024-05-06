function initializeDataTable(selector) {
    $(selector).DataTable({
        lengthMenu:[5, 10, 15 ,20],
    });
}

$(document).ready(function () {
    initializeDataTable('#table');
    initializeDataTable('#admin-table');
});
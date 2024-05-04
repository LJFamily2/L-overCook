function initializeDataTable(selector) {
    $(selector).DataTable({
        lengthChange:false,
    });
}

$(document).ready(function () {
    initializeDataTable('#table');
    initializeDataTable('#admin-table');
});
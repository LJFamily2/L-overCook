initializeDataTable('#table', '/users/getUsers');
initializeDataTable('#admin-table', '/users/getAdmins');

function initializeDataTable(tableId, ajaxUrl) {
   $(tableId).DataTable({
      dom: 'Bfrtip',
      serverSide: true,
      processing: true,
      buttons: [
         {
             extend: 'excelHtml5',
             autoFilter: true,
             sheetName: 'Exported data'
         }, 
         'csv'
     ],
      ajax: {
         url: ajaxUrl,
         type: 'POST',
      },
      columns: [
         { data: 'no' },
         { data: 'created' },
         { data: 'username' },
         { data: 'email' },
         {
            data: 'id',
            render: function (data, type, row) {
               return `
                            <i
                                class="ri-edit-box-line"
                                data-bs-toggle="modal"
                                data-bs-target="${
                                   tableId === '#table'
                                      ? '#staticBackdrop'
                                      : '#adminstaticBackdrop'
                                }${row.no}"
                                style="cursor: pointer;"
                            ></i>
                        `;
            },
         },
      ],
   });
}

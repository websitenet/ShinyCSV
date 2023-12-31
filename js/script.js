let loadedData = []; // Pour stocker les données chargées
let dataTable;

$(document).ready(function () {
    $('#csv-file').change(handleFileSelect);
    $('#reload-asc-button').click(() => reloadFileWithSorting('asc'));
    $('#reload-desc-button').click(() => reloadFileWithSorting('desc'));

    // Initialiser DataTables
    dataTable = $('#pokemon-table').DataTable({
        paging: false, // Désactiver la pagination pour afficher toutes les données en une seule page
        ordering: false // Désactiver le tri initial
    });

    // Ajouter un événement de recherche à la barre de recherche
    $('#search-input').on('keyup', function () {
        dataTable.search(this.value).draw(); // Effectuer une recherche et redessiner la table
    });
});


function handleFileSelect(event) {
    const file = event.target.files[0];

    Papa.parse(file, {
        complete: function(results) {
            loadedData = results.data;
            displayTable(loadedData);
            initializeDataTable();
        }
    });
}

function reloadFileWithSorting(order) {
    if (loadedData.length === 0) {
        alert('Veuillez d\'abord charger un fichier CSV.');
        return;
    }

    // Trier les données par la colonne "Rencontres" en ordre croissant ou décroissant
    const columnIndex = 3; // 3 est l'index de la colonne "Rencontres"
    const sortOrder = order === 'asc' ? 1 : -1;
    loadedData.sort((a, b) => sortOrder * (parseFloat(a[columnIndex]) - parseFloat(b[columnIndex])));

    // Recharger le tableau avec les données triées
    displayTable(loadedData);
    initializeDataTable();
}

function displayTable(data) {
    const table = $('#pokemon-table');
    table.empty();

    if (data.length === 0) {
        // Afficher un message d'instruction
        $('#instruction-message').text('Veuillez charger un fichier CSV.').show();
        return;
    }

    // Masquer le message d'instruction
    $('#instruction-message').hide();

    // Add header row
    const headerRow = $('<tr>');
    for (const header of data[0]) {
        headerRow.append($('<th>').text(header));
    }
    table.append(headerRow);

    // Add data rows
    for (let i = 1; i < data.length; i++) {
        const dataRow = $('<tr>');
        for (const cell of data[i]) {
            dataRow.append($('<td>').text(cell));
        }
        table.append(dataRow);
    }

    // Afficher le tableau une fois chargé
    table.show();
}

function initializeDataTable() {
    if ($.fn.DataTable.isDataTable('#pokemon-table')) {
        $('#pokemon-table').DataTable().destroy();
    }

    $('#pokemon-table').DataTable({
        paging: false,
        info: false
    });
}


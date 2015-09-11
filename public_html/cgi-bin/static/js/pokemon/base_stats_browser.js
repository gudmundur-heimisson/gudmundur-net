$(document).ready( function() {
    $('#iv-table').dataTable( {
        "processing": true,
        "ajax": {
            "url": "/api/basestats",
            "dataSrc": "objects"
        },
        "columns": [
            { "data": "pokedex_number" },
            { "data": "name"},
            { "data": "health_points"},
            { "data": "attack"},
            { "data": "defense"},
            { "data": "special_attack"},
            { "data": "special_defense"},
            { "data": "speed"},
            { "data": "total" }
        ]
    });
});
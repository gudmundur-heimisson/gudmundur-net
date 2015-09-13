var inputs = {"stat": {},
              "ev": {}};

function populateNamesDropdown( search, names ) {
    var subNames;
    if (search == undefined) {
        subNames = names;
    } else {
        var re = new RegExp("^" + search + ".*", "i");
        subNames = $.grep(names, function(element) {
            return element.match(re);
        });
    }
    var select = $("select#name");
    select.html("");
    for (var i=0; i<subNames.length; ++i) {
        select.append("<option value=\"" + subNames[i] + "\">" + subNames[i] + "</option>")
    }
    inputs["name"] = subNames[0];
}

var pokedata;
var names = [];

$.ajax({
    dataType: "json",
    url: "api/basestats",
    success: function( data ) {
        pokedata = data.objects;
        for (var i=0; i<pokedata.length; ++i) {
            names.push(pokedata[i].name);
        }
        names.sort();
        var search = $("input#name-search").value;
        populateNamesDropdown(search, names);
    }
});


var recordInput = function(element) {
    var id = element.attr("id");
    if (id != "name-search") {
        var parts = id.split("-");
        var val = element.val();
        val = val == "" ? undefined:val;
        if (parts.length == 2) {
            inputs[parts[1]][parts[0]] = val;
        } else {
            inputs[id] = val;
        }
    }
}

var recordSelect = function(element) {
    var id = element.attr("id");
    inputs[id] = $("option:selected", element).val();
}

var inputChange = function(event) {
    recordInput($(event.target));
    changeOutput();
}
var selectChange = function(event) {
    recordSelect($(event.target));
    changeOutput();
}

$("div#iv-calc-inputs input").each(function(index, element) {
    recordInput($(element));
});

$("div#iv-calc-inputs select").each(function(index, element) {
    recordSelect($(element));
});

$(function() {
    $("div#iv-calc-inputs input").keyup(inputChange);
    $("div#iv-calc-inputs input").change(inputChange);
    $("div#iv-calc-inputs select").change(selectChange);
    $("input#name-search")
    .keyup(function(event) {
        event.preventDefault();
        var search = event.target.value;
        populateNamesDropdown(search, names);
    });
});
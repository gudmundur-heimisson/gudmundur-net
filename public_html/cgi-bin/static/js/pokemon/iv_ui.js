var inputs = {"stat": {},
              "ev": {}};
var ivEsts = new Array(6);

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
        select.append("<option value=\"" + subNames[i] + "\">" + subNames[i].replace(/ (Forme|Mode|Size|Cloak)/, "") + "</option>")
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
        var search = $("input#name-search").val();
        populateNamesDropdown(search, names);
        changeOutput();
    }
});

var changeOutput = function() {
    if (pokedata != undefined) {
        var pokemon = $.grep(pokedata, function(pokemon) {
            if (pokemon.name == inputs.name) {
                return true;
            }
        });
        if (pokemon != undefined && pokemon.length > 0) {
            pokemon = pokemon[0];
            var baseStats = [pokemon.health_points, pokemon.attack,
                             pokemon.defense, pokemon.special_attack,
                             pokemon.special_defense, pokemon.speed];
            var stats = [inputs.stat.hp, inputs.stat.atk, inputs.stat.def,
                         inputs.stat.spatk, inputs.stat.spdef, inputs.stat.spd];
            var evs = [inputs.ev.hp, inputs.ev.atk, inputs.ev.def,
                       inputs.ev.spatk, inputs.ev.spdef, inputs.ev.spd];
            ivEsts = estimateIVs(inputs.level, baseStats, evs, inputs.nature, stats);
            $("div#iv-ests-container input").each(function(index, element) {
                if (ivEsts == undefined || ivEsts[index] == undefined) {
                    $(element).val("");
                } else {
                    var ivEst = ivEsts[index];
                    var lower = ivEst[0];
                    var upper = ivEst[ivEst.length-1];
                    if (upper == lower) {
                        $(element).val(upper);
                    } else if (isNaN(lower) && isNaN(upper)) {
                        $(element).val("");
                    } else {
                        $(element).val(lower + " - " + upper);
                    }
                }
            });
        }
    }
}

var recordInput = function(element) {
    var id = element.attr("id");
    if (id != "name-search") {
        var parts = id.split("-");
        var val = element.val();
        val = val == "" ? undefined:val;
        if (parts.length == 2) {
            inputs[parts[1]][parts[0]] = Number(val);
        } else {
            inputs[id] = Number(val);
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

$("div#iv-calc input").each(function(index, element) {
    recordInput($(element));
});

$("div#iv-calc select").each(function(index, element) {
    recordSelect($(element));
});

$(function() {
    $("div#iv-calc input").keyup(inputChange);
    $("div#iv-calc input").change(inputChange);
    $("div#iv-calc select").change(selectChange);
    $("input#name-search")
    .keyup(function(event) {
        event.preventDefault();
        var search = event.target.value;
        populateNamesDropdown(search, names);
    });
});
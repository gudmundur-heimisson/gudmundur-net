function populateNatures() {
    var names = [];
    for (n in NaturesMap) {
        names.push(n);
    }
    names.sort();
    var select = $("select#nature");
    select.html("");
    for (var i=0; i<names.length; ++i) {
        select.append("<option>" + names[i] + "</option>");
    }
}

function populateNamesDropdown( search, names ) {
    var subNames;
    if (search == undefined) {
        subNames = names;
    } else {
        var re = new RegExp("^" + search + ".*", "i");
        subNames = $.grep(names, function(element, index) {
            if (index > 0 && names[index-1] != element) {
               return element.match(re);
            }
        });
    }
    var select = $("select#name");
    select.html("");
    for (var i=0; i<subNames.length; ++i) {
        select.append("<option>" + subNames[i] + "</option>");
    }
}

var changeOutput = function() {
    if (pokedata != undefined) {
        var pokemon = $.grep(pokedata, function(pokemon, index) {
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
            var ivEsts = estimateIVs(inputs.level, baseStats, evs, inputs.nature, stats);
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
};

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
};

var recordSelect = function(element) {
    var id = element.attr("id");
    inputs[id] = $("option:selected", element).val();
};

var inputChange = function(event) {
    recordInput($(event.target));
    changeOutput();
};

var selectChange = function(event) {
    recordSelect($(event.target));
    changeOutput();
};

populateNatures();

var pokedata;
var names = [];
var pokemon = new Pokemon();

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
    }
});

function populateSelect(select, array) {
    select.html("");
    for (var i=0; i<array.length; ++i) {
        select.append("<option value='" + array[i].value +"'>"
                        + array[i].text + "</option>");
    }
}

function PokemonController(rootElement, pokemon, data) {
    this.data = data;
    this.root = $(rootElement);
    this.name = $(".name", this.root);
    this.level = $(".level", this.root);
    this.nature = $(".nature", this.root);
    this.nature.helpful = $(".nature-helpful", this.root);
    this.nature.hindering = $(".nature-hindering", this.root);
    this.form = $(".form", this.root);
    this.characteristic = $(".characteristic", this.root);
    this.stats = [];
    this.evs = [];
    for (var i=0; i<6; ++i) {
        this.stats.push($(".stats-" + i, this.root));
        this.evs.push($(".evs-" + i, this.root));
    }
    this.pokemon = pokemon;
}

PokemonController.prototype.readBaseStats = function() {
    var id = this.form.val();
    var p = this.data[id-1];
    this.pokemon.baseStats = [p.health_points, p.attack, p.defense,
                              p.special_attack, p.special_defense,
                              p.speed];
};

PokemonController.prototype.readStat = function(index) {
    var stat = this.stats[index].val();
    if (stat == "") {
        this.pokemon.stats[index] = NaN;
    } else {
        this.pokemon.stats[index] = Math.floor(stat);
    }
};

PokemonController.prototype.readStats = function() {
    for (var i=0; i<6; ++i) {
        this.readStat(i);
    }
};

PokemonController.prototype.readNature = function() {
    this.pokemon.nature = NaturesMap[this.nature.val()];
};

PokemonController.prototype.readEV = function(index) {
    var ev = this.evs[index].val();
    if (ev == "") {
        this.pokemon.evs[index] = NaN;
    } else {
        this.pokemon.evs[index] = Math.floor(ev);
    }
};

PokemonController.prototype.readEVs = function() {
    for (var i=0; i<6; ++i) {
        this.readEV(i);
    }
};

PokemonController.prototype.readLevel = function() {
    this.pokemon.level = Math.floor(this.level.val());
};

PokemonController.prototype.readCharacteristic = function() {
    this.pokemon.characteristic = CharsMap[this.characteristic.val()];
};

PokemonController.prototype.readAll = function() {
    this.readBaseStats();
    this.readNature();
    this.readStats();
    this.readEVs();
    this.readLevel();
    this.readCharacteristic();
};

PokemonController.prototype.writeNatureDetails = function() {
    if (this.pokemon.nature.neutral) {
        this.nature.helpful.html("+None");
        this.nature.hindering.html("-None");
    } else {
        this.nature.helpful.html("+" + StatsNames[this.pokemon.nature.helpful]);
        this.nature.hindering.html("-" + StatsNames[this.pokemon.nature.hindering]);
    }
};

function IVEstimatorController(rootElement, ivEstimator) {
    this.ivEstimator = ivEstimator;
    this.root = $(rootElement);
    this.ivEsts = [];
    for (var i=0; i<6; ++i) {
        this.ivEsts.push($(".ivests-" + i));
    }
}

IVEstimatorController.prototype.writeIVEsts = function() {
    for (var i=0; i<6; ++i) {
        var est = this.ivEstimator.ivEsts[i];
        var element = this.ivEsts[i];
        if (est.lower == null || est.upper == null) {
            element.val("");
        } else if (est.lower == est.upper) {
            element.val(est.upper);
        } else {
            element.val(est.lower + " - " + est.upper);
        }
    }
};

function IVEstimateApp(rootElement, data) {
    this.data = data;
    // Attach elements
    this.root = $(rootElement);
    this.nameSearch = $(".name-search", this.root);
    this.pokemon = new Pokemon();
    this.ivEstimator = new IVEstimator(this.pokemon);
    this.pokeController = new PokemonController(this.root, this.pokemon, this.data);
    this.ivEstController = new IVEstimatorController(this.root, this.ivEstimator);
    // Initialize forms
    this.populateNatures();
    this.populateNames();
    this.populateForms();
    this.populateCharacteristics();
    // Attach listeners
    var obj = this;
    this.nameSearch.keyup(function(event) {
        event.preventDefault();
        obj.populateNames();
        obj.populateForms();
    });
    this.pokeController.name.change(function(event) {
        event.preventDefault();
        obj.populateForms();
    });
    var changeTriggers = [this.pokeController.name, this.nameSearch, 
                          this.pokeController.level, this.pokeController.nature,
                          this.pokeController.form, this.pokeController.characteristic];
    changeTriggers = changeTriggers.concat(this.pokeController.stats)
                                   .concat(this.pokeController.evs);
    var changeFun = function(event) {
        event.preventDefault();
        obj.pokeController.readAll();
        obj.ivEstimator.estimateAll();
        obj.ivEstController.writeIVEsts();
    }
    for (var i=0; i<changeTriggers.length; ++i) {
        changeTriggers[i].change(changeFun);
        changeTriggers[i].keyup(changeFun);
    }
    this.pokeController.nature.change(function(event) {
        event.preventDefault();
        obj.pokeController.writeNatureDetails();
    });
    // Read values
    this.pokeController.readAll();
    this.pokeController.writeNatureDetails();
    this.ivEstimator.estimateAll();
    this.ivEstController.writeIVEsts();
}

IVEstimateApp.prototype.getNames = function() {
    this.names = [];
    for (var i=0; i<this.data.length; ++i) {
        var name = this.data[i].name;
        var id = this.data[i].id;
        if (i > 0) {
            var previousName = this.data[i-1].name;
            if (name != previousName) {
                this.names.push({"text":name, "value":id});
            }
        } else {
            this.names.push({"text":name, "value":id});
        }
    }
    this.names.sort( function(a,b) {
        if (a.text == b.text) return 0;
        return a.text < b.text ? -1 : 1;
    });
};

IVEstimateApp.prototype.populateNames = function() {
    if (this.names == undefined) {
        this.getNames();
    }
    var subNames;
    var search = this.nameSearch.val();
    if (this.search == "") {
        subNames = this.names;
    } else {
        var pattern = new RegExp("^" + search + ".*", "i");
        subNames = $.grep(this.names, function(name) {
            return name.text.match(pattern);
        });
    }
    populateSelect(this.pokeController.name, subNames);
};

IVEstimateApp.prototype.populateNatures = function() {
    var natures = [];
    for (n in NaturesMap) {
        natures.push({"text":n, "value":n});
    }
    natures.sort(function(a,b) {
        if (a.text == b.text) return 0;
        return a.text < b.text ? -1 : 1;
    });
    populateSelect(this.pokeController.nature, natures);
};

IVEstimateApp.prototype.populateForms = function() {
    var id = this.pokeController.name.val();
    var forms = [];
    if (id != null) {
        var basePokemon = this.data[id-1];
        var pokemon = this.data[id-1];
        while(basePokemon.name == pokemon.name) {
            var text = this.data[id-1].form;
            text = text == null ? "None" : text;
            forms.push({"text":text, "value":id});
            pokemon = this.data[(++id)-1];
        }
    }
    populateSelect(this.pokeController.form, forms);
};

IVEstimateApp.prototype.populateCharacteristics = function() {
    var chars = [];
    for (c in CharsMap) {
        chars.push({"text":c, "value":c});
    }
    chars.sort(function(a,b) {
        if (a.text == b.text) return 0;
        return a.text < b.text ? -1 : 1;
    });
    populateSelect(this.pokeController.characteristic, chars);
};
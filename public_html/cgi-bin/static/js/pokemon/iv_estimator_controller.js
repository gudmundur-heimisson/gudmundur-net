function populateSelect(select, array) {
    select.html("");
    for (var i=0; i<array.length; ++i) {
        select.append("<option value='" + array[i].value +"'>"
                        + array[i].text + "</option>");
    }
}

function PokemonController(rootElement, pokemon, data, statsRoot) {
    this.data = data;
    this.root = $(rootElement);
    this.name = $(".name", this.root);
    this.nature = $(".nature", this.root);
    this.nature.helpful = $(".nature-helpful", this.root);
    this.nature.hindering = $(".nature-hindering", this.root);
    this.form = $(".form", this.root);
    this.characteristic = $(".characteristic", this.root);
    this.stats = [];
    this.evs = [];
    this.statsRoot = statsRoot ? statsRoot : rootElement
    this.level = $(".level", this.statsRoot);
    for (var i=0; i<6; ++i) {
        this.stats.push($(".stats-" + i, this.statsRoot));
        this.evs.push($(".evs-" + i, this.statsRoot));
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
    this.statsGrid = $("#stats-io-grid", this.root);
    this.levelInputGrid = $("#stats-input-grid", this.root);
    this.addLevelButton = $(".add-level-inputs-button");
    this.removeLevelButton = $(".remove-level-inputs-button");
    this.pokemon = [new Pokemon()];
    this.ivEstimators = [new IVEstimator(this.pokemon[0])];
    this.pokeControllers = [new PokemonController(this.root, this.pokemon[0], this.data)];
    this.ivEstController = new IVEstimatorController(this.root, new IVEstimator(this.pokemon));
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
    this.pokeControllers[0].name.change(function(event) {
        event.preventDefault();
        obj.populateForms();
    });
    var changeTriggers = [this.pokeControllers[0].name, this.nameSearch, 
                          this.pokeControllers[0].level, this.pokeControllers[0].nature,
                          this.pokeControllers[0].form, this.pokeControllers[0].characteristic];
    changeTriggers = changeTriggers.concat(this.pokeControllers[0].stats)
                                   .concat(this.pokeControllers[0].evs);
    var changeFun = function(event) {
        event.preventDefault();
        obj.pokeControllers[0].readAll();
        obj.estimateAll();
        obj.ivEstController.writeIVEsts();
    }
    for (var i=0; i<changeTriggers.length; ++i) {
        changeTriggers[i].change(changeFun);
        changeTriggers[i].keyup(changeFun);
    }
    this.pokeControllers[0].nature.change(function(event) {
        event.preventDefault();
        obj.pokeControllers[0].writeNatureDetails();
    });
    this.addLevelButton.click(function(event) {
        event.preventDefault();
        obj.addLevelInputGroup();
    });
    this.removeLevelButton.click(function(event) {
        event.preventDefault();
        obj.removeLevelInputGroup();
    });
    // Read values
    this.pokeControllers[0].readAll();
    this.pokeControllers[0].writeNatureDetails();
    this.estimateAll();
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
    populateSelect(this.pokeControllers[0].name, subNames);
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
    populateSelect(this.pokeControllers[0].nature, natures);
};

IVEstimateApp.prototype.populateForms = function() {
    var id = this.pokeControllers[0].name.val();
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
    populateSelect(this.pokeControllers[0].form, forms);
};

IVEstimateApp.prototype.populateCharacteristics = function() {
    var chars = [{"value":null, "text":""}];
    for (c in CharsMap) {
        chars.push({"text":c, "value":c});
    }
    chars.sort(function(a,b) {
        if (a.text == b.text) return 0;
        return a.text < b.text ? -1 : 1;
    });
    populateSelect(this.pokeControllers[0].characteristic, chars);
};

IVEstimateApp.prototype.estimateAll = function() {
    var ivEstimator = this.ivEstimators[0];
    ivEstimator.estimateAll();
    var ivEsts = ivEstimator.ivEsts;
    for (var i = 1; i < this.ivEstimators.length; ++i) {
        ivEstimator = this.ivEstimators[i];
        ivEstimator.estimateAll();
        ivEsts = ivEstimator.intersectEstimates(ivEsts);
    }
    this.ivEstController.ivEstimator.ivEsts = ivEsts;
};

IVEstimateApp.prototype.addLevelInputGroup = function() {
    var lastInputGroup = $(".level-inputs-group", this.levelInputGrid);
    lastInputGroup = $(lastInputGroup[lastInputGroup.length-1]);
    var newInputGroup = lastInputGroup.clone(true);
    lastInputGroup.after(newInputGroup);
    this.removeLevelButton.show();
    var newPokemon = new Pokemon();
    var newIVEstimator = new IVEstimator(newPokemon);
    this.pokemon.push(newPokemon);
    this.ivEstimators.push(newIVEstimator);
    var newPokeController = new PokemonController(this.root, newPokemon,
                                                  this.data, newInputGroup);
    newPokeController.readAll();
    this.pokeControllers.push(newPokeController);
    var changeTriggers = [newPokeController.level];
    changeTriggers = changeTriggers.concat(newPokeController.stats)
                                   .concat(newPokeController.evs);
    var obj = this;
    var changeFun = function() {
        newPokeController.readAll();
        obj.estimateAll();
        obj.ivEstController.writeIVEsts();
    };
    for (var i=0; i<changeTriggers.length; ++i) {
        changeTriggers[i].change(changeFun);
        changeTriggers[i].keyup(changeFun);
    }
};

IVEstimateApp.prototype.removeLevelInputGroup = function() {
    var lastInputGroup = $(".level-inputs-group", this.levelInputGrid);
    if (lastInputGroup.length > 1) {
        if (lastInputGroup.length == 2) {
            this.removeLevelButton.hide();
        }
        lastInputGroup = $(lastInputGroup[lastInputGroup.length-1]);
        lastInputGroup.remove();
        this.pokeControllers.pop();
        this.ivEstimators.pop();
        this.pokemon.pop();
    }
};
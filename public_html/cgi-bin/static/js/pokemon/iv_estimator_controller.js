function populateSelect(select, array) {
    select.html("");
    for (var i=0; i<array.length; ++i) {
        select.append("<option value='" + array[i].value +"'>"
                        + array[i].text + "</option>");
    }
}

function IVEstimatorController(rootElement, data) {
    this.data = data;
    // Attach elements
    this.root = $(rootElement);
    this.nameSearch = $(".name-search", this.root);
    this.name = $(".name", this.root);
    this.level = $(".level", this.root);
    this.nature = $(".nature", this.root);
    this.nature.helpful = $(".nature-helpful", this.root);
    this.nature.hindering = $(".nature-hindering", this.root);
    this.form = $(".form", this.root);
    this.characteristic = $(".characteristic", this.root);
    this.stats = [];
    this.evs = [];
    this.ivEsts = [];
    for (var i=0; i<6; ++i) {
        this.stats.push($(".stats-" + i));
        this.evs.push($(".evs-" + i));
        this.ivEsts.push($(".ivests-" + i));
    }
    this.pokemon = new Pokemon();
    this.ivEstimator = new IVEstimator(this.pokemon);
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
    this.name.change(function(event) {
        event.preventDefault();
        obj.populateForms();
    });
    var changeTriggers = [this.name, this.nameSearch, this.level, this.nature,
                          this.form, this.characteristic]
    changeTriggers = changeTriggers.concat(this.stats).concat(this.evs);
    var changeFun = function(event) {
        event.preventDefault();
        obj.readAll();
        obj.ivEstimator.estimateAll();
        obj.writeIVEsts();
    }
    for (var i=0; i<changeTriggers.length; ++i) {
        changeTriggers[i].change(changeFun);
        changeTriggers[i].keyup(changeFun);
    }
    this.nature.change(function(event) {
        event.preventDefault();
        obj.writeNatureDetails();
    });
    // Read values
    this.readAll();
    this.writeNatureDetails();
    this.ivEstimator.estimateAll();
    this.writeIVEsts();
}

IVEstimatorController.prototype.getNames = function() {
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

IVEstimatorController.prototype.populateNames = function() {
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
    populateSelect(this.name, subNames);
};

IVEstimatorController.prototype.populateNatures = function() {
    var natures = [];
    for (n in NaturesMap) {
        natures.push({"text":n, "value":n});
    }
    natures.sort(function(a,b) {
        if (a.text == b.text) return 0;
        return a.text < b.text ? -1 : 1;
    });
    populateSelect(this.nature, natures);
};

IVEstimatorController.prototype.populateForms = function() {
    var id = this.name.val();
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
    populateSelect(this.form, forms);
};

IVEstimatorController.prototype.populateCharacteristics = function() {
    var chars = [];
    for (c in CharsMap) {
        chars.push({"text":c, "value":c});
    }
    chars.sort(function(a,b) {
        if (a.text == b.text) return 0;
        return a.text < b.text ? -1 : 1;
    });
    populateSelect(this.characteristic, chars);
};

IVEstimatorController.prototype.readBaseStats = function() {
    var id = this.form.val();
    var p = this.data[id-1];
    this.pokemon.baseStats = [p.health_points, p.attack, p.defense,
                              p.special_attack, p.special_defense,
                              p.speed];
};

IVEstimatorController.prototype.readStat = function(index) {
    var stat = this.stats[index].val();
    if (stat == "") {
        this.pokemon.stats[index] = NaN;
    } else {
        this.pokemon.stats[index] = Math.floor(stat);
    }
};

IVEstimatorController.prototype.readStats = function() {
    for (var i=0; i<6; ++i) {
        this.readStat(i);
    }
};

IVEstimatorController.prototype.readNature = function() {
    this.pokemon.nature = NaturesMap[this.nature.val()];
};

IVEstimatorController.prototype.readEV = function(index) {
    var ev = this.evs[index].val();
    if (ev == "") {
        this.pokemon.evs[index] = NaN;
    } else {
        this.pokemon.evs[index] = Math.floor(ev);
    }
};

IVEstimatorController.prototype.readEVs = function() {
    for (var i=0; i<6; ++i) {
        this.readEV(i);
    }
};

IVEstimatorController.prototype.readLevel = function() {
    this.pokemon.level = Math.floor(this.level.val());
};

IVEstimatorController.prototype.readCharacteristic = function() {
    this.pokemon.characteristic = CharsMap[this.characteristic.val()];
};

IVEstimatorController.prototype.readAll = function() {
    this.readBaseStats();
    this.readNature();
    this.readStats();
    this.readEVs();
    this.readLevel();
    this.readCharacteristic();
};

IVEstimatorController.prototype.writeNatureDetails = function() {
    if (this.pokemon.nature.neutral) {
        this.nature.helpful.html("+None");
        this.nature.hindering.html("-None");
    } else {
        this.nature.helpful.html("+" + StatsNames[this.pokemon.nature.helpful]);
        this.nature.hindering.html("-" + StatsNames[this.pokemon.nature.hindering]);
    }
};

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
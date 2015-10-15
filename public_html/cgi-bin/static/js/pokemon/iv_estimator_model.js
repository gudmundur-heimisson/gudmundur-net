function computeStat(iv, base, ev, level, nature, isHP) {
    var c = isHP ? level+10 : 5;
    return Math.floor( nature*Math.floor(level*( iv+2*base+Math.floor(ev/4) )/100 + c));
}

function estimateIV(level, base, s, ev, n, isHP) {
    var ivEst = new IVEstimate(null, null);
    if (!(level == undefined || base == undefined || s == undefined
           || ev == undefined || n == undefined)) {
        var c = isHP ? level + 10 : 5;
        var b = 2*base;
        var e = Math.floor(ev/4);
        var lower = (100/level)*(s/n -c) - b - e;
        var upper = lower + 99/level;
        if (n != 1.0) {
            upper += 90/(level*n);
        }
        var l = Math.max(Math.ceil(lower), 0);
        var u = Math.min(Math.floor(upper), 31);
        if (l<=u && l>=0 && l<=31 && u>=0 && u<=31) {
            var min = 31;
            var max = 0;
            for (var j=0; j<=u-l; ++j) {
                var iv = l+j;
                if (s == computeStat(iv, base, ev, level, n, isHP)) {
                    if (iv < min) {
                        min = iv;
                    }
                    if (iv > max) {
                        max = iv;
                    }
                }
            }
            ivEst.lower = min;
            ivEst.upper = max;
        }
    }
    return ivEst;
}

var StatsEnum = {HP:   0, 
                 Atk:  1, 
                 Def:  2, 
                 SpAtk:3, 
                 SpDef:4, 
                 Spd:  5};

function Nature(helpful, hindering) {
    if (helpful == hindering) {
        this.helpful = null;
        this.hindering = null;
        this.neutral = true;
    } else {
        this.helpful = helpful;
        this.hindering = hindering;
        this.neutral = false;
    }
    this.coefficients = [1, 1, 1, 1, 1, 1];
    if (!this.neutral) {
        this.coefficients[this.helpful] = 1.1;
        this.coefficients[this.hindering] = 0.9;
    }
}

var naturesMatrix = [["Hardy","Lonely","Adamant","Naughty","Brave"],
               ["Bold","Docile","Impish","Lax","Relaxed"],
               ["Modest","Mild","Bashful","Rash","Quiet"],
               ["Calm","Gentle","Careful","Quirky","Sassy"],
               ["Timid", "Hasty", "Jolly","Naive","Serious"]];

NaturesMap = {};
for (var i=0; i<5; ++i) {
    for (var j=0; j<5; ++j) {
        NaturesMap[naturesMatrix[i][j]] = new Nature(i+1, j+1);
    }
}

function Characteristic() {}

function Pokemon(baseStats, level, nature, characteristic, stats, evs) {
    this.baseStats = baseStats == undefined ? new Array(6) : baseStats;
    this.level = level;
    this.nature = nature;
    this.characteristic = characteristic;
    this.stats = stats == undefined ? new Array(6) : stats;
    this.evs = evs == undefined ? new Array(6) : evs;
}

function IVEstimate(lower, upper) {
    this.lower = lower;
    this.upper = upper;
}

IVEstimate.prototype.mean = function() {
    return (this.lower + this.upper)/2;
};

function IVEstimator(pokemon) {
    this.pokemon = pokemon;
    this.ivEsts = new Array(6);
    for (var i=0; i<6; ++i) {
        this.ivEsts[i] = new IVEstimate(null, null);
    }
    this.estimateAll();
}

IVEstimator.prototype.estimateAll = function() {
    if (this.pokemon.level != undefined && this.pokemon.nature != undefined) {
        for (var i=0; i<6; ++i) {
            this.ivEsts[i] = estimateIV(this.pokemon.level,
                                        this.pokemon.baseStats[i],
                                        this.pokemon.stats[i],
                                        this.pokemon.evs[i],
                                        this.pokemon.nature.coefficients[i],
                                        i==0);
        }
    }
    if (this.pokemon.characteristic != undefined) {
        //TODO
    }
};
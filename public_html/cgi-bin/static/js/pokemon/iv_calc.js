var stats = ["HP", "Atk", "Def", "Sp. Atk.", "Sp. Def.", "Spd"];

var natureNames = [["Hardy","Lonely","Adamant","Naughty","Brave"],
               ["Bold","Docile","Impish","Lax","Relaxed"],
               ["Modest","Mild","Bashful","Rash","Quiet"],
               ["Calm","Gentle","Careful","Quirky","Sassy"],
               ["Timid", "Hasty", "Jolly","Naive","Serious"]];

natureMatrices = {};

for (var i=0; i<5; ++i) {
    for (var j=0; j<5; ++j) {
        var m = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
        m[i+1] = 0.1 + m[i+1];
        m[j+1] = -0.1 + m[j+1];
        natureMatrices[natureNames[i][j]] = m;
    }
}

function Nature(helpful, hindering) {
    if (helpful == hindering) {
        this.helpful = null;
        this.hindering = null;
    }
    else {
        this.helpful = helpful;
        this.hindering = hindering;
    }
}

function computeStats(iv, base, ev, level, nature, isHP) {
    var c = isHP ? level+10 : 5;
    return Math.floor( nature*Math.floor(level*( iv+2*base+Math.floor(ev/4) )/100 + c));
}

function Pokemon(level, baseStats, ivs, evs, nature) {
    this.level = level;
    this.baseStats = baseStats;
    this.ivs = ivs;
    this.evs = evs;
    this.nature = nature;
    this.stats = new Array(6);
    for (var i=0; i<6; ++i) {
        this.stats[i] = computeStats(ivs[i], baseStats[i], evs[i], level, nature[i], isHP=i==0);
    }
}

function estimateIV(level, base, s, ev, n, isHP) {
    var ivs = [];
    var c = isHP ? level + 10 : 5;
    var b = 2*base;
    var e = Math.floor(ev/4);
    var lower = (100.0/level)*(s/n -c) - b - e;
    var upper = lower + 99/level;
    if (n != 1.0) {
        upper += 90/(level*n);
    }
    var l = Math.max(Math.ceil(lower), 0);
    var u = Math.min(Math.floor(upper), 31);
    if (!(l>=0 && u<=31)) {
        ivs.push(NaN);
    } else {
        for (var j=0; j<=u-l; ++j) {
            var iv = l+j
            if (s == computeStats(iv, base, ev, level, n, isHP)) {
                ivs.push(iv);
            }
        }
    }
    return ivs;
}

function estimateIVs(level, baseStats, evs, nature, stats) {
    var natureMatrix = natureMatrices[nature];
    var ivLists = new Array(6);
    if (level != undefined && nature != undefined) {
        for (var i=0; i<6; ++i) {
            ivLists[i] = estimateIV(level, baseStats[i], stats[i], evs[i], natureMatrix[i], isHP=i==0);
        }
    }
    return ivLists;
}
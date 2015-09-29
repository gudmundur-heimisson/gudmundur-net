var natures = [["Hardy","Lonely","Adamant","Naughty","Brave"],
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
        natureMatrices[natures[i][j]] = m;
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
    var ivs = new Array(6);
    var c = isHP ? level + 10 : 5;
    var b = 2*base;
    var e = Math.floor(ev/4);
    var est = function(e1, e2) {return (100.0/level)*((s+e2)/n + e1 - c) - b - e;}
    if (n == 1.0) {
        var lower = est(0, 0);
        var upper = est(0.99, 0);
    } else {
        var lower = est(0, 0);
        var upper = est(0.99, 0.9);
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
    var ivs = new Array(6);
    if (level != undefined && nature != undefined) {
        for (var i=0; i<6; ++i) {
            var s = stats[i]
            var b = 2*baseStats[i];
            var e = Math.floor(evs[i]/4);
            var n = natureMatrix[i];
            ivs.push(estimateIV(level, baseStats[i], stats[i], evs[i], natureMatrix[i], isHP=i==0));
        }
    }
            // var c = i==0 ? 10+level:5;
    //         var est = function(e1, e2) {return (100.0/level)*((s+e2)/n + e1 - c) - b - e;}
    //         if (n == 1.0) {
    //             var lower = est(0, 0);
    //             var upper = est(0.99, 0);
    //         } else {
    //             var lower = est(0, 0);
    //             var upper = est(0.99, 0.9);
    //         }
    //         var l = Math.max(Math.ceil(lower), 0);
    //         var u = Math.min(Math.floor(upper), 31);
    //         ivs[i] = new Array();
    //         if (!(l>=0 && u<=31)) {
    //             ivs[i].push(NaN);
    //         } else {
    //             for (var j=0; j<=u-l; ++j) {
    //                 var iv = l+j
    //                 if (s == computeStats(iv, baseStats[i], evs[i], level, n, isHP=i==0)) {
    //                     ivs[i].push(iv);
    //                 }
    //             }
    //         }
    //     }
    // }
    return ivs;
}
function testIVEstimate() {
    var a = new IVEstimate(0,1);
    var b = new IVEstimate(-1, 0.5);
    var c = new IVEstimate(0.5, 2);
    var d = new IVEstimate(0.25, 0.75);
    var e = new IVEstimate(2,3);
    var f = new IVEstimate(-1, 2);
    var estimates = [a,b,c,d,e, f];
    for (var i=0; i<estimates.length; ++i) {
        var join = a.intersect(estimates[i]);
        console.log(join.lower + "-" + join.upper);
    }
}

function testIVEstimator() {
    var base = [108, 130, 95, 80, 85, 102];
    var ivs = [24, 12, 30, 16, 23, 5];
    var evs = [74, 195, 86, 48, 84, 23];
    var nature = NaturesMap.Adamant;
    var stats = [289, 279, 192, 135, 171, 171];
    var level = 78;
    var garchomp = new Pokemon(base, level, nature, null, stats, evs);
    var est = new IVEstimator(garchomp);

    var pokedata;
    var controller;

    $.ajax({
        dataType: "json",
        url: "api/basestats",
        success: function( data ) {
            pokedata = data.objects;
            controller = new IVEstimatorController($(".iv-calc"), pokedata);
        }
    });
}
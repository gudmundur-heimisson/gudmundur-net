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
        controller = new IVEstimatorController($("#iv-calc"), pokedata);
    }
});

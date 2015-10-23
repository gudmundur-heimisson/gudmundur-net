var pokedata;
var app;

$.ajax({
    dataType: "json",
    url: "api/basestats",
    success: function( data ) {
        pokedata = data.objects;
        app = new IVEstimateApp($(".iv-calc"), pokedata);
    }
});
$.ajax({
    dataType: "json",
    url: "api/basestats",
    success: function( data ) {
        var pokedata = data.objects;
        var app = new IVEstimateApp($(".iv-calc"), pokedata);
    }
});
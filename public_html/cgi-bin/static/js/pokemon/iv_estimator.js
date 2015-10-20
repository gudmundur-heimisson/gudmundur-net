$.ajax({
    dataType: "json",
    url: "api/basestats",
    success: function( data ) {
        var pokedata = data.objects;
        var controller = new IVEstimatorController($("#iv-calc"), pokedata);
    }
});
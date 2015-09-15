// Copyright Gudmundur Heimisson, 2014. All rights reserved.

function KDEplot(KDEcanvas) {
    this.showPDF = true;
    this.showSamples = true;
    this.showKDE = true;
    this.c1 = KDEcanvas;
    this.ax1 = new Axis(this.c1, -0.1, 3, -0.1, 1.5);
    
    this.n = 100;
    this.a = 1;
    this.b = 2;
    this.nSamples = 1000;
        
    var mu = 1.5;
    var sigma = 1/3;
    this.masterSamples = Stats.rv_normal(mu, sigma, this.nSamples);
    this.samplePDF = function(x) {return Stats.pdf_normal(x, mu, sigma);};

    this.t = NumJS.linspace(this.a - 2, this.b + 2, 200);
    this.K = "normal";
    
    this.samples = this.masterSamples.slice(1, this.n);
    this.KDE = new Stats.KernelDensityEstimator(this.samples);
    this.h = this.KDE.h;
}

KDEplot.prototype.recomputeSamples = function() {
    this.samples = this.masterSamples.slice(1, this.n);
    this.KDE = new Stats.KernelDensityEstimator(this.samples);
};

KDEplot.prototype.render = function() {
    this.c1.width = this.c1.width;
    this.KDE.h = this.h;

    if (this.K == "normal") {
        this.KDE.Kernel = this.KDE.NormalKernel;
    } else if (this.K == "uniform") {
        this.KDE.Kernel = this.KDE.RectangularKernel;
    } else if(this.K == "epanechnikov") {
        this.KDE.Kernel = this.KDE.EpanechnikovKernel;
    }
    
    this.ax1.showAxis();
    if (this.showSamples) {
        this.ax1.plotDiscs(this.samples, NumJS.linspace(0,0, this.n), 2, "red");
    }
    if (this.showKDE) {
        var kde_t = this.KDE.density(this.t);
        this.ax1.plotLines(this.t, kde_t, 1, "blue");
    }
    if (this.showPDF) {
        var uni_t = NumJS.map(this.t, this.samplePDF);
        this.ax1.plotLines(this.t, uni_t, 1, "black");
    }
};

function changeH(h) {
        $("input#h-value").val(h);
        KDEplot.h = h;
        KDEplot.render();
        renderKernel();
}

function changeSamples(n) {
    $("input#n-value").val(n);
    KDEplot.n = n;
    KDEplot.recomputeSamples();
    KDEplot.render();
}

$(function() {
    $(window).unload(function () {
        $('select option').remove();
    });
    $("input#pdf-button")
    .click( function(event) {
        event.preventDefault();
        KDEplot.showPDF = !KDEplot.showPDF;
        KDEplot.render();
    });
    $("input#kde-button")
    .click( function(event ) {
        event.preventDefault();
        KDEplot.showKDE = !KDEplot.showKDE;
        KDEplot.render();
    });
    $("input#samples-button")
    .click( function(event) {
        event.preventDefault();
        KDEplot.showSamples = !KDEplot.showSamples;
        KDEplot.render();
        if (KDEplot.showSamples) {
            $("input#samples-button").val("Hide Samples");
        } else {
            $("input#samples-button").val("Show Samples");
        }
    });
    $("input#normal-h")
    .click( function(event) {
        event.preventDefault();
        KDEplot.h = KDEplot.KDE.normal_h;
        $('div#h-range').slider('value', KDEplot.h);
        $("input#h-value").val(KDEplot.h);
        KDEplot.render();
        renderKernel();
    });
    $("select#K-func").change(function(event) {
            var element = $(event.target);
            KDEplot.K = element.val();
            KDEplot.render();
            renderKernel();
        });
    $("select#PDF-select").change( function(event) {
        var element = $(event.target);
        if (element.val() == "uniform") {
            KDEplot.masterSamples = Stats.rv_uniform(KDEplot.a, KDEplot.b, KDEplot.nSamples);
            KDEplot.samplePDF = function(x) {return Stats.pdf_uniform(x, KDEplot.a, KDEplot.b);};
            KDEplot.recomputeSamples();
        }
        else if (element.val() == "normal") {
            var mu = 1.5;
            var sigma = 1/3;
            KDEplot.masterSamples = Stats.rv_normal(mu, sigma, KDEplot.nSamples);
            KDEplot.samplePDF = function(x) {return Stats.pdf_normal(x, mu, sigma);};
        }
        else if (element.val() == "exponential") {
            var lambda = 2/3;
            KDEplot.masterSamples = Stats.rv_exponential(lambda, KDEplot.nSamples);
            KDEplot.samplePDF = function(x) {return Stats.pdf_exponential(x, lambda);};
        }
        KDEplot.recomputeSamples();
        KDEplot.render();
    });
});

function renderKernel() {
    kplot.canvas.width = kplot.canvas.width;
    kplot.y_max = 0.75/KDEplot.h;
    var x = NumJS.linspace(-1.5, 1.5, 200);
    var y = NumJS.map(x, function(x) {var h = KDEplot.h; return (1/h)*KDEplot.KDE.Kernel(x/h);});
    kplot.showAxis();
    kplot.plotLines(x, y, 1.0, 'black');
}

var KDEplot = new KDEplot(document.getElementById('KDE-canvas'));
KDEplot.render();
var kplot = new Axis(document.getElementById('K-canvas'), -1.5, 1.5, 0.0, 1.0);
renderKernel();

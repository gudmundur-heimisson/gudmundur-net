// Copyright Gudmundur Heimisson, 2014. All rights reserved.

function Stats() {}

Stats.prototype.rv_uniform = function (lower, upper, n) {
  var samples = new Array(n);
  for (var i = 0; i < n; i++) {
    samples[i] = (upper - lower) * Math.random() + lower;
  }
  return samples;
};

Stats.prototype.pdf_uniform = function(x, lower, upper) {
	if (x >= lower && x <= upper) {
		return 1/(upper-lower);
	}
	else {
		return 0;
	}
};

Stats.prototype.cdf_uniform = function(x, lower, upper) {
	if (x >= lower && x <= upper) {
		return (x-lower)/(upper-lower);
	} else if (x < lower) {
		return 0;
	} else if (x > upper) {
		return 1;
	}
};

Stats.prototype.rv_normal = function(mu, sigma, n) {
	var samples = new Array(n);
	var U = this.rv_uniform(0, 1, n);
	var V = this.rv_uniform(0, 1, n);
	for (var i = 0; i < n; i++) {
		samples[i] = mu + sigma * Math.sqrt(-2*Math.log(U[i])) * Math.cos(2*Math.PI*V[i]);
	}
	return samples;
};

Stats.prototype.pdf_normal = function(x, mu, sigma) {
	return 1/(sigma * Math.sqrt(2 * Math.PI)) * Math.exp(-Math.pow(x-mu, 2)/(2 * Math.pow(sigma, 2)));
};

Stats.prototype.cdf_normal = function(x, mu, sigma) {
	return (1/2) * ( 1 + NumJS.erf( (x-mu)/(sigma*Math.sqrt(2)) ) );
};

Stats.prototype.rv_exponential = function(lambda, n) {
	var samples = new Array(n);
	var U = this.rv_uniform(0,1, n);
	for (var i = 0; i < n; i++) {
		samples[i] = -Math.log(U[i])/lambda;
	}
	return samples;
};

Stats.prototype.pdf_exponential = function(x, lambda) {
	if (x < 0) {
		return 0;
	}
	return lambda*Math.exp(-lambda*x);
};

Stats.prototype.cdf_exponential = function(x, lambda) {
	return 1-Math.exp(-lambda*x);
};

Stats.prototype.KernelDensityEstimator = function(samples) {
	this.samples = samples;
	var stddev = NumJS.std_dev(samples);
	var n = this.samples.length;
	this.normal_h = 1.06 * stddev * Math.pow(n, -1/5);
	this.h = this.normal_h;
	this.Kernel = this.NormalKernel;
};

Stats.prototype.KernelDensityEstimator.prototype.NormalKernel = function(x) {
	return Stats.pdf_normal(x, 0, 1);
};

Stats.prototype.KernelDensityEstimator.prototype.RectangularKernel = function(x) {
	return Stats.pdf_uniform(x, -1, 1);
};

Stats.prototype.KernelDensityEstimator.prototype.EpanechnikovKernel = function(x) {
	return (3/2) * (1-Math.pow(x,2)) * Stats.pdf_uniform(x, -1, 1);
};

Stats.prototype.KernelDensityEstimator.prototype.density = function(x) {
	var kde = new Array(x.length);
	for (var j = 0; j < x.length; ++j) {
		kde[j] = 0;
		for (var i = 0; i < this.samples.length; ++i) {
			kde[j] = kde[j] + (1/this.h) * this.Kernel( (x[j] - this.samples[i]) / this.h );
		}
		kde[j] = kde[j]/this.samples.length;
	}
	return kde;
};

var Stats = new Stats();
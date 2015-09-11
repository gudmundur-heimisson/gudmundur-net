// Copyright Gudmundur Heimisson, 2014. All rights reserved.

function NumJS () {}

NumJS.prototype.linspace = function(a, b, n) {
  var space = new Array(n);
  for (var i=0; i < n; ++i) {
    space[i] = (b-a)/(n-1) * i + a;
  }
  return space;
};

NumJS.prototype.map = function(x, fun) {
  var mapped = new Array(x.length);
  for (var i = 0; i < x.length; ++i) {
    mapped[i] = fun(x[i]);
  }
  return mapped;
};

NumJS.prototype.sum = function(x) {
	var sum = 0;
	for (var i = 0; i < x.length; ++i) {
		sum = sum + x[i];
	}
	return sum;
};

NumJS.prototype.erf = function(x) {
	var t = 1/(1+0.5*Math.Abs(x));
	var tau = t*Math.exp( Math.pow(x,2) 
					- 1.26551223 
					+ 1.00002368*t 
					+ 0.37409196*Math.pow(t,2) 
					+ 0.09679419*Math.pow(t,3) 
					- 0.18628806*Math.pow(t,4) 
					+ 0.27886807*Math.pow(t,5)
					- 1.13520398*Math.pow(t,6)
					+ 1.48851587*Math.pow(t,7)
					- 0.82215223*Math.pow(t,8)
					+ 0.17087277*Math.pow(t,9));
	if (x >= 0) {
		return 1-tau;
	} else {
		return tau-1;
	}
};

NumJS.prototype.mean = function(x) {
	var n = x.length;
	return this.sum(x)/n;
};

NumJS.prototype.variance = function(x) {
	var mean = this.mean(x);
	var variance = 0;
	for (var i = 0; i < x.length; ++i) {
		variance = variance + Math.pow(x[i],2);
	}
	variance = 1/(x.length-1) * variance;
	variance = variance - mean;
	return variance;
};

NumJS.prototype.std_dev = function(x) {
	var variance = this.variance(x);
	return Math.sqrt(variance);
};

NumJS = new NumJS();
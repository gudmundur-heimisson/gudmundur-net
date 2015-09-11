// Copyright Gudmundur Heimisson, 2014. All rights reserved.

function Integrate () {
  this.error = NaN;
  this.log = false;
  this.tol = Math.pow(10, -10);
}

Integrate.prototype.G7K15 = function(fun, a, b) {
  var alpha  = (b-a)/2;
  var beta = (a+b)/2;

  func = function(x) {
    return fun(alpha*x + beta);
  };

  //Gauss nodes
  var f1 = func(0.0);
  var f2 = func(0.405845151377397);
  var f3 = func(0.741531185599394);
  var f4 = func(0.949107912342759);
  var f5 = func(-0.405845151377397);
  var f6 = func(-0.741531185599394);
  var f7 = func(-0.949107912342759);

  //Kronrod nodes
  var f8 = func(0.207784955007898);
  var f9 = func(0.586087235467691);
  var f10= func(0.864864423359769);
  var f11= func(0.991455371120813);
  var f12= func(-0.207784955007898);
  var f13= func(-0.586087235467691);
  var f14= func(-0.864864423359769);
  var f15= func(-0.991455371120813);

  //Gauss weights
  var w1 = 0.417959183673469;
  var w2 = 0.381830050505119;
  var w3 = 0.279705391489277;
  var w4 = 0.129484966168870;

  //Kronrod weights
  var w5 = 0.209482141084728;
  var w6 = 0.204432940075298;
  var w7 = 0.190350578064785;
  var w8 = 0.169004726639267;
  var w9 = 0.140653259715525;
  var w10= 0.104790010322250;
  var w11= 0.063092092629979;
  var w12= 0.022935322010529;

  var G7 = alpha * ( w1*f1 + w2*(f2+f5) + w3*(f3+f6) + w4*(f4+f7) );


  var K15 = alpha * ( w5*f1 + w6*(f8+f12) + w7*(f2+f5) + w8*(f9+f13) + w9*(f3+f6) + w10*(f10+f14) + w11*(f4+f7) + w12*(f11+f15) );


  var error = Math.pow(200*Math.abs(G7-K15), 1.5);

  if (this.log) {
    console.log("Alpha: " + alpha);
    console.log("Beta: " + beta);
    console.log("a: " + a);
    console.log("b: " + b);
    console.log("G7: " + G7);
    console.log("K15: " + K15);
    console.log("Error: " + error);
    console.log("Tolerance: " + this.tol);
    console.log("|b-a|: " + Math.abs(b-a));
    console.log("Interval tolerance: " + 100*this.tol);
    console.log("\n");
  }

   // if (error > this.tol) {// && Math.abs(b-a) > this.tol) {
   //  m = (a+b)/2;
   //  if (!(Math.abs(a-m) == 0 || Math.abs(m-b) == 0)) {
   //    return this.G7K15(fun, a, m) + this.G7K15(fun, m, b);
   //  }
   // }

  return K15;
};

var Integrate = new Integrate();
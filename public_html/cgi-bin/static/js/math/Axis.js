// Copyright Gudmundur Heimisson, 2014. All rights reserved.

function Axis(canvas, x_min, x_max, y_min, y_max) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.x_min = x_min;
    this.x_max = x_max;
    this.y_min = y_min;
    this.y_max = y_max;
    this.x_axis_thickness = 2;
    this.y_axis_thickness = 2;
    this.x_axis_strokeStyle = "black";
    this.y_axis_strokeStyle = "black";
}

Axis.prototype.showAxis = function() {
    var x = [this.x_min, this.x_max];
    var y = [0, 0];
    this.plotLines(x, y, this.x_axis_thickness, this.x_axis_strokeStyle);
    x = [0, 0];
    y = [this.y_min, this.y_max];
    this.plotLines(x, y, this.y_axis_thickness, this.y_axis_strokeStyle);
};

Axis.prototype.X = function(w) {
    return ( (this.x_max - this.x_min) / this.canvas.width ) * w + this.x_min;
};

Axis.prototype.Y = function(h) {
    return ( (this.y_min - this.y_max) / this.canvas.height ) * h + this.y_max;
};

Axis.prototype.W = function(x) {
    return this.canvas.width * (x - this.x_min) / (this.x_max - this.x_min);
};

Axis.prototype.H = function(y) {
    return this.canvas.height * (y - this.y_max) / (this.y_min - this.y_max);
};

Axis.prototype.plotLines = function(x, y, lineWidth, strokeStyle) {
    this.context.beginPath();
    this.context.lineWidth = lineWidth;
    this.context.strokeStyle = strokeStyle;
    this.context.moveTo(this.W(x[0]), this.H(y[0]));
    var n = Math.min(x.length, y.length);
    for (var i=1; i < n; i++) {
        this.context.lineTo(this.W(x[i]), this.H(y[i]));
    }
    this.context.stroke();
};

Axis.prototype.plotDisc = function(x, y, r, fillStyle) {
    this.context.beginPath();
    this.context.fillStyle = fillStyle;
    this.context.arc(this.W(x), this.H(y), r, 0, 2*Math.PI);
    this.context.fill();
};

Axis.prototype.plotDiscs = function(x, y, r, fillStyle) {
    var n = Math.min(x.length, y.length);
    for (var i=0; i < n; i++) {
        this.plotDisc(x[i], y[i], r, fillStyle);
    }
};

Axis.prototype.plotPoints = function(x, y, fillStyle) {
    this.plotDiscs(x, y, 1, fillStyle);
};
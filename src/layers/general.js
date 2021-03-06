var _ = require('../util');
var layerUtil = require('../layerUtil');

function GeneralLayer(layer) {
  this._layer = layer;
}

GeneralLayer.prototype.id = function(){
  return '' + this._layer.objectID();
};

GeneralLayer.prototype.shortId = function(){
  return ('' + this._layer.objectID().sha1()).substr(0, 5);
};

GeneralLayer.prototype.symbolId = function(){
  return null;
};

GeneralLayer.prototype.dirName = function(){
  return (this.name() + " - " + this.shortId()).replace(new RegExp('/'), ":");
};

GeneralLayer.prototype.name = function(){
  return '' + this._layer.name();
};

GeneralLayer.prototype.className = function(){
  return '' + this._layer.className();
};

GeneralLayer.prototype.stringValue = function(){
  return '' + this._layer.stringValue();
};

GeneralLayer.prototype.layers = function(){
  var re = new Array();
  if (this._layer.layers) {
    re = this._layer.layers();
  }

  return re;
};

GeneralLayer.prototype.setLayers = function(layers){
  this._layers = layers;
};

GeneralLayer.prototype.type = function(){
  return layerUtil.getType(this._layer);
};

GeneralLayer.prototype.bounds = function(){
  var b = this._layer.frame();
  return {
    origin: {
      x: parseFloat(b.x()).toFixed(3),
      y: parseFloat(b.y()).toFixed(3)
    },
    size: {
      width: parseFloat(b.width()).toFixed(3),
      height: parseFloat(b.height()).toFixed(3)
    }
  };
};

GeneralLayer.prototype.styles = function(){
  var re = [];

  if (!this._layer.isVisible()) {
    re.push("display: none");
  }

  if (this._layer.isLocked()) {
    re.push("lock: true");
  }

  var bounds = this.bounds();
  re.push('top: ' + bounds.origin.y + 'px');
  re.push('left: ' + bounds.origin.x + 'px');
  re.push('width: ' + bounds.size.width + 'px');
  re.push('height: ' + bounds.size.height + 'px');

  re = re.concat(this.rotation());
  re = re.concat(this.blendMode());

  return re;
};

GeneralLayer.prototype.rotation = function(){
  var re = new Array();
  var rotation = this._layer.rotation();
  if (rotation > 0) {
    re.push('transform: rotate(' + rotation + 'deg)');
  }
  return re;
};

GeneralLayer.prototype.cssAttributes = function(){
  var re = new Array();
  var styles = this._layer.CSSAttributes();

  for (var i = 0; i < styles.length; i++) {
    var s = "" + styles[i];
    if ((new RegExp('^\/\\* .* \\*\/')).test(s) ||
        (new RegExp('^background:')).test(s) ||
        (new RegExp('^border:')).test(s) ||
        (new RegExp('^letter-spacing:')).test(s) ||
        (new RegExp('^box-shadow:')).test(s) ||
        (new RegExp("linear-gradient")).test(s)) {
      continue;
    }
    re.push(s);
  }

  re = re.concat(this.cssBackgrounds());
  re = re.concat(this.cssBorders());

  return re;
};

GeneralLayer.prototype.cssBackgrounds = function(){
  return new Array();
};

GeneralLayer.prototype.cssBorders = function(){
  var re = new Array();

  if (!this._layer.styleGeneric().hasEnabledBorder()) {
    return re;
  }

  var borders = this._layer.style().borders();
  for (var i = 0; i < borders.length; i++) {
    var color = borders[i].color();
    var s = "border: " + borders[i].thickness() + 'px solid ' + _.colorToString(color);
    if (!borders[i].isEnabled()) {
      s += ' none'
    }
    re.push(s);
  }

  return re;
};

GeneralLayer.prototype.blendMode = function(){
  var re = new Array();

  if (this._layer.style) {
    var mode = this._layer.style().contextSettings().blendMode();
    if (mode > 0) {
      re.push('blend-mode: ' + _.blendModeNumberToString(mode));
    }
  }

  return re;
};

GeneralLayer.prototype.images = function(){
  return new Array();
};

GeneralLayer.prototype.setSavedImages = function(images){
  this.savedImages = images;
};

GeneralLayer.prototype.path = function(){
  return "";
};

module.exports = GeneralLayer;

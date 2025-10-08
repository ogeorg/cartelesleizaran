var doc = app.activeDocument;
var layers = doc.artLayers;

// alert(layers.getByName("res1eq1").textItem.font)

var count = 3;
var hRes = 60;
var delta = 40;
var H = hRes * (count+1) + delta * count
var Htot = 1080;
var top = (Htot-H) / 2;
alert(top);

function ypos(line) {
  return top + line * (hRes+delta);
}
function makeTitle(title) {
  var y = ypos(0);
  var layer = layers.getByName("title");
  var item = layer.textItem;
  item.content = title;
  item.position = [535, y];
}

var titleFontName = "Share-BoldOSF";
var titleFontSize = 48;

var resFontName = "ShareTech-Regular";
var resFontSize = 24;

var colorEq = new SolidColor();
colorEq.rgb.hexValue = "ffffff";

var colorScore = new SolidColor();
colorScore.rgb.hexValue = "000000";

var lineTmpl = layers.getByName("TmplBgResLine")
var resSet = doc.layerSets.getByName("ResSet");
for(var a=resSet.artLayers.length-1; a>=0; a--) {
  resSet.artLayers[a].remove();
}

function makeEq1At(eq1, ypos) {
    var lEq = resSet.layers.add();
    lEq.kind = LayerKind.TEXT;
    lEq.name = "res" + line + "eq1";
    
    var item = lEq.textItem;
    item.kind = TextType.POINTTEXT;
    item.justification = Justification.LEFT;
    item.contents = eq1;
    
    item.position = [100, ypos + 40];
    item.font = resFontName ;
    item.size = resFontSize;
    item.color = colorEq ;
}
function makeEq2At(eq2, ypos) {
    lEq = resSet.layers.add();
    lEq.kind = LayerKind.TEXT;
    lEq.name = "res" + line + "eq2";
    
    var item = lEq.textItem;
    item.kind = TextType.POINTTEXT;
    item.justification = Justification.RIGHT;
    item.contents = eq2;
    
    item.position = [970, ypos + 40];
    item.font = resFontName ;
    item.size = resFontSize;
    item.color = colorEq;
}
function makeScoreAt(score, ypos) {
    lSc = resSet.layers.add();
    lSc.kind = LayerKind.TEXT;
    lSc.name = "res" + line + "sc";
    
    var item = lSc.textItem;
    item.kind = TextType.POINTTEXT;
    item.justification = Justification.CENTER;
    item.contents = score;
    
    item.position = [535, ypos + 40];
    item.font = resFontName ;
    item.size = resFontSize;
    item.color = colorScore ;    
}
function makeResBg(ypos) {
    var bgRL = lineTmpl.duplicate();
    bgRL.name = "BgResLine" + line;
    bgRL.move(resSet, ElementPlacement.INSIDE);
    bgRL.visible = true;
    bgRL.translate(0, ypos);
}
function makeResLine(eq1, eq2, score, line) {
    var y = ypos(line);
    makeResBg(y);
    makeEq1At(eq1, y);
    makeEq2At(eq2, y);
    makeScoreAt(score, y);
}
var eq1 = "LEIZARAN";
var eq2 = "ALOÑA";
var score = "17-21";
var line = 1;
makeTitle("SENIORAK");
makeResLine(eq1, eq2, score, 1)
makeResLine(eq1, eq2, score, 2)
makeResLine(eq1, eq2, score, 3)
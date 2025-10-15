
var data = {
  "fecha": {
    "hilabetea": "urria", "mes": "octubre", "egunak": "11-12"
  },
  "categorias": [
    {
      "titulo": "SENIOR", "partidos": [
        { "s": "Neskak", "t": "URR 11, 17:30", "l": "ETXEBARRI Kirold. (KUKULLAGA)", "t1": "Kukullaga Etxebarri", "t2": "Leizaran Lanbroa Taberna", "g1": "29", "g2": "21" },
        { "s": "Mutilak", "t": "URR 11, 16:45", "l": "IPURUA Kiroldegia (EIBAR)", "t1": "Eibar Eskubaloia B", "t2": "Leizaran Ernio Inmobiliaria", "g1": "30", "g2": "22" },
        { "s": "Mutilak", "t": "URR 11, 18:30", "l": "ALLURRALDE Kiroldegia", "t1": "Leizaran Eskubaloia", "t2": "Donibane Esk. Mitxintxola", "g1": "32", "g2": "40" }]
    },
    {
      "titulo": "JUBENIL", "partidos": [
        { "s": "Neskak", "t": "URR 11, 09:30", "l": "MAJORI Kiroldegia (ORDIZIA)", "t1": "Industrias Landu OET", "t2": "Leizaran Eskubaloia", "g1": "28", "g2": "23" },
        { "s": "Mutilak", "t": "URR 11, 17:00", "l": "ALLURRALDE Kiroldegia", "t1": "Leizaran Javier Zeramikak", "t2": "Ereintza Aguaplast", "g1": "35", "g2": "24" }]
    }]
}

var doc = app.activeDocument;
var layers = doc.artLayers;

var fecha = data['fecha'];
layers.getByName('hilabetea').textItem.contents = fecha['hilabetea'];
layers.getByName('egunak').textItem.contents = fecha['egunak'];
layers.getByName('mes').textItem.contents = fecha['mes'];

// alert(layers.getByName("res1eq1").textItem.font)

var frameTop = 300;
var frameBot = 1400;
var frameLeft = 0 + 100;
var frameRight = 1200 - 100;
var frameHeight = frameBot - frameTop;
var frameHorCenter = (frameLeft + frameRight) / 2;
var catHeight = 60;
var resultHeight = 60;    // altura de un resultado
var resultBaseline = 40;  // result top to result baseline
var resultDist = 20;      // distancia entre resultados
var catDist = 80;         // distancia entre categorías

var resSet = doc.layerSets.getByName("Partidos");
for (var a = resSet.artLayers.length - 1; a >= 0; a--) {
  resSet.artLayers[a].remove();
}

/** rellena la capa "title" avec le titre */

var titleFontName = "SofiaSans-Bold";
var titleFontSize = 64;
var titleColor = new SolidColor();
titleColor.rgb.hexValue = "fff00b";

var equipoFontName = "SofiaSansExtraCondensed-Regular";
var equipoFontSize = 56;
var equipoColor = new SolidColor();
equipoColor.rgb.hexValue = "c0c4cf";

var scoreFontName = "SofiaSansExtraCondensed-Bold";
var scoreFontSize = 64;
var scoreColor = new SolidColor();
scoreColor.rgb.hexValue = "f7450f";

function makeTitle(title, ypos, catPos) {
  var lTitle = resSet.layers.add();
  lTitle.kind = LayerKind.TEXT;
  lTitle.name = "cat" + catPos + "_tit";

  var item = lTitle.textItem;
  item.kind = TextType.POINTTEXT;
  item.justification = Justification.CENTER;
  item.contents = title;
  item.position = [frameHorCenter, ypos];
  item.font = titleFontName;
  item.size = titleFontSize;
  item.color = titleColor;
//  alert("title: " + item.justification + " / " + item.font + " / " + item.size + " / " + item.color)
}
function makeEq1At(eq1, ypos, catPos, resPos) {
//  alert("ypos(0) = " + ypos)
  var lEq = resSet.layers.add();
  lEq.kind = LayerKind.TEXT;
  lEq.name = layerPrefix + "_eq1";

  var item = lEq.textItem;
  item.kind = TextType.POINTTEXT;
  item.justification = Justification.LEFT;
  item.contents = eq1;
  item.position = [frameLeft, ypos];
  item.font = equipoFontName;
  item.size = equipoFontSize;
  item.color = equipoColor;
//  alert("title: " + item.justification + " / " + item.font + " / " + item.size + " / " + item.color)
}
function makeEq2At(eq2, ypos, layerPrefix) {
  lEq = resSet.layers.add();
  lEq.kind = LayerKind.TEXT;
  lEq.name = layerPrefix + "_eq2";

  var item = lEq.textItem;
  item.kind = TextType.POINTTEXT;
  item.justification = Justification.RIGHT;
  item.contents = eq2;
  item.position = [frameRight, ypos];
  item.font = equipoFontName;
  item.size = equipoFontSize;
  item.color = equipoColor;
}
function makeScoreAt(score, ypos, layerPrefix) {
  lSc = resSet.layers.add();
  lSc.kind = LayerKind.TEXT;
  lSc.name = layerPrefix + "_sc";

  var item = lSc.textItem;
  item.kind = TextType.POINTTEXT;
  item.justification = Justification.CENTER;
  item.contents = score;
  item.position = [frameHorCenter, ypos];
  item.font = scoreFontName;
  item.size = scoreFontSize;
  item.color = scoreColor;
}
function makeResBg(ypos) {
  var bgRL = lineTmpl.duplicate();
  bgRL.name = "BgResLine" + line;
  bgRL.move(resSet, ElementPlacement.INSIDE);
  bgRL.visible = true;
  bgRL.translate(0, ypos);
}
function makeResLine(partido, ypos, catPos, resPos) {
  var layerPrefix = "cat" + catPos + "_res" + resPos;
  makeEq1At(partido.t1, ypos, layerPrefix);
  makeEq2At(partido.t2, ypos, layerPrefix);
  if (partido.g1 || partido.g2) {
    var score = partido.g1 + " - " + partido.g2;
    makeScoreAt(score, ypos, layerPrefix);
  }
}

var categorias = data.categorias;
var catCount = categorias.length;

var resCount = 0
for(var c in categorias) {
  resCount += categorias[c].partidos.length;
}

// Altura de los textos
var textHeight = catCount * catHeight + (catCount-1) * catDist + resCount * (resultHeight + resultDist);
// Posicion top de los textos
var textTop = frameTop + (frameHeight - textHeight) / 2;

function ypos(catPos, resPos) {
  return textTop + catPos * catHeight + (catPos-1) * catDist + resPos * (resultHeight + resultDist);
}

var catPos = 1;
var ypos = textTop + resultBaseline;
for(var c in categorias) {
  var category = categorias[c];
  makeTitle(category.titulo, ypos, catPos);
  var partidos = category.partidos;
  var resPos = 1;
  for(var p in partidos) {
    var partido = partidos[p]
    ypos += resultDist + resultHeight ;
    makeResLine(partido, ypos, catPos, resPos);
    resPos += 1;
  }
  catPos += 1;
  ypos += catDist + catHeight;
}


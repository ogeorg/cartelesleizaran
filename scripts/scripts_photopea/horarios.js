var doc = app.activeDocument;
var layers = doc.layers;
// Los parametros son:
// + offsettop
// + offsetright
var PARAMS = $$PARAMS$$;

// Distancia entre categorias
// T = altura de titulo (50) / DT = distancia entre los bloques de categoria
// P = altura de partido (133) / DP = distancia entre los partidos
// C = altura de categoria = T + #P_cat * (DP+P)
// #C * T + #P_tot * (P+DP) + (#C+1) * DC = 1000
function initDistancias() {
    var distC = 0;
    var distP = 20;
    var heightT = 50;
    var heightP = 130;

    var categorias = data.categorias;
    var numC = categorias.length;
    var numP = 0;
    for (var c in categorias) {
        numP += categorias[c].partidos.length;
    }
    distC = Math.ceil((1000 - numC * heightT - numP * (distP + heightP)) / (numC + 1));
    return { 'dC': distC, 'dP': distP };
}
var dists = initDistancias();

function initPosition(dists) {
    return { 'x': PARAMS.offsetright, 'y': PARAMS.offsettop };
}
var pos = initPosition(dists);
function pos_x() {
    return pos.x;
}
function pos_y() {
    return pos.y;
}
function pos_preshift_y(dy) {
    pos.y += dy;
    return pos.y;
}
function pos_postshift_y(dy) {
    var y = pos.y;
    pos.y += dy;
    return y;
}

var colorCategoria = new SolidColor();
colorCategoria.rgb.hexValue = "67a2eb";

var colorPartidoGris = new SolidColor();
colorPartidoGris.rgb.hexValue = "d3d0aa";

var colorPartidoRojo = new SolidColor();
colorPartidoRojo.rgb.hexValue = "f55212";

var colorPartidoAmar = new SolidColor();
colorPartidoAmar.rgb.hexValue = "ffeb0c";

function categoria_new(json) {
    var cat = {};
    cat.titulo = json.titulo;
    return cat;
}

function categorias_clear() {
    var layers = setPartidos.layers;
    for (l = layers.length - 1; l >= 0; l--) {
        layers[l].remove();
    }
}

/** Altura desde arriba de la capa l1 hasta abajo de la capa l2 */
function heightFromTo(l1, l2) {
    return l2.bounds[3].value - l1.bounds[1].value;
}
/** Crea la capa "cat_$categoria" */
function categoria_build(c, categoria) {
    // Antes de poner el bloque, dejamos un hueco de DeltaCat
    pos_postshift_y(dists.dC);

    doc.activeLayer = setPartidos;
    var layer = setPartidos.layers.add();
    layer.kind = LayerKind.TEXT;
    layer.name = "cat_" + categoria.titulo;

    var item = layer.textItem;
    // PARAGRAPHTEXT = 0, POINTTEXT = 1
    item.kind = TextType.POINTTEXT;
    item.justification = Justification.LEFT;
    item.contents = categoria.titulo;

    // Bajamos 50 para poner el titulo
    item.position = [pos_x(), pos_postshift_y(50)];
    item.font = 'Poppins-Black';
    item.size = 72;
    item.color = colorCategoria;
}
/** Crea las capas "par_$cat_$part_{,L,p1,p2}" */
function partido_build(c, p, part) {
    // Antes de poner el bloque, dejamos un hueco de Deltapartido
    pos_postshift_y(dists.dP);

    // Mutila/Neska + horario
    doc.activeLayer = setPartidos;
    var lay1 = setPartidos.layers.add();
    lay1.kind = LayerKind.TEXT;
    lay1.name = "par_" + c + "_" + p;

    var item = lay1.textItem;
    item.justification = Justification.LEFT;
    item.kind = TextType.POINTTEXT;
    item.contents = part.s;
    if (part.t) {
        item.contents += " • " + part.t;
    }
    if (part.l) {
        item.contents += " • ";
    }
    item.position = [pos_x(), pos_y()];
    item.font = 'Poppins-SemiBold';
    item.size = 40;
    item.color = colorPartidoGris;

    var bounds = lay1.bounds;
    var width = bounds[2].value - bounds[0].value;
    // alert("> c="+c+" / p="+p+": width=" + width);

    // Lugar
    var lay2 = setPartidos.layers.add();
    lay2.kind = LayerKind.TEXT;
    lay2.name = "par_" + c + "_" + p + "_L";

    var item = lay2.textItem;
    item.kind = TextType.POINTTEXT;
    item.justification = Justification.LEFT;
    item.contents = part.l;
    item.position = [pos_x() + width + 10, pos_postshift_y(50)];
    item.font = 'Poppins-SemiBold';
    item.size = 36;

    var lugar = part.l.toLowerCase()
    item.color = lugar.includes('andoain') || lugar.includes('allurralde') ? colorPartidoRojo : colorPartidoGris;

    // Equipo 1
    var lay3 = setPartidos.layers.add();
    lay3.kind = LayerKind.TEXT;
    lay3.name = "par_" + c + "_" + p + "_t1";

    var item = lay3.textItem;
    item.kind = TextType.POINTTEXT;
    item.justification = Justification.LEFT;
    item.contents = part.t1;
    item.position = [pos_x(), pos_postshift_y(50)];
    item.font = 'Poppins-BoldItalic';
    item.size = 40;
    item.color = colorPartidoAmar;

    // Equipo 2
    if (part.t2) {
        var lay4 = setPartidos.layers.add();
        lay4.kind = LayerKind.TEXT;
        lay4.name = "par_" + c + "_" + p + "_t2";
        
        var item = lay4.textItem;
        item.kind = TextType.POINTTEXT;
        item.justification = Justification.LEFT;
        item.contents = part.t2;
        item.position = [pos_x(), pos_postshift_y(50)];
        item.font = 'Poppins-BoldItalic';
        item.size = 40;
        item.color = colorPartidoAmar;
    }
}
// Fecha
var fecha = data['fecha'];
layers.getByName('hilabetea').textItem.contents = fecha['hilabetea'];
layers.getByName('egunak').textItem.contents = fecha['egunak'];
layers.getByName('mes').textItem.contents = fecha['mes'];

// Partidos
var setPartidos = doc.layerSets.getByName("Partidos");
var categorias = data.categorias;
categorias_clear();
for (var c in categorias) {
    var categoria = categorias[c];
    categoria_build(c, categoria);

    var partidos = categoria.partidos;
    for (var p in partidos) {
        var partido = partidos[p];
        partido_build(c, p, partido);
    }
}
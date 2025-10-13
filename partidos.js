/**
 * Transforma el DOM en una tabla html
 * 
 * En esta tabla se puede comprobar los datos, y seleccionar
 * tanto la plantilla como los partidos que se insertan
 * 
 * @param {*} dom 
 */
function transformDom2Html(dom) {
    makeFecha(dom.fecha);
    makeCategorias(dom.categorias);
}
function makeLinkedNameEquipo(teamName, cat, nm) {
    var equipo = getEquipoByName(teamName, cat, nm);
    equipo = equipo ? `<a href='${equipo.urls[0]}' target='_blank'>${teamName}</a>`: teamName;
    return equipo;
}
function makeCategorias(categorias) {
    var $partidosTabla = $('#partidosTabla');
    function makeCategoria(categoria) {
        var hayGoles = false;
        for (var partido of categoria.partidos) {
            if ('g1' in partido || 'g2' in partido) {
                hayGoles = true;
                break;
            }
        }
        $partidosTabla.append(`<h3><input class='cb-category' type='checkbox' name='${categoria.titulo.toLowerCase()}' /> ${categoria.titulo}</h3>`);
        var g = hayGoles ? '<th>G.</th>' : '';
        var head = `<tr><th>N/M</th><th>Hora</th><th>Lugar</th><th>Equipos</th>${g}</tr>`;
        var $tabla = $(`<table class='dataTable'><thead>${head}</thead></table>`);
        var $body = $tabla.appendTo($partidosTabla).append("<tbody></tbody>");
        for (var partido of categoria.partidos) {
            var g1 = hayGoles ? ('g1' in partido ? `<td>${partido.g1}</td>` : '<td></td>') : "";
            var g2 = hayGoles ? ('g2' in partido ? `<td>${partido.g2}</td>` : '<td></td>') : "";
            var equipo1 = makeLinkedNameEquipo(partido.t1, categoria.titulo, partido.s);
            var equipo2 = makeLinkedNameEquipo(partido.t2, categoria.titulo, partido.s);
            $body.append(`<tr><td>${partido.s}</td><td>${partido.t}</td><td>${partido.l}</td><td>${equipo1}</td>${g1}</tr>`);
            $body.append(`<tr><td colspan='3' ><td>${equipo2}</td>${g2}</tr>`);
        }
    }
    $partidosTabla.empty();
    if (categorias) {
        for (var categoria of categorias) {
            makeCategoria(categoria);
        }
    } else {
        var $partidosTabla = $('#partidosTabla');
        $partidosTabla.append("<p>&lt;== Elige una configuración o teclee los datos de una jornada</p>")
    }
}
function makeFecha(fecha) {
    var $fechaTabla = $('#fechaTabla');
    $fechaTabla.empty();
    if (fecha) {
        $fechaTabla.append(`<h3>FECHAS</h3>`);
        var head = `<tr><th>Hilabetea</th><th>Egunak</th><th>Mes</th></tr>`;
        var body = `<tr><td>${fecha.hilabetea}</td><td>${fecha.egunak}</td><td>${fecha.mes}</td></tr>`;
        var $tabla = $(`<table class='dataTable'><thead>${head}</thead><tbody>${body}</tbody></table>`);
        $fechaTabla.append($tabla);
    }
}

function makePlantillas() {
    $plantillas = $('#plantillas');
}
function $makeSelectPlantillas() {
    var options = '';
    for (var pl in PLANTILLAS) {
        options += `<option value='${pl}'>${PLANTILLAS[pl].title}</option>`;
    }
    return $(`<select id='selPlantillas'>${options}</select> `);
}
function getPartidosPanel() {
    var $pnl = $("#partidosRightPanel");
    if ($pnl.length == 0) {
        $pnl = $("<div id='partidosRightPanel'>");

        var $plantillas = $(`<div id="plantillas"></div>`).appendTo($pnl);
        $(`<span>Plantilla: </span>`).appendTo($plantillas);
        $makeSelectPlantillas().appendTo($plantillas);
        $(`<button id='btnCargarPlantilla'>Abrir en el editor</button>`) //
            .appendTo($plantillas) //
            .on('click', runLoadPlantilla);

        $(`<div id="fechaTabla" class="dataTableContainer"></div>`).appendTo($pnl);
        $(`<div id="partidosTabla" class="dataTableContainer"></div>`).appendTo($pnl);
        $('#rightPanel').append($pnl);
    }
    return $pnl;
}
function initPartidos() {
    var $partidosRightPanel = getPartidosPanel();
}
function onShowPartidosOnRight() {
    $("#rightPanel").children().hide();
    getPartidosPanel().show();
}
/**
 * Carga una plantilla
 */
function runLoadPlantilla() {
    // Recoge el nombre de la plantilla a cargar
    var plKey = $('#selPlantillas').find(":selected").val();
    var plantilla = PLANTILLAS[plKey];
    var plUrl = plantilla.url;
    var m = plUrl.match(/\/([\w]+)\.psd/);
    if (m) {
        plName = m[1];
        var script = `
var expName = "${plName}";
var expUrl = "${plUrl}";
var expDoc = app.documents.getByName(expName);
if (expDoc) {
    app.activeDocument = expDoc;
} else {
    app.open(expUrl, null, false);
}
`;
    } else {
        alert(`URL ${plUrl} no apunta a un .psd`);
    };
    console.log(script);
    frame.contentWindow.postMessage(script, "*");
    slideUp();
}

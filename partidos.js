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
function parseTablaPartidos() {
    var fecha = {};
    var categorias = {};
    $('.editable-data, .fixed-data').find("[data-key]").each(function () {
        var $this = $(this);
        var key = $this.data('key').split(':');
        var cat = key[0];
        if (cat == 'fecha') {
            fecha[key[1]] = $this.text();
        } else {
            var categoria = categorias[cat] ?? { titulo: CATEGORIAS[cat], partidos: [] };
            categorias[cat] = categoria;

            var pos = key[1];
            var partido = categoria.partidos[pos] ?? {};
            categoria.partidos[pos] = partido;

            partido[key[2]] = $this.text();
        }
    });
    return { fecha: fecha, categorias: Object.values(categorias) };
}

function makeLinkedNameEquipo(teamName, cat, nm) {
    var equipo = equiposService.getEquipoByName(teamName, cat, nm);
    if (equipo) {
        var urls = equipo.urls.filter((u) => u).map((u, i) => `<a href='${u}' target='partidos_leizaran_en_federaciones'>${i + 1}</a>`);
        return "<sup>" + urls.join(", ") + "</sup>";
    } else {
        return "";
    }
}
function makeCategorias(categorias) {
    var $partidosTabla = $('#partidosTabla');
    function makeCategoria(categoria) {
        var categoriaKey = equiposService.getCategoriaKeyByName(categoria.titulo);
        $partidosTabla.append(`<h3><input class='cb-category' type='checkbox' name='${categoria.titulo.toLowerCase()}' /> ${categoria.titulo}</h3>`);
        var head = `<tr><th>N/M</th><th>Hora</th><th>Lugar</th><th>Equipos</th><th>G.</th></tr>`;
        var $tabla = $(`<table class='dataTable'><thead>${head}</thead></table>`);
        var $body = $tabla.appendTo($partidosTabla).append("<tbody></tbody>");
        var partidoPos = 0;
        for (var partido of categoria.partidos) {
            var parKey = categoriaKey + ":" + partidoPos;
            var links1 = makeLinkedNameEquipo(partido.t1, categoria.titulo, partido.s);
            var links2 = makeLinkedNameEquipo(partido.t2, categoria.titulo, partido.s);
            $body.append(`<tr>
                <td class='fixed-data'><span data-key='${parKey}:s'>${partido.s}</span></td>
                <td class='editable-data'><span data-key='${parKey}:t'>${partido.t}</span></td>
                <td class='editable-data'><span data-key='${parKey}:l'>${partido.l}</span></td>
                <td class='editable-data'><span data-key='${parKey}:t1'>${partido.t1}</span>${links1}</td>
                <td class='editable-data'><span data-key='${parKey}:g1'>${partido.g1 ?? ''}</span></td></tr>`);
            $body.append(`<tr><td colspan='3' >
                <td class='editable-data'><span data-key='${parKey}:t2'>${partido.t2}</span>${links2}</td>
                <td class='editable-data'><span data-key='${parKey}:g2'>${partido.g2 ?? ''}</span></td></tr>`);
            partidoPos += 1;
        }
    }
    var catChecks = getCategoriesChecks();
    $partidosTabla.empty();
    if (categorias) {
        for (var categoria of categorias) {
            makeCategoria(categoria);
        }
    } else {
        var $partidosTabla = $('#partidosTabla');
        $partidosTabla.append("<p>&lt;== Elige una configuración o teclee los datos de una jornada</p>")
    }
    $('.editable-data').on('dblclick', onEditDato);
    setCategoriesChecks(catChecks);
}
var $currentEdit = null;
function acceptCurrentEdit(newvalue) {
    $currentEdit.empty();
    $currentEdit.text(newvalue);
    $currentEdit = null;
}
function cancelCurrentEdit() {
    $currentEdit.empty();
    $currentEdit.text($currentEdit.data('origvalue'));
    $currentEdit = null;
}
function makeEditDatoInputText(origvalue) {
    var $input = $(`<input type='text' value='${origvalue}' />`) //
        .on('change', function () {
            acceptCurrentEdit(this.value);
        }) //
        .on('keydown', function (event) {
            switch (event.which) {
                case 27: cancelCurrentEdit(); break;
                case 9, 13: acceptCurrentEdit(this.value); break;
                default: break;
            }
        });
    return $input;
}
function makeEditDatoSelectMes(values, origvalue) {
    var options = "1,2,3,4,5,6,7,8,9,10,11,12".split(",").map(v => `<option>${v}</option>`).join("");
    var $sel = $(`<select>${options}</select>`) //
        .val(origvalue) //
        .on('blur', function() {
            acceptCurrentEdit(this.value);
            $('#partidosHilabetea').text(MESES[this.value][3]);
            $('#partidosMes').text(MESES[this.value][1]);
        });
    return $sel;
}
function onEditDato() {
    var $this = $(this);
    var $edit = $this.find("[data-key]");
    if ($currentEdit) {
        if ($edit == $currentEdit)
            return;
        else
            cancelCurrentEdit();
    }
    var value = $edit.text();
    $edit.data('origvalue', value);
    $edit.empty();
    var valuetype = $edit.data('valuetype')
    if (valuetype == 'month') {
        var $editwidget = makeEditDatoSelectMes(value);
    } else {
        var $editwidget = makeEditDatoInputText(value);
    }
    $editwidget.appendTo($edit);
    $currentEdit = $edit;
}
function getCategoriesChecks() {
    var checks = {};
    $(".cb-category").each(function () {
        checks[this.name] = this.checked;
    });
    return checks;
}
function setCategoriesChecks(checks) {
    $(".cb-category").each(function () {
        this.checked = checks[this.name];
    });
}
function makeFecha(fecha) {
    var $fechaTabla = $('#fechaTabla');
    $fechaTabla.empty();
    if (fecha) {
        $fechaTabla.append(`<h3>FECHAS</h3>`);
        var head = `<tr><th>Urtea</th><th colspan='3'>Hilabetea</th><th>Egunak</th></tr>`;
        var body = `<tr>
            <td class='editable-data'><span data-key='fecha:y'>${fecha.y}</span></td>
            <td class='editable-data'><span data-key='fecha:m' data-valuetype='month'>${fecha.m}</span></td>
            <td id='partidosHilabetea'>${fecha.hilabetea}</td>
            <td id='partidosMes'>${fecha.mes}</td>
            <td class='editable-data'><span data-key='fecha:egunak'>${fecha.egunak}</span></td>`;
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
        $pnl.append("<h2>Partidos</h2>");


        var $plantillas = $(`<div id="plantillas"></div>`).appendTo($pnl);
        $(`<span>Plantilla: </span>`).appendTo($plantillas);
        $makeSelectPlantillas().appendTo($plantillas);
        $(`<button id='btnCargarPlantilla'>Abrir en el editor</button>`) //
            .appendTo($plantillas) //
            .on('click', runLoadPlantilla);

        $(`<div id="fechaTabla" class="dataTableContainer"></div>`).appendTo($pnl);
        $(`<div id="partidosTabla" class="dataTableContainer"></div>`).appendTo($pnl);
        $('#right_panel').append($pnl);
    }
    return $pnl;
}
function initPartidos() {
    var $partidosRightPanel = getPartidosPanel();
}
function onShowPartidosOnRight() {
    $("#right_panel").children().hide();
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

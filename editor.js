/*
    'fecha': {
        'hilabetea': 'abuztua',
        'egunak': '30',
        'mes': 'agosto'
    },
    'categorias': [
        {
            'titulo': 'KADETE',
            'partidos': [
                {
                    's': 'Mutilak', 't': '10:00', 'l': 'Alluralde (Andoain)',
                    't1': 'Leizaran Camacho construcción',
                    't2': 'Zaisa Bidasoa Irun'
                }
            ]
        }, {
            'titulo': 'JUBENIL',
            'partidos': [
                {
                    's': 'Mutilak', 't': '10:00', 'l': 'Hernani kiroldegia (Hernani)',
                    't1': 'Hernani',
                    't2': 'Leizaran Javier Zeramika'
                }
            ]
        }
    ]
[Fecha]
2025 / 30 / 8
[Kadete]
Mutilak ; 10:00 ; Alluralde (Andoain) ; Leizaran Camacho construcción; Zaisa Bidasoa Irun
[Jubenil]
Mutilak ; 10:00 ; Hernani kiroldegia (Hernani) ; Hernani ;Leizaran Javier Zeramika

*/
var MESES = [
    [],
    ['ene', 'enero', 'urt', 'urtarrila'],
    ['feb', 'febrero', 'ots', 'otsaila'],
    ['mar', 'marzo', 'mar', 'martxoa'],
    ['abr', 'abril', 'api', 'apirila'],
    ['may', 'mayo', 'mai', 'maiatza'],
    ['jun', 'junio', 'eka', 'ekaina'],
    ['jul', 'julio', 'uzt', 'uztaila'],
    ['ago', 'agosto', 'abu', 'abuztua'],
    ['sep', 'septiembre', 'ira', 'iraila'],
    ['oct', 'octubre', 'urr', 'urria'],
    ['nov', 'noviembre', 'aza', 'azaroa'],
    ['dic', 'diciembre', 'abe', 'abendua'],
];



/**
 * Recibe el mensaje de Photopea
 * @param e el evento
 * @returns 
 */
function onMSG(e) {
    console.log(e.origin, e);
    if (e.origin.indexOf("photopea.com") == -1) return;
    var nst;
    if (typeof e.data == "string") nst = e.data;
    else nst = "ArrayBuffer[" + e.data.byteLength + "]";
    //        document.getElementById("msgs").textContent += nst + "\n";
};

var isUp = true;
function slideUp() {
    $("#overlay").animate({
        height: 20,
        done: function () { }
    }, function (animation, jumpedToEnd) {
        $("#ui_main").hide()
    });
    isUp = true;
}
function slideDown() {
    $("#overlay").animate({
        height: "100%"
    }, function (animation, jumpedToEnd) {
        $("#ui_main").show()
    });
    isUp = false;
}


function slide() {
    if (isUp) {
        slideDown();
    } else {
        slideUp();
    }
}

var frame = null;
function runScript(e) {
    slideUp();
    var script = document.getElementById("script").value;
    frame.contentWindow.postMessage(script, "*");
}


function EditorService() {
    $("#btnShowSaveConfig").hide();
    this.resetContent = function () {

    }
    /**
     * Coge la desripcion de partidos
     */
    this.fillTableWithData = function () {
        var partidos = $data.val();
        var dom = parsePartidos(partidos);
        tableView.fillWithDom(dom);
        tableView.showPartidosOnRight();

        photopeaCodeService.fillCodeWithDom(dom);
    }

    function transformDom2Data(dom) {
        var lines = [];
        var fecha = dom.fecha;
        lines.push("[FECHA]");
        lines.push(`${fecha.y} ; ${fecha.m} ; ${fecha.egunak} ; `);
        var categorias = dom.categorias;
        for (var cat in categorias) {
            var categoria = categorias[cat]
            lines.push(`[${categoria.titulo}]`);
            for (var par in categoria.partidos) {
                var partido = categoria.partidos[par];
                lines.push(`${partido.s} ; ${partido.t} ; ${partido.l} ; ${partido.t1} ; ${partido.t2} ; ${partido.g1 ?? ''} ; ${partido.g2 ?? ''}`);
            }
        }
        return lines.join('\n');
    }
    this.setContent = function (key, config) {
        $data.val(config);
        $("#currentConfigKey").text(`Configuración: ${key}`);
        $("#btnShowSaveConfig").show();
        this.fillTableWithData();
    }
    this.fillDataWithTable = function () {
        var dom = tableView.getDom();
        var data = transformDom2Data(dom);
        $data.val(data);
    }
    this.init = function () {
        $data = $("#partidos");
    }
    var $data;
}
const editorService = new EditorService();


function PhotopeaCodeService() {
    this.fillCodeWithDom = function (dom) {
        var dom2 = {};
        dom2.fecha = dom.fecha;
        dom2.categorias = [];
        if (dom.categorias)
            for (var categoria of dom.categorias) {
                var titulo = categoria.titulo.toLowerCase();
                var $cb = $(`input[name='${titulo}']`);
                if ($cb.is(':checked'))
                    dom2.categorias.push(categoria);
            }
        var json = "var data = " + JSON.stringify(dom2) + "\n\n";
        var plantilla = $("#selPlantillas").val();
        script = paramsPersistor.getParams(plantilla).code ?? $("#basecode4Photopea").val();
        script = script.replace("$$PARAMS$$", paramsPersistor.getParamsAsStr(plantilla));
        $("#script").val(json + script);
    }
    this.fillCodeWithTable = function () {
        var dom = tableView.getDom();
        this.fillCodeWithDom(dom)

    }

}
const photopeaCodeService = new PhotopeaCodeService();
// ----------------------------------------------
// Help panel
// ----------------------------------------------

function onShowHelp() {
    $("#right_panel").children().hide();
    $("#helpRightPanel").show();
}

function onPaste2Capitalize(e) {
    e.preventDefault();
    var name = e.originalEvent.clipboardData.getData('text');
    name = name.replace(/\p{L}+/ug, word => word[0].toUpperCase() + word.slice(1).toLowerCase());
    this.value = name;
}
// ----------------------------------------------
// Params panel
// ----------------------------------------------


// ----------------------------------------------
// Linking
// ----------------------------------------------

$(document).ready(function () {
    frame = document.getElementById("pp");
    window.addEventListener("message", onMSG);
    $("#btnSlide").on("click", slide);
    $("#btnDataToTable").on("click", () => editorService.fillTableWithData());
    $("#btnTableToData").on("click", () => editorService.fillDataWithTable());
    $("#btnDom2Javascript").on("click", () => photopeaCodeService.fillCodeWithTable());

    $("#btnPostScript").on('click', runScript);
    $("#btnShowLoadConfig").on('click', () => configurationsService.showConfigsOnRight(currentConfigKey));
    $("#btnShowHelp").on('click', onShowHelp);
    $("#txtCapitalize").on('paste', onPaste2Capitalize);

    // Parametros
    $("#btnShowScriptParams")./* The `on` function in the provided JavaScript code is used to attach
    event handlers to elements in the document. It is commonly used with
    jQuery to bind event handlers to specific events like click, change,
    keyup, etc. */
        on('click', () => parametersService.showScriptParamsOnRight());
    $("#btnEquiposPanel").on('click', () => equiposService.showPanel());

    $(".btnCerrarRightPanel").on('click', () => tableView.showPartidosOnRight());

    saveConfigAsService.init();
    $("#btnShowSaveConfigAs").on('click', () => saveConfigAsService.showPanel());

    configurationsService.init();
    $("#btnSaveSaveConfig").on('click', () => configurationsService.saveCurrentConfig($("#partidos").val()));

    tableView.init();

    editorService.init();
    slideDown();

    // onTransformDataToTable();
    editorService.fillTableWithData();

    // updatePlayground();
});


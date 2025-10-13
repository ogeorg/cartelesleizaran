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
var meses = [
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


function transformDom2Javascript(dom) {
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
    var script = $("#basecode4Photopea").val();
    var plantilla = $("#selPlantillas").val();
    script = script.replace("$$PARAMS$$", getParamsAsStr(plantilla));
    $("#script").val(json + script);
}

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
        height: "90%"
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

/**
 * Coge la desripcion de partidos
 */
function onTransformPartidos() {
    var partidos = $("#partidos").val();
    var dom = parsePartidos(partidos);
    transformDom2Html(dom);
    transformDom2Javascript(dom);
    $("#btnDom2Javascript").on("click", function () {
        transformDom2Javascript(dom);
        onShowPartidosOnRight();
    });
}


// ----------------------------------------------
// Help panel
// ----------------------------------------------

function onShowHelp() {
    $("#rightPanel").children().hide();
    $("#helpRightPanel").show();
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
    $("#btnTransformPartidos").on("click", onTransformPartidos);
    $("#btnPostScript").on('click', runScript);
    $("#btnShowLoadConfig").on('click', onShowConfigsOnRight);
    $("#btnShowHelp").on('click', onShowHelp);

    // Parametros
    $("#btnShowScriptParams").on('click', onShowScriptParamsOnRight);
    $("#btnShowDataSources").on('click', onShowDataSources);

    $(".btnCerrarRightPanel").on('click', onShowPartidosOnRight);

    initConfigurations();
    initPartidos();
    slideDown();

    onTransformPartidos();

    // updatePlayground();
});


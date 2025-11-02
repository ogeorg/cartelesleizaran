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

    function onPaste2Capitalize(e) {
        e.preventDefault();
        var name = e.originalEvent.clipboardData.getData('text');
        name = name.replace(/\p{L}+/ug, word => word[0].toUpperCase() + word.slice(1).toLowerCase());
        navigator.clipboard.writeText(name);
        this.value = name;
    }

    /**
     * Coge la desripcion de partidos
     */
    this.fillTableWithData = function () {
        var partidos = $data.val();
        var dom = parsePartidos(partidos);
        tableView.fillWithDom(dom);
        broadcaster.broadcast('show-right-panel', { panel: 'partidos' });

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
    this.fillDataWithTable = function () {
        var dom = tableView.getDom();
        var data = transformDom2Data(dom);
        $data.val(data);
    }
    this.saveCurrentConfig = async function () {
        if (!currentConfigKey) {
            this.saveAs();
        } else {
            var data = $("#partidos").val();
            currentConfig.data = data;
            await configsPersistor.saveConfig(currentConfigKey, currentConfig);
            broadcaster.broadcast('config-selected', { key: currentConfigKey, config: currentConfig });
            console.log("Saved");
        }
    }

    this.saveAs = function () {
        $dlg = $(`<div id="saveAsDialog" title="Guardar la configuración"></div>`);
        $dlg //
            .append(`<div>Nombre de la configuración</div>`) //
            .append(`<input type="text" id="txtConfigNameSaveConfigAs" />`) //
            .dialog({
                autoOpen: false,
                buttons: {
                    "OK": async function () {
                        var name = $("#txtConfigNameSaveConfigAs").val();
                        var data = $("#partidos").val();
                        var config = { name, data };
                        var key = configurationsService.addConfiguration(config);
                        await configsPersistor.saveConfig(key, config);
                        broadcaster.broadcast('config-selected', { key, config });
                        $dlg.dialog("close");
                    },
                    "Cancel": function () {
                        $dlg.dialog("close");
                    }
                }
            });
        $dlg.dialog("open");
    }

    this.init = function () {
        $data = $("#partidos");
        $("#btnSaveSaveConfig").on('click', () => {
            currentConfig.data = $data.val();
            this.saveCurrentConfig()
        });
        $("#btnShowSaveConfigAs").on('click', () => this.saveAs());
        $("#btnShowConfigsPanel").on('click', () => broadcaster.broadcast('show-right-panel', { panel: 'configs' }));
        $("#btnEquiposPanel").on('click', () => broadcaster.broadcast('show-right-panel', { panel: 'equipos' }));
        $("#btnShowHelp").on('click', () => broadcaster.broadcast('show-right-panel', { panel: 'help' }));

        $("#txtCapitalize").on('paste', onPaste2Capitalize);

        broadcaster //
            .register(this, ['config-name-changed'], function (event) {
                var key = event.key;
                var config = event.config;
                if (currentConfigKey == key) {
                    $("#currentConfigKey").text(`Configuración: ${config.name ?? '--'}`);
                }
            }) //
            .register(this, ['config-selected'], function (event) {
                currentConfig = event.config;
                currentConfigKey = event.key;
                $("#currentConfigKey").text(`Configuración: ${currentConfig.name ?? '--'}`);
                $data.val(currentConfig.data);
            });
    }
    var currentConfig = {};
    var currentConfigKey = null;
    var $data;
}
const editorService = new EditorService();

function Broadcaster() {
    var eventsMap = {};
    this.register = function (listener, eventName, handler) {
        if (!(eventName in eventsMap)) {
            eventsMap[eventName] = [[listener, handler]];
        } else {
            eventsMap[eventName].push([listener, handler]);
        }
        return this;
    }
    this.broadcast = function (eventName, data) {
        if (!(eventName in eventsMap))
            return;
        for (handler of eventsMap[eventName]) {
            var listener = handler[0];
            var callback = handler[1];
            callback.call(listener, data);
        }
    };

}
const broadcaster = new Broadcaster();
// broadcaster.broadcast('config-name-changed', { oldname: null, newname: 'abc' })

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
        script = parametersService.getParams(plantilla).code ?? $("#basecode4Photopea").val();
        script = script.replace("$$PARAMS$$", parametersService.getParamsAsStr(plantilla));
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

function HelpUI() {
    //broadcaster.broadcast('show-right-panel', { panel: 'equipos' }));
    broadcaster //
        .register(this, ['show-right-panel'], function (event) {
            if (event.panel == 'help') {
                $("#helpRightPanel").show();
            } else {
                $("#helpRightPanel").hide();
            }
        });
}
const helpUI = new HelpUI();

// ----------------------------------------------
// Params panel
// ----------------------------------------------

// ----------------------------------------------
// Linking
// ----------------------------------------------

$(document).ready(async function () {
    frame = document.getElementById("pp");
    window.addEventListener("message", onMSG);

    // Sliding
    $("#btnSlide").on("click", slide);

    // data <-> tabla
    $("#btnDataToTable").on("click", () => editorService.fillTableWithData());
    $("#btnTableToData").on("click", () => editorService.fillDataWithTable());

    // tabla <-> javascript
    $("#btnDom2Javascript").on("click", () => photopeaCodeService.fillCodeWithTable());

    // Botones de abajo
    $("#btnShowScriptParams").on('click', () => broadcaster.broadcast('show-right-panel', { panel: 'params' }));
    $("#btnPostScript").on('click', runScript);

    // Boton general
    $(".btnCerrarRightPanel").on('click', () => tableView.showPartidosOnRight());

    await configurationsUI.init();
    tableView.init();
    editorService.init();
    equiposUI.init();
    parametersService.init();
    broadcaster.broadcast('show-right-panel', { panel: 'configs' });

    // editorService.fillTableWithData();

    slideDown();
});


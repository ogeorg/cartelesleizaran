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
var plantillas = {
    'car': ['Caratula', 'https://rawcdn.githack.com/ogeorg/cartelesleizaran/refs/heads/main/plantilla_caratula.psd'],
    'hor': ['Horarios', 'https://rawcdn.githack.com/ogeorg/cartelesleizaran/refs/heads/main/plantilla_horarios.psd'],
    //    ['lag', 'Amistoso', 'http://ogeorg.com/leizaran/plantilla_amistoso.psd'],
};

function produceNothing() { }
/**
 * Parsea el texto de datos de partidos y crea un DOM
 * 
 * @param {*} txtPartidos 
 * @returns 
 */
function parsePartidos(txtPartidos) {
    var dom = {}
    function NullState() {
        this.produce = produceNothing;
    }
    function FechaHeaderState() {
        this.fecha = {};
        dom.fecha = this.fecha;
        this.produce = produceNothing;
    }
    function InFechaState(prevstate, line) {
        this.fecha = prevstate.fecha;
        this.produce = function () {
            if (!line)
                return;
            var items = line.split("/");
            var mes = parseInt(items[1].trim());
            this.fecha.hilabetea = meses[mes][3];
            this.fecha.mes = meses[mes][1];
            this.fecha.egunak = items[2].trim();
        }
    }
    function PartidoHeaderState(catName) {
        if (!dom.categorias)
            dom.categorias = [];
        this.categoria = {};
        dom.categorias.push(this.categoria);
        this.produce = function () {
            this.categoria.titulo = catName;
            this.categoria.partidos = [];
        }
    }
    function InPartidoState(prevstate, line) {
        this.categoria = prevstate.categoria;
        this.produce = function () {
            if (!line)
                return;
            var items = line.split(";");
            var partido = {};
            if (items.length > 0) partido.s = items[0].trim();
            if (items.length > 1) partido.t = items[1].trim();
            if (items.length > 2) partido.l = items[2].trim();
            if (items.length > 3) partido.t1 = items[3].trim();
            if (items.length > 4) partido.t2 = items[4].trim();
            if (items.length > 5) partido.g1 = items[5].trim();
            if (items.length > 6) partido.g2 = items[6].trim();
            this.categoria.partidos.push(partido);
        }
    }
    function nextState(prevstate, line) {
        line = line.trim();
        if (!line) {
            prevstate.produce = produceNothing;
            return prevstate;
        }
        var res = line.match(/\[([\s\w]+)\]/);
        if (res) {
            var seccion = res[1];
            if (seccion.toLowerCase() == 'fecha')
                return new FechaHeaderState();
            else
                return new PartidoHeaderState(seccion);
        }
        else {
            if (prevstate instanceof FechaHeaderState) {
                return new InFechaState(prevstate, line);
            } else if (prevstate instanceof InFechaState) {
                return new InFechaState(prevstate, line);
            } else if (prevstate instanceof PartidoHeaderState) {
                return new InPartidoState(prevstate, line);
            } else if (prevstate instanceof InPartidoState) {
                return new InPartidoState(prevstate, line);
            }
        }
    }

    var lines = txtPartidos.split("\n");
    var state = new NullState();
    for (var line of lines) {
        state = nextState(state, line);
        state.produce();
    }
    return dom;
}

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
            $body.append(`<tr><td>${partido.s}</td><td>${partido.t}</td><td>${partido.l}</td><td>${partido.t1}</td>${g1}</tr>`);
            $body.append(`<tr><td colspan='3' ><td>${partido.t2}</td>${g2}</tr>`);
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
function makePantillas() {
    $plantillas = $('#plantillas');
    var options = '';
    for (var pl in plantillas) {
        options += `<option value='${pl}'>${plantillas[pl][0]}</option>`;
    }
    $plantillas.append($(`<span>Plantilla: </span>`));
    $plantillas.append($(`<select id='selPlantillas'>${options}</select> `));
    $plantillas.append($(`<button id='btnCargarPlantilla'>Abrir en el editor</button>`));
    $('#btnCargarPlantilla').on('click', runLoadPlantilla);
}

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
 * Carga una plantilla
 */
function runLoadPlantilla() {
    // Recoge el nombre de la plantilla a cargar
    var plKey = $('#selPlantillas').find(":selected").val();
    var plantilla = plantillas[plKey];
    var plUrl = plantilla[1];
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

var currentConfigKey = null;
var configEjemplo = `[Fecha]
2025 / 5 / 15-18
[SENIOR]
Neskak ; 17 MAI 18:00 ; Egia (Donosita) ; Egia Baztarre Taberna ; Leizaran Lanbroa Taberna
Mutilak ; 17 MAI 18:99 ; Ispilla (Zumarraga) ; Urola E.K. Crist. Goiherro ; Leizaran Eskubalioa
[JUBENIK]
Neskak ; 17 MAI 13:00 ; Alluralde kiroldegia ; Leizaran Eskubalioa ; Goizper Bergara KE 
Mutilak ; 17 MAI 11:45 ; Alluralde kiroldegia ; MEK Eibar Eskubalioa ;Leizaran Javier Zeramika
[KADETE neskak]
Neskak ; 17 MAI 11:45 ; Galtzalaborda (Errenteria) ; Ereintza Beissier ; Leizaran La Salle Berrozpe
[KADETE mutilak]
Mutilak ; 17 MAI 15:00 ; Alluralde kiroldegia ; Leizaran Camacho Construcción ; Alkain Bidaso Irun
Mutilak ; 18 MAI 11:00 ; MEK Eibar Eskubalioa B ; Leizaran Horia
Mutilak ; 17 MAI 11:00 ; Alluralde kiroldegia ; Leizaran Txuria ; Txindoki Done Pedro;`;
function onShowConfigsOnRight() {
    showConfigsOnRight(currentConfigKey);
}
function showConfigsOnRight(selectedKey) {
    $("#rightPanel").children().hide();
    var configs = getConfigs();

    // First we create the table
    var $body = $("#configsList tbody");
    $body.empty();
    $("#configPreview").empty();

    var $currTr = null;
    for (var c of Object.keys(configs).sort()) {
        var b1 = `<button class='btnSeeConfig'>Ver</button>`;
        var b2 = `<button class='btnLoadConfig'>Cargar</button>`;
        var b3 = `<button class='btnRemoveConfig'>Eliminar</button>`;
        var b4 = `<button class='btnRenameConfig'>Renombrar</button>`;
        var $tr = $(`<tr data-key='${c}'><td class='configKey'>${c}</td><td>${b1} ${b2} ${b3} ${b4}</td></tr>`).appendTo($body);
        if (c == selectedKey) {
            $currTr = $tr;
            $currTr.addClass('viewedConfig');
            $("#configPreview").text(configs[c]);
        }
    }

    // Then we create event handlers
    function get$tr(btn) {
        var $btn = $(btn);
        return $btn.closest("tr")
    }
    $('.btnSeeConfig').on('click', function () {
        if ($currTr)
            $currTr.removeClass('viewedConfig');
        $currTr = get$tr(this);
        $currTr.addClass('viewedConfig');
        var key = $currTr.data('key');
        $("#configPreview").text(configs[key]);
    });
    $('.btnLoadConfig').on('click', function () {
        var key = get$tr(this).data('key');
        loadConfig(key, configs[key]);
    })
    $('.btnRemoveConfig').on('click', function () {
        var key = get$tr(this).data('key');
        if (confirm(`Quiere eliminar la entrada ${key}?`)) {
            if (key == currentConfigKey) {
                $("#configPreview").text("");
                currentConfigKey = null;
            }
            delete configs[key];
            setConfigs(configs);
            showConfigsOnRight(currentConfigKey);
        }
    })
    $('.btnRenameConfig').on('click', function () {
        var $btn = $(this);
        var $td = $btn.parent();
        var $tr = get$tr(this);
        var key = $tr.data('key');
        var $name = $("<input style='margin-left: 10px' type='text'>").appendTo($td);
        var $btnOk = $("<button disabled='disabled'>Ok</button>").appendTo($td);
        $name.on('input', function () {
            var exists = $name.val() in configs;
            $btnOk.prop("disabled", exists);
        })
        $btnOk.on("click", function () {
            var newKey = $name.val();
            if (!(newKey in configs)) {
                var config = configs[key];
                configs[newKey] = config;
                delete configs[key];
                setConfigs(configs);
                showConfigsOnRight(newKey);
                /*
                $tr.data('key', newKey);
                $btnOk.remove();
                $name.remove();
                */
            }
        });
    })
    $("#loadConfigRightPanel").show();
}
function onLoadDefaultConfig() {
    // Load config to partidos
    $("#partidos").val(configEjemplo);
    onTransformPartidos();
    onShowPartidosOnRight();
}
/** Actions on loading a config */
function loadConfig(key, config) {
    // Load config to partidos
    $("#partidos").val(config);
    setCurrentKey(key);
    // Enable button "Save"
    $("#btnShowSaveConfig").show();
    onTransformPartidos();
    onShowPartidosOnRight();
}
function setCurrentKey(key) {
    currentConfigKey = key;
    // Show current key
    $("#currentConfigKey").text(`Configuración: ${key}`);
}
function onShowPartidosOnRight() {
    $("#rightPanel").children().hide();
    $("#partidosRightPanel").show();
}
function onShowSaveConfigAsOnRight() {
    $("#rightPanel").children().hide();
    $("#saveConfigAsRightPanel").show();
}
function onSaveSaveConfigAs() {
    var key = $("#txtConfigNameSaveConfigAs").val();
    var configs = getConfigs();
    if (key in configs) {
        if (!confirm(`La clave ${key} ya existe.  Quiere utilizarla?`)) {
            return;
        }
    }
    configs[key] = $("#partidos").val();
    setConfigs(configs);
    setCurrentKey(key);
}
function onSaveSaveConfig() {
    var configs = getConfigs();
    configs[currentConfigKey] = $("#partidos").val();
    setConfigs(configs);
}
function getConfigs() {
    var configs = JSON.parse(localStorage.getItem("configs"));
    if (configs == null) configs = {};
    return configs;
}
function setConfigs(configs) {
    localStorage.setItem("configs", JSON.stringify(configs));
}
function onShowHelp() {
    $("#rightPanel").children().hide();
    $("#helpRightPanel").show();
}
function onDownloadConfigs() {
    // const json = { numberProp: 1, stringProp: "hello world" };
    // const data = JSON.stringify(json);
    const data = localStorage.getItem("configs");
    // Pass the string to a Blob and turn it
    // into an ObjectURL
    const blob = new Blob([data], { type: "application/json" });
    const jsonObjectUrl = URL.createObjectURL(blob);

    // Create an anchor element, set it's
    // href to be the Object URL we have created
    // and set the download property to be the file name
    // we want to set
    const filename = "configuraciones_partidos_leizaran.json";
    const anchorEl = document.createElement("a");
    anchorEl.href = jsonObjectUrl;
    anchorEl.download = filename;

    // There is no need to actually attach the DOM
    // element but we do need to click on it
    anchorEl.click();

    // We don't want to keep a reference to the file
    // any longer so we release it manually
    URL.revokeObjectURL(jsonObjectUrl);
}
function onUploadConfigs() {
    $("#uploadConfigs").show();
    var filesElem = document.getElementById('files');
    filesElem.addEventListener('change', handleFileSelecting, false);
}
function onCancelUploadConfigs() {
    $("#uploadConfigs").hide()
}
function handleFileSelecting(evt) {
    var files = evt.target.files; // FileList object
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();
        reader.onload = (function (theFile) {
            return function (e) {
                var content = e.target.result;
                if (content) {
                    readConfigs(content);
                }
            };
        })(f);

        reader.readAsText(f);
    }
}
function readConfigs(content) {
    const data = JSON.parse(content);
    const keys = Object.keys(data);
    alert("Las claves son\n- " + keys.join("\n- "));
}
$(document).ready(function () {
    frame = document.getElementById("pp");
    window.addEventListener("message", onMSG);
    $("#btnSlide").on("click", slide);
    $("#btnTransformPartidos").on("click", onTransformPartidos);
    $("#btnPostScript").on('click', runScript);
    $("#btnShowLoadConfig").on('click', onShowConfigsOnRight);
    $("#btnCancelLoadConfig").on('click', onShowPartidosOnRight);
    $("#btnShowSaveConfigAs").on('click', onShowSaveConfigAsOnRight);
    $("#btnCancelSaveConfigAs").on('click', onShowPartidosOnRight);
    $("#btnSaveSaveConfigAs").on('click', onSaveSaveConfigAs);
    $("#btnSaveSaveConfig").on('click', onSaveSaveConfig);
    $("#btnLoadDefaultLoadConfig").on('click', onLoadDefaultConfig);
    $("#btnShowHelp").on('click', onShowHelp);
    $("#btnCerrarHelp").on('click', onShowPartidosOnRight);
    $("#btnDownloadConfigs").on('click', onDownloadConfigs);
    $("#btnUploadConfigs").on('click', onUploadConfigs);
    $("#btnCancelUploadConfigs").on('click', onCancelUploadConfigs);

    makePantillas();
    slideDown();

    onTransformPartidos();

    // updatePlayground();
});


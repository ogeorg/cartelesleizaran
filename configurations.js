
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



function getConfigs() {
    var configs = JSON.parse(localStorage.getItem("configs"));
    if (configs == null) configs = {};
    return configs;
}
function setConfigs(configs) {
    localStorage.setItem("configs", JSON.stringify(configs));
}



/** Mostra el panel de configuraciones con la configuracion actual */
function onShowConfigsOnRight() {
    showConfigsOnRight(currentConfigKey);
}

/** Devuelve el TR que contiene el boton */
function get$tr(btn) {
    var $btn = $(btn);
    return $btn.closest("tr")
}


//////////////////////////////////////////////////
// PANEL CONFIG
//////////////////////////////////////////////////
const CLASS_BTN_SEE_CONFIG = 'btnSeeConfig';

/** Mostra una configuracion concreta.  Tambien se llama para refrescar el panel */
function showConfigsOnRight(selectedKey) {
    $("#rightPanel").children().hide();
    var configs = getConfigs();

    // First we create the table
    var $body = $("#configsList tbody");
    $body.empty();
    $("#configPreview").empty();

    var $currTr = null;
    for (var c of Object.keys(configs).sort()) {
        var b1 = `<button class='${CLASS_BTN_SEE_CONFIG}'>Ver</button>`;
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
    $(`.${CLASS_BTN_SEE_CONFIG}`).on('click', function () {
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
            }
        });
    })
    $("#loadConfigRightPanel").show();
    $("#btnLoadDefaultLoadConfig").on('click', onLoadDefaultConfig);
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

//////////////////////////////////////////////////
// UPLOAD / DOWNLOAD
//////////////////////////////////////////////////

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

//////////////////////////////////////////////////
// PANEL SAVE AS
//////////////////////////////////////////////////

function getSaveConfigAsRightPanel() {
    var $pnl = $("#saveConfigAsRightPanel");
    if ($pnl.length == 0) {
        $pnl = $("<div id='saveConfigAsRightPanel'>");
        $pnl.append("<h3>Guardar como...</h3>");
        // Show one input[text], and on save, checks whether
        // the name exists.  If it does not exist, saves.  If it
        // exists, put a message and if confirmed, saves 
        $pnl.append("<div><input id='txtConfigNameSaveConfigAs' type='text' name='configName' /></div>");
        var $btns = $("<div></div>");
        $(`<button id='btnSaveSaveConfigAs'>Guardar</button>`) //
            .on('click', onSaveSaveConfigAs) //
            .appendTo($btns);
        $(`<button id='btnCancelSaveConfigAs'>Cancel</button>`) //
            .on('click', onShowPartidosOnRight) //
            .appendTo($btns);
        $pnl.append(btns);
        $('#rightPanel').append($pnl);
    }
    return $pnl;
}
function onShowSaveConfigAsOnRight() {
    $("#rightPanel").children().hide();
    getSaveConfigAsRightPanel().show();
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

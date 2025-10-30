
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



//////////////////////////////////////////////////
// UPLOAD / DOWNLOAD
//////////////////////////////////////////////////

const BASE_URL = "https://8080-cs-1060876045999-default.cs-europe-west1-xedi.cloudshell.dev"

function ConfigPersistor() {
    var persistor = new Persistor();

    /**
     * Guarda todas las configuraciones en localStorage
     * @param {*} configs 
     */
    this.storeConfigs = function (configs) {
        localStorage.setItem("configs", JSON.stringify(configs));
    }

    this.saveConfig = function (clave, config, onSuccess) {
        $.ajax({
            url: 'jornada/' + clave,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ text: config }),
            dataType: 'json',
            success: function (response) {
                console.log('Save successful:', response);
                onSuccess();
            },
            error: function (xhr, status, error) {
                console.error('Save failed:', status, error);
            }
        });

    }
    this.loadConfigs = function () {
        var configs = JSON.parse(localStorage.getItem("configs"));
        if (configs == null) configs = {};
        return configs;
    }
    /**
     * Devuelve una promesa de jornadas
     * @returns 
     */
    this.getConfigurations = function () {
        return $.ajax({
            url: 'jornadas',
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            success: function (response) {
                var configs = response; // JSON.parse(response);
                if (configs == null) configs = {};
                return configs;
            },
            error: function (xhr, status, error) {
                console.error('Get failed:', status, error);
            }
        });
    }
    this.download = function () {
        persistor.download("configs", "configuraciones_partidos_leizaran.json");
    }
    this.deleteConfig = function (clave, onSuccess) {
        $.ajax({
            url: 'jornada/' + clave,
            type: 'DELETE',
            contentType: 'application/json',
            dataType: 'json',
            success: function (response) {
                console.log('Delete successful:', response);
                onSuccess();
            },
            error: function (xhr, status, error) {
                console.error('Save failed:', status, error);
            }
        });
    }
    this.renameConfig = function (oldKey, newKey, onSuccess) {
        $.ajax({
            url: 'jornada/' + oldKey + '/rename',
            type: 'POST',
            contentType: 'application/json',
            data: { newkey: newKey },
            dataType: 'json',
            success: function (response) {
                console.log('Rename successful:', response);
                onSuccess();
            },
            error: function (xhr, status, error) {
                console.error('Save failed:', status, error);
            }
        });
    };
    this.uploadConfigs = function (onSuccess) {
        persistor.getUploadDialog(function (content) {
            const data = JSON.parse(content);
            onSuccess(data);
        });
    }
}
var configsPersistor = new ConfigPersistor();



//////////////////////////////////////////////////
// PANEL CONFIG
//////////////////////////////////////////////////




function ConfigurationsService() {
    const CLASS_BTN_SEE_CONFIG = 'btnSeeConfig';


    function _setCurrentKey(key) {
        currentConfigKey = key;
        // Show current key
    }
    this.setCurrentKey = function (key) {
        _setCurrentKey(key);
    }

    this.saveCurrentConfig = function (config) {
        if (!currentConfigKey) {
            saveConfigAsService.saveAs();
        }
        else {
            configs[currentConfigKey] = config;
            configsPersistor.storeConfigs(configs);
            configsPersistor.saveConfig(currentConfigKey, config);
        }
    }
    this.deleteConfig = function (clave, onSuccess) {
        // una vez eliminado en datastore, elimina aquí
        configsPersistor.deleteConfig(key, function () {
            delete configs[key];
            onSuccess();
        });
    };
    this.renameConfig = function (oldKey, newKey, onSuccess) {
        if (!(newKey in configs)) {
            configsPersistor.renameConfig(oldKey, newKey, function () {
                var config = configs[oldKey];
                configs[newKey] = config;
                delete configs[key];
                onSuccess();
            });
        }
    };
    this.downloadAll = function () {
        configsPersistor.download();
    }
    this.uploadConfigs = function (onSuccess) {
        configsPersistor.uploadConfigs(function (data) {
            // cargamos todas las configuraciones
            for (key in data) {
                configs[key] = data[key];
            }
            onSuccess();
        });
    };
    this.getConfigurations = function() {
        return configs;
    }
    this.getConfiguration = function (key) {
        return configs[key];
    }
    this.init = async function () {
        configsPersistor.getConfigurations().then(function (data) {
            configs = data;
        });
    }

    var currentConfigKey = null;
    var configs;
}

function ConfigurationsUI(configurationsService) {
    /** Crea el panel si no existe */
    function get$ConfigurationPanel() {
        if (!$pnl) {
            $pnl = $("<div id='configurations-panel' style='display: none;'>");
            $pnl.append("<h2>Configuraciones</h2>");
            make$Botonera().appendTo($pnl);

            $pnl.append(`<table id="configsList"><thead><tr><th>Clave</th><th>Acciones</th></tr></thead><tbody></tbody></table>`);

            $(`<pre id="configPreview"></pre>`).appendTo($pnl);
            $('#right_panel').append($pnl);
        }
        return $pnl;
    }

    function make$Botonera() {
        var $btns = $("<div class='buttonbox'></div>")
        $(`<button id="btnLoadDefaultLoadConfig">Cargar ejemplo</button>`) //
            .on('click', onLoadDefaultConfig) //
            .appendTo($btns);
        $(`<button id="btnMakeNextConfig">Crear jornada</button>`) //
            .on('click', onMakeNextConfig) //
            .appendTo($btns);
        $(`<button id="btnDownloadConfigs">Descargar todo</button>`) //
            .on('click', onDownload) //
            .appendTo($btns);
        $(`<button id="btnUploadConfigs">Cargar un fichero</button>`) //
            .on('click', onUpload) //
            .appendTo($btns);
        $(`<button id="btnCancelLoadConfig">Cancel</button>`) //
            .on('click', () => tableView.showPartidosOnRight()) //
            .appendTo($btns);
        return $btns;
    }

    function onDownload() {
        configurationsService.downloadAll();
    }
    function onUpload() {
        configurationsService.uploadConfig(function () {
            updateTable();
        });
    }
    function onLoadDefaultConfig() {
        editorService.setContent(undefined, configEjemplo);
    }
    /** Recrea la tabla, con una configuracion seleccionada opcional */
    function updateTable(selectedKey) {
        // First we create the table
        var $body = $("#configsList tbody");
        $body.empty();
        $("#configPreview").empty();

        var configs = configurationsService.getConfigurations();
        for (var c of Object.keys(configs).sort()) {
            var b1 = `<button class='btnSeeConfig'>Ver</button>`;
            var b2 = `<button class='btnLoadConfig'>Cargar</button>`;
            var b3 = `<button class='btnRemoveConfig'>Eliminar</button>`;
            var b4 = `<button class='btnRenameConfig'>Renombrar</button>`;
            var $tr = $(`<tr data-key='${c}'><td class='configKey'>${c}</td><td class='buttonbox'>${b1}${b2}${b3}${b4}</td></tr>`).appendTo($body);
            if (c == selectedKey) {
                $currTr = $tr;
                $currTr.addClass('viewedConfig');
                $("#configPreview").text(configs[c]);
            }
        }

        // Then we create event handlers
        $(`.btnSeeConfig`).on('click', onPreviewConfig);
        $('.btnLoadConfig').on('click', onLoadConfig);
        $('.btnRemoveConfig').on('click', onDeleteConfig);
        $('.btnRenameConfig').on('click', onRenameConfig);
    }


    /** Devuelve el TR que contiene el boton */
    function get$tr(btn) {
        var $btn = $(btn);
        return $btn.closest("tr")
    }

    /** Preview de una configuraion */
    function onPreviewConfig() {
        if ($currTr)
            $currTr.removeClass('viewedConfig');
        $currTr = get$tr(this);
        $currTr.addClass('viewedConfig');
        var key = $currTr.data('key');
        var config = configurationsService.getConfiguration(key);
        $("#configPreview").text(config);
    }

    function onLoadConfig() {
        var key = get$tr(this).data('key');
        var config = configurationsService.getConfiguration(key);
        // editorUI.loadConfig(key), que pregunta a configurationService.
        editorService.setContent(key, config);
        _setCurrentKey(key);
    }

    function onRenameConfig() {
        var $btn = $(this);
        var $td = $btn.parent();
        var $tr = get$tr(this);
        var key = $tr.data('key');
        var $name = $("<input style='margin-left: 10px' type='text'>").appendTo($td);
        var $btnOk = $("<button disabled='disabled'>Ok</button>").appendTo($td);
        $name.on('input', function () {
            var exists = $name.val() in configurationsService.getConfigurations();
            $btnOk.prop("disabled", exists);
        })
        $btnOk.on("click", function () {
            var newKey = $name.val();
            configurationsService.renameConfig(key, newKey, function () {
                updateTable(newKey);
            });
        });
    }

    function onDeleteConfig() {
        var key = get$tr(this).data('key');
        if (confirm(`Quiere eliminar la entrada ${key}?`)) {
            if (key == currentConfigKey) {
                $("#configPreview").text("");
                currentConfigKey = null;
            }
            configurationsService.deleteConfig(key, function () {
                showConfigsOnRight(currentConfigKey);
            });
        }
    }
    /** Mostra una configuracion concreta.  Tambien se llama para refrescar el panel */
    this.showConfigsOnRight = function (selectedKey) {
        $("#right_panel").children().hide();
        updateTable(configurationsService.getConfigurations(), selectedKey);
        $pnl.show();
    }

    function onMakeNextConfig() {
        var partidosByCat = {};
        for (var c in CATEGORIAS) {
            partidosByCat[c] = [];
        }

        var date = new Date();
        // proximo sabado
        date.setDate(date.getDate() + 6 - date.getDay());
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var fechaJornada = `${y} / ${m} / ${d}`;
        var fechaPartido = `${MESES[m][2].toUpperCase()} ${d}, hh:mm`;

        for (var e in EQUIPOS) {
            var cat = e.substring(0, 3);
            var sex = e.substring(4, 7);
            var partido = `${SEXOS[sex]} ; ${fechaPartido} ; $$LUGAR$$ ; ${EQUIPOS[e].name}; $$ADVERSARIO$$ ;`;
            partidosByCat[cat].push(partido);
        }

        var config = `[Fecha]\n${fechaJornada}`;
        for (var c in partidosByCat) {
            config += `\n[${CATEGORIAS[c]}]\n`;
            var partidos = partidosByCat[c];
            for (var partido of partidos) {
                config += partido + '\n';
            }
        }
        editorService.setContent(undefined, config);
    }
    this.init = async function () {
        await configurationsService.init();
        $pnl = get$ConfigurationPanel();
    }

    var $currTr = null;
    var $pnl;
}

const configurationsService = new ConfigurationsService();
const configurationsUI = new ConfigurationsUI(configurationsService);

//////////////////////////////////////////////////
// PANEL SAVE AS
//////////////////////////////////////////////////

function SaveConfigAsService() {

    function getDialog() {

        $dlg = $(`<div id="saveAsDialog" title="Guardar la configuración"></div>`);
        $dlg //
            .append(`<div>Nombre de la configuración</div>`) //
            .append(`<input type="text" id="txtConfigNameSaveConfigAs" />`) //
            .dialog({
                autoOpen: false,
                buttons: {
                    "OK": function () {
                        var key = $("#txtConfigNameSaveConfigAs").val();
                        var config = $("#partidos").val();
                        configsPersistor.saveConfig(key, config, function () {
                            editorService.setCurrentKey(key);
                            $dlg.dialog("close");
                        });
                    },
                    "Cancel": function () {
                        $dlg.dialog("close");
                    }
                }
            });
        return $dlg;
    }
    this.saveAs = function () {
        $dlg = getDialog();
        $dlg.dialog("open");
    }

    this.init = function () {
        // $pnl = get$Panel();
    }
    var $dlg;
}
saveConfigAsService = new SaveConfigAsService();

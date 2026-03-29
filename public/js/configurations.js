
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

    this.saveConfig = async function (clave, config) {
        try {
            const response = await $.ajax({
                url: 'jornadas/' + clave,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(config),
                dataType: 'json',
            });
            console.log('Save successful:', response);
        } catch (jqXHR) {
            console.error('Save failed:', jqXHR.statusText, jqXHR.status, jqXHR);
        }
    }

    /**
     * Devuelve una promesa de jornadas
     * @returns 
     */
    this.fetchConfigurations = async function () {
        try {
            var configs = await $.ajax({
                url: 'jornadas',
                type: 'GET',
                contentType: 'application/json',
                dataType: 'json',
            });
            if (configs == null) configs = {};
            return configs;
        } catch (error) {
            console.error('Get failed:', error);
        }
    }
    this.download = function () {
        persistor.download("jornadas", "configuraciones_partidos_leizaran.json");
    }
    this.deleteConfig = function (clave) {
        return $.ajax({
            url: 'jornadas/' + clave,
            type: 'DELETE',
            contentType: 'application/json',
            dataType: 'json',
            ok: function (response) {
                console.log('Delete successful:', response);
            },
            error: function (xhr, status, error) {
                console.error('Save failed:', status, error);
            }
        });
    }

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

// una configuracion tiene
// una clave key
// un nombre name \___ forma la config
// un texto  data /
// cuando se crea, se le da una clave 'key' fija


function ConfigurationsService() {
    const CLASS_BTN_SEE_CONFIG = 'btnSeeConfig';


    function _setCurrentKey(key) {
        currentConfigKey = key;
        // Show current key
    }
    this.setCurrentKey = function (key) {
        _setCurrentKey(key);
    }
    this.getCurrentKey = function () {
        return currentConfigKey;
    }
    this.deleteConfig = function (key, onSuccess) {
        // una vez eliminado en datastore, elimina aquí
        configsPersistor.deleteConfig(key).then(function () {
            delete configs[key];
            onSuccess(); // para que la UI haga lo suyo
        });
    };
    this.renameConfig = async function (key, newName, onSuccess) {
        if (key in configs) {
            var config = configs[key];
            config.name = newName;
            await configsPersistor.saveConfig(key, config);
            onSuccess(); // para que la UI cambie el nombre
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
    this.getConfigurations = function () {
        return configs;
    }
    this.getConfiguration = function (key) {
        return configs[key];
    }
    this.addConfiguration = function (config) {
        var key = crypto.randomUUID().substring(0, 8);
        configs[key] = config;
        return key;
    }
    this.init = async function () {
        configs = await configsPersistor.fetchConfigurations();
        broadcaster //
            .register(this, ['config-selected'], function (event) {
                currentConfigKey = event.key;
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
            $pnl //
                .append("<h2>Jornadas</h2>") //
                .append(make$Botonera()) //
                .append(`<table id="configsList"><thead><tr><th>Clave</th><th>Acciones</th></tr></thead><tbody></tbody></table>`) //                
                .append($(`<div id='configNamePreview' style='margin-top: 10px'></div><pre id="configPreview"></pre>`)) //
                .appendTo($('#right_panel'));
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
    /** Recrea la tabla, con una configuracion seleccionada opcional */
    function updateTable() {
        // First we create the table
        var $body = $("#configsList tbody");
        $body.empty();
        $("#configPreview").empty();

        var configs = configurationsService.getConfigurations();
        var currentKey = configurationsService.getCurrentKey();
        for (var key of Object.keys(configs).sort((a, b) => configs[b].name.localeCompare(configs[a].name))) {
            var name = configs[key].name;
            var b1 = `<button class='btnSeeConfig'>Ver</button>`;
            var b2 = `<button class='btnLoadConfig'>Cargar</button>`;
            var b3 = `<button class='btnRemoveConfig'>Eliminar</button>`;
            var b4 = `<button class='btnRenameConfig'>Renombrar</button>`;
            var $tr = $(`<tr data-key='${key}'><td class='configKey'>${name}</td><td class='buttonbox'>${b1}${b2}${b3}${b4}</td></tr>`).appendTo($body);
            if (key == currentKey) {
                $currTr = $tr;
                $currTr.addClass('viewedConfig');
                // $("#configPreview").text(configs[key].data);
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
        $currTr = get$tr(this);
        var key = $currTr.data('key');
        var config = configurationsService.getConfiguration(key);

        $("#configNamePreview").text(config.name);
        $("#configPreview").text(config.data);
    }

    function onLoadConfig() {
        var key = get$tr(this).data('key');
        broadcaster.broadcast('config-selected', { key, config: configurationsService.getConfiguration(key) });
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
            var name = $name.val();
            configurationsService.renameConfig(key, name, function () {
                updateTable();
                broadcaster.broadcast('config-name-changed', { key, config: { name } });
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
                updateTable();
            });
        }
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

        var data = `[Fecha]\n${fechaJornada}`;
        for (var c in partidosByCat) {
            data += `\n[${CATEGORIAS[c]}]\n`;
            var partidos = partidosByCat[c];
            for (var partido of partidos) {
                data += partido + '\n';
            }
        }
        var config = { name: "noname", data };
        var key = configurationsService.addConfiguration(config);
        broadcaster.broadcast('config-selected', { key, config });
    }

    function onLoadDefaultConfig() {
        var config = { name: null, data: configEjemplo };
        broadcaster.broadcast('config-selected', { key: null, config });
    }

    this.init = async function () {
        await configurationsService.init();
        $pnl = get$ConfigurationPanel();
        broadcaster //
            .register(this, ['config-selected'], function (event) {
                var selectedKey = event.key;
                updateTable(selectedKey);
            }) //
            .register(this, ['show-right-panel'], function (event) {
                if (event.panel == 'configs') {
                    updateTable();
                    $pnl.show();
                } else {
                    $pnl.hide();
                }
            });
    }

    var $currTr = null;
    var $pnl;
}

const configurationsService = new ConfigurationsService();
const configurationsUI = new ConfigurationsUI(configurationsService);


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

function ConfigPersistor() {
    var persistor = new Persistor();
    this.storeConfigs = function (configs) {
        localStorage.setItem("configs", JSON.stringify(configs));
    }
    this.loadConfigs = function () {
        var configs = JSON.parse(localStorage.getItem("configs"));
        if (configs == null) configs = {};
        return configs;
    }
    this.download = function () {
        persistor.download("configs", "configuraciones_partidos_leizaran.json");
    }
    this.upload = function (parseFile) {
        $dlg = persistor.getUploadDialog(parseFile);
        $dlg.dialog("open");
    }
}
var configsPersistor = new ConfigPersistor();



//////////////////////////////////////////////////
// PANEL CONFIG
//////////////////////////////////////////////////




function ConfigurationsService() {
    const CLASS_BTN_SEE_CONFIG = 'btnSeeConfig';

    function parseFile(content) {
        const data = JSON.parse(content);
        for (key in data) {
            configs[key] = data[key];
        }
        configsPersistor.storeConfigs(configs);
        updateTable()
    }

    function get$ConfigurationPanel() {
        if (!$pnl) {
            $pnl = $("<div id='dataSourcesPanel'>");
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
            .on('click', function () { configsPersistor.download(); }) //
            .appendTo($btns);
        $(`<button id="btnUploadConfigs">Cargar un fichero</button>`) //
            .on('click', function () { configsPersistor.upload(parseFile); }) //
            .appendTo($btns);
        $(`<button id="btnCancelLoadConfig">Cancel</button>`) //
            .on('click', () => tableView.showPartidosOnRight()) //
            .appendTo($btns);
        return $btns;
    }
    function updateTable(selectedKey) {
        // First we create the table
        var $body = $("#configsList tbody");
        $body.empty();
        $("#configPreview").empty();

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
        $(`.btnSeeConfig`).on('click', onSeeConfig);
        $('.btnLoadConfig').on('click', onLoadConfig);
        $('.btnRemoveConfig').on('click', onRemoveConfig);
        $('.btnRenameConfig').on('click', onRenameConfig);
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

    function onLoadDefaultConfig() {
        editorService.setContent(undefined, configEjemplo);
    }

    /** Devuelve el TR que contiene el boton */
    function get$tr(btn) {
        var $btn = $(btn);
        return $btn.closest("tr")
    }
    function onSeeConfig() {
        if ($currTr)
            $currTr.removeClass('viewedConfig');
        $currTr = get$tr(this);
        $currTr.addClass('viewedConfig');
        var key = $currTr.data('key');
        var config = configs[key];
        $("#configPreview").text(config);
    }
    function onLoadConfig() {
        var key = get$tr(this).data('key');
        editorService.setContent(key, configs[key]);
        _setCurrentKey(key);
    }
    function _setCurrentKey(key) {
        currentConfigKey = key;
        // Show current key
    }
    this.setCurrentKey = function (key) {
        _setCurrentKey(key);
    }

    function onRemoveConfig() {
        var key = get$tr(this).data('key');
        if (confirm(`Quiere eliminar la entrada ${key}?`)) {
            if (key == currentConfigKey) {
                $("#configPreview").text("");
                currentConfigKey = null;
            }
            delete configs[key];
            configsPersistor.storeConfigs(configs);
            self.showConfigsOnRight(currentConfigKey);
        }
    }
    function onRenameConfig() {
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
                configsPersistor.storeConfigs(configs);
                self.showConfigsOnRight(newKey);
            }
        });

    }
    /** Mostra una configuracion concreta.  Tambien se llama para refrescar el panel */
    this.showConfigsOnRight = function (selectedKey) {
        $("#right_panel").children().hide();
        updateTable(configs, selectedKey);
        $pnl.show();
    }
    this.saveCurrentConfig = function (config) {
        // configs = configsPersistor.loadConfigs();
        configs[currentConfigKey] = config;
        configsPersistor.storeConfigs(configs);
    }
    this.init = function () {
        $pnl = get$ConfigurationPanel();
        configs = configsPersistor.loadConfigs();
    }
    var self = this;
    var currentConfigKey = null;
    var $currTr = null;
    var $pnl;
    var configs;
}
const configurationsService = new ConfigurationsService();

//////////////////////////////////////////////////
// PANEL SAVE AS
//////////////////////////////////////////////////

function SaveConfigAsService() {
    function get$Panel() {
        var $pnl = $("#saveConfigAsRightPanel");
        if ($pnl.length == 0) {
            $pnl = $("<div id='saveConfigAsRightPanel'>");
            $pnl.append("<h2>Guardar como...</h2>");
            // Show one input[text], and on save, checks whether
            // the name exists.  If it does not exist, saves.  If it
            // exists, put a message and if confirmed, saves 
            $pnl.append("<div><input id='txtConfigNameSaveConfigAs' type='text' name='configName' /></div>");
            $pnl.append(make$Botonera());
            $('#right_panel').append($pnl);
        }
        return $pnl;
    }

    function make$Botonera() {
        var $btns = $("<div class='buttonbox'></div>");
        $(`<button id='btnSaveSaveConfigAs'>Guardar</button>`) //
            .on('click', onSaveSaveConfigAs) //
            .appendTo($btns);
        $(`<button id='btnCancelSaveConfigAs'>Cancel</button>`) //
            .on('click', () => tableView.showPartidosOnRight()) //
            .appendTo($btns);
        return $btns;
    }
    function onSaveSaveConfigAs() {
        var key = $("#txtConfigNameSaveConfigAs").val();
        var configs = configsPersistor.loadConfigs();
        if (key in configs) {
            if (!confirm(`La clave ${key} ya existe.  Quiere utilizarla?`)) {
                return;
            }
        }
        configs[key] = $("#partidos").val();
        configsPersistor.storeConfigs(configs);
        configurationsService.setCurrentKey(key);
    }

    this.showPanel = function () {
        $("#right_panel").children().hide();
        $pnl.show();
    }
    this.init = function () {
        $pnl = get$Panel();
    }
    var $pnl;
}
saveConfigAsService = new SaveConfigAsService();

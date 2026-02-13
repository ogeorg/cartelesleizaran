
const PARAMS_NOT2SCRIPT = ['$$useDefault$$', 'code'];

function ParametersService() {
    const PARAM_DEFINITIONS = {
        offsettop: { dflt: "350", title: "Espacio encima" },
        offsetright: { dflt: "130", title: "Espacio a al derecha" },
        code: { dflt: "", title: "Codigo", type: 'textarea' },
    }
    const PLANTILLA_DFLT_KEY = '$$default$$';
    const PLANTILLA_DFLT_NAME = 'Valores por defecto';
    const PARAMS_SEL_PLANTILLAS_ID = 'params-selPlantillas';
    const PARAMS_CHK_USE_DFLT_ID = 'params-useDefault';
    const PARAMS_DIV_USE_DFLT_ID = 'params-divUseDflt';
    const PARAMS_USE_DFLT_KEY = '$$useDefault$$'
    const PARAMS_LIST_PARAMS = 'params-list';

    function $makeSelectPlantillasParams() {
        var options = `<option value='${PLANTILLA_DFLT_KEY}'>${PLANTILLA_DFLT_NAME}</option>`;
        for (var pl in PLANTILLAS) {
            options += `<option value='${pl}'>${PLANTILLAS[pl].title}</option>`;
        }
        var $sel = $(`<select id='${PARAMS_SEL_PLANTILLAS_ID}'>${options}</select>`);
        return $sel;
    }
    function getSelectedPlantillasParamsKey() {
        return $(`#${PARAMS_SEL_PLANTILLAS_ID}`).val();
    }
    function changePlantillaParams(pl) {
        if (pl == PLANTILLA_DFLT_KEY)
            $(`#${PARAMS_DIV_USE_DFLT_ID}`).hide();
        else
            $(`#${PARAMS_DIV_USE_DFLT_ID}`).show();
        initParamsPanel();
    }

    function whenCheckboxParamsUseDefault(checked) {
        if (checked)
            $(`#${PARAMS_LIST_PARAMS}`).hide();
        else
            $(`#${PARAMS_LIST_PARAMS}`).show();
    }

    var initParamsPanel = function () {
        var paramsKey = getSelectedPlantillasParamsKey();
        var params = paramsSets[paramsKey] ?? {};

        var useDefault = params[PARAMS_USE_DFLT_KEY] ?? false;
        $(`#${PARAMS_CHK_USE_DFLT_ID}`).prop('checked', useDefault);
        whenCheckboxParamsUseDefault(useDefault);

        $(`#${PARAMS_LIST_PARAMS} div[data-param]`).each(function () {
            var $this = $(this);
            var param = $this.data('param');
            var title = $this.data('title');
            var dflt = $this.data('default');
            var value = params[param] ?? dflt;
            $this.empty();
            var param_def = PARAM_DEFINITIONS[param];
            if (param_def.type == 'textarea') {
                $this.append(`<div>${title}</div>`);
                // $(`<textarea is="highlighted-code" data-param='${param}' style='width: 100%; box-sizing: border-box;' rows='10'></textarea>`) //
                // .val(value);
                $(`<div data-param='${param}' id='paramseditor'></div>`)
                    .appendTo($this);
                let editor = window.ace.edit("paramseditor");
                editor.setTheme("ace/theme/monokai");
                editor.session.setMode("ace/mode/javascript");
                editor.setValue(value);
            } else {
                $this.append(`<div style='display: inline-block; width: 200px'>${title}</div>`);
                $this.append(`<input data-param='${param}' data-value='${value}' type='text' value='${value}'/> (${param} = ${value})`);
            }
        })
    }

    function onUndoParamChange() {
        $(`#${PARAMS_LIST_PARAMS} input[data-param]`).each(function () {
            var $this = $(this);
            var value = $this.data('value');
            $this.val(value);
        })
    }

    function onSaveScriptParamsOnRight() {
        var params = {};
        params[PARAMS_USE_DFLT_KEY] = $(`#${PARAMS_CHK_USE_DFLT_ID}`).is(':checked');
        $(`#${PARAMS_LIST_PARAMS}`)
            .find('input[data-param], textarea[data-param]')
            .each(function () {
                var $this = $(this);
                var param = $this.data('param');
                var value = $this.val();
                params[param] = value;
            });
        var paramsKey = getSelectedPlantillasParamsKey();
        paramsPersistor.saveParamsSet(paramsKey, params) //
            .then(function () {
                paramsSets[paramsKey] = params;
                initParamsPanel();
            });
    }
    function make$Botonera() {
        var $btns = $("<div class='buttonbox'></div>");
        $(`<button id='btnSaveParams'>Guardar</button>`) //
            .on('click', onSaveScriptParamsOnRight) //
            .appendTo($btns);
        $(`<button id='btnUndoParamsChange'>Desahcer cambios</button>`) //
            .on('click', onUndoParamChange) //
            .appendTo($btns);
        return $btns;
    }
    var get$ParametersPanel = function () {
        if (!$pnl) {
            $pnl = $("<div id='paramsRightPanel'>").appendTo($('#right_panel'));

            // Titulo
            $pnl.append("<h2>Parametros</h2>");
            $pnl.append(make$Botonera());

            var $divPlant = $(`<div></div>`).appendTo($pnl);

            var $pPlant = $("<p>Panel de parametros para </p>").appendTo($pnl);
            $makeSelectPlantillasParams() //
                .appendTo($pPlant) //
                .on('change', (e) => changePlantillaParams(e.target.value));

            var $divUseDflt = $(`<div id='${PARAMS_DIV_USE_DFLT_ID}'></div>`).appendTo($pnl);
            $(`<input type='checkbox' id='${PARAMS_CHK_USE_DFLT_ID}'>`) //
                .on('change', function () { whenCheckboxParamsUseDefault(this.checked); }) //
                .appendTo($divUseDflt);
            $divUseDflt.append(" Usar los valores por defecto");

            // Lista de parametros
            var $list = $(`<p id='${PARAMS_LIST_PARAMS}'></p>`).appendTo($pnl);
            for (var p in PARAM_DEFINITIONS) {
                $(`<div data-param="${p}" data-default="${PARAM_DEFINITIONS[p].dflt}" data-title="${PARAM_DEFINITIONS[p].title}"></div>`) //
                    .appendTo($list);
            }

            // Botones
            changePlantillaParams(PLANTILLA_DFLT_KEY);
        }
        return $pnl;
    }
    this.getParams = function (paramsKey) {
        return paramsSets[paramsKey] ?? {};
    }

    this.getParamsAsStr = function (plantilla) {
        var params = paramsSets[plantilla];
        var res = [];
        for (var p in params) {
            if (PARAMS_NOT2SCRIPT.includes(p))
                continue;
            res.push(`${p}: ${params[p]}`);
        }
        return '{' + res.join(', ') + '}';
    }

    function init() {
        paramsPersistor.getParamsSets() //
            .then(function (sets) {
                paramsSets = sets;
                broadcaster //
                    .register(this, ['show-right-panel'], function (event) {
                        var $pnl = get$ParametersPanel();
                        if (event.panel == 'params') {
                            $pnl.show();
                        } else {
                            $pnl.hide();
                        }
                    });
            });
    }

    broadcaster.register(this, ['ready'], function (event) {
        init();
    });
    var paramsSets;
    var $pnl;
}
const parametersService = new ParametersService();

function ParametersPersistor() {

    this.getParamsSets = async function () {
        try {
            return paramsSets = await $.ajax({
                url: 'paramssets',
                type: 'GET',
                contentType: 'application/json',
                dataType: 'json'
            }) ?? {};
        } catch (error) {
            console.error('Get failed:', error);
        }
    }

    this.saveParamsSet = async function (paramsKey, paramssets) {
        try {
            return await $.ajax({
                url: 'paramssets/' + paramsKey,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(paramssets),
                dataType: 'json'
            });
        } catch (error) {
            console.error('Get failed:', error);
        }
    }

}
var paramsPersistor = new ParametersPersistor();


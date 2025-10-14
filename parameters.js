const PARAM_DEFINITIONS = {
    offsettop: { dflt: "350", title: "Espacio encima" },
    offsetright: { dflt: "130", title: "Espacio a al derecha" },
    code: { dflt: "", title: "Codigo", type: 'textarea' },
}
const PARAMS_NOT2SCRIPT = ['__useDefault__', 'code'];

const PLANTILLA_DFLT_KEY = '__default__';
const PLANTILLA_DFLT_NAME = 'Valores por defecto';
const PARAMS_SEL_PLANTILLAS_ID = 'params-selPlantillas';
const PARAMS_CHK_USE_DFLT_ID = 'params-useDefault';
const PARAMS_DIV_USE_DFLT_ID = 'params-divUseDflt';
const PARAMS_USE_DFLT_KEY = '__useDefault__'
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
    var paramsPlantillaTitle = pl == PLANTILLA_DFLT_KEY ? PLANTILLA_DFLT_NAME : PLANTILLAS[pl].title;
    $("#paramsPlantillaTitle").text(paramsPlantillaTitle);
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
function getParametersPanel() {
    var $pnl = $("#paramsRightPanel");
    if ($pnl.length == 0) {
        var $pnl = $("<div id='paramsRightPanel'>").appendTo($('#right_panel'));

        // Titulo
        $pnl.append("<h2>Parametros</h2>");

        var $divPlant = $(`<div></div>`).appendTo($pnl);
        $divPlant.append("Plantilla: ");
        $makeSelectPlantillasParams() //
            .appendTo($divPlant) //
            .on('change', function () { changePlantillaParams(this.value); });

        $pnl.append("<p>Panel de parametros para <span style='font-style:italic' id='paramsPlantillaTitle'></span></p>");

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
        var $btns = $("<div class='buttonbox'></div>").appendTo($pnl);
        $(`<button id='btnSaveParams'>Guardar</button>`) //
            .on('click', onSaveScriptParamsOnRight) //
            .appendTo($btns);
        $(`<button id='btnUndoParamsChange'>Desahcer cambios</button>`) //
            .on('click', onUndoParamChange) //
            .appendTo($btns);
        $(`<button>Cerrar</button>`) //
            .on('click', onShowPartidosOnRight) //
            .appendTo($btns);

        changePlantillaParams(PLANTILLA_DFLT_KEY);
    }
    return $pnl;
}

function onShowScriptParamsOnRight() {
    $("#right_panel").children().hide();
    getParametersPanel().show();
    initParamsPanel();
}


function initParamsPanel() {
    var params = paramsPersistor.getParams(getSelectedPlantillasParamsKey());

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
            $(`<textarea data-param='${param}' style='width: 100%; box-sizing: border-box;' rows='10'></textarea>`) //
                .appendTo($this)
                .val(value);
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
    paramsPersistor.saveParams(getSelectedPlantillasParamsKey(), params);
    initParamsPanel();
}
function ParametersPersistor() {
    function loadAllParams() {
        return JSON.parse(localStorage.getItem("params")) ?? {};
    }
    this.getParams = function (paramsKey) {
        var allParams = loadAllParams();
        var params = allParams[paramsKey] ?? {};
        return params;
    }
    this.saveParams = function (paramsKey, params) {
        var allParams = loadAllParams();
        allParams[paramsKey] = params;
        localStorage.setItem("params", JSON.stringify(allParams));
    }
    this.getParamsAsStr = function (plantilla) {
        var params = this.getParams(plantilla);
        var res = [];
        for (var p in params) {
            if (PARAMS_NOT2SCRIPT.includes(p))
                continue;
            res.push(`${p}: ${params[p]}`);
        }
        return '{' + res.join(', ') + '}';
    }
}
var paramsPersistor = new ParametersPersistor();

function ParametersService() {

}
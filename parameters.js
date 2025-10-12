const PARAMS = {
    offsettop : { dflt: "350", title: "Espacio encima" },
    offsetright : { dflt: "130", title: "Espacio a al deecha" },
}
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
function onChangePlantillaParams() {
    changePlantillaParams(this.value);
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
function onChangeCheckboxParamsUseDefault() {
    whenCheckboxParamsUseDefault(this.checked);
}
function whenCheckboxParamsUseDefault(checked) {
    if (checked)
        $(`#${PARAMS_LIST_PARAMS}`).hide();
    else
        $(`#${PARAMS_LIST_PARAMS}`).show();
}
function getParametersPanel() 
{
    var $pnl = $("#paramsRightPanel");
    if ($pnl.length == 0) {
        var $pnl = $("<div id='paramsRightPanel'>").appendTo($('#rightPanel'));

        // Titulo
        $pnl.append("<h3>Parametros</h3>");

        var $divPlant = $(`<div></div>`).appendTo($pnl);
        $divPlant.append("Plantilla: ");
        $makeSelectPlantillasParams() //
            .appendTo($divPlant) //
            .on('change', onChangePlantillaParams);

        $pnl.append("<p>Panel de parametros para <span style='font-style:italic' id='paramsPlantillaTitle'></span></p>");

        var $divUseDflt =  $(`<div id='${PARAMS_DIV_USE_DFLT_ID}'></div>`).appendTo($pnl);
        $(`<input type='checkbox' id='${PARAMS_CHK_USE_DFLT_ID}'>`) //
            .on('change', onChangeCheckboxParamsUseDefault) //
            .appendTo($divUseDflt);
        $divUseDflt.append(" Usar los valores por defecto");

        // Lista de parametros
        var $list = $(`<p id='${PARAMS_LIST_PARAMS}'></p>`).appendTo($pnl);
        for(var p in PARAMS) {
            $(`<div data-param="${p}" data-default="${PARAMS[p].dflt}" data-title="${PARAMS[p].title}"></div>`) //
                .appendTo($list);
        }

        // Botones
        var $btns = $("<p></p>").appendTo($pnl);
        $(`<button id='btnSaveParams'>Guardar</button>`) //
            .on('click', onSaveScriptParamsOnRight) //
            .appendTo($btns);
        $("<span> </span>").appendTo($btns);
        $(`<button id='btnUndoParamsChange'>Desahcer cambios</button>`) //
            .on('click', onUndoParamChange) //
            .appendTo($btns);
        $("<span> </span>").appendTo($btns);
        $(`<button>Cerrar</button>`) //
            .on('click', onShowPartidosOnRight) //
            .appendTo($btns);

        changePlantillaParams(PLANTILLA_DFLT_KEY);
    }
    return $pnl;
}

function onShowScriptParamsOnRight() {
    $("#rightPanel").children().hide();
    getParametersPanel().show();
    initParamsPanel();
}

function onSaveScriptParamsOnRight() {
    var allParams = loadParams();
    var params = {};
    params[PARAMS_USE_DFLT_KEY] = $(`#${PARAMS_CHK_USE_DFLT_ID}`).is(':checked');
    $(`#${PARAMS_LIST_PARAMS} input`).each(function() {
        var $this = $(this);
        var param = $this.data('param');
        var value = $this.val();
        params[param] = value;
    });
    allParams[getSelectedPlantillasParamsKey()] = params;
    saveParams(allParams);
    initParamsPanel();
}
function loadParams() {
    var params = JSON.parse(localStorage.getItem("params"));
    if (params == null) params = {};
    return params;
}
function getParamsAsStr() {
    var res = [];
    $(`#${PARAMS_LIST_PARAMS} input[data-param]`).each(function() {
        var $this = $(this);
        var param = $this.data('param');
        var value = $this.val();
        res.push(`${param}: ${value}`);
    })
    return '{' + res.join(', ') + '}';
}
function saveParams(params) {
    localStorage.setItem("params", JSON.stringify(params));
}

function initParamsPanel() {
    var allParams = loadParams();
    var params = allParams[getSelectedPlantillasParamsKey()] ?? {};
    
    var useDefault = params[PARAMS_USE_DFLT_KEY] ?? false;
    $(`#${PARAMS_CHK_USE_DFLT_ID}`).prop('checked', useDefault);
    whenCheckboxParamsUseDefault(useDefault);

    $(`#${PARAMS_LIST_PARAMS} div[data-param]`).each(function() {
        var $this = $(this);
        var param = $this.data('param');
        var title = $this.data('title');
        var dflt =  $this.data('default');
        var value = params[param] ?? dflt;
        $this.empty();
        $this.append(`<div style='display: inline-block; width: 200px'>${title}<div>`);
        $this.append(`<input data-param='${param}' data-value='${value}' type='text' value='${value}'/> (${param} = ${value})`);
    })
} 

function onUndoParamChange() {
    $(`#${PARAMS_LIST_PARAMS} input[data-param]`).each(function() {
        var $this = $(this);
        var value = $this.data('value');
        $this.val(value);
    })
}

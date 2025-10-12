const PARAMS = {
    offsettop : { dflt: "350", title: "Espacio encima" },
    offsetright : { dflt: "130", title: "Espacio a al deecha" },
}

function getParametersPanel() 
{
    var $pnl = $("#paramsRightPanel");
    if ($pnl.length == 0) {
        var $pnl = $("<div id='paramsRightPanel'>");
        $pnl.append("<h3>Parametros</h3>");
        $pnl.append("<p>Panel de parametros</p>");

        var $list = $("<div id='paramsList'></div>").appendTo($pnl);
        for(var p in PARAMS) {
            $(`<div data-param="${p}" data-default="${PARAMS[p].dflt}" data-title="${PARAMS[p].title}"></div>`) //
                .appendTo($list);
        }
        var $btns = $("<div></div>").appendTo($pnl);
        $(`<button id='btnSaveParams'>Guardar</button>`) //
            .on('click', onSaveScriptParamsOnRight) //
            .appendTo($btns);
        $(`<button id='btnUndoParamsChange'>Desahcer cambios</button>`) //
            .on('click', onUndoParamChange) //
            .appendTo($btns);
        $(`<button>Cerrar</button>`) //
            .on('click', onShowPartidosOnRight) //
            .appendTo($btns);

        $('#rightPanel').append($pnl);
    }
    return $pnl;
}

function onShowScriptParamsOnRight() {
    $("#rightPanel").children().hide();
    getParametersPanel().show();
    initParamsPanel();
}

function onSaveScriptParamsOnRight() {
    var params = {};
    $("#paramsList input").each(function() {
        var $this = $(this);
        var param = $this.data('param');
        var value = $this.val();
        params[param] = value;
    });
    saveParams(params);
    initParamsPanel();
}
function loadParams() {
    var params = JSON.parse(localStorage.getItem("params"));
    if (params == null) params = {};
    return params;
}
function getParamsAsStr() {
    var res = [];
    $("#paramsList input[data-param]").each(function() {
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
    var params = loadParams();
    $("#paramsList div[data-param]").each(function() {
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
    $("#paramsList input[data-param]").each(function() {
        var $this = $(this);
        var value = $this.data('value');
        $this.val(value);
    })
}

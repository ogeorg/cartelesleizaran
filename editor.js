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
//    'car': ['Caratula', 'http://ogeorg.com/leizaran/plantilla_caratula.psd'],
//    'hor': ['Horarios', 'http://ogeorg.com/leizaran/plantilla_horarios.psd'],
    'car': ['Caratula', 'https://rawcdn.githack.com/ogeorg/cartelesleizaran/refs/heads/main/plantilla_caratula.psd'],
    'hor': ['Horarios', 'https://rawcdn.githack.com/ogeorg/cartelesleizaran/refs/heads/main/plantilla_horarios.psd'],
//    't_1': ['(t)Neon', 'https://raw.githubusercontent.com/ogeorg/cartelesleizaran/d250cd62b7e0f8acfb6387e330d57832b8ae2bed/test_neon.psd'],
//    't_2': ['(t)SawSign', 'https://raw.githubusercontent.com/ogeorg/cartelesleizaran/d250cd62b7e0f8acfb6387e330d57832b8ae2bed/test_sawsign.psd'],
//    ['lag', 'Amistoso', 'http://ogeorg.com/leizaran/plantilla_amistoso.psd'],
};

/**
 * Parsea el texto de datos de partidos y crea un DOM
 * 
 * @param {*} txtPartidos 
 * @returns 
 */
function parsePartidos(txtPartidos) {
    var dom = {}
    function NullState() {
        this.produce = function () { }
    }
    function FechaHeaderState() {
        this.fecha = {};
        dom.fecha = this.fecha;
        this.produce = function () {
        }
    }
    function InFechaState(prevstate, line) {
        this.fecha = prevstate.fecha;
        this.produce = function () {
            if (!line)
                return;
            var items = line.split("/");
            var mes = items[1].trim();
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
            this.categoria.partidos.push(partido);
        }
    }
    function nextState(prevstate, line) {
        line = line.trim();
        if (!line)
            return prevstate;
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
        $partidosTabla.append(`<h3><input class='cb-category' type='checkbox' name='${categoria.titulo.toLowerCase()}' /> ${categoria.titulo}</h3>`);
        var head = `<tr><th>N/M</th><th>Hora</th><th>Lugar</th><th>Equipos</th></tr>`;
        var $tabla = $(`<table border='1' style='width: 100%' width='100%'><thead>${head}</thead></table>`);
        var $body = $tabla.appendTo($partidosTabla).append("<tbody></tbody>");
        for (var partido of categoria.partidos) {
            $body.append(`<tr><td>${partido.s}</td><td>${partido.t}</td><td>${partido.l}</td><td>${partido.t1}</td></tr>`);
            $body.append(`<tr><td colspan='3' ><td>${partido.t2}</td></tr>`);
        }
    }
    $partidosTabla.empty();
    for (var categoria of categorias) {
        makeCategoria(categoria);
    }

}
function makeFecha(fecha) {
    var $fechaTabla = $('#fechaTabla');
    $fechaTabla.empty();
    $fechaTabla.append(`<h3>FECHAS</h3>`);
    var head = `<tr><th>Hilabetea</th><th>Egunak</th><th>Mes</th></tr>`;
    var body = `<tr><td>${fecha.hilabetea}</td><td>${fecha.egunak}</td><td>${fecha.mes}</td></tr>`;
    var $tabla = $(`<table style='width: 100%'><thead>${head}</thead><tbody>${body}</tbody></table>`);
    $fechaTabla.append($tabla);
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
        $("#dialog").hide()
    });
    isUp = true;
}
function slideDown() {
    $("#overlay").animate({
        height: "90%"
    }, function (animation, jumpedToEnd) {
        $("#dialog").show()
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
function runLoadPlantilla() {
    var plKey = $('#selPlantillas').find(":selected").val();
    var plantilla = plantillas[plKey];
    var plUrl = plantilla[1];
    var m = plUrl.match(/\/([\w]+)\.psd/);
    if (m) {
        plName = m[1];
        var script = `app.open("${plUrl}", null, false);`;
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

function onTransformPartidos() {
    var partidos = $("#partidos").val();
    var dom = parsePartidos(partidos);
    transformDom2Html(dom);
    transformDom2Javascript(dom);
    $("#btnDom2Javascript").on("click", function () { transformDom2Javascript(dom); });
}
$(document).ready(function () {
    frame = document.getElementById("pp");
    window.addEventListener("message", onMSG);
    $("#btnSlide").on("click", slide);
    $("#btnTransformPartidos").on("click", onTransformPartidos);
    $("#btnPostScript").on('click', runScript);
    makePantillas();
    slideDown();

    onTransformPartidos();

    // updatePlayground();
});    


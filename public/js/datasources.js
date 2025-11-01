const EQUIPOS = {
    "sen:nes:1": {
        equipo: "Senior neska",
        name: "Leizaran Lanbroa Taberna",
        urls: [
            {
                desc: 'Kirolak',
                url: "https://kirolak.gipuzkoa.eus/es/competiciones-calendario.asp?deporte=todos&deportetmp=balonmano&ref=220&cat=18&gr=1&clas=0"
            },
            {
                desc: 'Vasca',
                url: "https://intranet.fvascabm.com/competiciones.asp?torneo=3312"
            }
        ]
    },
    "sen:mut:1": {
        "equipo": "Senior mutila 1",
        "name": "Leizaran Ernio Inmobiliaria",
        "urls": [
            "https://kirolak.gipuzkoa.eus/es/competiciones-calendario.asp?deporte=todos&deportetmp=balonmano&ref=220&cat=17&gr=1&clas=0",
            "https://intranet.fvascabm.com/competiciones.asp?torneo=3311"
        ]
    },
    "sen:mut:2": {
        "equipo": "Senior mutila 2",
        "name": "Leizaran Eskubaloia",
        "urls": [
            "https://kirolak.gipuzkoa.eus/es/competiciones-calendario.asp?deporte=todos&deportetmp=balonmano&ref=224&cat=12&gr=1&clas=0",
            "https://www.gieskubaloia.eus/es/competicion/calendario/?temporada=28&referencia=224&categoria=12&grupo=1"
        ]
    },
    "jub:nes:1": {
        "equipo": "Jubenil neska",
        "name": "Leizaran Eskubaloia",
        "urls": [
            "https://www.gieskubaloia.eus/es/competicion/calendario/?temporada=28&referencia=224&categoria=15",
            ""
        ]
    },
    "jub:mut:1": {
        "equipo": "Jubenil mutila",
        "name": "Leizaran Javier Zeramikak",
        "urls": [
            "https://kirolak.gipuzkoa.eus/es/competiciones-calendario.asp?deporte=todos&deportetmp=balonmano&ref=220&cat=20&gr=1&clas=0",
            "https://intranet.fvascabm.com/competiciones.asp?torneo=3313"
        ]
    },
    "kad:nes:1": {
        "equipo": "Kadete neska 1",
        "name": "Leizaran La Salle Berrozpe",
        "urls": [
            "https://kirolak.gipuzkoa.eus/es/competiciones-calendario.asp?deporte=todos&deportetmp=balonmano&ref=224&cat=16&gr=2&clas=0",
            "https://www.gieskubaloia.eus/es/competicion/calendario/?temporada=28&referencia=224&categoria=16&grupo=2"
        ]
    },
    "kad:nes:2": {
        "equipo": "Kadete neska 2",
        "name": "Leizaran Horia",
        "urls": [
            "https://kirolak.gipuzkoa.eus/es/competiciones-calendario.asp?deporte=todos&deportetmp=balonmano&ref=224&cat=16&gr=5&clas=0",
            "https://www.gieskubaloia.eus/es/competicion/calendario/?temporada=28&referencia=224&categoria=16&grupo=5"
        ]
    },
    "kad:mut:1": {
        "equipo": "Kadete mutila 1",
        "name": "Leizaran Camacho Construcción",
        "urls": [
            "https://kirolak.gipuzkoa.eus/es/competiciones-calendario.asp?deporte=todos&deportetmp=balonmano&ref=220&cat=22&gr=1&clas=0",
            "https://intranet.fvascabm.com/competiciones.asp?torneo=3314"
        ]
    },
    "kad:mut:2": {
        "equipo": "Kadete mutila 2",
        "name": "Leizaran Horia",
        "urls": [
            "https://kirolak.gipuzkoa.eus/es/competiciones-calendario.asp?deporte=todos&deportetmp=balonmano&ref=224&cat=14&gr=3&clas=0",
            "https://www.gieskubaloia.eus/es/competicion/calendario/?temporada=28&referencia=224&categoria=14&grupo=3"
        ]
    },
    "kad:mut:3": {
        "equipo": "Kadete mutila 2",
        "name": "Leizaran Txuria",
        "urls": [
            "https://kirolak.gipuzkoa.eus/es/competiciones-calendario.asp?deporte=todos&deportetmp=balonmano&ref=224&cat=14&gr=3&clas=0https://www.gieskubaloia.eus/es/competicion/calendario/?temporada=28&referencia=224&categoria=14&grupo=3",
            ""
        ]
    },
    "inf:nes:1": {
        "equipo": "Infantil neska 1",
        "name": "Leizaran McDonalds",
        "urls": [
            "https://kirolak.gipuzkoa.eus/es/competiciones-calendario.asp?deporte=todos&deportetmp=balonmano&ref=225&cat=38&gr=2&clas=0",
            ""
        ]
    },
    "inf:nes:2": {
        "equipo": "Infantil neska 2",
        "name": "Leizaran Urkabe",
        "urls": [
            "https://kirolak.gipuzkoa.eus/es/competiciones-calendario.asp?deporte=todos&deportetmp=balonmano&ref=225&cat=38&gr=6&clas=0",
            ""
        ]
    },
    "inf:mut:1": {
        "equipo": "Infantil mutila 1",
        "name": "Leizaran Oianume",
        "urls": [
            "https://kirolak.gipuzkoa.eus/es/competiciones-calendario.asp?deporte=todos&deportetmp=balonmano&ref=225&cat=36&gr=2&clas=0",
            ""
        ]
    },
    "inf:mut:2": {
        "equipo": "Infantil mutila 2",
        "name": "Leizaran Horia",
        "urls": [
            "https://kirolak.gipuzkoa.eus/es/competiciones-calendario.asp?deporte=todos&deportetmp=balonmano&ref=225&cat=36&gr=4&clas=0",
            ""
        ]
    }
}

function dateYYYYMMDD(date) {
    var month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

const CATEGORIAS = {
    'sen': 'SENIOR',
    'jub': 'JUBENIL',
    'kad': 'KADETE',
    'inf': 'INFANTIL',
    'ale': 'ALEBIN'
}
const SEXOS = {
    'nes': 'Neskak',
    'mut': 'Mutilak',
}
function EquiposPersistor() {
    var persistor = new Persistor();
    this.storeEquipos = function (equipos) {
        localStorage.setItem("equipos", JSON.stringify(equipos));
    }
    this.loadEquipos = function () {
        var equipos = JSON.parse(localStorage.getItem("equipos"));
        if (equipos == null) params = EQUIPOS;
        return equipos;
    }
    this.download = function () {
        persistor.download("equipos", "equipos_leizaran.json");
    }
    this.upload = function (parseFile) {
        $dlg = persistor.getUploadDialog(parseFile);
        $dlg.dialog("open");
    }
    /**
     * Devuelve una promesa de jornadas
     * @returns 
     */
    this.getEquipos = function () {
        return $.ajax({
            url: 'equipos',
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            success: function (response) {
                var equipos = response; // JSON.parse(response);
                if (equipos == null) equipos = EQUIPOS;
                return equipos;
            },
            error: function (xhr, status, error) {
                console.error('Get failed:', status, error);
            }
        });
    }
    this.saveEquipos = function (equipos, onSuccess) {
        $.ajax({
            url: 'equipos',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(equipos),
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
}

function EquiposService() {
    const persistor = new EquiposPersistor();

    this.saveEquipos = function (equipos) {
        // persistor.storeEquipos(equipos);
        persistor.saveEquipos(equipos, function () {
            console.log("Saved");
        });
    }

    function parseFile(content) {
        equipos = JSON.parse(content);
        persistor.storeEquipos(equipos);
        updateEquiposList()
    }


    /** Devuelve la clave de categoría 
     * @param {*} name (SENIOR, ...)
     * @returns (sen, jub, kad, inf, ale)
     */
    this.getCategoriaKeyByName = function (name) {
        for (var c in CATEGORIAS) {
            if (CATEGORIAS[c] == name)
                return c;
        }
        return undefined;
    }

    /** Devuelve la clave de sexo
     * @param {*} name Neskak / Mutilak
     * @returns nes / mut
     */
    this.getSexoKeyByName = function (name) {
        for (var s in SEXOS) {
            if (SEXOS[s] == name)
                return s;
        }
        return undefined;
    }

    /* ************************* */
    /* Metodos publicos          */
    /* ************************* */

    /**
     * Devuelve un equipo por su nombre, categoría y N/M
     * @param {*} name el nombre
     * @param {*} cat la categoría (sen, jub, kad, inf, ale)
     * @param {*} nm N/M (nes, mut)
     * @returns 
     */
    this.getEquipoByName = function (name, cat, nm) {
        cat = this.getCategoriaKeyByName(cat);
        nm = this.getSexoKeyByName(nm);
        for (e in equipos) {
            if (equipos[e].name == name) {
                if (e.startsWith(cat + ":" + nm))
                    return equipos[e];
            }
        }
        return undefined;
    }
    this.getEquipoByKey = function (e) {
        return equipos[e];
    }
    this.getEquipoKeysInCategory = function (cat) {
        var keysInCat = [];
        for (var e in equipos) {
            if (e.startsWith(cat)) {
                keysInCat.push(e);
            }
        }
        return keysInCat
    }
    this.downloadEquipos = function () {
        persistor.download();
    }

    var equipos;
    // persistor.getEquipos().then(function (data) { equipos = data; });
    equipos = persistor.loadEquipos();
}

function EquiposUI(equiposService) {
    const EQUIPOS_LIST_ID = 'equipos-list';

    /** Devuelve el panel jquery, lo crea si necesario
     * @returns 
     */
    function getEquiposPanel() {
        /* The line `var  = $("#equiposPanel");` is selecting the HTML element with the id "equiposPanel"
        and storing it in the jQuery object ``. This allows the code to reference and manipulate the
        selected element using jQuery methods and properties. */
        var $pnl = $("#equiposPanel");
        if ($pnl.length == 0) {
            $pnl = $("<div id='equiposPanel'>");
            $pnl.append("<h2>Equipos...</h2>");
            $pnl.append(make$Botonera());

            // Lista de equipos
            var $list = $(`<p id='${EQUIPOS_LIST_ID}'></p>`).appendTo($pnl);

            $('#right_panel').append($pnl);
        }
        return $pnl;
    }

    function make$Botonera() {
        var $btns = $("<div class='buttonbox'></div>");
        $(`<button>Guardar</button>`) //
            .on('click', onEquiposSave) //
            .appendTo($btns);
        $(`<button>Descargar</button>`) //
            .on('click', function () { equiposService.downloadEquipos(); }) //
            .appendTo($btns);
        $(`<button>Cargar un fichero</button>`) //
            .on('click', function () { persistor.upload(parseFile); }) //
            .appendTo($btns);
        $(`<button>Cerrar</button>`) //
            .on('click', () => tableView.showPartidosOnRight()) //
            .appendTo($btns);
        return $btns;
    }
    /** Guarda los datos de los equipos
      */
    function onEquiposSave() {
        var equipos = getEquiposFromUI();
        equiposService.saveEquipos(equipos);
    }

    function makeEquipoFromUI($divEq) {
        var e = $divEq.data('equipo');
        var competicion = $divEq.find('input.equipo-competicion').val();
        var hasta = $divEq.find('input.equipo-hasta').val();
        var urls = [];
        $divEq.find('input.equipo-url').each(function () {
            var $input = $(this);
            var pos = $input.parents('.urlLine').index();
            var url = urls[pos] ?? {};
            urls[pos] = url;
            url[$input.data('field')] = $input.val();
        });

        return {
            equipo: EQUIPOS[e].equipo,
            name: EQUIPOS[e].name,
            competicion: competicion,
            hasta: hasta,
            urls: urls
        };
    }
    function getEquiposFromUI() {
        var equipos = {};
        $(`div[data-equipo]`).each(function () {
            var $this = $(this);
            equipos[$this.data('equipo')] = makeEquipoFromUI($this);
        });
        return equipos;
    }
    function updateFechaHastaStyle() {
        var $fechaHasta = $(this);
        var hoy = dateYYYYMMDD(new Date());
        if (hoy > $fechaHasta.val())
            $fechaHasta.addClass('fecha-hasta-superada');
        else
            $fechaHasta.removeClass('fecha-hasta-superada');
    }

    function updateDataSourceLink(input) {
        var url = input.value;
        var $link = $(input).next().find('a')
        if (url) {
            $link.attr('href', url).show();
        } else {
            $link.attr('href', '#').hide();
        }
    }

    /** Crea una fila de descripcion/url
     * @param {*} u posicion del url
     * @param {*} url url
     * @returns la fila
     */
    function make$DivUrl(url) {
        var $urlline = $("<div class='urlLine'></div>");
        var desc;
        if (typeof url === "string") {
            desc = '';
            // url tal cual
        } else {
            desc = url.desc ?? '';
            url = url.url ?? ''
        }
        // Descripcion
        $urlline //
            .append(`<div class='formEl w1' style='text-align: right'>Clave: </div>`) //
            .append( //
                $(`<input class='equipo-url formEl w2' data-field='desc'></div>`) //
                    .val(desc)) //
            .append(`<div class='formEl w1' style='text-align: right'>Url: </div>`) //
            .append( //
                $(`<input class='equipo-url formEl w4' data-field='url'></div>`) //
                    .val(url) //
                    .on('change', function () { updateDataSourceLink(this); }) //
            ) //
            .append( //
                $(`<div class='formEl wm' style='text-align: center'>
              <a rel='noopener noreferrer' target='competicion_datasource'>[ver]</a></div>`)) //
            .append( //
                $(`<div class='formEl wm' style='text-align: center'></div>`) //
                    .append( //
                        $(`<button>-</button>`) //
                            .on('click', function () {
                                var $row = $(this).parents('.urlLine').remove();
                            })));

        return $urlline;
    }
    function make$DivAddUrl() {
        var $urlline = $("<div class='urlLine'></div>");
        $urlline //
            .append( //
                $(`<div class='formEl w1' style='text-align: right'></div>`) //
                    .append( //
                        $(`<button>+</button>`) //
                            .on('click', function () {
                                $(this).parents('.urlLine').prev().after(make$DivUrl(0, ""));
                            })));
        return $urlline;
    }
    function make$DivEquipo(e) {
        var equipo = equiposService.getEquipoByKey(e);
        var eqName = equipo.name ?? '';
        var $divEquipo = $(`<div data-equipo="${e}"></div>`);
        $(`<div class='titulo-3'>${equipo.equipo}: <em>${eqName}</em></div>`) //
            .appendTo($divEquipo);
        var $divCompeticionHasta = $('<div></div>').appendTo($divEquipo);
        $divCompeticionHasta //
            .append(`<div class='formEl w1' style='text-align: right'>Comp.: </div>`) //
            .append(//
                $(`<input class='equipo-competicion formEl w4'/>`) //
                    .val(equipo.competicion ?? '')) //
            .append(`<div class='formEl w1' style='text-align: right'>Hasta: </div>`) //
            .append($(`<input class='equipo-hasta formEl w2'/>`) //
                .val(equipo.hasta ?? '') //
                .on('change', updateFechaHastaStyle) //
                .trigger('change', []));

        var $divUrls = $('<div>').appendTo($divEquipo);
        for (var url of equipo.urls) {
            make$DivUrl(url).appendTo($divUrls);
        }
        make$DivAddUrl().appendTo($divUrls);

        //

        return $divEquipo;
    }

    function make$DivCategoria(cat) {
        var catName = CATEGORIAS[cat];
        var $divCat = $(`<div>`);
        var idCatBody = `datasrc-cat${cat}-body`;
        $(`<div class='titulo-2'>${catName}</div>`) //
            .on('click', () => $('#' + idCatBody).toggle())
            .appendTo($divCat);
        var $divCatBody = $(`<div id='${idCatBody}' style='padding-left: 10px'></div>`) //
            .toggle(cat == 'sen')
            .appendTo($divCat);
        for (var e of equiposService.getEquipoKeysInCategory(cat)) {
            make$DivEquipo(e).appendTo($divCatBody);
        }
        return $divCat;
    }
    function updateEquiposList() {
        const $list = $(`#${EQUIPOS_LIST_ID}`);
        $list.empty();
        for (var cat in CATEGORIAS) {
            make$DivCategoria(cat).appendTo($list);
        }
        $('.equipo-url').trigger('change');
    }
    this.init = async function () {
        broadcaster //
            .register(this, ['show-right-panel'], function (event) {
                var $pnl = getEquiposPanel();
                if (event.panel == 'equipos') {
                    updateEquiposList();
                    $pnl.show();
                } else {
                    $pnl.hide();
                }
            });
    }
}

var equiposService = new EquiposService();
var equiposUI = new EquiposUI(equiposService);
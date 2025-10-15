const EQUIPOS = {
  "sen:nes:1": {
    "equipo": "Senior neska",
    "name": "Leizaran Lanbroa Taberna",
    "urls": [
      "https://kirolak.gipuzkoa.eus/es/competiciones-calendario.asp?deporte=todos&deportetmp=balonmano&ref=220&cat=18&gr=1&clas=0",
      "https://intranet.fvascabm.com/competiciones.asp?torneo=3312"
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
const CATEGORIAS = {
  'sen': 'SENIOR',
  'jub': 'JUBENIL',
  'kad': 'KADETE',
  'inf': 'INFANTIL'
}
const SEXOS = {
  'nes': 'Neskak',
  'mut': 'Mutilak',
}

function EquiposPersistor() {
  this.saveEquipos = function(equipos) {
    localStorage.setItem("equipos", JSON.stringify(equipos));
  }
  this.loadEquipos = function() {
    var equipos = JSON.parse(localStorage.getItem("equipos"));
    if (equipos == null) params = EQUIPOS;
    return equipos;
  }
}
function EquiposService() {
  const persistor = new EquiposPersistor();
  const EQUIPOS_LIST_ID = 'equipos-list';
  function updateDataSourceLink($link, url) {
    if (url) {
      $link.attr('href', url).show();
    } else {
      $link.attr('href', '#').hide();
    }
  }

  /**
   * Guarda los datos de los equipos
   */
  function onEquiposSave() {
    var equipos = {};
    $(`div[data-equipo]`).each(function () {
      var $this = $(this);
      var e = $this.data('equipo');
      var $urls = $this.find('input');
      var equipo = {
        equipo: EQUIPOS[e].equipo,
        name: EQUIPOS[e].name,
        urls: [$urls[0].value, $urls[1].value]
      };
      equipos[e] = equipo;
    });
    persistor.saveEquipos(equipos);
  }

  /**
   * Devuelve el panel jquery, lo crea si necesario
   * @returns 
   */
  function getEquiposPanel() {
    var $pnl = $("#equiposPanel");
    if ($pnl.length == 0) {
      $pnl = $("<div id='equiposPanel'>");
      $pnl.append("<h2>Equipos...</h2>");

      // Lista de equipos
      var $list = $(`<p id='${EQUIPOS_LIST_ID}'></p>`).appendTo($pnl);
      var equipos = persistor.loadEquipos();
      for (var e in equipos) {
        var equipo = equipos[e];
        var $line = $(`<div data-equipo="${e}"></div>`) //
          .appendTo($list);
        $(`<div>${equipo.equipo}: <em>${equipo.name}</em></div>`) //
          .appendTo($line);
        for (var url of equipo.urls) {
          var $urlline = $("<div></div>").appendTo($line);
          $(`<input style='width: 400px'></div>`) //
            .val(url) //
            .on('change', function () {
              updateDataSourceLink($(this).next(), this.value);
            })
            .appendTo($urlline);
          var $link = $(`<a rel='noopener noreferrer' target='_blank'>[ver]</a>`) //
            .appendTo($urlline);
          updateDataSourceLink($link, url);
        }
      }

      var $btns = $("<div class='buttonbox'></div>");
      $(`<button>Guardar</button>`) //
        .on('click', onEquiposSave) //
        .appendTo($btns);
      $(`<button>Cerrar</button>`) //
        .on('click', onShowPartidosOnRight) //
        .appendTo($btns);
      $pnl.append($btns);
      $('#right_panel').append($pnl);
    }
    return $pnl;
  }

  /**
   * Devuelve la clave de categoría 
   * @param {*} name (SENIOR, ...)
   * @returns (sen, jub, kad, inf)
   */
  this.getCategoriaKeyByName = function(name) {
    for (var c in CATEGORIAS) {
      if (CATEGORIAS[c] == name)
        return c;
    }
    return undefined;
  }

  /**
   * Devuelve la clave de sexo
   * @param {*} name Neskak / Mutilak
   * @returns nes / mut
   */
  this.getSexoKeyByName = function(name) {
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
   * Enseña el panel de equipos
   */
  this.showPanel = function () {
    $("#right_panel").children().hide();
    getEquiposPanel().show();
  }

  /**
   * Devuelve un equipo por su nombre, categoría y N/M
   * @param {*} name el nombre
   * @param {*} cat la categoría (sen, jub, kad, inf)
   * @param {*} nm N/M (nes, mut)
   * @returns 
   */
  this.getEquipoByName = function (name, cat, nm) {
    cat = this.getCategoriaKeyByName(cat);
    nm = this.getSexoKeyByName(nm);
    for (e in EQUIPOS) {
      if (EQUIPOS[e].name == name) {
        if (e.startsWith(cat + ":" + nm))
          return EQUIPOS[e];
      }
    }
    return undefined;
  }
}
var equiposService = new EquiposService();

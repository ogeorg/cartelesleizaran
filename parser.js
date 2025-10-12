
function produceNothing() { }

/**
 * Parsea el texto de datos de partidos y crea un DOM
 * 
 * @param {*} txtPartidos 
 * @returns 
 */
function parsePartidos(txtPartidos) {
    var dom = {}
    function NullState() {
        this.produce = produceNothing;
    }
    function FechaHeaderState() {
        this.fecha = {};
        dom.fecha = this.fecha;
        this.produce = produceNothing;
    }
    function InFechaState(prevstate, line) {
        this.fecha = prevstate.fecha;
        this.produce = function () {
            if (!line)
                return;
            var items = line.split("/");
            var mes = parseInt(items[1].trim());
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
            if (items.length > 5) partido.g1 = items[5].trim();
            if (items.length > 6) partido.g2 = items[6].trim();
            this.categoria.partidos.push(partido);
        }
    }
    function nextState(prevstate, line) {
        line = line.trim();
        if (!line) {
            prevstate.produce = produceNothing;
            return prevstate;
        }
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

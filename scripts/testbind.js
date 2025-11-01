function Class() {
    function print() {
        console.log(a);
    }
    this.getCallback = function() {
        return [this, print];
    }
    function printN(n) {
        console.log(a, n);
    }
    this.getCallbackN = function() {
        return [this, printN];
    }
    var a = 3;
}

const object = new Class();

var handler = object.getCallback();
handler[1].call(handler[0]);

handler = object.getCallbackN();
handler[1].call(handler[0], 4);

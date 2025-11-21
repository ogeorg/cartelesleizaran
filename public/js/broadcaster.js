function Broadcaster() {
    var eventsMap = {};
    this.register = function (listener, eventName, handler) {
        if (!(eventName in eventsMap)) {
            eventsMap[eventName] = [[listener, handler]];
        } else {
            eventsMap[eventName].push([listener, handler]);
        }
        return this;
    }
    this.broadcast = function (eventName, data) {
        if (!(eventName in eventsMap))
            return;
        for (handler of eventsMap[eventName]) {
            var listener = handler[0];
            var callback = handler[1];
            callback.call(listener, data);
        }
    };

}
const broadcaster = new Broadcaster();
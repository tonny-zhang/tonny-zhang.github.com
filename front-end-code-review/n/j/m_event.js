(function(global){
	var Event = global.Event = function(){
		this.events = {};
	}
	Event.test = function(){console.log('test')}
	var eventProp = Event.prototype;
	eventProp.on = function(eventName,callback){
		var events = this.events;
		var list = events[eventName] || (events[eventName] = []);
		list.push(callback)
		return this;
	}
	eventProp.emit = function(eventName,data){
		var _this = this;
		var events = _this.events;
		var list = events[eventName], fn

		if (list) {
			list = list.slice();
			while ((fn = list.shift())) {
				fn(data)
			}
		}
		return _this;
	}
	eventProp.off = function(eventName,callback){
		var _this = this;
		var events = _this.events;
		if (!(eventName || callback)) {
			events = _this.events = {}
			return _this
		}

		var list = events[eventName]
		if (list) {
			if (callback) {
				for (var i = list.length - 1; i >= 0; i--) {
					if (list[i] === callback) {
						list.splice(i, 1)
					}
				}
			}
			else {
				delete events[eventName]
			}
		}
		return _this;
	}
	if(typeof define != 'undefined'){
		define(function(){
			return Event
		});
	}
})(this.W || (this.W = {}));
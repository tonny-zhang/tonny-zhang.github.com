dojo.provide("html5.Log");

dojo.require("dojo.date.locale");
window.requestFileSystem = window.webkitRequestFileSystem || window.requestFileSystem;
window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
dojo.declare("html5.Log", null, {

	SPACE:4,
	MSGMAP:{"1":"ERROR","2":"WARNING","3":"INFO","4":"DEBUG"},
	METHODMAP:{"1":"error","2":"warn","3":"info","4":"debug"},
	_logData:{"status":false},
	_logWorker:new Worker('HTML5File.js'),
	
	constructor: function(grantedBytes) {
		//1表示记录错误信息，2表示记录警告信息，3表示记录一般信息，4表示记录调式信息
		this.logLevel = 1;
		this.indent = 0;

		if(!this._logData.status){//所有实例只初始化一次
			this._logData.status = true;
			this._logWorker.postMessage({"cmd":"init","grantedBytes":grantedBytes});
		}
		this._logWorker.onmessage = function(e) {
			console.log(e.data);
		}
	},
	
	getLogLevel: function() {
		return this.logLevel;
	},

	setLogLevel: function(logLevel) {
		this.logLevel = logLevel;
	},

	isDebugEnabled: function() {
		return this.logLevel >= 4;
	},

	// 记录错误信息
	error: function(location, message, extra) {
		this._record(1, location, message, extra);
	},

	// 记录警告信息
	warn: function(location, message, extra) {
		this._record(2, location, message, extra);
	},

	// 记录一般信息
	info: function(location, message, extra) {
		this._record(3, location, message, extra);
	},

	// 记录调式信息
	debug: function(location, message, extra) {
		this._record(4, location, message, extra);
	},

	// 进入一个函数
	entry: function(location, extra) {
		this._record(-1, location, "Entry", extra);
		this.indent += this.SPACE;
	},

	// 退出一个函数
	exit: function(location, extra) {
		this.indent -= this.SPACE;
		this._record(-1, location, "Exit", extra);
	},

	_record: function(level, location, message, extra) {

		var logEntry = {
			level: level,
			time: new Date(),
			loc: location,
			msg: message,
			extra: extra,
			indent: this.indent
		};
		
		if (level <= this.logLevel) {
			var logInfo = this._formatLogEntry(logEntry);
			this._writeLogEntryToFile(logEntry,logInfo);
		}
	},

	_formatLogEntry: function(logEntry) {
		
		var result = dojo.date.locale.format(logEntry.time,{datePattern: "yyyy-MM-dd", timePattern: "HH:mm:ss "});
		for ( var i = 0; i < logEntry.indent; i++) {
			result += " ";
		}
		if(logEntry.level>=0){
			result += this.MSGMAP[logEntry.level+""]+ " - ";
		}
		result += logEntry.loc;
		if (logEntry.msg) {
			result += " - " + this._formatObject(logEntry.msg);
		}
		if (logEntry.extra) {
			result += " - " + this._formatObject(logEntry.extra);
		}
		result += "\r\n";
		return result;
	},

	//格式化Object类型信息
	_formatObject: function(data) {
		if (dojo.isObject(data)) {
			return dojo.toJson(data);
		} else {
			return data;
		}
	},
	
	_writeLogEntryToFile:function(logEntryObj,logEntryStr){
		var logFileName = dojo.date.locale.format(logEntryObj.time,{datePattern: "yyyy-MM-dd'.log'","selector":"date"});
		//每一天创建一个log文件
		console.log(logEntryStr);
		this._logWorker.postMessage({"cmd":"log","logFileName":logFileName,"logEntryStr":logEntryStr});
	}

});

//log文件管理器，列出所有已经存在的log
dojo.declare("html5.log.Manager", null, {
	
	listLogFiles:function(){
		var self = this;
		window.requestFileSystem(PERSISTENT, 0 ,function(fs){//得到log文件目录handler
			fs.root.getDirectory('html5logs', {create: true},function(folder){
				self.html5logFolder = folder;
				self._readEntries();
			});
		});	
	},
	
	_readEntries:function(){
		
		var dirReader = this.html5logFolder.createReader();
		var entries = [],self = this;

		var readFiles = function() {
			dirReader.readEntries(function(results) {//读取目录内容，直到返回内容为0为止
				if (!results.length) {
					entries.sort(function(a, b) {
						return a.name < b.name ? -1 :b.name < a.name ? 1 : 0;
					});
					self._listResults(entries);
				} else {
					entries = entries.concat(Array.prototype.slice.call(results||[],0));
					readFiles();
				}
			});
		};
		readFiles();
	},
	
	//显示所有log文件
	_listResults:function(entries){

		var table = document.createElement("table"),title = document.createElement("tr"),
			name = document.createElement("th"),download = document.createElement("th");
		
		name.innerHTML="名字";
		download.innerHTML="下载";
		title.appendChild(name);
		title.appendChild(download);
		table.appendChild(title);
		
		entries.forEach(function(entry, i) {
			var tr = document.createElement('tr');
			
			var entryName = document.createElement("td");
			entryName.innerHTML = entry.name;
			tr.appendChild(entryName);
			
			var entryDownload = document.createElement("td");
			var a = document.createElement('a');
			a.href = entry.toURL();//提供URL，可以单击链接下载log文件
			a.innerHTML = entry.name
			entryDownload.appendChild(a);
			tr.appendChild(entryDownload);
			
			table.appendChild(tr);
		});
		
		document.getElementById('filelist').innerHTML="";
		document.getElementById('filelist').appendChild(table);
	}
});

html5.log._manager = null;
//单件模式，只创建一个log管理器
html5.log.manager = function(){
	// summary:
	//		Returns the current DnD manager.  Creates one if it is not created yet.
	if(!html5.log._manager){
		html5.log._manager = new html5.log.Manager();
	}
	return html5.log._manager;	// Object
};

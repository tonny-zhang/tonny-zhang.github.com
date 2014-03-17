//解决File API浏览器兼容性问题
self.requestFileSystemSync = self.webkitRequestFileSystemSync || self.requestFileSystemSync;
self.BlobBuilder = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder;

var html5logFolder = null;

self.onmessage = function(e) {
	var data = e.data;
	self.postMessage("data "+data);

	switch (data.cmd){
		//初始化log文件夹
		case "init":{
			var fs = self.requestFileSystemSync(PERSISTENT, data.grantedBytes);
			html5logFolder = fs.root.getDirectory('html5logs', {create: true});
			self.postMessage("html5logFolder "+html5logFolder.name);
			break;
		}
		//写内容到log文件
		case "log":{
			var fileEntry = html5logFolder.getFile(data.logFileName, {create: true});
			self.postMessage("fileEntry "+fileEntry.name);
			var fileWriter = fileEntry.createWriter();
			var blob = new BlobBuilder();
			blob.append(data.logEntryStr);
			fileWriter.seek(fileWriter.length);
			fileWriter.write(blob.getBlob('text/plain'));
			break;
		}
	}
};
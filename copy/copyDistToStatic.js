var fs = require('fs');
var path = require('path')
function copy(src, dst) {
  fs.writeFileSync(dst, fs.readFileSync(src));
}
function travel(dir, callback) {
	if (fs.statSync(dir).isDirectory()) {
    	callback(dir,true);
    }
  fs.readdirSync(dir).forEach(function (file) {
    var pathname = path.join(dir, file);
    if (fs.statSync(pathname).isDirectory()) {
      travel(pathname, callback);
    } else {
      callback(pathname,false);
    }
  });
}

function copy(src,  dest){
	travel(src,function(file,isDir){ 
		var filename=dest+file.substring(src.length);
		if (isDir===true && !fs.existsSync(filename)) { 
				fs.mkdirSync(filename); 
        }
		if(isDir===false){
        	fs.writeFileSync(filename, fs.readFileSync(file));
        }
	});
};

function delDir(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file) {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
            	delDir(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

function delCopy(src,dest){
	delDir(dest);
	copy(src,dest);
}
delCopy('dist','../oa-starter/src/main/resources/static');
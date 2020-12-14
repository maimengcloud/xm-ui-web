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


copy('../mdp-sys-web/src/api/mdp/','src/api/mdp/');
copy('../mdp-sys-web/src/views/mdp/','src/views/mdp/'); 
copy('../ac-core-web/src/api/ac/','src/api/ac/');
copy('../ac-core-web/src/views/ac/','src/views/ac/'); 
copy('../mk-mng-web/src/api/mk/','src/api/mk/');
copy('../mk-mng-web/src/views/mk/','src/views/mk/'); 
/**
 * tencent cms uploader
 * 
 * @attention
 * 使用上传（腾讯CMS）checklist：
 * 1、修改increfile.js文件，重点是"cdnpath", "cdncsspath", "path_prefix", "csspath_prefix", "pathmap"字段
 * 2、cookie设置，此cookie应该有响应的上传权限
 */
var fs = require('fs');
var http = require('http');
var request = require('request');
var querystring = require('querystring');
var Gear = require('gearjs');
var colors = require('colors');

var Config = {};

function getfile(file){
  return file.replace(/(_\d{6}[a-zA-Z]?)_\d{6}[a-zA-Z]?\.js/, '$1_$.js');
}

//解析上传api返回的数据（数据是一段script）
function parseRes(body, file){
  if(body.indexOf('displaySucc') != -1){//上传成功
    console.log(('  Info : ' + file + ' upload success!').cyan);
  }
  else if(body.indexOf('displayInfoByKey') != -1){//已经存在此文件
    console.log(('  Error : ' + file + ' is already exsit!').red);
  }
  else{//其他错误
    console.log(('  Error : ' + file + ' upload fail!').red);
  }
}

//检测cdn上是否有此文件，有则改名
function rename(obj){
  var defer = Gear.q.defer();
  var suffix = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  var isnoVer = obj.file.match(/_\d{6}\w?\.(js|css|png)/);//是否不做版本控制
  isnoVer = isnoVer ? false : true;
  var cdnpath = '';

  if(obj.file.indexOf('.js') != -1){
    cdnpath = Config.upload.cdnjspath;
  }
  else if(obj.file.indexOf('.css') != -1){
    cdnpath = Config.upload.cdncsspath;
  }

  if(obj.cdn){
    cdnpath = obj.cdn;
  }

  //pos为suffix串中游标
  function check(pos, callback){
    if(pos == suffix.length){
      if(callback){
        callback('');
      }
    }
    else{
      var f = suffix.slice(pos, pos + 1);
      var file = obj.file.replace(/(\.(js|css|png))$/, f + '$1');
      var url = cdnpath + obj.path + file;
      request.get(url, function(err, res, body){
        var colorfull = '';
        if(res.statusCode == 200){
          check(pos + 1, callback);
          colorfull = ('' + res.statusCode).green;
        }
        else{//不存在
          if(callback){
            callback(file);
          }
          colorfull = ('' + res.statusCode).red;
        }
        console.log('  Info : fetch ' + url + ' ' + colorfull);
      });
    }
  }

  console.log('  Info : get version of ' + obj.noverfile);

  if(isnoVer){
    defer.resolve({
      file : obj.file, 
      isnoVer : true
    });
  }
  else{
    check(-1, function(file){
      if(file == ''){
        defer.reject(file + '`s versions are too much!');
      }
      else{
        defer.resolve({
          file : file, 
          isnoVer : false
        });
      }
    });
  }

  return defer.promise;
}

//这种方案，不能上传multipart/form-data数据
/*
var post = function(obj, callback){
  var options = {
    hostname : 'wizard2.webdev.com',
    path : '/cgi-bin/material/material_add',
    method : 'POST',
    headers : {'Cookie' : cookie}
  };

  var file = obj.file.replace(/(_\w*)_[0-9a-zA-Z]*\.js/, '$1_$.js');
  obj.path = 'mb/js/' + obj.path;

  Gear.fs.readFile(Config.uploadDir + file).done(function(code){
    var data = querystring.stringify({
      upfile : code,
      addmat : '1',
      defaultwater : '0',
      newname : obj.newname,
      overwrite : '1',
      path : obj.path,
      url : 'http://wizard2.webdev.com/cgi-bin/material/material_list?dir=' + obj.path,
      watermark : '0'
    });

    options.headers['Content-Length'] = data.length;

    var rets = '';

    var req = http.request(options, function(res){
      res.on('data', function(chunk){
        rets = rets + chunk;
      });
      res.on('end', function(){
        console.log(rets);
        if(callback){
          callback();
        }
      })
    });

    req.write(data);
    req.end();
    console.log(req);
  });
}
*/

/*
 * newname : main-141002b.png
 * override : 1
 * addmat : 1
 * watermark : 0
 * defaultwater : 52
 * url : http://wizard2.webdev.com/cgi-bin/material/material_list?dir=css/mobi/sprite
 * path : css/mobi/sprite/
 */
function post(obj, callback){
  var cookie = Config.upload.cms_cookie;
  if(!cookie){//无cookie信息
    console.log('  Error : has no cookie when uploading!'.red);
    return;
  }

  var file = getfile(obj.file);//obj.file.replace(/(_\d{6}[a-zA-Z]?)_\d{6}[a-zA-Z]?\.js/, '$1_$.js');
  if(file.indexOf('.js') != -1){//js文件上传
    obj.path = 'js/' + obj.path;
  }
  else if(file.indexOf('.css') != -1){//css文件上传
    obj.path = 'css/' + obj.path;
  }
  if(obj.cdn == Config.upload.cdncssimgpath){//文件为css image
    obj.path = 'css/' + obj.path;
  }

  var options = {
    url : 'http://wizard2.webdev.com/cgi-bin/material/material_add',
    headers : {
      'Cookie' : cookie
    }
  };

  console.log('  Info : uploading ' + obj.newname);
  var r = request.post(options, function(err, res, body){
    if(err){
      console.log(('  Error : ' + err).red);
    }
    else{
      parseRes(body, obj.newname);
      
      if(callback){
        callback();
      }
    }
  });

  var form = r.form();
  form.append('upfile', fs.createReadStream(Config.uploadDir + file));
  form.append('addmat', '1');
  form.append('defaultwater', '0');
  form.append('newname', obj.newname);
  form.append('overwrite', obj.isnoVer ? '0' : '1');//控制是否覆盖上传 1 - 否 0 - 是
  form.append('path', obj.path);
  form.append('url', 'http://wizard2.webdev.com/cgi-bin/material/material_list?dir=' + obj.path);
  form.append('watermark', '0');
}

/**
 * 执行上传操作
 * @param  {object} obj     文件对象
 * @param  {object} Config  上传全局配置
 * @param  {function} callback 完成之后的回调
 * @return {[type]}         [description]
 */
function doPost(obj, config, callback){
  Config = config;

  rename(obj).done(function(fileObj){
    var file = fileObj.file;
    var ver = file.match(/\d{6}[a-zA-Z0-9]?/g);
    if(ver){
      ver = ver[0];
    }
    
    obj.newname = file;

    obj.isnoVer = fileObj.isnoVer;//此文件是否没有版本配置信息

    //do post
    post(obj, function(){
      //remove file
      var file = getfile(obj.file);//obj.file.replace(/(_\d{6}[a-zA-Z]?)_\d{6}[a-zA-Z]?\.js/, '$1_$.js');
      file = Config.uploadDir + file;
      fs.unlinkSync(file);

      if(callback){
        callback(fileObj);
      }
    });
  });
}

exports.doPost = doPost;

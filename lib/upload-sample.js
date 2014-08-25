/**
 * file uploader
 */
var fs = require('fs');
var http = require('http');
var request = require('request');
var querystring = require('querystring');
var Gear = require('gearjs');
var colors = require('colors');

var Config = {};

//上传目录下的所有文件
//config
//{
//  cdnpath : '',
//  filePathMap : {
//    'page.js' : 'm/t/'
//  }
//}
function uploadDir(dir, config, callback){
  Config = config;
  Config.uploadDir = dir;
  var files = fs.readdirSync(dir);
  var sortFiles = [];
  var waiting = [];

  Gear._.each(files, function(file, key){
    if(file.indexOf('$') == -1){//增量文件
      sortFiles.unshift(file);
    }
    else{
      sortFiles.push(file);
    }
  });

  Gear._.each(sortFiles, function(file, key){
    var noverfile = file.replace(/_\d{6}[a-zA-Z0-9]?(_\$)?/, '');
    var tmp = config.filePathMap[noverfile] + file;
    waiting.push({
      path : config.filePathMap[noverfile],
      file : file,
      noverfile : noverfile
    });
  });

  upload(waiting).done(function(){
    if(callback){
      callback();
    }
  });
}

//bpath,filename
var upload = (function(){
  var defer = Gear.q.defer();
  var verObj = {};//将全量文件的版本号存在这里

  /**
   * @todo 待实现
   * 将文件上传到指定的服务器上
   * @param  {Object}   obj      文件信息
   * @param  {Function} callback 上传成功的回调函数
   * @example
   * post(
   *   {
   *     path:'路径',
   *     file:'文件名',
   *     noverfile:'不带版本号的文件名',
   *     newname:'可以上传到CDN上的文件名，避免冲突'
   *   },
   *   function(){}//上传成功之后，执行callback即可
   * );
   *
   * 注：
   * 1、推荐使用request模块来实现文件上传，可参考 https://github.com/mikeal/request/issues/316
   * 2、根据需要，可以使用colors模块来让自己的输出log加上颜色，可参考 https://github.com/marak/colors.js
   */
  var post = function(obj, callback){
    // demo codes
    // var file = obj.file.replace(/(_\d{6}[a-zA-Z]?)_\d{6}[a-zA-Z]?\.js/, '$1_$.js');
    // if(file.indexOf('.js') != -1){//js文件上传
    //   obj.path = Config.path_prefix + obj.path;
    // }
    // else if(file.indexOf('.css') != -1){//css文件上传
    //   obj.path = Config.csspath_prefix + obj.path;
    // }

    // var options = {
    //   url : 'http://cgi.uploader.com/upload',
    //   headers : {
    //     'Cookie' : 'cookies'
    //   }
    // };

    // console.log('  Info : uploading ' + obj.newname);
    // var r = request.post(options, function(err, res, body){
    //   if(err){
    //     console.log(('  Error : ' + err).red);
    //   }
    //   else{
    //     parseRes(body, obj.newname);//parse and show response
        
    //     if(callback){
    //       callback();
    //     }
    //   }
    // });

    // var form = r.form();
    // form.append('code', fs.createReadStream(Config.uploadDir + file));
    // form.append('newname', obj.newname);
    // form.append('path', obj.path);
  }
  exports.uploadFun = false;//@todo  实现post 方法之后，需要将false置为true

  var action = function(queue, callback){
    var obj = queue.shift();
    if(obj){
      if(obj.file.indexOf('$') !== -1){//增量文件 更新文件名
        obj.file = obj.file.replace('$', verObj[obj.noverfile]);
      }
      if(Config.pathmap && Config.pathmap[obj.path]){//本地路径与cdn路径映射
        obj.path = Config.pathmap[obj.path];
      }
      rename(obj).done(function(fileObj){
        var file = fileObj.file;
        var ver = file.match(/\d{6}[a-zA-Z0-9]?/g);
        if(ver){
          ver = ver[0];
        }
        verObj[obj.noverfile] = ver;
        obj.newname = file;

        obj.isnoVer = fileObj.isnoVer;//此文件是否没有版本配置信息

        //do post
        post(obj, function(){
          //remove file
          var file = obj.file.replace(/(_\d{6}[a-zA-Z]?)_\d{6}[a-zA-Z]?\.js/, '$1_$.js');
          file = Config.uploadDir + file;
          fs.unlinkSync(file);

          action(queue, callback);
        });
      });
    }
    else{
      if(callback){
        callback();
      }
    }
  }
  return function(queue){
    action(queue, function(){
      defer.resolve();
    });
    return defer.promise;
  }
}());

//检测cdn上是否有此文件，有则改名
function rename(obj){
  var defer = Gear.q.defer();
  var suffix = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  var isnoVer = obj.file.match(/_\d{6}\w?\.(js|css)/);//是否不做版本控制
  isnoVer = isnoVer ? false : true;
  var cdnpath = '';

  if(obj.file.indexOf('.js') != -1){
    cdnpath = Config.cdnpath;
  }
  else if(obj.file.indexOf('.css') != -1){
    cdnpath = Config.cdncsspath;
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
      var file = obj.file.replace(/(\.(js|css))$/, f + '$1');
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

exports.uploadDir = uploadDir;
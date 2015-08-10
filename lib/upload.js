/**
 * file uploader
 *
 * @attention
 * 此文件只是上传的壳文件，需要结合自身业务实现上传引擎
 */
var fs = require('fs');
var http = require('http');
var request = require('request');
var querystring = require('querystring');
var Gear = require('gearjs');
var colors = require('colors');

var incre = {};
var Config = {};
var successList = [];

var uploadEngine;//上传引擎

function printList(list, title){
  console.log(('  +++++++++++++++' + (title || 'list') + '+++++++++++++++').green);
  Gear._.each(list, function(file, key){
    console.log('  ', key + 1, '\t', file);
  });
  console.log('  ++++++++++++++++++++++++++++++++++++++++++++'.green);
}

//上传目录下的所有文件
//config
//{
//  cdnpath : '',
//  filePathMap : {
//    'page.js' : 'm/t/'
//  }
//}
function uploadDir(dir, idxs, config, callback){
  Config = config;
  Config.uploadDir = dir;
  var files = fs.readdirSync(dir);
  var tarFiles = [];//过滤之后的文件数组
  var sortFiles = [];
  var waiting = [];
  var all = (idxs == '0');//上传目录下所有文件

  idxs = Gear._.map(idxs, function(idx){
    return parseInt(idx, 10) - 1;
  });

  if(!all){
    Gear._.each(files, function(file, key){
      if(idxs.indexOf(key) != -1){
        tarFiles.push(file);
      }
    });
  }

  Gear._.each(all ? files : tarFiles, function(file, key){
    if(file.indexOf('$') == -1){//增量文件
      sortFiles.unshift(file);
    }
    else{
      sortFiles.push(file);
    }
  });

  Gear._.each(sortFiles, function(file, key){
    var reg = /_\d{1,2}\./;//不同目录的同名文件不能超过99个
    var rfile = file;//upload目录下文件名，真正可以访问到的文件
    if(reg.test(file)){//同名文件
      file = file.replace(reg, '.');
    }
    var noverfile = file.replace(/_\d{6}[a-zA-Z0-9]?(_\$)?/, '');//不带版本号且不带去重处理的文件名
    var mpKey = rfile.replace(/_\d{6}[a-zA-Z0-9]?(_\$)?/, '');//不带版本号的文件名
    waiting.push({
      cdn : config.cdn,
      path : config.filePathMap[mpKey],
      file : file,
      rfile : rfile,
      noverfile : noverfile
    });
  });

  upload(waiting).done(function(verObj){
    if(callback){
      callback(verObj);
    }
    printList(successList, 'uploaded  list');
    successList = [];
  });
}

function listDir(dir, opt){
  var files = fs.readdirSync(dir);
  var _files = [];
  opt = opt || {};
  if(opt.filePathMap){
    Gear._.each(files, function(file, key){
      var noverfile = file.replace(/_\d{6}[a-zA-Z0-9]?(_\$)?/, '');
      var file1 = noverfile.replace(/_\d{1,2}/, '');
      _files.push(opt.filePathMap[noverfile] + file1);
    });
  }
  else{
    _files = files;
  }
  printList(_files, 'uploading list');
}

//获取上传列表中某文件的上传索引号(自然索引+1)
function indexOf(file, dir){
  var files = fs.readdirSync(dir);
  return files.indexOf(file) + 1;
}

//bpath,filename
var upload = (function(){
  var defer = Gear.q.defer();
  var verObj = {};//将全量文件的版本号存在这里

  exports.uploadFun = true;//是否实现了cgi上传接口

  var action = function(queue, callback){
    var obj = queue.shift();
    if(obj){
      if(obj.file.indexOf('$') !== -1){//增量文件 更新文件名
        obj.file = obj.file.replace('$', verObj[obj.noverfile]);
      }
      if(Config.pathmap && Config.pathmap[obj.path]){//本地路径与cdn路径映射
        obj.path = Config.pathmap[obj.path];
      }

      uploadEngine.doPost(obj, Config, function(fileObj){
        var file = fileObj.file;
        var ver = file.match(/\d{6}[a-zA-Z0-9]?/g);
        if(ver){
          ver = ver[0];
        }
        else{//文件名无版本号信息
          ver = '-';
        }

        verObj[obj.noverfile] = ver;

        successList.push(obj.path + file);

        action(queue, callback);
      });
    }
    else{
      if(callback){
        callback();
      }
    }
  }
  return function(queue){
    try{

      action(queue, function(){
        defer.resolve(verObj);
      });
    }catch(e){
      if(e.code == 'MODULE_NOT_FOUND'){
        console.log('  Error : can not find upload engine！'.red);
      }
      else{
        console.log('  Error : error occurred！please check config about "upload" in increfile.js！'.red);
      }
    }
    return defer.promise;
  }
}());

function init(_incre){
  incre = _incre;
  if(incre.config.upload.local){
    uploadEngine = require('./upload-local.js').init(incre);
  }
  else{
    uploadEngine = require('./' + incre.config.upload.engine + '.js');
  }
}

function clear(){
  if(uploadEngine.clear){
    uploadEngine.clear();
  }
}

exports.uploadDir = uploadDir;
exports.listDir = listDir;
exports.indexOf = indexOf;
exports.init = init;
exports.clear = clear;
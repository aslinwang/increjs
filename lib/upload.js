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

var Config = {};
var successList = [];

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
    var noverfile = file.replace(/_\d{6}[a-zA-Z0-9]?(_\$)?/, '');
    waiting.push({
      cdn : config.cdn,
      path : config.filePathMap[noverfile],
      file : file,
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

function listDir(dir){
  var files = fs.readdirSync(dir);
  printList(files, 'uploading list');
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
  var uploadEngine;

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

        verObj[obj.noverfile] = ver;

        successList.push(file);

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
      if(Config.upload.local){
        uploadEngine = require('./upload-local.js');
      }
      else{
        uploadEngine = require('./' + Config.upload.engine + '.js');
      }
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

exports.uploadDir = uploadDir;
exports.listDir = listDir;
exports.indexOf = indexOf;

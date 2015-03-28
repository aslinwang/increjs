/**
 * local uploader
 * 将最终生成的文件发布到本地某目录，主要用于页面和js共用域名的情况
 * 
 * @attention
 * 使用上传（腾讯CMS）checklist：
 */
var fs = require('fs');
var http = require('http');
var request = require('request');
var querystring = require('querystring');
var Gear = require('gearjs');
var colors = require('colors');

var Config = {};
var distRoot = '';

function getfile(file){
  return file.replace(/(_\d{6}[a-zA-Z]?)_\d{6}[a-zA-Z]?\.js/, '$1_$.js');
}

//解析上传api返回的数据（数据是一段script）
function parseRes(body, file){
  if(body.indexOf('displaySucc') != -1){//上传成功
    console.log(('  Info : ' + file + ' upload success!').cyan);
  }
  else if(body.indexOf('displayInfoByKey') != -1){//已经存在此文件
    console.log(('  Error : ' + file + ' is already exist!').red);
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
      var url = obj.path + file;
      var colorfull = '';
      url = distRoot + url.replace(Config.upload.project + '/', '');
      if(fs.existsSync(url)){
        console.log('  Info : fetch ' + url + ' ' + '200'.green);
        check(pos + 1, callback);
      }
      else{
        console.log('  Info : fetch ' + url + ' ' + '404'.red);
        if(callback){
          callback(file);
        }
      }
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
  var tarDir = distRoot + obj.path.replace(Config.upload.project + '/', '');
  var file = getfile(obj.file);//obj.file.replace(/(_\d{6}[a-zA-Z]?)_\d{6}[a-zA-Z]?\.js/, '$1_$.js');
  console.log('  Info : uploading ' + obj.newname);

  Gear.fs.copyFile(Config.uploadDir + file, tarDir, [
      { match : file, replacement : obj.newname}
    ], Config.base).done(function(src){
    console.log(('  Info : ' + src + ' upload success!').cyan);
    if(callback){
      callback();
    }
  });
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

  // 检测config.upload.local是否存在
  distRoot = Config.base + Config.upload.local;
  if(!fs.existsSync(distRoot)){
    console.log(('  Error:directory : "' + Config.upload.local + '" does not exist').red);
  }
  else{
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
}

exports.doPost = doPost;
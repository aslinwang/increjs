'use strict';
var path = require('path');
var fs = require('fs');
var Commander = require('cmd-interface').Commander;
var CommanderUtil = require('cmd-interface').util;
var Gear = require('gearjs');
var Generator = require('./generator.js');
var Htmlmin = require('./htmlmin.js');

var incre = {};

incre.root = path.resolve(__dirname, '../');

var PLUGINS_PATH = incre.root + '/plugins/';

incre.commander = new Commander({
  name : 'increjs'
});
Gear._.extend(incre.commander, CommanderUtil);

incre.fs = Gear.fs;
incre.gear = Gear;

incre.makeincre = Generator.makeIncDataFile;
incre.htmlmin = Htmlmin.htmlmin;

// remove bom
incre.removeBom = function(data, fun){
  var res = data;
  var buff = new Buffer(data, 'utf-8');
  if (buff[0].toString(16).toLowerCase() == "ef" && buff[1].toString(16).toLowerCase() == "bb" && buff[2].toString(16).toLowerCase() == "bf") {
    //EF BB BF 239 187 191

    buff = buff.slice(3);
    res = buff.toString('utf-8');

    if(fun){
      fun();
    }
  }
  return res;
}

try{
  var Uploader = require('./upload.js');
  incre.uploader = {
    indexOf : Uploader.indexOf,
    uploadDir : Uploader.uploadDir,
    listDir : Uploader.listDir,
    clear : Uploader.clear,
    init : Uploader.init
  };
  incre.uploadFun = Uploader.uploadFun;//上传模块中是否实现了自定义上传接口
}
catch(e){

}

//加载插件
var plugins = fs.readdirSync(PLUGINS_PATH);
Gear._.each(plugins, function(v, i){
  var increKey = path.basename(v).replace(path.extname(v), '');
  incre[increKey] = require(PLUGINS_PATH + v);
  incre[increKey].init(incre);
});

module.exports = incre;
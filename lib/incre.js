'use strict';
var path = require('path');
var Commander = require('cmd-interface').Commander;
var CommanderUtil = require('cmd-interface').util;
var Gear = require('gearjs');
var Generator = require('./generator.js');
var Htmlmin = require('./htmlmin.js');

var incre = {};

incre.root = path.resolve(__dirname, '../');

incre.commander = new Commander({
  name : 'increjs'
});
Gear._.extend(incre.commander, CommanderUtil);

incre.fs = Gear.fs;
incre.gear = Gear;

incre.makeincre = Generator.makeIncDataFile;
incre.htmlmin = Htmlmin.htmlmin;
try{
  var Uploader = require('./upload.js');
  incre.uploadDir = Uploader.uploadDir;
  incre.listDir = Uploader.listDir;
  incre.uploadFun = Uploader.uploadFun;//上传模块中是否实现了自定义上传接口
}
catch(e){

}

module.exports = incre;
'use strict';
var path = require('path');
var Commander = require('cmd-interface').Commander;
var CommanderUtil = require('cmd-interface').util;
var Gear = require('gearjs');
var Generator = require('./generator.js');

var incre = {};

incre.root = path.resolve(__dirname, '../');

incre.commander = new Commander({
  name : 'increjs'
});
Gear._.extend(incre.commander, CommanderUtil);

incre.fs = Gear.fs;
incre.gear = Gear;

incre.makeincre = Generator.makeIncDataFile;
try{
  var Uploader = require('./upload.js');
  incre.uploadDir = Uploader.uploadDir;
  incre.uploadFun = Uploader.uploadFun;//�ϴ�ģ�����Ƿ�ʵ�����Զ����ϴ��ӿ�
}
catch(e){

}

module.exports = incre;
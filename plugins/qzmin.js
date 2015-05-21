/**
 * increjs插件 - qzmin
 * 生成qzmin文件，配合Fiddler+willow使用，可以将合并之后的请求拆散之后分别请求
 * 
 * @dependencies
 * Fiddler、Willow
 * 
 * incre qzmin
 */
var async = require('async');
var fs = require('fs');
var Layout = require('layout');
var path = require('path');
var incre;

var QzMin = (function(){
  var tmpl = [
    '{\n',
      '\tprojects : [{\n',
        '\t\tname : "<%=mergejs%>",\n',
        '\t\ttarget : "./out/<%=mergejs%>",\n',
        '\t\tinclude : [\n',
          '<%=chips%>\n',
        '\t\t]\n',
      '\t}],\n',
      '\tlevel : 0,\n',
      '\tshrink : false,\n',
      '\tencode : "utf-8",\n',
      '\tcomment : "Tencent Auto Team"\n',
    '}'
  ].join('');

  var qz2Root = '../../';//qzmin文件到incre root的距离
  var qzDir;//qzmin文件的存放目录

  function build(){
    qzDir = incre.config.base + '.incre/qzmin/';
    tmpl = incre.gear._.template(tmpl);

    incre.fs.mkdir('qzmin', incre.config.base + '.incre/');//创建存放gaga编译文件的目录
    incre.fs.mkdir('out', incre.config.base + '.incre/qzmin/');//创建存放gaga编译文件的目录

    var src = [];
    for(var key in incre.config.merge){
      src.push(key);
    }

    function action(){
      var mergejs = src.shift();
      
      if(!mergejs){
        return;
      }

      var chips = incre.gear._.map(incre.config.merge[mergejs], function(chip){
        return '\t\t\t"' + qz2Root + chip + '"';
      });

      chips = chips.join(',\n');

      var tmplstr = tmpl({
        mergejs : mergejs,
        chips : chips
      });
      
      fs.writeFile(qzDir + mergejs + '.qzmin', tmplstr, function(err){
         if(err){
            console.log(('  Error:' + err).red);
          }
          console.log(('  Info : ' + mergejs + ' qzmin file generate success!').green);
          action();
      });
    }

    action();
  }

  return {
    build : build
  }
}());

exports.init = function(_incre){
  incre = _incre;
  incre.CONFIG = incre.CONFIG || {};
  incre.commander.command({
    cmd : 'qzmin',//incre gaga
    description : 'generate qzmin files',
    handler : function(){
      QzMin.build();
    }
  });
}
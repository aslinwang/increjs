/**
 * increjs插件 - markdown
 * 处理markdown文档，自动生成适于浏览的html文件
 *
 * incre markdown
 */
var incre;

function markdown(){
  var pre = '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><link href="http://mat1.gtimg.com/www/mb/css/lib/markdown_140826a.css" media="all" rel="stylesheet" type="text/css" /></head><body><div id="content-container" class="markdown-body"></div><textarea id="content-source" style="display:none">',
      end = '</textarea> <script src="http://mat1.gtimg.com/www/mb/js/lib/marked_131018.js"></script> <script> marked.setOptions({breaks : true,highlight : function(code, lang) { return lang ? hljs.highlight(lang, code).value : hljs.highlightAuto(code).value; }});document.getElementById(\'content-container\').innerHTML = marked(document.getElementById(\'content-source\').value);</script> </body> </html>',
      defer = incre.gear.q.defer();

  var mds = incre.config.markdown;
  var htmlRoot = incre.config.base + '.incre/md2html/';

  function exec(){
    var md = mds.shift();
    if(!md){
      defer.resolve(true);
    }
    else{
      var val = incre.config.base + md;
      incre.fs.readFile(val).done(function(data){
        data = pre + data + end;
        var file = htmlRoot + md + '.html';
        incre.fs.writeFile(file, data, function(err){
          if(err){
            console.log(('  Error : write markdown file ' + file + 'failed!').red);
          }
          else{
            console.log('  Info : write markdown file ' + file + ' success.');
          }
        }, incre.config.base);

        exec();
      }, function(err){
        defer.reject(err);
      });
    }
  }

  exec();

  return defer.promise;
}

exports.init = function(_incre){
  incre = _incre;
  incre.commander.command({
    cmd : 'markdown',
    description : 'turn md file to html file',
    handler : function(){
      markdown();
    }
  });
}
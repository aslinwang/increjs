/**
 * increjs插件 - html
 * 处理markdown文档，自动生成适于浏览的html文件
 * 
 * incre html
 * incre html -w  //监控是否有改动
 */
var chokidar = require('chokidar');
var iconv = require('iconv-lite');

var incre;

var Html = (function(){
  // 模板语法：
  // <include>inc/header.html</include> <!--引入页面片-->
  // <div>{title}</div><!--前端变量，在increfile.js中声明-->
  // <div>{$out.title}</div><!--后端变量，后端模板解析时解析-->
  // 
  
  var root, dist, charset, verflag;

  function isenable(){
    return !!incre.config.html;
  }

  function removeBom(data, fun){
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

  //用vars填充code中的变量
  function fillVars(code, vars){
    if(!vars){
      return code;
    }

    code = code.replace(/\{([\$\._a-zA-Z0-9]*)\}/g, function(match, p1, offset, str){
      return vars[p1] || match;
    });

    return code;
  }

  //从代码中获取页面片地址
  function getFrags(code, fragVars){
    var codes = {};
    var frags = code.match(/<include>([a-zA-Z0-9_\/\.]*)<\/include>/g) || [];
    var defer = incre.gear.q.defer();

    frags = incre.gear._.map(frags, function(frag){
      return frag.replace(/<include>/g, '').replace(/<\/include>/g, '');
    });

    var frag_urls = incre.gear._.map(frags, function(frag){
      return root + frag;
    });

    incre.fs.readFiles(frag_urls).done(function(datas){
      for(var i = 0; i < frags.length; i++){
        //替换模板变量
        datas[i] = fillVars(datas[i], fragVars[frags[i]]);

        codes[frags[i]] = removeBom(datas[i], function(){
          console.log(('  Warning : \'' + frags[i] + '\' has bom and be removed automatically!').yellow);          
        });
      }

      defer.resolve(codes);
    }, function(err){
      defer.reject(err);
    });

    return defer.promise;
  }

  function action(htmlPath, fragVars){
    var defer = incre.gear.q.defer();

    incre.fs.readFile(htmlPath).done(function(data){
      //get fragment code
      getFrags(data, fragVars).done(function(fragcodes){
        data = data.replace(/<include>(.*)<\/include>/g, function(match, p1, offset, str){
          return fragcodes[p1];
        });

        defer.resolve(data);
      });
    }, function(err){
      defer.reject(err);
    });

    return defer.promise;
  }

  function build(){
    console.log('  Info : start building html'.green);
    if(!isenable()){
      return;
    }

    root = root || incre.config.base + (incre.config.html.root || '');
    dist = root + '/dist/';
    charset = charset || incre.config.html.charset || 'utf-8';
    verflag = verflag || incre.config.html.verflag;
    if(incre.config.html.root){
      delete incre.config.html.root;
      delete incre.config.html.charset;
      delete incre.config.html.verflag;
    }

    // 新版UI开发系统，将原始文件移植到src目录中
    if(verflag == 1){
      dist = root;
    }

    var keys = incre.gear._.keys(incre.config.html);

    function exec(){
      var key = keys.shift();
      if(!key){
        return;
      }
      else{
        var htmlPath = root + key;
        var fragVars = incre.config.html[key];//页面片模板变量

        if(verflag == 1){
          htmlPath = root + 'src/' + key;
        }

        action(htmlPath,fragVars).done(function(res){
          if(res){
            var file = dist + key;
            res = removeBom(res);//remove bom
            if(charset != 'utf-8'){
              //res = iconv.decode(res, 'utf-8');
              res = iconv.encode(res, charset);
            }
            incre.fs.writeFile(file, res, function(err){
              if(err){
                console.log(('  Error : write static html file ' + file + 'failed!').red);
              }
              else{
                console.log('  Info : write static html file ' + file + ' success.');
              }

              exec();
            }, incre.config.base);
          }
        });
      }
    }

    exec();
  }

  return {
    build : build,
    verflag : verflag
  }
}());

exports.init = function(_incre){
  incre = _incre;
  incre.commander.command({
    cmd : 'html',
    description : 'build html from some fragments',
    handler : function(){
      var opt = process.argv[3];

      if(opt && opt == '-w'){
        var tmproot = incre.config.html.root;
        var watch = chokidar.watch(incre.config.base + incre.config.html.root, {ignored: /dist/, persistent: true});
        // 统一不同OS中文件URI路径隔离符号
        watch.on('change', function(file){
          file = file.replace(/\\/g, '/');
          var tmp = file.replace(tmproot, '');
          tmp = tmp.replace(/\\/g, '/');
          if(tmp.indexOf('/') == -1 && Html.verflag){//监控目录的根目录下的文件改动,新版UI开发系统中，忽略更目录的改动
            return;
          }
          console.log(('  Info : auto build html as \'' + file + '\' has been changed') .grey);
          Html.build();
        });
      }

      Html.build();
    }
  });
}
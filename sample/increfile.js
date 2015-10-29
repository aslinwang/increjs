module.exports = {
  base : './',//项目根目录
  chunk : 20,//块大小
  jsugly : {//jsugly option配置
    mangle : {//配置不被mangle的字符串
      except : ['define', 'require', 'exports', 'module']
    }
  },
  upload : {// upload 配置
    // txcms cdn文件定位规则：
    // cdnjspath + project + '/' + src.key
    project : 'mobi',
    local : 'dist/',//如果为true，cms_cookie，engine，cdnjspath，cdncsspath，cdncssimgpath可不用设置
    cms_cookie : 'your cookie',
    engine : 'upload-txcms',//上传引擎，实现将文件上传到tx cms
    cdnjspath : 'http://mat1.gtimg.com/auto/js/',//js cdn path
    cdncsspath : 'http://mat1.gtimg.com/auto/css/',//css cdn path
    cdncssimgpath : 'http://mat1.gtimg.com/auto/css/'// css image cdn path
  },
  merge : {//合并js
    // 'mobi/core.js' : [
    //     'lib/zepto/zepto-1.1.4.min.js',
    //     'lib/seajs/sea-2.3.0.min.js',
    //     'lib/x/x.js',
    //     'mobi/auto.js'
    // ]
  },
  rjs : {//r.js配置文件，详情用法参考http://requirejs.org/docs/optimization.html
    enable : false,
    baseUrl : './',
    dir : 'dist',
    fileExclusionRegExp : /^(\.incre|html)$/,
    paths: {
      // avalon : 'vendor/avalon/avalon.mobile.min',
      // domReady : 'vendor/require/domReady',
      // text : 'vendor/require/text',
      // zepto: 'vendor/zepto/zepto-1.1.4'
    },
    modules : [
      // {name : 'main'}
      // {name : 'modules/aaa/aaa'}
    ]
  },
  gaga : {
    // 'engine' : {//gm engine config
    //   'algorithm' : 'binary-tree',
    //   'padding' : 4,
    //   'imageMagick' : false //如果是需要在Mac下使用，需要将此属性置为true
    // },
    // 'root' : 'mobi/css/',//样式根目录
    // 'slice' : 'img/slice/',//切片图目录root+slice
    // 'sprite' : '/css/sprite/',//雪碧图的上传目录:"~/{project}{sprite}"
    // 'src' : {
    //   'main.css' : {
    //     'main.png' : '150404',
    //     'main@2x.png' : '150404'
    //   },
    //   'style1.css' : {
    //     'rem' : 100,//rem方案
    //     // is2in1：是否将多套图统一为一套图，pc版本不需要设置此属性。此属性用于替换oneset
    //     'is2in1' : true,
    //     'style1.png' : '150404'
    //   }
    // }
  },
  src : {//需要build的文件对象(文件名:cdn上全量文件版本号)
    // 'm/t/page.js' : 140717,//path+filename,文件filename最终会上传至cdnpath+path下
    // 'noincre.js' : '',//value为空 ：不生成增量文件
    // 'noversion' : '-'//value为"-" : 不追加版本号，上传的时候可能会覆盖原文件、慎用！
    // 'nojsmin' : '~',//value为"~" : 对js文件不做处理，一般对无法使用jsugly压缩的js文件作此处理
    // 'mobi/core.js' : '',//js文件构建
    // 'mobi/css/test.css' : ''//css文件构建
  },
  template : {//build template
    // 'root' : 'mobi/tmpl/',//模板源文件根目录（相对与.incre目录而言）
    // 'Lottery' : {//模板项目的目录名，如：mobi/tmpl/Lottery
    //     'lottery' : 'test.css',//模板样式名: 模板样式文件名。js usage: require('css/lottery')[约定:模板样式名首字母小写]
    //     'Lottery' : 'Lottery.html',//模版名：模板文件名。js usage: require('tmpl/Lottery')[约定:模板名首字母大写]
    //     'Lottery_Matter' : 'Lottery_Matter.html',//模版名：模板文件名。js usage: require('tmpl/Lottery_Matter')
    //     'Lottery_QQ' : 'Lottery_QQ.html'//模版名：模板文件名。js usage: require('tmpl/Lottery_QQ')
    // }
  },
  html : {//build html 专为重构工作设计
    // 模板语法：
    // <include>inc/header.html</include> <!--引入页面片-->
    // <div>{title}</div><!--前端变量，在increfile.js中声明-->
    // <div>{$out.title}</div><!--后端变量，后端模板解析时解析-->
    
    // 'root' : 'mobi/html/',//html根目录，存放html片段文件，生成文件在mobi/html/dist目录下
    // 'charset' : 'gbk',//html编码
    // 'verflag' : 1,//新版UI开发系统，将原始文件移植到src目录中
    // 'mergetest.htm' : {//key为要构建的文件名，value为文件中需要的模板变量
    //   'inc/header.html' : {
    //     'title' : '腾讯汽车触屏版',
    //     'keywords' : '汽车，腾讯汽车，手机，汽车大全，车型大全，汽车报价，汽车图片、汽车评测、汽车资讯，汽车新闻，评测',
    //     'description' : '腾讯汽车触屏版为您提供厂商名称车系名称系列车型报价，参数配置、图片,经销商、试驾、降价、论坛等信息。'
    //   }
    // }
  },
  pathmap : {//路径映射 local <-> cdn
    // 'mobi/css/' : 'mobi/'//本地文件(local:\\mobi\css\test.css) <-> cdn文件(cdn:/mobi/test.css)
  },
  markdown : [//将*.md文件转化为*.html文件，便于浏览，html文件存放在.incre/md2html目录下
    // 'mobi/readme.md',
    // 'mobi/doc/increjs_usage.md'
  ]
};
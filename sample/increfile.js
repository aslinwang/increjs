module.exports = {
  base : './',//项目根目录
  chunk : 20,//块大小
  cdnpath : 'http://mat1.gtimg.com/auto/js/',
  cdncsspath : 'http://mat1.gtimg.com/auto/css/',
  path_prefix : 'js/',//腾讯CMS专用
  csspath_prefix : 'css/',//腾讯CMS专用
  merge : {//合并js
    // 'mobi/core.js' : [
    //     'lib/zepto/zepto-1.1.4.min.js',
    //     'lib/seajs/sea-2.3.0.min.js',
    //     'lib/x/x.js',
    //     'mobi/auto.js'
    // ]
  },
  src : {//需要build的文件对象(文件名:cdn上全量文件版本号)
    // 'm/t/page.js' : 140717,//path+filename,文件filename最终会上传至cdnpath+path下
    // 'noincre.js' : '',//value为空 ：不生成增量文件
    // 'noversion' : '-'//value为"-" : 不追加版本号，上传的时候可能会覆盖原文件、慎用！
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
  pathmap : {//路径映射 local <-> cdn
    // 'mobi/css/' : 'mobi/'//本地文件(local:\\mobi\css\test.css) <-> cdn文件(cdn:/mobi/test.css)
  },
  markdown : [//将*.md文件转化为*.html文件，便于浏览，html文件存放在.incre/md2html目录下
    // 'mobi/readme.md',
    // 'mobi/doc/increjs_usage.md'
  ]
};
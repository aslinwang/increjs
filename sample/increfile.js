module.exports = {
  base : './',//项目根目录
  chunk : 20,//块大小
  cdnpath : 'http://mycdn.com/www/js/',
  path_prefix : 'js/lib/',//腾讯CMS专用
  src : {//需要build的文件对象(文件名:cdn上全量文件版本号)
    'm/t/page.js' : 140717,//path+filename,文件filename最终会上传至cdnpath+path下
    'm/module/TalkList.js' : 140717,
    'lib/fc.js' : 140717
  }
};
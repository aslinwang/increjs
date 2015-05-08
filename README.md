increjs
============

一个前端构建自动化工具

Install
-------
* 安装nodejs，目前暂支持v0.10.26版本
* 安装图形处理库GraphicsMagick(如果需要用到`incre gaga`)
  * Windows版本
    [下载安装](https://github.com/aslinwang/increjs/tree/master/misc)
  * Mac版本
    使用brew进行安装

    `brew install imagemagick`

    `brew install graphicsmagick`

    注意：如果在mac下使用incre，需要在`increfile.js`配置文件中设置`gaga.engine.imageMagick=true`
* `npm install increjs -g`

Usage
-----
命令包括：
* `incre` - 使用帮助
* `incre -d` - 在调试模式下运行命令
* `incre -v` - 查看increjs的版本号
* `incre init` - 项目初始化
* `incre gaga` - 处理css sprite图片
* `incre build` - 项目构建
* `incre upload` - 上传文件到CDN
* `incre markdown` - 将markdown文件转化成html文件
* `incre html` - 构建html页面
* `incre qzmin` - 根据increfile.js的[merge]配置，生成qzmin文件

### `incre init`

命令行进入到工作目录，如:jsdev/，然后执行此命令，将会在此目录下生成`.incre`目录，里面存放配置信息和一些临时文件

### `incre gaga`

命令行执行，根据配置处理样式文件中的css sprite图片，合并图片并自动处理样式代码，自动适配retina屏幕设备。详见：https://github.com/aslinwang/increjs/issues/3

### `incre build`

命令行执行，将会根据配置文件`.incre/increfile.js`进行编译，生成相应的全量文件和增量文件
* 将多个文件合并成一个文件（merge）
* 压缩js文件(jsmin)
* 混淆js文件(jsugly)
* 编译模版文件

### `incre build -uic=main.css`

命令行执行，表示在构建时，main.css文件中的css sprite图片有更新。在构建过程中会对这些文件按照配置进行上传、打版本号。build过程结束后，需要将获得的sprite图片版本号回写到`.incre/increfile.js`文件中

### `incre html`，`incre html -w`

命令行执行，构建html根目录下的文件。能够解析`<include></include>`语法，能解析简单的页面片变量。方便提取html页面中的公用部分。带上参数`-w`之后，可以监听html根目录下文件的改动，从而进行自动构建

需要关注的是，html页面在编写时的语法规范：
```
<include>inc/header.html</include> <!--引入页面片-->
<div>{title}</div><!--前端变量，在increfile.js中声明-->
<div>{$out.title}</div><!--后端变量，后端模板解析时解析-->
```

举例来说：
inc/header.html——
```
<!DOCTYPE html>
<html>
  <head>
    <title>{title}</title>
    <meta name="keywords" content="{keywords}" />
    <meta name="description" content="{description}" />
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="format-detection"content="telephone=no, email=no" />
    <link type = "text/css" rel="stylesheet" href = "../css/test.css" /> 
  </head>
  <body>
```

inc/footer.html——
```
  </body>
</html>
```

index.html——
```
<include>inc/header.html</include>
<div>content</div>
<include>inc/footer.html</include>
```

页面片变量声明——
```
//increfile.js
html : {//build html 专为重构工作设计
  'root' : 'mobi/html/',//html根目录，存放html片段文件，生成文件在mobi/html/dist目录下
  'index.html' : {//key为要构建的文件名，value为文件中需要的模板变量
    'inc/header.html' : {
      'title' : '腾讯汽车触屏版',
      'keywords' : '汽车，腾讯汽车，手机，汽车大全，车型大全，汽车报价，汽车图片、汽车评测、汽车资讯，汽车新闻，评测',
      'description' : '腾讯汽车触屏版为您提供厂商名称车系名称系列车型报价，参数配置、图片,经销商、试驾、降价、论坛等信息。'
    }
  }
}
```

### `incre upload -l`

命令行执行，获取将要上传的文件列表

### `incre upload 1,2,3`

命令行执行，上传文件列表中第1,2,3个文件，命令中","为半角逗号
此命令将build生成的文件上传至指定的CDN或服务器上。**此功能的与服务器通信部分，需要自己实现。详见：https://github.com/aslinwang/increjs/issues/1**

### `incre upload 0`
命令行执行，上传目录下所有文件

### `incre markdown`

命令行执行，根据配置文件，可以将md文件转为html文件，以方便阅读

### `incre clear`

命令行执行，清除`.incre`目录下的临时文件

### `incre qzmin`

命令行执行，根据increfile.js的[merge]配置生成qzmin文件，此文件配合Fiddler+willow使用，可以将一个js请求拆分成多个子文件的请求，从而映射到本地的相应文件

Change Log
----------
[change log](CHANGELOG.md)

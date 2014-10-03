increjs
============

一个前端构建自动化工具

Install
-------
`npm install increjs -g`

Usage
-----
`incre init`

命令行进入到工作目录，如:jsdev/，然后执行此命令，将会在此目录下生成`.incre`目录，里面存放配置信息和一些临时文件

`incre build`

命令行执行，将会根据配置文件`.incre/increfile.js`进行编译，生成相应的全量文件和增量文件

`incre build -uic=main.css`

命令行执行，表示在构建时，main.css文件中的css sprite图片有更新。在构建过程中会对这些文件按照配置进行上传、打版本号

`incre html`，`incre html -w`

命令行执行，构建html根目录下的文件。能够解析`<include></include>`语法，能解析简单的页面片变量。方便提取html页面中的公用部分。带上参数`-w`之后，可以监听html根目录下文件的改动，从而进行自动构建

`incre upload -l`

命令行执行，获取将要上传的文件列表

`incre upload 1,2,3`

命令行执行，上传文件列表中第1,2,3个文件，命令中","为半角逗号
此命令将build生成的文件上传至指定的CDN或服务器上。**此功能的与服务器通信部分，需要自己实现。详见：https://github.com/aslinwang/increjs/issues/1**

`incre upload 0`
命令行执行，上传目录下所有文件

`incre markdown`

命令行执行，根据配置文件，可以将md文件转为html文件，以方便阅读

`incre clear`

命令行执行，清除`.incre`目录下的临时文件

Attention
---------
**与[seajs-appcache](http://github.com/aslinwang/seajs-appcache)配合使用**

increjs是一个js构建工具，最终生成并上传带版本信息的js文件，在开发过程中，使用seajs插件，seajs-appcache，可以加载符合条件的增量文件。详见[seajs-appcache](http://github.com/aslinwang/seajs-appcache)说明

Change Log
----------
<<<<<<< HEAD
[change log](CHANGELOG.md)
=======
29 July 2014
 * 完成increjs的基本功能，init、build、upload、clear等

20 Aug. 2014
 * 支持对js文件的普通build、upload，不生成增量文件

23 Aug. 2014
 * 支持多个js文件merge到一个js文件
 * 支持构建并上传css文件
 * 支持构建前端模版特性

25 Aug. 2014
 * 构建模板时，还可以构建与模板相关的css文件
 * 支持转化markdown文件为html文件，便于浏览

26 Aug. 2014
 * 在未执行初始化操作时，也能使用`incre -v`和`incre`命令
 * 优化markdown文件html化之后的展现样式

30 Aug. 2014
 * 提供sample/demo目录，便于理解increjs的使用
 * 构建html功能，专为页面重构工作开发。支持公共页面片提取，页面片模板变量声明等

3 Sept. 2014
 * `incre html`去BOM

8 Sept. 2014
 * `incre html -w`监控html根目录下文件改动，自动进行build操作
 * `incre html`去BOM, fix bug

15 Sept. 2014
 * 增加retina_image配置，将css文件中含有的"main@2x.png"转为"main-2x.png"，以解决部分CMS不支持上传文件名带有@字符的文件的问题
 * 支持构建除utf-8以外编码（如gbk）的html，修复去BOM的bug

22 Sept. 2014
 * 增加`jsugly`配置。例如可以配置不被jsugly mangle掉的字符串
 * 增加`incre upload -l`, `incre upload 1,2`, `incre upload 0`

29 Sept. 2014
 * css minify的时候不使用高级优化选项(noAdvanced)
>>>>>>> d25bbe2e208fb1596721c50c7a74b15095a368ec

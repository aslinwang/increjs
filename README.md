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

命令行执行，表示在构建时，main.css文件中的css sprite图片有更新。在构建过程中会对这些文件按照配置进行上传、打版本号。build过程结束后，需要将获得的sprite图片版本号回写到`.incre/increfile.js`文件中

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


Change Log
----------
[change log](CHANGELOG.md)
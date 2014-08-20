increjs
============

A tool could compile js files, generator incre files and upload them.

Install
-------
`npm install increjs -g`

Usage
-----
`increjs init`

命令行进入到工作目录，如:jsdev/，然后执行此命令，将会在此目录下生成`.incre`目录，里面存放配置信息和一些临时文件

`increjs build`

命令行执行，将会根据配置文件`.incre/increfile.js`进行编译，生成相应的全量文件和增量文件

`increjs upload`

命令行执行，将build生成的文件上传至指定的CDN或服务器上。**此功能的与服务器通信部分，需要自己实现。详见：https://github.com/aslinwang/increjs/issues/1**

`increjs clear`

命令行执行，清除`.incre`目录下的临时文件

Attention
---------
**与[seajs-appcache](http://github.com/aslinwang/seajs-appcache)配合使用**

increjs是一个js构建工具，最终生成并上传带版本信息的js文件，在开发过程中，使用seajs插件，seajs-appcache，可以加载符合条件的增量文件。详见[seajs-appcache](http://github.com/aslinwang/seajs-appcache)说明

Change Log
----------
29 July 2014
 * 完成increjs的基本功能，init、build、upload、clear等
20 August 2014
 * 支持对js文件的普通build、upload，不生成增量文件
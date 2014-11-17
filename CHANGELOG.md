change log
============
17 Nov. 2014
 * 重构代码，采用plugins模式开发incre命令
 * 支持`incre gaga`命令，用于自动合并雪碧图(功能参考[CssGaga](http://www.99css.com/archives/542))
 * fix bug:如果没有实现upload.js，则插件加载失败

18 Oct. 2014
 * 支持`incre build -uic=main.css`模式

29 Sept. 2014
 * css minify的时候不使用高级优化选项(noAdvanced)

22 Sept. 2014
 * 增加`jsugly`配置。例如可以配置不被jsugly mangle掉的字符串
 * 增加`incre upload -l`, `incre upload 1,2`, `incre upload 0`

15 Sept. 2014
 * 增加retina_image配置，将css文件中含有的"main@2x.png"转为"main-2x.png"，以解决部分CMS不支持上传文件名带有@字符的文件的问题
 * 支持构建除utf-8以外编码（如gbk）的html，修复去BOM的bug

8 Sept. 2014
 * `incre html -w`监控html根目录下文件改动，自动进行build操作
 * `incre html`去BOM, fix bug

3 Sept. 2014
 * `incre html`去BOM

30 Aug. 2014
 * 提供sample/demo目录，便于理解increjs的使用
 * 构建html功能，专为页面重构工作开发。支持公共页面片提取，页面片模板变量声明等

26 Aug. 2014
 * 在未执行初始化操作时，也能使用`incre -v`和`incre`命令
 * 优化markdown文件html化之后的展现样式

25 Aug. 2014
 * 构建模板时，还可以构建与模板相关的css文件
 * 支持转化markdown文件为html文件，便于浏览

23 Aug. 2014
 * 支持多个js文件merge到一个js文件
 * 支持构建并上传css文件
 * 支持构建前端模版特性

20 Aug. 2014
 * 支持对js文件的普通build、upload，不生成增量文件

29 July 2014
 * 完成increjs的基本功能，init、build、upload、clear等

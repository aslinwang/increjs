change log
============
30 Nov.2015
 * importCss时，自动去除BOM
 * 模版编译之后，去除回车之后的大段空格

22 Nov.2015
 * 升级increjs，支持node-v4.2.2

5 Nov.2015
 * 如果css中没有使用gaga功能，样式gaga过程不能连续

1 Nov.2015
 * 优化`incre html -w`监控目录的逻辑

29 Oct.2015
 * 优化increfile的oneset配置

27 Oct.2015
 * 优化increfile配置
 * `incre html -w`监听目录改动时循环触发的bug

10 Oct.2015
 * 修复不需要二倍图时gaga报错的情况
 * 监控html改动时，监控出错修复

8 Sept. 2015
 * gaga时，修复在替换雪碧图版本号时bug

5 Sept. 2015
 * `incre html`支持指定源文件存放目录，比如放在html/src中，方便按相对目录查找其他资源

2 Sept. 2015
 * background-image 支持rem
 * 废除retina_image配置

28 Aug. 2015
 * 两套雪碧图在gaga时bug

14 Aug. 2015
 * css文件多次引入相同雪碧图时，background-position计算错误

11 Aug. 2015
 * 支持只使用一套雪碧图，即对低分辨率的设备也使用二倍图

5 Aug. 2015
 * cleancss默认会去除样式中的IE hack，配置compatibility为true可阻止

30 June 2015
 * css文件中sprite图片支持不追加版本号的配置
 * 本地上传支持样式文件和sprite图片
 * 新增`incre upload -c`命令，用于清空本地上传目录

3 June 2015
 * 不同目录下的文件允许同名，但同名文件不能超过99个
 * 增加rjs打包引擎控制开关

21 May 2015
 * `incre upload -l`展示路径信息
 * mkdir循环创建目录更改逻辑时候，老的创建目录的方式有误,修复此bug

1 May 2015
 * 新增初始化项目时，nproxy配置文件
 * 使用requirejs编写模块，支持使用rjs打包
 * js压缩配置新增"~"，支持对js文件原样输出
 * css sprite支持背景图使用2倍图（需要在css样式规则中将`background-size:12px 12px;`写在当条规则的最前面）

19 Apr. 2015
 * 新增`incre qzmin`命令

4 Apr. 2015
 * 将cssprite过程从increjs移到gaga中，这样模块可以高内聚，同时可以优化increfile配置

28 Mar. 2015
 * 修复在没有配置cssprite时，报错的问题

20 Mar. 2015
 * 支持css文件中的import模式，打包时会自动寻找import语句，并替换成实际代码（import文件中暂不支持自动css sprite）
 * 支持一个工程中配置多个css文件

9 Mar. 2015
 * 增加upload-local引擎，允许将文件发布到本地，用于页面和前端文件公用域名和服务器的情况

1 Jan. 2015
 * 确保小图的位置一定为偶数，以确保CSS的retina元素的background-position为整数

30 Dec. 2014
 * 将上传部分以引擎的方式独立出来，供第三方结合自身业务特点自由实现
 * 优化`increfile.js`配置文件的编写

29 Dec. 2014
 * htmlmin支持将'\''转为`&#39;`实体字符
 * fix bug:扩展uploadDir参数

8 Dec. 2014
 * 构建时，将代码中的中文转为unicode编码，已解决不同页面编码场景下同一份js代码出现乱码
 * fix bug：对于多文件合并的js文件，如果文件名与单文件名相同，构建内容出错

28 Nov. 2014
 * fix bug:`incre gaga`生成retina code时，如果不存在@2x图，报错停止。对此种情况容错

26 Nov. 2014
 * fix bug:`incre gaga`在处理retina code时,会漏掉相关代码

23 Nov. 2014
 * 修改gaga中文件路径相关部分，便于将.incre配置目录移动到项目内部进行管理

22 Nov. 2014
 * 优化安装。如果未安装GraphicsMagick库，也能安装increjs工具，除`incre gaga`之外的命令仍可使用
 * 更新sample/increfile.js配置

20 Nov. 2014
 * fix bug:`incre gaga`时，autoRetina部分的样式顺序有误

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

/**
 * increjs插件 - gaga
 * 用于处理样式文件，自动生成样式中的雪碧图，处理方式参考cssgaga(http://www.99css.com/archives/542)
 * 
 * @dependencies
 * GraphicsMagick(exe, http://www.graphicsmagick.org/download.html)
 * gmsmith(npm package)
 * 
 * incre gaga
 * 要求：
 * 1、切片图放在slice目录中
 * 2、切片图格式只能为png
 */
var async = require('async');
var fs = require('fs');
var Layout = require('layout');
var concat = require('concat-stream');
var path = require('path');
var cleancss = require('clean-css');
var incre;

// spritesmith
// https://github.com/Ensighten/spritesmith
var Spritesmith = (function(){
  var engine,gm,GmSmith;

  function EngineSmith($engine){
    this.engine = $engine;
  }

  EngineSmith.prototype = {
    // Create multiple images
    createImages : function(files, cb){
      var $engine = this.engine;
      async.waterfall([
        function engineCreateImages(cb){// Mass create images
          $engine.createImages(files, cb);
        },
        function savePaths(imgs, cb){// Save the image paths
          imgs.forEach(function(img, i){// Iterate over the images and save their paths
            img._filepath = files[i];
          });

          cb(null, imgs);// Callback with the images
        }
      ], cb);
    },
    createCanvas : function(width, height, cb){// Helper to create canvas via engine
      var $engine = this.engine;
      return $engine.createCanvas(width, height, cb);
    }
  };

  /**
   * Spritesmith generation function
   * @param {Object} params Parameters for spritesmith
   * @param {String[]} [params.src] Images to generate into sprite sheet
   * @param {String} [params.engine="auto"] Engine to use (phantomjs, canvas, gm, pngsmith, or user-defined via Spritesmith.addEngine)
   * @param {String} [params.algorithm="top-down"] Algorithm to pack images with (top-down or user-defined via Spritesmith.addAlgorithm)
   * @param {Number} [params.padding] Padding to use between images
   * @param {Mixed} [params.exportOpts] Options to pass through to engine for export
   * @param {Function} callback Function that receives compiled spritesheet and map
   * @returns {Mixed} callback[0] err If an error was encountered, this will be returned to callback
   * @returns {Object} callback[1] result Result object of spritesmith
   * @returns {String} callback[1].image Binary string representation of image
   * @returns {Object} callback[1].coordinates Map from file name to an object containing x, y, height, and width information about the source image
   */
  function build(params, callback){
    var retObj = {},
        files = params.src,
        algorithmPref = params.algorithm || 'top-down';

    try{
      GmSmith = require('gmsmith');
      gm = require('gm').subClass({imageMagick : params.imageMagick});
    }catch(e){
      console.log('  Error : has no gmsmith engine! Please install GraphicsMagick lib and reinstall increjs! https://github.com/aslinwang/increjs/issues/3'.red);
      return;
    }

    var engineOpts = params.engineOpts || {};
    engine = new GmSmith(engineOpts);

    // Create our smiths
    var engineSmith = new EngineSmith(engine),
        layer = new Layout(algorithmPref, params.algorithmOpts),
        padding = params.padding || 0,
        exportOpts = params.exportOpts || {},
        packedObj;

    async.waterfall([
      function grabImages(cb){
        engineSmith.createImages(files, cb);
      },
      function smithAddFiles(images, cb){
        images.forEach(function(img){
          var width = img.width,
              height = img.height,
              meta = {'img' : img, 'actualWidth' : width, 'actualHeight' : height};

          // 确保小图的位置一定为偶数，以确保CSS的retina元素的background-position为整数
          var _width = Math.round((width + padding)/2)*2;
          var _height = Math.round((height + padding)/2)*2;
          layer.addItem({'width' : _width, 'height' : _height, 'meta' : meta});
        });

        cb(null);
      },
      function smithOutputCoordinates(cb){
        packedObj = layer['export']();

        var coordinates = {},
            packedItems = packedObj.items;
        packedItems.forEach(function(item){
          var meta = item.meta,
              img = meta.img,
              name = img._filepath;
          coordinates[name] = {
            x : item.x,
            y : item.y,
            width : meta.actualWidth,
            height : meta.actualHeight
          };
        });

        retObj.coordinates = coordinates;

        cb(null);
      },
      function generateCanvas(cb){
        var width = Math.max(packedObj.width || 0, 0),
            height = Math.max(packedObj.height || 0, 0);
        var itemsExist = packedObj.items.length;
        if(itemsExist){
          width -= padding;
          height -= padding;
        }

        retObj.properties = {
          width : width,
          height : height
        };

        if(itemsExist){
          var canvas = engine.createCanvas(width, height);
          // cb(null, canvas);
          process.nextTick(function handleNextTick () {
            cb(null, canvas);
          });
        }
        else{
          cb(null, '');
        }
      },
      function exportCanvas(canvas, cb){
        var items = packedObj.items;
        if(!canvas){
          return cb(null, new Buffer(0));
        }

        // Add the images onto canvas
        try {
          items.forEach(function addImage (item) {
            var img = item.meta.img;
            canvas.addImage(img, item.x, item.y);
          });
        } catch (err) {
          return cb(err);
        }

        // Export our canvas
        var imageStream = canvas['export'](exportOpts);
        imageStream.on('error', cb);
        imageStream.pipe(concat(function handleResult (image) {
          cb(null, image);
        }));
      },
      function saveImage(image, cb){
        retObj.image = image;

        cb(null);
      },
      function smithCallbackData(cb){
        cb(null, retObj);
      }
    ], callback);
  }

  function getGm(){
    return gm;
  }

  return {
    build : build,
    gm : getGm
  }
}());

var GaGa = (function(){
  var dist;//gaga根目录
  var root;//样式根目录
  var sliceDir;//切片图目录
  var src;//待处理样式数组
  var slices = [];//切片图列表
  var slices2x = [];//切片图@2x列表
  var coordinates = {};//坐标存储
  var codes = '';//存储样式代码

  var spriteDir = '.incre/gaga/';//sprite生成目录

  var options = {
    imagestamp : false,
    cssstamp : false,
    newsprite : false
  };
  
  function isenable(){
    var res = true;
    var keys = ['root', 'slice', 'src'];
    if(!incre.config.gaga){
      return false;
    }
    incre.gear._.each(keys, function(v, k){
      if(!incre.config.gaga.hasOwnProperty(v)){
        res = false;
        return;
      }
    });
    return res;
  }

  function createSprite(css, done){
    var config = incre.config.gaga.engine || {};
    var imgList = slices;
    var imgList2x = slices2x;

    var prefix = incre.config.base + root;
    var retinaSize;

    var rem = incre.config.gaga.src[css].rem;
    var has2x;

    imgList = incre.gear._.map(imgList, function(img){
      return incre.config.base + root + sliceDir + img;
    });
    imgList2x = incre.gear._.map(imgList2x, function(img){
      return incre.config.base + root + sliceDir + img;
    });

    if(imgList.length > 0){
      async.waterfall([
        function createSprite(cb){//create sprite
          console.log(('  Info : start gaga ' + css + '...').green);
          Spritesmith.build(incre.gear._.extend(config, {
            src : imgList
          }), function(err, result){
            if(err){
              console.log(('  Error:' + err).red);
            }
            else{
              var dist_sprite = dist + css.replace('css', '') + 'png';
              coordinates.sprite = {};
              incre.gear._.each(imgList, function(v,k){
                coordinates.sprite[v] = result.coordinates[v];
              });
              coordinates.spriteSize = result.properties;
              
              fs.writeFile(dist_sprite, result.image, 'binary', function(err){
                if(err){
                  console.log(('  Error:' + err).red);
                }
                cb(null);
              });
            }
          });
        },
        function verify2x(cb){// verify @2x.png is exist
          var tmpList = [];
          incre.gear._.each(imgList2x, function(v, k){
            if(fs.existsSync(v)){
              tmpList.push(v);
            }
          });
          cb(null, tmpList);
        },
        function createSprite2x(list, cb){// create retina sprite
          if(list.length > 0){
            has2x = true;
            Spritesmith.build(incre.gear._.extend(config, {
              src : list
            }), function(err, result){
              if(err){
                console.log(('  Error:' + err).red);
              }
              else{
                var dist_sprite2x = dist + css.replace('.css', (incre.config.gaga.x2suffix ? incre.config.gaga.x2suffix : '@') + '2x.') + 'png';
                coordinates.sprite2x = {};
                incre.gear._.each(list, function(v,k){
                  coordinates.sprite2x[v] = result.coordinates[v];
                });
                coordinates.sprite2xSize = result.properties;

                fs.writeFile(dist_sprite2x, result.image, 'binary', function(err){
                  if(err){
                    console.log(('  Error:' + err).red);
                  }

                  Spritesmith.gm()(dist_sprite2x).size(function(err, size){
                    if(!err){
                      retinaSize = size;
                      cb(null);
                    }
                    else{
                      console.log(('  Error:' + err).red);
                    }
                  });
                });
              }
            });
          }
          else{
            has2x = false;
            cb(null);
          }
        },
        function replaceCode(cb){
          var distCodes = codes;
          distCodes = distCodes.replace(/background-image\s*:\s*url\((.*)\);?/g, function(match,group,str){
            var img = group.replace(/\'/g, '').replace(/\"/g, '');
            if(img.indexOf('slice') != -1){
              var imgKey = prefix + img;
              var imgV = coordinates.sprite[imgKey];
              var csspos = '';//background-position
              var bgs = 'inherit';//background-size
              var pos = {
                x : imgV.x,
                y : imgV.y
              };

              // oneset/is2in1含义是：是否将多套图统一为一套图
              if(incre.config.gaga.src[css].oneset || incre.config.gaga.src[css].is2in1){
                pos.x = imgV.x / 2;
                pos.y = imgV.y / 2;
                if(rem){
                  bgs = [coordinates.spriteSize.width / 2 / rem, 'rem',' ', coordinates.spriteSize.height / 2 / rem, 'rem'].join('');
                }
                else{
                  bgs = [coordinates.spriteSize.width / 2, 'px',' ', coordinates.spriteSize.height / 2, 'px'].join('');
                }
              }

              if(rem){
                csspos = ['-', pos.x / rem, 'rem -', pos.y / rem, 'rem;'].join('');
              }
              else{
                csspos = ['-', pos.x, 'px -', pos.y, 'px;'].join('');
              }

              return ['background-image:url(sprite/', css.replace('css', 'png') , ');background-position:', csspos, 'background-size: ', bgs, ';'].join('');
            }
            return match;
          });
          cb(null, distCodes);
        },
        function retinaCode(code, cb){
          // 非oneset模式，才生成retina code
          if(!(incre.config.gaga.src[css].oneset || incre.config.gaga.src[css].is2in1) && has2x){
            var minicodes = new cleancss({
              noAdvanced : true,
              compatibility : true
            }).minify(codes);
            RegExp.escape = function (s) {
                return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
            };

            var selectors = {};

            incre.gear._.each(coordinates.sprite, function(img, key){
              key = key.replace(prefix, '');
              var selectorReg = new RegExp('(\\.?[^}]*?)\\s?{\\s?[^}]*?' + RegExp.escape(key), 'ig');
              var selectorRes = minicodes.match(selectorReg);

              incre.gear._.each(selectorRes, function(res,idx){
                var selector = res.replace(selectorReg, '$1');
                selectors[selector] = key;
              });
            });

            var retinaCode = '\n\n@media only screen and (-webkit-min-device-pixel-ratio: 1.5),only screen and (min--moz-device-pixel-ratio: 1.5),only screen and (min-resolution: 240dpi)\n{';
            var rw = Math.floor(retinaSize.width/2),
                rh = Math.floor(retinaSize.height/2);

            incre.gear._.each(selectors, function(imgKey, selector){
              var tmpkey = prefix + imgKey.replace('.png', '@2x.png');
              var img = coordinates.sprite2x[tmpkey];

              if(img){
                var csspos = '';//background-position
                var bgs = '';//background-size

                if(rem){
                  csspos = ['-', img.x / 2 / rem, 'rem -', img.y / 2 / rem, 'rem;'].join('');
                }
                else{
                  csspos = ['-', img.x / 2, 'px -', img.y / 2, 'px;'].join('');
                }

                if(rem){
                  bgs = [rw / rem, 'rem ', rh / rem, 'rem;'].join('');
                }
                else{
                  bgs = [rw, 'px ', rh, 'px;'].join('');
                }

                retinaCode += selector;
                retinaCode += ['{background-image:url(sprite/', css.replace('.css', '@2x.png'), ');background-position:', csspos, 'background-size:', bgs, '}'].join('');
              }
            });

            retinaCode += '\n}\n';
            cb(null, code + retinaCode);
          }
          else{
            cb(null, code);
          }
        },
        function saveCss(code, cb){
          fs.writeFile(dist + css, code, function(err){
            if(err){
              console.log(('  Error:' + err).red);
            }
            console.log(('  Info : ' + css + ' gaga success!').green);
            cb(null);
          });
        }
      ], function(){
        if(done){
          done();
        }
      });
    }
    else{
      async.waterfall([
        function saveCss(cb){
          console.log(('  Info : start write ' + css + '...(without gaga)').green);
          fs.writeFile(dist + css, codes, function(err){
            if(err){
              console.log(('  Error:' + err).red);
            }
            console.log(('  Info : write ' + css + ' success (without gaga)').green);

            cb(null);
          });
        }
      ], function(){
        if(done){
          done();
        }
      });
    }
  }

  function build(){
    if(!isenable()){
      console.log('  Warning : has no gaga config!'.yellow);
      return;
    }
    dist = incre.config.base + spriteDir;
    incre.fs.mkdir('gaga', incre.config.base + '.incre/');//创建存放gaga编译文件的目录
    root = incre.config.gaga.root;
    sliceDir = incre.config.gaga.slice;
    src = [];

    for(var key in incre.config.gaga.src){
      src.push(key);
    }

    function action(){
      var css = src.shift();
      var file = '';
      if(css){
        slices = [];
        slices2x = [];
        file = root + css;

        incre.fs.readFile(file).done(function(data){
          data = data.replace(/background-image\s*:\s*url\((.*)\)/g, function(match,group,str){
            var img = group.replace(/\'/g, '').replace(/\"/g, '');
            if(img.indexOf('slice') != -1){
              slices.push(path.basename(img));
              slices2x.push(path.basename(img).replace('.png', '@2x.png'));
            }
            return match;
          });

          codes = data;

          slices = incre.gear._.uniq(slices);//数组去重
          slices2x = incre.gear._.uniq(slices2x);//数组去重
          
          createSprite(css, function(){
            action();
          });
        });
      }
    }

    action();

    // 1、获取css文件中的background-image图片
    // 2、从incre.config.slice目录中获取1中图片
    // 3、将2中图片合并（如果retina=true，则合并两份），并记录每张图的position(难点！)
    // 4、替换css文件的background-image和background-position属性
    // 5、增加media query，对retina设备的支持
    //
    // x.css->.incre/gaga/x.css(文件内容改变)：incre gaga
    //
    // 如果雪碧图有更新：incre build -uic=x.css  记得回写cssprite版本号
    // 如果雪碧图无更新：incre build
    //
    // 上传文件：incre upload x
    

  }

  // 上传雪碧图，并追加retina代码
  // cfg.fpMap filepathMap
  // cfg.ver 版本号
  function cssprite(file, imgcss, success, fail, cfg){
    var uploadDir = incre.config.base + '.incre/upload/';
    // if(!incre.config.cssprite || !incre.config.cssprite.root){//@todo 如果有上次储存的图片版本号，则持续向下执行
    // if(!incre.config.cssprite){//@todo 如果有上次储存的图片版本号，则持续向下执行  
    //   if(fail){
    //     fail();
    //   }
    //   return;
    // }
    incre.CONFIG.cssprite_root = spriteDir;

    var k = path.basename(file);
    var v = incre.config.gaga.src[k];

    if(!v){//未配置cssprite
      if(fail){
        fail();
      }
      return;
    }

    function action(){
      if(incre.CONFIG.cssprite_root + k == file){
        //上传css图片，并修改版本号。考虑异步调用对后面写文件操作的影响
        //1、将图片复制到上传目录中
        //2、获取图片的索引
        //3、上传图片
        var vers = {};//版本号对象,basename
        var f = [];//图片文件列表
        incre.gear._.each(v, function(_ver, _f){
          // 处理非文件名的配置
          if(['oneset', 'rem', 'is2in1'].indexOf(_f) == -1){
            f.push(_f);
            vers[path.basename(_f).replace(/@2x\.png/g, '-2x.png')] = _ver;//对于不支持上传文件名带有@符号文件的CMS，将@2x改为-2x
          }
        });

        if(imgcss == k){
          v = incre.gear._.map(f, function(i){
            return incre.CONFIG.cssprite_root + i;
          });
          var v2 = incre.gear._.clone(v);
          incre.fs.copyFiles(v, uploadDir, function(cur){
            var ver = '';
            cur = cur.replace('@2x', '-2x');
            if(vers[cur] != '-'){
              ver = '_' + cfg.ver;
            }
            return [
              { match : '@', replacement : '-'},
              { match : '.png', replacement : ver + '.png'}
            ]
          }).done(function(v1){
            console.log('  Info : write css sprite images success.');

            var filePathMap = {};
            incre.gear._.each(v2, function(value, key){
              value = path.basename(value.replace('@', '-'));
              filePathMap[value] = incre.config.upload.project + (incre.config.gaga.sprite ? incre.config.gaga.sprite : '/sprite/');
            });

            v1 = incre.gear._.map(v1, function(i){
              return incre.uploader.indexOf(i, uploadDir);
            });

            incre.uploader.uploadDir(uploadDir, v1, incre.gear._.extend(incre.config, {
              // cdnpath : incre.config.upload.cdnpath,
              // cdncsspath : incre.config.upload.cdncsspath,
              pathmap : incre.config.pathmap,
              filePathMap : incre.gear._.extend(filePathMap, cfg.fpMap),
              cdn : incre.config.upload.cdncssimgpath
            }), function(verObj){
              console.log('  Info : upload css sprite images success.'.green);

              if(success){
                success(verObj);
              }
            });
          });
        }
        else{
          if(success){
            success(vers);
          }
        }
      }
    }

    action();
  }

  // 替换图片名中的@2x为-2x
  function replace2x(code, file){
    var tmpcode = code;
    tmpcode = tmpcode.replace(/@2x\.png/g, '-2x.png');//对于不支持上传文件名带有@符号文件的CMS，将@2x改为-2x
    if(tmpcode.indexOf('-2x.png') != -1){
      console.log(('  Warning : file ' + file + ' has retina images! Turn their names to "*-2x.png"!').yellow);
    }

    return tmpcode;
  }

  return {
    build : build,
    cssprite : cssprite,
    replace2x : replace2x
  }
}());

exports.cssprite = function(file, imgcss, success, fail, cfg){
  GaGa.cssprite(file, imgcss, success, fail, cfg);
}

exports.replace2x = function(code, file){
  return GaGa.replace2x(code, file);
}

exports.init = function(_incre){
  incre = _incre;
  incre.CONFIG = incre.CONFIG || {};
  incre.commander.command({
    cmd : 'gaga',//incre gaga
    description : 'precompile css like cssgaga',
    handler : function(){
      GaGa.build();
    }
  });
}
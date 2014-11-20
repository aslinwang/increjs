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
var path = require('path');
var cleancss = require('clean-css');
var incre;

// spritesmith
// https://github.com/Ensighten/spritesmith
var Spritesmith = (function(){
  var engine;
  try{
    var engine = require('gmsmith');
    var gm = require('gm');
  }catch(e){
    console.log('  Error : has no gmsmith engine!'.red);
  }

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

  function CanvasSmith($canvas){
    this.canvas = $canvas;
  }
  CanvasSmith.prototype = {
    addImage : function(imgObj){
      var img = imgObj.meta.img,
          x = imgObj.x,
          y = imgObj.y,
          $canvas = this.canvas;
      $canvas.addImage(img, x, y);
    },
    addImages : function(images){
      var _this = this;
      images.forEach(function(img){
        _this.addImage(img);
      });
    },
    addImageMap : function(imageMap){
      var _this = this,
          imageNames = Object.getOwnPropertyNames(imageMap);

      imageNames.forEach(function(name){// Add the images
        var image = imageMap[name];
        _this.addImage(image);
      });
    },
    export : function(options, cb){
      this.canvas['export'](options, cb);
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

    // If there is a set parameter for the engine, use it
    if(engine.set){
      var engineOpts = params.engineOpts || {};
      engine.set(engineOpts);
    }

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

          layer.addItem({'width' : width + padding, 'height' : height + padding, 'meta' : meta});
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
          engine.createCanvas(width, height, cb);
        }
        else{
          cb(null, '');
        }
      },
      function exportCanvas(canvas, cb){
        var items = packedObj.items;
        if(!canvas){
          return cb(null, '');
        }

        var canvasSmith = new CanvasSmith(canvas);

        canvasSmith.addImages(items);

        canvasSmith['export'](exportOpts, cb);
      },
      function saveImageToRetObj(imgStr, cb){
        retObj.image = imgStr;

        cb(null);
      },
      function smithCallbackData(cb){
        cb(null, retObj);
      }
    ], callback);
  }

  return {
    build : build,
    gm : gm
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

  function createSprite(css){
    var config = incre.config.gaga.engine || {};
    var imgList = slices;
    var imgList2x = slices2x;

    var prefix = './mobi/css/';
    var retinaSize;

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
              coordinates.sprite = result.coordinates;
              fs.writeFile(dist_sprite, result.image, 'binary', function(err){
                if(err){
                  console.log(('  Error:' + err).red);
                }
                cb(null);
              });
            }
          });
        },
        function createSprite2x(cb){// create retina sprite
          if(imgList2x.length > 0){
            Spritesmith.build(incre.gear._.extend(config, {
              src : imgList2x
            }), function(err, result){
              if(err){
                console.log(('  Error:' + err).red);
              }
              else{
                var dist_sprite2x = dist + css.replace('.css', '@2x.') + 'png';
                coordinates.sprite2x = {};
                incre.gear._.each(imgList2x, function(v,k){
                  coordinates.sprite2x[v] = result.coordinates[v];
                });

                fs.writeFile(dist_sprite2x, result.image, 'binary', function(err){
                  if(err){
                    console.log(('  Error:' + err).red);
                  }
                  Spritesmith.gm(dist_sprite2x).size(function(err, size){
                    if(!err){
                      retinaSize = size;
                      cb(null);
                    }
                  });
                });
              }
            });
          }
          else{
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

              return ['background-image:url(sprite/', css.replace('css', 'png') , ');background-position:-', imgV.x, 'px -', imgV.y, 'px;'].join('');
            }
            return match;
          });
          cb(null, distCodes);
        },
        function retinaCode(code, cb){
          if(incre.config.retina_image){
            var minicodes = new cleancss({
              noAdvanced : true
            }).minify(codes);
            RegExp.escape = function (s) {
                return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
            };

            var selectors = {};

            incre.gear._.each(coordinates.sprite, function(img, key){
              key = key.replace(prefix, '');
              var selectorReg = new RegExp('(\\.?[^}]*?)\\s?{\\s?[^}]*?' + RegExp.escape(key), 'ig');
              var selectorRes = minicodes.match(selectorReg);
              var selector = selectorRes.length > 0 ? selectorRes[0].replace(selectorReg, '$1') : null;
              
              selectors[key] = selector;
            });
            // code = code.replace(/(.*){background-image\s*:\s*url\((.*)\)/g, function(match,group,str){
            //   var img = group.replace(/\'/g, '').replace(/\"/g, '');
            //   if(img.indexOf('slice') != -1){
            //     slices.push(path.basename(img));
            //     slices2x.push(path.basename(img).replace('.png', '@2x.png'));
            //   }
            //   return match;
            // });

            var retinaCode = '\n\n@media only screen and (-webkit-min-device-pixel-ratio: 1.5),only screen and (min--moz-device-pixel-ratio: 1.5),only screen and (min-resolution: 240dpi)\n{';
            var rw = Math.floor(retinaSize.width/2),
                rh = Math.floor(retinaSize.height/2);
            incre.gear._.each(coordinates.sprite2x, function(img, key){
              var tmpkey = key.replace(prefix, '').replace('@2x', '');
              
              retinaCode += selectors[tmpkey];
              retinaCode += ['{background-image:url(sprite/', css.replace('.css', '@2x.png'), ');background-position:-', img.x/2, 'px -', img.y/2, 'px;background-size:', rw, 'px ', rh, 'px;}'].join('');
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
        
      });
    }
  }

  function build(){
    if(!isenable()){
      console.log('  Warning : has no gaga config!'.yellow);
      return;
    }
    dist = incre.config.base + '.incre/gaga/';
    incre.fs.mkdir('gaga', incre.config.base + '.incre');//创建存放gaga编译文件的目录
    root = incre.config.gaga.root;
    sliceDir = incre.config.gaga.slice;
    src = incre.config.gaga.src;

    incre.gear._.each(src, function(v, k){
      var file = root + v;
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
        
        createSprite(v);
      });
    });

    // √1、获取css文件中的background-image图片
    // √2、从incre.config.slice目录中获取1中图片
    // 3、将2中图片合并（如果retina=true，则合并两份），并记录每张图的position(难点！)
    // 4、替换css文件的background-image和background-position属性
    // 5、增加media query，对retina设备的支持
    //
    //x.css->.incre/gaga/x.css(文件内容改变)：incre gaga
    //
    //如果雪碧图有更新：incre build -uic=x.css  记得回写cssprite版本号
    //如果雪碧图无更新：incre build
    //
    //上传文件：incre upload x
    

  }

  return {
    build : build
  }
}());

exports.init = function(_incre){
  incre = _incre;
  incre.commander.command({
    cmd : 'gaga',//incre gaga
    description : 'precompile css like cssgaga',
    handler : function(){
      GaGa.build();
    }
  });
}
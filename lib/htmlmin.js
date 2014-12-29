function htmlmin(strHtml, isMustache) {
  var _r = strHtml,
    _sl = strHtml.length,
    _arr,
    _isComment,
    _newArr = [];

  if (isMustache) {
    _arr = strHtml.split(/[\n\r]/);

    _isComment = false;
    _arr.forEach(function (o) {
      if (o === '{{!') {
        _isComment = true;
      }
      if (!_isComment) {
        o = o.replace(/^\s+|\s+$/g, '');
        if (o !== '') {
          _newArr.push(o);
        }
      }
      if (o === '}}') {
        _isComment = false;
      }
    });
    _r = _newArr.join(' ');
  }

  _r = _r.replace(/\\'/g, "&#39;"); //
  _r = _r.replace(/(\n|\r)/g, ""); //del \n
  _r = _r.replace(/>([\x20\t]+)</g, "><"); //del blank & tab
  _r = _r.replace(/^\s+|\s+$/g, ""); // trim blank
  _r = _r.replace(/<!--.+?-->/g, ""); // del comment
  _r = _r.replace(/\\/g, "\\\\"); //
  _r = _r.replace(/'/g, "\\'"); //
  return _r;
}

exports.htmlmin = htmlmin;
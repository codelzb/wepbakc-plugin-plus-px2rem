var _ = require('lodash');
var utils = require('loader-utils');
const path = require('path')
var isOpen = false
var postcssConfig
try{
    let postcssPath = path.resolve(path.resolve(),'./postcss.config.js')
    postcssConfig = require(postcssPath);
}catch(err){
    console.log('读取postcss.config.js时发生错误',err);
}
module.exports = function (source) {
    if (_.isUndefined(this.cacheable)) return source;
    this.cacheable();
    var query = utils.getOptions(this),
        basePx = !_.isUndefined(query.basePx) ? query.basePx : 10,
        min = !_.isUndefined(query.min) ? query.min : 0,
        exclude = !_.isUndefined(query.exclude) ? query.exclude : null,
        floatWidth = !_.isUndefined(query.floatWidth) ? query.floatWidth : 3,
        matchPXExp = /([0-9,.]+px)([;| |}|'|"|);|/])/g;
    
    if(postcssConfig&&postcssConfig.plugins&&postcssConfig.plugins.length){
        isOpen = postcssConfig.plugins.find(item => item.postcssPlugin===query.followPostcss)
    }
    if(query.followPostcss){
        if(isOpen){
            return source.replace(matchPXExp, function (match, m1, m2) {
                var pxValue = parseFloat(m1.slice(0, m1.length - 2));
                if (pxValue <= min) return match;
                if (exclude&& pxValue == exclude) return match;
                var remValue = pxValue / basePx;
                if (pxValue % basePx != 0)
                    remValue = (pxValue / basePx).toFixed(floatWidth);
                return remValue + 'rem' + m2;
            });
        }else{
            return source
        }
    }else{
        return source.replace(matchPXExp, function (match, m1, m2) {
            var pxValue = parseFloat(m1.slice(0, m1.length - 2));
            if (pxValue <= min) return match;
            if (exclude&& pxValue == exclude) return match;
            var remValue = pxValue / basePx;
            if (pxValue % basePx != 0)
                remValue = (pxValue / basePx).toFixed(floatWidth);
            return remValue + 'rem' + m2;
        });
    }
};


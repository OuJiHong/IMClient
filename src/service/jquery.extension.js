/**
 * Created by OJH on 2017/8/29.
 * jquery 的扩展
 */


var jQuery = require("jquery");

window.jQuery = jQuery;
window.$ = jQuery;
require("velocity-animate");
require("velocity-animate/velocity.ui.js");
module.exports = jQuery;

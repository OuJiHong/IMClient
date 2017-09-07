/**
 * 主程序入口
 *
 */
import $ from "jquery";
import util  from "./service/util";
import LoginInit from "./component/login";

import "./css/reset.css";
import "./css/common.css";

import * as stropheJs from "strophe.js";

window.util = util;
window.stropheJs = stropheJs;

$(function(){

    LoginInit();

});







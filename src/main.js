/**
 * 主程序入口
 *
 */
import $ from "./service/jquery.extension";
import util  from "./service/util";
import LoginInit from "./component/login";

import "./css/reset.css";
import "./css/common.css";

window.util = util;

$(function(){

    LoginInit();

});







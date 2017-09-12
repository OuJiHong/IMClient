/**
 * 主程序入口
 *
 */
import $ from "jquery";
import util  from "./util/util";
import { LoginInit } from "./component/login";

import "./css/common.css";

import * as stropheJs from "strophe.js";

$(function(){

    LoginInit();

});


//test
window.util = util;





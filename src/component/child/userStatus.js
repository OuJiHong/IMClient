/**
 * Created by OJH on 2017/9/8.
 */
import userStatusTemplate from "./userStatus.art";
import util from "../../util/util";
import { Logger } from "../../service/logger";
import $ from "jquery";
import { client }  from "../login";


var logger = new Logger("userStatus");

/**
 * 初始化出席状态
 */
function initUserStatus(){


    var userStatusNode = $("<article></article>");


    //other
    var initData = {

    };

    userStatusNode.html(userStatusTemplate(initData));


    //用户状态变动
    client().off("userStatusChange").onUserStatusChange(function(stanza, statusMsg){
        logger.debug("用户状态改变：" + stanza.outerHTML + ">>" + statusMsg);
    });


    return userStatusNode;

}


export {
    initUserStatus
};


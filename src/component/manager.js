/**
 * Created by OJH on 2017/9/8.
 */

import util from "../util/util";
import { initUserStatus } from "./child/userStatus";
import { initRoster } from "./child/roster";
import $ from "jquery";
import managerTemplate from "./manager.art";


var hostPopup = util.popup({
    content:managerTemplate(),
    position:"bottom right"
});

function getManagerHeader(){
    var content = hostPopup.getContent();
    var body = content.find("[data-xmpp='header']");
    if(body.length == 0){
        return content;
    }
    return body;
}

function getManagerBody(){
    var content = hostPopup.getContent();
    var body = content.find("[data-xmpp='body']");
    if(body.length == 0){
        return content;
    }
    return body;
}




/**
 * 初始化管理面板，
 * 必须登录之后调用
 *
 */
function initManager(){

    var userStatusNode = initUserStatus();
    var rosterNode = initRoster();

    getManagerHeader().html(userStatusNode);
    getManagerBody().html(rosterNode);

    hostPopup.open();

}


export {
    initManager
}
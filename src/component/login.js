/**
 * 登录
 *
 */

import { Client } from "../service/client";
import $ from "jquery";
import loginTemplate from './login.art'
import util from "../util/util";
import { Logger } from "../service/logger";
import { initManager } from "./manager";



const logger = new Logger("login");

//当前客户端
var currentClient = null;
var hostPopup = util.popup(loginTemplate());

/**
 * 初始化客户端
 * @param username
 * @param password
 */
function initClient(username, password){


    if(currentClient != null){
        //断开原有连接
        currentClient.disconnect("用户重新登录 - " + username);
    }


    var client = new Client(username, password);

    var msgOperation = util.showLoading("正在登录...");
    client.onConnectStatusChange(function(status, statusMsg){
        logger.debug("initClient:" + status + ">>" + statusMsg);
    });

    client.onConnectSuccess(function(status, statusMsg){
        hostPopup.close();
        msgOperation.close();
        //进入联系人面板
        initManager();
    });

    client.onConnectError(function(status, statusMsg){
        msgOperation.close();
        util.showError(statusMsg);
    });


    //连接
    client.connect();

    //test
    window.client = client;

    return client;
}


/**
 * 登录初始化
 * @constructor
 */
function LoginInit() {

    var $form = hostPopup.getContent().find("form");
    $form.submit(function(evt){
        evt.preventDefault();
        var formData = util.formData($form);
        if(util.isEmpty(formData.username)){
            util.toast("请输入用户名");
            return false;
        }
        if(util.isEmpty(formData.password)){
            util.toast("请输入密码");
            return false;
        }

        var client = initClient(formData.username, formData.password);
        currentClient = client;//设置当前客户端

    });


    hostPopup.open();

}

/**
 * 获取当前客户端
 * @returns {*}
 */
function client(){
    if(currentClient == null){
        LoginInit();
        throw new Error("客户端尚未初始化");
    }

    return currentClient;
}


export {
    LoginInit,
    initClient,
    client
}




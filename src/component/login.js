/**
 * 登录
 *
 */

import { Strophe } from "strophe.js";
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

    var Status = Strophe.Status;

    var client = new Client(username, password);

    var msgOperation = util.showLoading("正在登录...");
    client.onConnectStatusChange(function(status, statusMsg){
        logger.debug("initClient:" + status + ">>" + statusMsg);

        if(status == Status.CONNECTED  || status === Status.ATTACHED){
            //连接成功
            client.setUserStatus();//初始化用户在线状态


            //connection.authzid;//授权标识
            //connection.authcid;//认证标识（用户名称）
            //connection.pass;//认证标识（密码）
            //connection.servtype;//服务类型（MD5）


            hostPopup.close();
            msgOperation.close();
            //进入联系人面板
            initManager();

        }else if(status == Status.ERROR || status == Status.AUTHFAIL || status == Status.CONNFAIL || status == Status.CONNTIMEOUT){
            msgOperation.close();
            util.showError(statusMsg);

        }else if(status == Status.DISCONNECTED){
            msgOperation.close();
            util.showError(statusMsg);
        }

    });

    client.on("error", function(stanza){
        logger.error("receive error:" , stanza);
    });


    //连接
    client.connect();

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

    return $form;
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




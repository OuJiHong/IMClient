/**
 * Created by OJH on 2017/8/30.
 * 功能服务
 */
import { Client } from "../service/client";
import { Logger } from "../service/logger";

const logger = new Logger("imService");

let currentClient = null;

function initClient(username, password){


    if(currentClient != null){
        //断开原有连接
        currentClient.disconnect("用户重新登录 - " + username);
    }


    var client = new Client(username, password);

    currentClient = client;//设置当前客户端

    var msgOperation = util.showLoading("正在登录...");
    client.onConnectStatusChange(function(status, statusMsg){
        logger.debug("initClient:" + status + ">>" + statusMsg);
        msgOperation.changeMsg(statusMsg);
    });

    client.onConnectSuccess(function(status, statusMsg){
        msgOperation.close();
        //进入联系人面板
        util.toast(statusMsg);
    });

    client.onConnectError(function(status, statusMsg){
        msgOperation.close();
        util.showError(statusMsg);
    });


    //用户状态变动
    client.onUserStatusChange(function(statusMsg, userStatus){
        logger.debug("用户状态改变：" + statusMsg + ">>" + userStatus);
    });


    //test
    window.cc = currentClient;
}


let imService = {
    initClient:initClient
};


export default imService;


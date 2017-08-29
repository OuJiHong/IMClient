/**
 * Created by OJH on 2017/8/29.
 * xampp 客户端
 *
 */
import { Strophe, $build, $msg, $iq, $pres } from "strophe.js";


/**
 * 连接状态常量
 *
 Status.ERROR	(发生了一个错误)An error has occurred
 Status.CONNECTING	(当前正在连接)The connection is currently being made
 Status.CONNFAIL	(连接请求失败)The connection attempt failed
 Status.AUTHENTICATING	(连接进行身份验证)The connection is authenticating
 Status.AUTHFAIL	(身份验证请求失败)The authentication attempt failed
 Status.CONNECTED	(连接成功)The connection has succeeded
 Status.DISCONNECTED	(连接已终止)The connection has been terminated
 Status.DISCONNECTING	(目前连接被终止)The connection is currently being terminated
 Status.ATTACHED	(已附加的连接)The connection has been attached
 Status.REDIRECT	(连接被重定向)The connection has been redirected
 Status.CONNTIMEOUT	(连接已超时)The connection has timed out
 *
 *

 LogLevel.DEBUG	Debug output
 LogLevel.INFO	Informational output
 LogLevel.WARN	Warnings
 LogLevel.ERROR	Errors
 LogLevel.FATAL	Fatal errors

 *
 *

 三种特别的片段:XML 节（XML stanzas）

 <message/>
 <presence/>
 <iq/>

 用户可用状态:
 聊天
    说明你有能力，并且积极寻求谈话（可能你十分善于社交）
 离开
    表明你暂时离开了 IM 客户端、电脑、或者设备一段时间，这个状态经常是不通过手动
    操作进行的，通过“自动离开”功能即可实现，现在许多 IM 客户端都有这个功能。
 长时间离开
    说明你要离开更长的一段时间，你的 IM 客户端同样可以自动实现这个功能。
 忙碌
    说明你现在很忙并不希望被打扰
 *
 *
 */


//配置
const serverHost = "openfire.zhongqi.com";
const serverAddress = "http://" + serverHost + "/http-bind/";

const eventType = {
    message:"message",
    connectSuccess:"connectSuccess",
    connectStatusChange:"connectStatusChange",
    connectError:"connectError",
    disconnect:"disconnect"
};

//连接状态翻译
const Status = Strophe.Status;
const statusMap = {

};
statusMap[Status.ERROR] = "发生了一个错误";
statusMap[Status.CONNECTING] = "当前正在连接";
statusMap[Status.CONNFAIL] = "连接请求失败";
statusMap[Status.AUTHENTICATING] = "连接进行身份验证";
statusMap[Status.CONNECTED] = "连接成功";
statusMap[Status.DISCONNECTED] = "连接已终止";
statusMap[Status.DISCONNECTING] = "目前连接被终止";
statusMap[Status.ATTACHED] = "已附加的连接";
statusMap[Status.REDIRECT] = "连接被重定向";
statusMap[Status.CONNTIMEOUT] = "连接已超时";

/**
 * 事件绑定存储
 * @type {{}}
 */
const eventHandler = {

};

/**
 * 添加处理函数
 * @param name
 * @param handler
 * @returns {*}
 */
function addHandler(name, handler){
    if(name != null && typeof handler == "function"){
        var handlerAry = eventHandler[name];
        if(handlerAry == null){
            handlerAry = [];
            eventHandler[name] = handlerAry;
        }
        handlerAray.push(handler);
    }

    return eventHandler[name];
}

/**
 * 移除处理函数
 * @param name
 */
function removeHandler(name){
    var count = 0;
    if(name != null){
        var handlerAry = eventHandler[name];
        if(handlerAry != null){
            count = handlerAry.length;
           delete eventHandler[name];
        }

    }

    return count;
}

/**
 * 触发处理函数
 * @param name
 * @param thisArg
 * @param args
 * @returns {number}
 */
function triggerHandler(name, thisArg, args){
    var count = 0;
    if(name != null){
        var handlerAry = eventHandler[name];
        if(handlerAry != null){
           for(let i = 0 ; i < handlerAry.length; i++){
                let handler = handlerAry[i];
                handler && handler.apply(thisArg, args);
                count++;
           }

        }

    }

    return count;
}


function Client(username, password){

    if(this instanceof Client){

        this.username = username;
        this.password = password;
        //创建一个连接对象
        this.connection = new Strophe.Connection(serverAddress, {});

        this.connect();


    }else{
        throw new Error("Please use the new  Client  object creation");
    }

}

/**
 * 建立连接
 * @returns {Strophe.Connection|Connection}
 */
Client.prototype.connect = function(){
    var connection = this.connection;
    //重置连接，以便重复利用
    connection.reset();

    var jid = this.username;
    var pass = this.password;
    //回调处理状态
    var callback = function(status){
        if(status == Strophe.Status.CONNECTED){
            //连接成功
            var successMsg = statusMap[status];
            triggerHandler(eventType.connectSuccess, connection, [status, successMsg]);

        }else if(status == Status.ERROR || status == Status.CONNFAIL || status == Status.CONNTIMEOUT){
            var errorMsg = statusMap[status];
            triggerHandler(eventType.connectError, connection, [status, errorMsg]);
        }

        //连接状态改变
        var statusMsg = statusMap[status];
        triggerHandler(eventType.connectStatusChange, connection, [status, errorMsg]);
    };

    var wait = null;
    var hold = null;
    var route = null;
    var authcid = null;

    connection.connect(jid, pass, callback, wait, hold, route, authcid);

    return this;

};

/**
 * 断开连接
 * @param reason
 * @returns {Client}
 */
Client.prototype.disconnect = function(reason){

    this.connection.disconnect(reason);

    return this;
};

/**
 * 发送消息
 * @param jid
 * @param msg
 * @returns {Client}
 */
Client.prototype.sendMessage = function(jid, msg){



    return this;
};


/**
 * 添加事件处理
 * @param name
 * @param handler
 * @returns {Client}
 */
Client.prototype.on = function(name, handler){
    addHandler(name, handler);
    return this;
};

/**
 * 移除事件处理
 * @param name
 * @returns {Client}
 */
Client.prototype.off = function(name){
    removeHandler(name);
    return this;
};


Client.prototype.onMessage = function(handler){
    addHandler(eventType.message, handler);
    return this;
};

Client.prototype.onConnectSuccess = function(handler){
    addHandler(eventType.connectSuccess, handler);
    return this;
};

Client.prototype.onConnectError = function(handler){
    addHandler(eventType.connectError, handler);
    return this;
};

Client.prototype.onDisConnect = function(handler){
    addHandler(eventType.disconnect, handler);
    return this;
};



/**
 * 导出客户端
 */
export {
    Client
};


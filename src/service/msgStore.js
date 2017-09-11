/**
 * Created by OJH on 2017/9/8.
 * 消息存储服务
 *
 */
import $ from "jquery";

/**
 * 缓存消息数据
 * @type {{}}
 */
var dataStore = {

};

/**
 * 事件处理缓存
 * @type {{}}
 */
var messageChangeHandlers = {

};

var unreadChangeHandlers = {

};

var chatStatusChangeHandlers = {

};

/**
 * 定义数据格式
 * @constructor
 */
function DataItem(){
    if(this instanceof DataItem){
        this.alreadyRead = [];
        this.unread = [];
        return;
    }

    throw new Error("please use 'new DataItem' create object");

}

DataItem.prototype.alreadyRead = null;
DataItem.prototype.unread = null;

DataItem.prototype.add = function(msgObj){
    this.unread.push(msgObj);
};

DataItem.prototype.read = function(){
    var msgObj = this.unread.shift();
    if(msgObj != null){
        this.alreadyRead.push(msgObj);
    }

    return msgObj;
};

DataItem.prototype.size = function(){
    return (this.alreadyRead.length + this.unread.length);
};

DataItem.prototype.remove = function(index){
    this.alreadyRead.splice(index,1);
};

DataItem.prototype.clearReadMsg = function(){
    this.alreadyRead.splice(0);
};



/**
 * 添加消息
 * @param jid
 * @param msgObj
 * @param msgObj
 */
function addMsg(jid, msgObj){
    var dataItem = dataStore[jid];
    if(dataItem == null){
        dataItem = new DataItem();
        dataStore[jid] = dataItem;
    }

    dataItem.add(msgObj);
    if(dataItem.size() >= 500){
        dataItem.remove(0);//移除一条数据
    }

    emitMessageChange(jid, []);

    emitUnreadSizeChange(jid, [getUnreadSize(jid)]);
}

/**
 * 渲染视图
 * @param jid
 * @param handler
 */
function render(jid, handler){
    //获取未读消息
    var dataItem = dataStore[jid];
    var msgObj = null;
    var count = 0;
    if(dataItem != null){
        while((msgObj = dataItem.read()) != null){
            handler(msgObj);
            count++;
        }
    }


    emitUnreadSizeChange(jid, [getUnreadSize(jid)]);

    return count;
}


function getDataItem(jid){
    var dataItem = dataStore[jid];;
    return dataItem;
}


function getUnreadSize(jid){
    var dataItem = getDataItem(jid);
    if(dataItem == null){
        return 0;
    }else{
        return dataItem.unread.length;
    }

}

function getAlreadyReadSize(jid){
    var dataItem = getDataItem(jid);
    if(dataItem == null){
        return 0;
    }else{
        return dataItem.alreadyRead.length;
    }
}

/**
 * 消息改变监听
 *
 */
function onMessageChange(jid, handler){

    if(jid != null){
        var callbacks = messageChangeHandlers[jid];
        if(callbacks == null){
            callbacks = $.Callbacks("stopOnFalse");
            messageChangeHandlers[jid] = callbacks;
        }
        callbacks.add(handler);
    }

    //emit one
    emitMessageChange(jid, []);

}

function emitMessageChange(jid, args){
    var callbacks = messageChangeHandlers[jid];
    if(callbacks != null){
        callbacks.fireWith(jid, args);
    }
}


/**
 * 未读消息变动监听
 * @param handler
 */
function onUnreadSizeChange(jid, handler){
    if(jid != null){
        var callbacks = unreadChangeHandlers[jid];
        if(callbacks == null){
            callbacks = $.Callbacks("stopOnFalse");
            unreadChangeHandlers[jid] = callbacks;
        }
        callbacks.add(handler);
    }

    //emit one
    emitUnreadSizeChange(jid, [getUnreadSize(jid)]);
}

/**
 * 触发未读消息
 * @param jid
 * @param args
 */
function emitUnreadSizeChange(jid, args){
    var callbacks = unreadChangeHandlers[jid];
    if(callbacks != null){
        callbacks.fireWith(jid, args);
    }
}

/**
 * 聊天状态改变监听
 * @param jid
 * @param handler
 */
function onChatStatusChange(jid, handler){
    if(jid != null){
        var callbacks = chatStatusChangeHandlers[jid];
        if(callbacks == null){
            callbacks = $.Callbacks("stopOnFalse");
            chatStatusChangeHandlers[jid] = callbacks;
        }
        callbacks.add(handler);
    }

    //emit one
    emitChatStatus(jid, ["gone"]);
}


function emitChatStatus(jid, args){
    var callbacks = chatStatusChangeHandlers[jid];
    if(callbacks != null){
        callbacks.fireWith(jid, args);
    }
}


/**
 * 清空消息
 * @param jid
 * @param renderArea
 */
function clearMsg(jid, renderArea){
    delete dataStore[jid];
    renderArea.empty();

}


var msgStore = {
    addMsg: addMsg,
    render:render,
    getDataItem:getDataItem,
    getUnreadSize:getUnreadSize,
    getAlreadyReadSize:getAlreadyReadSize,
    clearMsg:clearMsg,
    onMessageChange:onMessageChange,
    onUnreadSizeChange:onUnreadSizeChange,
    onChatStatusChange:onChatStatusChange,
    emitChatStatus:emitChatStatus
};


export {
    msgStore
};


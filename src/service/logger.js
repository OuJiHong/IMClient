/**
 * Created by OJH on 2017/8/23.
 */

var debug = true;

function Logger(name){
    if(this instanceof Logger){
        //标识名称
        this.name = name;
    }else{
        throw new Error("Please use the new  Logger object creation");
    }
}

/**
 * 普通消息
 * @param msg
 */
Logger.prototype.info = function(msg){
    console.log(this.name + ":" + msg);
}

/**
 * 调试信息
 * @param msg
 */
Logger.prototype.debug = function(msg){
    if(debug){
        console.log("[DEBUG "+this.name+" ] - " + msg);
    }
}

/**
 * 错误信息
 * @param msg
 * @param e
 */
Logger.prototype.error= function(msg, e){
    console.error(this.name + ":" + msg, (e ? e.stack : ""));
}

export {
    Logger
};

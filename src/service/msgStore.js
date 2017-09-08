/**
 * Created by OJH on 2017/9/8.
 * 消息存储服务
 *
 */
import $ from "jquery";

var scrollTimerVal = null;

/**
 * 自动滚动到底部
 *
 * @param renderArea
 */
function autoScroll(renderArea){
    clearTimeout(scrollTimerVal);
    scrollTimerVal = setTimeout(function(){
        var $renderArea = $(renderArea);
        var maxScrollTop = $renderArea.prop("scrollHeight") - $renderArea.height();
        $renderArea.stop(true,true).animate({scrollTop:maxScrollTop});
    },100);
}


/**
 * 添加消息
 * @param renderArea
 * @param strTemplate
 * @param msgObj
 */
function addMsg(renderArea, strTemplate, msgObj){
    var msgHtml = strTemplate(msgObj);
    renderArea.append(msgHtml);
    autoScroll(renderArea);
}


/**
 * 清空消息
 * @param renderArea
 */
function clearMsg(renderArea){

}


var msgStore = {
    addMsg: addMsg,
    clearMsg:clearMsg
};


export {
    msgStore
};


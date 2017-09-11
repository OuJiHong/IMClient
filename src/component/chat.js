/**
 * Created by OJH on 2017/9/8.
 */

import util from "../util/util";
import $ from "jquery";
import chatPanelTemplate from "./chatPanel.art";
import chatMsgTemplate from "./chatMsg.art";
import chatUserTemplate from "./chatUser.art";
import chatContainerTemplate from "./chatContainer.art";
import { client } from "./login";
import { msgStore } from "../service/msgStore";


var hostPopup = util.popup(chatContainerTemplate());

/**
 * 获取面板唯一id
 *
 */
function getDomId(jid){
    var id = "chat_panel_" + client().nodeJid(jid);
    return id;
}

/**
 * 获取用户容器
 */
function getChatUserContainer(){
    var content = hostPopup.getContent();
    var body = content.find(".xmpp-chat-users");//容器标识
    if(body.length == 0){
        return content;
    }
    return body;
}

/**
 * 获取所有用户条目
 * @returns {*|{ID, TAG, NAME, CLASS}|T|{}}
 */
function getAllUserItem(){
    return getChatUserContainer().find(".xmpp-chat-user-item");
}

/**
 * 查找用户条目
 * @param panelId
 */
function findUserItem(panelId){
    var allUserItem = getAllUserItem();
    return allUserItem.filter("[data-xmpp-ref="+panelId+"]");
}

/**
 * 定位面板设置的容器
 *
 */
function getPanelCotnainer(){
    var content = hostPopup.getContent();
    var body = content.find(".xmpp-chat-panel");//容器标识
    if(body.length == 0){
        return content;
    }
    return body;
}
/**
 * 查找面板
 * @param jid
 */
function findPanel(jid){
    var id = getDomId(jid);
    var findPanel = $("#" + id);
    if(findPanel.length == 0){
        return createChatPanel(jid);
    }
    return findPanel;
}

/**
 * 获取所有对话框
 */
function getAllPanel(){
    var chatPanels = getPanelCotnainer().find("[data-xmpp-chat-panel]");
    return chatPanels;
}

/**
 * 创建面板
 *
 */
function createChatPanel(jid){


    var panelId = getDomId(jid);
    var initData = {
        jid:jid,
        panelId:panelId
    };

    var $panel = $("<article  data-xmpp-chat-panel='"+jid+"' ></article>");
    $panel.attr("id", panelId );
    $panel.html(chatPanelTemplate(initData));

    //绑定表单提交
    var $form = $panel.find("form");
    var $message = $form.find("[name='message']");

    //提交信息
    $form.submit(function(evt){
        evt.preventDefault();
        var msg = $message.val();
        if(util.isEmpty(msg)){
            $message.addClass("invalid");
            $message.one("focus", function(){
                $(this).removeClass("invalid");
            });

        }else{
            //发送数据
            client().sendMessage(jid, msg);
            var msgObj = {
                subject:"",
                body:msg,
                date:new Date(),
                read:false,
                receive:false
            };

            msgStore.addMsg(jid, msgObj);

        }

        $message.val("");

    });



    var $userItem = $(chatUserTemplate(initData));

    $userItem.click(function(){
        var refPaneId = $(this).attr("data-xmpp-ref");
        if(refPaneId != null){
            activePanel($("#" + refPaneId));
        }

    });

    //用户条目内具有关闭功能
    $userItem.find(".xmpp-common-close-btn").click(function(evt){
        evt.preventDefault();
        evt.stopPropagation();
        var refPaneId = $(this).attr("data-xmpp-ref");
        if(refPaneId != null){
            deactivePanel($("#" + refPaneId));
        }

    });


    getChatUserContainer().append($userItem);

    //添加到容器
    var panelContainer = getPanelCotnainer();
    panelContainer.append($panel);

    //面板内具有关闭功能
    panelContainer.find(".xmpp-common-close-btn").click(function(evt){
        var refPaneId = $(this).attr("data-xmpp-ref");
        if(refPaneId != null){
            deactivePanel($("#" + refPaneId));
        }

    });


    msgStore.onMessageChange(jid, function(){
        if($panel.is(":visible")){
            renderMsg($panel);
        }
    });

    //消息数量发生改变
    msgStore.onUnreadSizeChange(jid, function(unreadSize){
        $userItem.find(".xmpp-chat-user-unread").html(unreadSize);
    });

    //聊天状态发生改变
    msgStore.onChatStatusChange(jid, function(status){
        $panel.find(".xmpp-chat-user-status").html(status);
    });

    return $panel;

}

/**
 * 自动滚动到底部
 *
 * @param renderArea
 */
var scrollTimerVal = null;
function autoScroll(renderArea){
    clearTimeout(scrollTimerVal);
    scrollTimerVal = setTimeout(function(){
        var $renderArea = $(renderArea);
        var maxScrollTop = $renderArea.prop("scrollHeight") - $renderArea.height();
        $renderArea.stop(true,true).animate({scrollTop:maxScrollTop});
    },100);
}


/**
 * 渲染视图
 * @param panel
 */
function renderMsg(panel){
    var jid = panel.attr("data-xmpp-chat-panel");
    var renderArea = panel.find(".xmpp-chat-content");
    var count = msgStore.render(jid, function(readMsgObj){
        var msgHtml = chatMsgTemplate(readMsgObj);
        renderArea.append(msgHtml);
    });

    if(count > 0){
        autoScroll(renderArea);
    }

}



/**
 * 激活面板
 * @param $panel
 */
function activePanel(panel){

    //是否显示用户条目
    var allUserItem = getAllUserItem();
    allUserItem.removeClass("active");
    var refUserItem = findUserItem(panel.attr("id"));
    refUserItem.addClass("xmpp-listable").addClass("active");

    //显示指定面板
    var allPanel = getAllPanel();
    allPanel.hide();
    panel.show();

    //读取消息
    renderMsg(panel);


    if(allUserItem.filter(".xmpp-listable").length > 1){
        getChatUserContainer().show();
    }else{
        getChatUserContainer().hide();
    }


    hostPopup.open();

}

/**
 * 取消激活的面板
 *
 * @param panel
 */
function deactivePanel(panel){


    var allUserItem = getAllUserItem();
    var refUserItem = findUserItem(panel.attr("id"));
    refUserItem.removeClass("xmpp-listable");
    panel.hide();

    //是否有剩余可显示
    var allUserItem = getAllUserItem();
    var availableItem = allUserItem.filter(".xmpp-listable");
    if(availableItem.length > 0){
        var refPanelId = availableItem.eq(0).attr("data-xmpp-ref");
        activePanel($("#" + refPanelId));
    }

    if(getPanelCotnainer().is(":hidden")){
        hostPopup.hide();
    }

}

/**
 * 打开一个聊天对话框
 * @param toJid
 */
function openChat(toJid){
    var panel = findPanel(toJid);

    activePanel(panel);

    return panel;
}

/**
 * 关闭目标聊天对话框
 * @param toJid
 */
function closeChat(toJid){
    var panel = findPanel(toJid);

    deactivePanel(panel);

    return panel;
}


export {
    openChat,
    closeChat
}
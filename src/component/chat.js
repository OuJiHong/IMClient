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

    //监听消息
    client().onMessage(function(stanza){
        var $stanza = $(stanza);
        var from = client().bareJid($stanza.attr("from"));
        if(jid == from){
            //添加消息到面板
            var subject = $stanza.find("subject");
            var body = $stanza.find("body");
            var msgObj = {
                subject:subject.html(),
                body:body.html()
            };

            //渲染区域
            var renderArea = $panel.find(".xmpp-chat-content");
            msgStore.addMsg(renderArea, chatMsgTemplate, msgObj);

        }
    });

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


    return $panel;

}


/**
 * 激活面板
 * @param $panel
 */
function activePanel(panel){

    //是否显示用户条目
    var allUserItem = getAllUserItem();
    allUserItem.removeClass("active");
    var refUserItem = allUserItem.filter("[data-xmpp-ref="+panel.attr("id")+"]");
    refUserItem.addClass("xmpp-listable").addClass("active");

    //显示指定面板
    var allPanel = getAllPanel();
    allPanel.hide();
    panel.show();

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
    var refUserItem = allUserItem.filter("[data-xmpp-ref="+panel.attr("id")+"]");
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

}

/**
 * 关闭目标聊天对话框
 * @param toJid
 */
function closeChat(toJid){
    var panel = findPanel(toJid);

    deactivePanel(panel);


}


export {
    openChat,
    closeChat
}
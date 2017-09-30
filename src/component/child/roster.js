/**
 * Created by OJH on 2017/9/7.
 */

import rosterTemplate from "./roster.art";
import util from "../../util/util";
import { Logger } from "../../service/logger";
import $ from "jquery";
import { client }  from "../login";
import { openChat } from "../chat";
import { msgStore } from "../../service/msgStore";
import { Strophe } from "strophe.js";


var logger = new Logger("roster");

/**
 * 查找花名册用户
 * @param rosterNode
 * @param jid
 * @returns {*|{}|T|{ID, TAG, NAME, CLASS}}
 */
function findRosterItem(rosterNode, jid ){
   return  rosterNode.find(".roster-item[data-jid='"+jid+"']");
}

/**
 * 获取所有
 * @returns {*|{}|T|{ID, TAG, NAME, CLASS}}
 */
function findAllItem(rosterNode){
    return  rosterNode.find(".roster-item");
}

/**
 * 创建用户条目
 * @param rosterNode
 * @param infoObj
 */
function createRosterItem(rosterNode, infoObj){
    var $rosterItem = $(rosterTemplate(infoObj));
    rosterNode.append($rosterItem);

    //未读消息数量监听
    msgStore.onUnreadSizeChange(infoObj.jid, function(unreadSize){
        $rosterItem.find(".xmpp-user-unread").html(unreadSize);
    });
}

/**
 * 初始化花名册
 */
function initRoster(){
    var rosterPromise = client().getRoster();
    util.additionErrorHandler(rosterPromise);

    var rosterNode = $("<article></article>");
    rosterPromise.then(function(stanza){
        var $stanza = $(stanza);
        $stanza.find("query>item").each(function(index, node){
            var $node = $(node);
            var jid = $node.attr("jid");
            var name = $node.attr("name");
            var subscription = $node.attr("subscription");
            var info = {
                index:index,
                jid:jid,
                name:name,
                subscription:subscription
            };

            //移除存在的条目
            findRosterItem(rosterNode, jid).remove();

            createRosterItem(rosterNode, info);

        });


    });


    rosterNode.on("click", ".roster-item", function(evt){
        var $this = $(this);
        var toJid = $this.attr("data-jid");
        var panel = openChat(toJid);

    });


    //监听用户状态
    client().on("presence", function(stanza){

        //不包括本身
        var from = client().bareJid(stanza.getAttribute("from"));
        var jid = client().currentJid();

        if(jid != from ){
            var statusType = stanza.getAttribute("type");
            var name = stanza.getAttribute("name");
            var subscription = stanza.getAttribute("subscription");
            var curItem = findRosterItem(rosterNode, from);
            if(curItem.length == 0){
                //创建新的条目
                var index = findAllItem(rosterNode).length;
                var info = {
                    index:index,
                    jid:from,
                    name:name,
                    subscription:subscription
                };

                createRosterItem(rosterNode, info);

            }else{
                //修改状态动作
                curItem.find(".xmpp-user-status").html(statusType);
            }

        }

    });


    //监听消息
    var chatStatusMap = {
        active:"激活聊天",
        composing:"正在输入",
        paused:"暂停输入",
        gone:"结束会话"
    };

    client().on("message", function(stanza){
        var $stanza = $(stanza);
        var from = client().bareJid($stanza.attr("from"));
        //添加消息到缓存，定义数据格式
        var subject = $stanza.find("subject");
        var body = $stanza.find("body");
        if(body.length > 0){
            var msgObj = {
                subject:subject.html(),
                body:body.html(),
                date:new Date(),
                read:false,
                receive:true
            };

            msgStore.addMsg(from, msgObj);
        }else{
            //查找状态:active,composing,paused,gone
            var statusDom = stanza.getElementsByTagNameNS(Strophe.NS.CHATSTATES, "*");
            var statusVal = "gone";
            if(statusDom.length > 0){
                statusVal =  statusDom[0].tagName;
            }
            statusVal = statusVal.toLowerCase();
            var  statusText = chatStatusMap[statusVal];
            //触发动作
            msgStore.emitChatStatus(from, [statusText]);

        }


    });

    return rosterNode;

}


export {
    initRoster
};

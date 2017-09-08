/**
 * Created by OJH on 2017/9/7.
 */

import rosterTemplate from "./roster.art";
import util from "../../util/util";
import { Logger } from "../../service/logger";
import $ from "jquery";
import { client }  from "../login";
import { openChat } from "../chat";


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

            var rosterItem = rosterTemplate(info);
            rosterNode.append(rosterItem);
        });


    });


    rosterNode.on("click", ".roster-item", function(evt){
        var $this = $(this);
        var toJid = $this.attr("data-jid");
        openChat(toJid);
    });


    //监听用户状态
    client().off("userStatusChange").onUserStatusChange(function(stanza, statusMsg){

        //不包括本身
        var from = client().bareJid(stanza.getAttribute("from"));
        var jid = client().fullJid(client().authcid);

        if(jid != from ){

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

                var rosterItem = rosterTemplate(info);
                rosterNode.append(rosterItem);

            }else{
                //修改状态动作
                curItem.find(".xmpp-user-status").html(statusMsg);
            }

        }



    });

    return rosterNode;

}


export {
    initRoster
};

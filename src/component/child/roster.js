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
 * 初始化花名册
 */
function initRoster(){
    var rosterPromise = client().getRoster();
    util.additionErrorHandler(rosterPromise);

    var rosterNode = $("<article></article>");
    rosterPromise.then(function(stanza){
        var $stanza = $(stanza);
        var infoList = [];
        $stanza.find("query>item").each(function(index, node){
            var $node = $(node);
            var info = {
                jid:$node.attr("jid"),
                name:$node.attr("name"),
                subscription:$node.attr("subscription")
            };
            infoList.push(info);
        });

        var initData = {
            infoList:infoList
        };

        rosterNode.html(rosterTemplate(initData));
    });


    rosterNode.on("click", ".roster-item", function(evt){
        var $this = $(this);
        var toJid = $this.attr("data-jid");
        openChat(toJid);
    });


    return rosterNode;

}


export {
    initRoster
};

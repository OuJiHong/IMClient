/**
 * Created by OJH on 2017/9/8.
 */
import userStatusTemplate from "./userStatus.art";
import util from "../../util/util";
import { Logger } from "../../service/logger";
import $ from "jquery";
import { client }  from "../login";



var logger = new Logger("userStatus");

/**
 * 初始化出席状态
 */
function initUserStatus(){


    var userStatusNode = $("<article></article>");


    //可用的用户状态
    const userStatusList = [{
        value:"available",
        text:"上线"
    },{
        value:"away",
        text:"离开"
    },{
        value:"unavailable",
        text:"下线"
    }];

    //other
    var initData = {
        status:userStatusList[0],
        userStatusList:userStatusList
    };

    userStatusNode.html(userStatusTemplate(initData));


    var $statusTypeSel = userStatusNode.find("select[name='statusType']");
    $statusTypeSel.change(function(){
        client().setUserStatus($(this).val());
    });

    //用户状态变动
    client().on("presence", function(stanza){
        //只判断本身
        var from = client().bareJid(stanza.getAttribute("from"));
        var jid = client().currentJid();

        var statusType = stanza.getAttribute("type");
        if(!statusType){
            statusType = userStatusList[0].value;
        }

        //不知是根据type判断还是根据show标签判断
        var showDom = stanza.getElementsByTagName("show");
        if(showDom.length > 0){
            statusType = showDom[0].innerHTML;
        }

        if(jid == from){
            logger.debug("当前用户状态变动:" + statusType);
            userStatusNode.find(".xmpp-self-user-status").html(statusType);
            $statusTypeSel.val(statusType);
        }

    });


    return userStatusNode;

}


export {
    initUserStatus
};


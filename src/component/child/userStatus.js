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


    //other
    var initData = {

    };

    userStatusNode.html(userStatusTemplate(initData));


    //用户状态变动
    client().onUserStatusChange(function(stanza){

        //只判断本身
        var from = client().bareJid(stanza.getAttribute("from"));
        var jid = client().fullJid(client().authcid);

        var statusType = stanza.getAttribute("type");

        if(jid == from){

            initData = {
                statusMsg:statusType
            };

            userStatusNode.html(userStatusTemplate(initData));
        }

    });


    return userStatusNode;

}


export {
    initUserStatus
};


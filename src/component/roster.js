/**
 * Created by OJH on 2017/9/7.
 */

import rosterTemplate from "./roster.art";
import imService from "../service/imService";
import util from "../util/util";

/**
 * 初始化花名册
 */
function initRoster(){
    var rosterPromise = imService.getRoster();
    util.additionErrorHandler(rosterPromise);

    rosterPromise.then(function(stanza){

    });


}


export default initRoster;
import $ from "jquery";
import loginTemplate from '../templates/login.art'
import util from "../service/util";
import { Logger } from "../service/logger";
import imService from "../service/imService";



const logger = new Logger("login");


export default function LoginInit() {

    var loginContent = loginTemplate();
    var popupOperation = util.popup(loginContent);

    var $form = popupOperation.dom.find("form");
    $form.submit(function(evt){
        evt.preventDefault();
        var formData = util.formData($form);
        if(util.isEmpty(formData.username)){
            util.toast("请输入用户名");
            return false;
        }
        if(util.isEmpty(formData.password)){
            util.toast("请输入密码");
            return false;
        }

        imService.initClient(formData.username, formData.password);

    });


    popupOperation.open();

}
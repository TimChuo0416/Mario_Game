const {ccclass, property} = cc._decorator;

declare const firebase: any;

@ccclass
export default class Auth extends cc.Component {

    
    start () {
        // init logic
        // this.startGame();

        this.InitLogin();
        this.InitSignup();
    }

    update (dt) {
        
    }

    Login(){
        cc.director.loadScene("Login");
    }
    Signup(){
        cc.director.loadScene("Signup");
    }

    InitLogin(){
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "Auth";
        clickEventHandler.handler = "Login";
        cc.find("Canvas/menu_bg/Login").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }
    InitSignup(){
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "Auth";
        clickEventHandler.handler = "Signup";
        cc.find("Canvas/menu_bg/Signup").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class Gamestart2 extends cc.Component {


    onLoad(){

    }

    start () {
        this.scheduleOnce(function() {
            cc.director.loadScene("Stage2");
        }, 2);
    }

    update (dt) {
        
    }

}
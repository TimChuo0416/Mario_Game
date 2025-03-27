const {ccclass, property} = cc._decorator;

@ccclass
export default class Gamestart extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    onLoad(){

    }

    start () {
        this.scheduleOnce(function() {
            cc.director.loadScene("Stage1");
        }, 2);
    }

    update (dt) {
        
    }

}
const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraTransposer extends cc.Component {

    
    @property(cc.Node)
    target: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    update(dt) {
        // using convertToWorldSpaceAR + convertToNodeSpaceAR because
        // they are inaccurate and causes camera jitter. :(
        
        if(!this.target) return;
        let targetPos = this.target.convertToWorldSpaceAR(cc.v2(0, 0));
        let newPos = this.node.parent.convertToNodeSpaceAR(targetPos);
        
        if(targetPos.x > 400 && newPos.x > 0){
            this.node.x = newPos.x;
        }
        //this.node.y = newPos.y;
    }
}


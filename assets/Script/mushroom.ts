const {ccclass, property} = cc._decorator;

@ccclass
export default class mushroom extends cc.Component {
    
        // @property(cc.Label)
        // label: cc.Label = null;
    
        // @property
        // text: string = 'hello';
    
        onLoad(){
            cc.director.getPhysicsManager().enabled = true;
        }
    
        start () {
            
        }
    
        update (dt) {
            
        }
        
}
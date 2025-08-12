import { _decorator, Button, Node, Sprite } from 'cc';
import { VMComponpent } from './VMComponpent';
const { ccclass, property, requireComponent, executeInEditMode } = _decorator;

@ccclass('VMButton')
@requireComponent(Button)
@executeInEditMode(true)
export class VMButton extends VMComponpent {

    protected onLoad(): void {
        super.onLoad();
        if (!this.node.getComponent(Sprite)) {
            this.node.addComponent(Sprite);
            this.node.getComponent(Button).transition = Button.Transition.SCALE;
        }
    }

    public ValueChange(fidle: string, value: any): void {
        this.node.on(Node.EventType.TOUCH_END, value, this)
    }
}


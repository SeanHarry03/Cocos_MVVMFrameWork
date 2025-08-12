import { _decorator, Component, Node, ProgressBar, Sprite } from 'cc';
import { VMComponpent } from './VMComponpent';
const { ccclass, property, requireComponent, executeInEditMode } = _decorator;

@ccclass('VMProgressBar')
@requireComponent(ProgressBar)
@executeInEditMode(true)
export class VMProgressBar extends VMComponpent {
    protected onLoad(): void {
        super.onLoad();
        if (!this.node.getChildByName("bar")) {
            const childNode = new Node("bar");
            childNode.addComponent(Sprite);
            childNode.parent = this.node;

            this.getComponent(ProgressBar).barSprite = childNode.getComponent(Sprite);
            childNode.getComponent(Sprite).type = Sprite.Type.SLICED;

            this.node.addComponent(Sprite).type = Sprite.Type.SLICED;
        }
    }
}


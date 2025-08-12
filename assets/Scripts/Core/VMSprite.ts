import { _decorator, Component, Node, Sprite } from 'cc';
import { VMComponpent } from './VMComponpent';
import Util from './Util';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('VMSprite')
@requireComponent(Sprite)
export class VMSprite extends VMComponpent {

    public ValueChange(fidle: string, value: any): void {
        if (fidle == "spriteFrame") {
            if (typeof value == "string") {
                //传递的是图片的链接
                Util.loadRemoteFrame(this.getComponent(Sprite), value);
            } else {
                this.getComponent(Sprite).spriteFrame = value;
            }
        } else {
            super.ValueChange(fidle, value)
        }
    }
}


import { _decorator, EventHandler, Node, Sprite, Toggle } from 'cc';
import { VMComponpent } from './VMComponpent';
import { VMUpdateType } from './VMConst';
const { ccclass, property, requireComponent, executeInEditMode } = _decorator;
/**
 * 使用Boolean值来控制Toggle的选中状态
 * 请给定一个默认值,不能使用null.
 * 使用null,会导致第一次不会执行Toggle组件的点击事件
 */
@ccclass('VMToggle')
@requireComponent(Toggle)
@executeInEditMode(true)
export class VMToggle extends VMComponpent {

    checkEvent: Function = null;

    protected onLoad(): void {
        super.onLoad();
        if (this.node.children.length == 0 || !this.node.getComponentsInChildren(Sprite)) {
            let Checkmark = new Node("Checkmark");
            Checkmark.addComponent(Sprite);
            Checkmark.setParent(this.node);

            this.node.getComponent(Toggle).checkMark = Checkmark.getComponent(Sprite);
            this.node.getComponent(Toggle).transition = Toggle.Transition.SCALE;
        }
        this.valueChangedNum = 0;
    }

    public ValueChange(fieldstr: string, value: any): void {
        // console.log('VMToggle ValueChange:', fieldstr, value, typeof value);
        let toggleComponent = this.node.getComponent(Toggle);
        if (this.valueChangedNum >= 1 && this.updateType == VMUpdateType.Once) {
            toggleComponent.checkEvents.length = 0;
            return;
        }

        if (typeof value == 'function') {
            this.checkEvent = value;
            if (toggleComponent.checkEvents.length == 0) {
                const eventhandler = new EventHandler();
                eventhandler.target = this.node;
                eventhandler.component = "VMToggle";
                eventhandler.handler = "onClickEvent";
                toggleComponent.checkEvents.push(eventhandler);
            }
        } else if (typeof value == 'boolean') {
            toggleComponent.isChecked = value;
            // console.log("事件的数量:", toggleComponent.checkEvents.length)
        }
    }

    onClickEvent(event: Toggle) {
        this.ValueChangeRefCount(null);
        this.checkEvent && this.checkEvent(event.isChecked);
    }
}


import { _decorator, Component, EventHandler, EventTouch, Node, Sprite, Toggle, ToggleComponent } from 'cc';
import { VMComponpent } from './VMComponpent';
const { ccclass, property, requireComponent, executeInEditMode } = _decorator;

@ccclass('VMToggle')
@requireComponent(Toggle)
@executeInEditMode(true)
export class VMToggle extends VMComponpent {

    clickEvent: Function = null;
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
    }

    public ValueChange(fieldstr: string, value: any): void {
        // console.log('VMButton ValueChange:', fieldstr, value, typeof value);
        let toggleComponent = this.node.getComponent(Toggle);
        if (typeof value == 'function') {
            this.clickEvent = value;
            const eventhandler = new EventHandler();
            eventhandler.target = this.node;
            eventhandler.component = "VMToggle";
            eventhandler.handler = "onClickEvent";
            toggleComponent.clickEvents.push(eventhandler);
        }
    }

    onClickEvent(event: EventTouch) {
        if (this.clickEvent) {
            this.clickEvent(event.currentTarget.getComponent(Toggle));
        }
    }
}


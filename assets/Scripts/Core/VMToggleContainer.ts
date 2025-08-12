import { _decorator, EventHandler, Node, Toggle, ToggleContainer } from 'cc';
import { VMComponpent } from './VMComponpent';
const { ccclass, property, requireComponent, executeInEditMode } = _decorator;

@ccclass('VMToggleContainer')
@requireComponent(ToggleContainer)
@executeInEditMode(true)

export class VMToggleContainer extends VMComponpent {

    checkEvent: Function = null;

    protected onLoad(): void {
        super.onLoad();
        if (this.node.getComponentsInChildren(Toggle).length == 0) {
            console.warn(this.node.name + "-->ToggleContainer 子节点缺少Toggle组件")
        }
    }

    public ValueChange(fieldstr: string, value: any) {
        let togglesGroup = this.node.getComponent(ToggleContainer);
        if (typeof value == 'function') {
            const eventhandler = new EventHandler();
            eventhandler.target = this.node;
            eventhandler.component = "VMToggleContainer";
            eventhandler.handler = "onCheckEvent";
            togglesGroup.checkEvents.push(eventhandler);
            this.checkEvent = value;
        }
    }

    onCheckEvent(toggle: any) {
        let togglesGroup = this.node.getComponent(ToggleContainer);
        this.checkEvent && this.checkEvent(togglesGroup);
    }
}


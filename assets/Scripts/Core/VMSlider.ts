import { _decorator, Button, Component, EventHandler, Node, Slider, Sprite } from 'cc';
import { VMComponpent } from './VMComponpent';
const { ccclass, property, executeInEditMode, requireComponent } = _decorator;

@ccclass('VMSlider')
@requireComponent(Slider)
@executeInEditMode(true)
export class VMSlider extends VMComponpent {

    SliderEventCall: Function = null;
    protected onLoad(): void {
        super.onLoad();
        if (this.node.children.length == 0||!this.node.getComponentsInChildren(Sprite)||!this.node.getComponentsInChildren(Button)) {
            let handle = new Node("Handle");
            handle.addComponent(Sprite);
            handle.addComponent(Button);
            handle.setParent(this.node)
            this.node.getComponent(Slider).handle = handle.getComponent(Sprite)
            this.node.addComponent(Sprite).type = Sprite.Type.SLICED;
        }

    }

    public ValueChange(fieldstr: string, value: any): void {
        // console.log('VMSlider ValueChange:', fieldstr, value);
        let silderComponent = this.node.getComponent(Slider);
        if (typeof value == "number") {
            silderComponent.progress = value;
        } else {
            // console.log("滑动事件绑定")
            this.SliderEventCall = value;
            const eventhandler = new EventHandler();
            eventhandler.target = this.node;
            eventhandler.component = "VMSlider";
            eventhandler.handler = "onSliderEvent";
            silderComponent.slideEvents.push(eventhandler);

        }
    }

    onSliderEvent(slider: Slider) {
        this.SliderEventCall && this.SliderEventCall(slider)
    }
}


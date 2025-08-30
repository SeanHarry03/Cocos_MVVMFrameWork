import { _decorator, Button, Node, Slider, Sprite } from 'cc';
import { VMComponpent } from './VMComponpent';
import { SliderProgress } from '../../FrameWork/UI/Component/SliderProgress/SliderProgress';
import { VMUpdateType } from './VMConst';
const { ccclass, property, executeInEditMode, requireComponent } = _decorator;

@ccclass('VMSlider')
@requireComponent(SliderProgress)
@executeInEditMode(true)
export class VMSlider extends VMComponpent {

    SliderEventCall: Function = null;

    silderComponent: SliderProgress = null;
    isAddCallback: boolean = false;

    protected onLoad(): void {
        super.onLoad();
        if (this.node.children.length == 0 || !this.node.getComponentsInChildren(Sprite) || !this.node.getComponentsInChildren(Button)) {
            let handle = new Node("Handle");
            handle.addComponent(Sprite);
            handle.addComponent(Button);
            handle.setParent(this.node)
            this.node.getComponent(Slider).handle = handle.getComponent(Sprite)
            this.node.addComponent(Sprite).type = Sprite.Type.SLICED;
        }
        this.silderComponent = this.node.getComponent(SliderProgress)
        if (this.updateType == VMUpdateType.BothWay)
            //双向绑定数据
            this.silderComponent.onValueChanged = (value2: number) => {
                this.SetVMDataField(this.BindVMData_Field, value2);
                // console.log("双向绑定数据", this.BindVMData_Field, value2);
            }
    }

    public ValueChange(fieldstr: string, value: any): void {
        // console.log('VMSlider ValueChange:', fieldstr, value);
        if (!this.silderComponent) {
            this.silderComponent = this.node.getComponent(SliderProgress);
        }
        if (typeof value == "number") {
            this.silderComponent.value = value;
        } else {
            this.SliderEventCall = value;
            if (!this.isAddCallback) {
                this.isAddCallback = true;
                this.silderComponent.onValueChanged = (value: number) => {
                    this.SliderEventCall && this.SliderEventCall(value);
                };
            }
        }

    }
}


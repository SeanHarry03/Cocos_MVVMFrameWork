import { _decorator, CCInteger, CCString, Color, EventTouch, ProgressBar, Slider, Toggle, ToggleContainer, } from 'cc';
import { VMData } from './Core/VMData';
import { BindVMUI } from './Core/Decorator';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('MainScene')
export class MainScene extends VMData {

    @BindVMUI({ comName: "lablestr" })
    @property({ type: CCInteger })
    lablestr: number = 12;

    @BindVMUI({ comName: "Slider" })
    silderProgress: number = 1;

    @BindVMUI({ comName: "Button" })
    onButtonClick() {
        console.log("点击了按钮")
    }

    @BindVMUI({ comName: "Slider" })
    SliderEvent(slider: Slider) {
        console.log("滑动条滑动了", slider)
    }

    @BindVMUI({ comName: "Toggle" })
    ToggleClickEvent(toggle: Toggle) {
        
        console.log("点击了Toggle",toggle.isChecked)
    }

    @BindVMUI({ comName: "ToggleGroup" })
    ToggleGroupEvent(togglesGroup: ToggleContainer) {
        console.log("点击了ToggleGroup",togglesGroup)
    }
}


import { _decorator, CCInteger, CCString, Color, ProgressBar, } from 'cc';
import { VMData } from './Core/VMData';
import { BindVMUI } from './Core/Decorator';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('MainScene')
export class MainScene extends VMData {

    @BindVMUI({ comName: "lablestr" })
    @property({type: CCInteger})
    lablestr: number = 12;

    protected onLoad(): void {
        // super.onLoad();
        console.log("MainScene onLoad",this.lablestr)
    }

    start() {
        console.log("MainScene start",this.lablestr)
    }
}


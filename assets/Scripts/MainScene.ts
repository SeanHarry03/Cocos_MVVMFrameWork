import { _decorator, CCInteger, CCString, Color, ProgressBar, } from 'cc';
import { VMData } from './Core/VMData';
import { BindVMUI } from './Core/Decorator';
const { ccclass, property, executeInEditMode } = _decorator;



@ccclass('MainScene')
export class MainScene extends VMData {

    // @property(CCInteger)
    @BindVMUI({ comName: "lablestr" })
    lablestr: number = 0;

    protected onLoad(): void {
        // super.onLoad();
        this.lablestr = 12312
        console.log("MainScene onLoad")
    }

    start() {
        console.log("MainScene start")
    }
}


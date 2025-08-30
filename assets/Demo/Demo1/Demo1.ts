import { _decorator } from 'cc';
import { BindVMUI } from '../../Scripts/Core/Decorator';
import { VMData } from '../../Scripts/Core/VMData';
import { fieldMappConst } from '../../Scripts/Core/VMConst';

const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('Demo1')
export class Demo1 extends VMData {

    @BindVMUI({ comName: "HPSliderProgress,HPValue", changeKeys: `value,${fieldMappConst.Label.string}` })
    HP: number = 40;

    @BindVMUI({ comName: "AddressEditBox,Label-001" })
    AddressStr: string = "";

    protected onLoad(): void {
        this.AddressStr = "中国xxx21323"
    }

    public onBtnClick() {
        console.log("HP:", this.HP)
    }
}



import { _decorator, Component, EditBox, Enum, Node } from 'cc';
import { VMComponpent } from './VMComponpent';
import { VMUpdateType } from './VMConst';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('VMEditBox')
@requireComponent(EditBox)
export class VMEditBox extends VMComponpent {

    @property({ type: Enum(VMUpdateType), tooltip: "数据同步的方式" ,override:true})
    updateType: VMUpdateType = VMUpdateType.BothWay;
    public EditEnd(eidtor: EditBox) {
        let vmData = this.GetParentVMData();
        if (vmData)
            vmData[this.BindVMData_Field] = eidtor.string;
        else {
            console.warn(`未找到父级VMData,无法同步属性：${this.BindVMData_Field}`)
        }
    }
}


import { _decorator, EditBox, Enum, EventHandler } from 'cc';
import { VMComponpent } from './VMComponpent';
import { VMUpdateType } from './VMConst';
const { ccclass, property, requireComponent, executeInEditMode } = _decorator;

@ccclass('VMEditBox')
@requireComponent(EditBox)
@executeInEditMode(true)
export class VMEditBox extends VMComponpent {

    @property({ type: Enum(VMUpdateType), tooltip: "数据同步的方式", override: true })
    updateType: VMUpdateType = VMUpdateType.BothWay;

    protected onLoad(): void {
        super.onLoad();
        if (this.node.getComponent(EditBox).editingDidEnded.length == 0) {
            let editEndEvent = new EventHandler();
            editEndEvent.target = this.node;
            editEndEvent.component = "VMEditBox";
            editEndEvent.handler = "EditEnd";
            this.node.getComponent(EditBox).editingDidEnded.push(editEndEvent);
        }
    }

    public EditEnd(eidtor: EditBox) {
        this.SetVMDataField(this.BindVMData_Field, eidtor.string)
    }

    // override ValueChange(fieldstr: string, value: any): void {
    //     if(typeof value == "string"){
    //         super.ValueChange(fieldstr, value);
    //     }else{
    //         //是函数

    //     }
    // }
}


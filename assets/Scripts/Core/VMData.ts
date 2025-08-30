import { _decorator, Component, Node } from 'cc';
import { VMComponpent } from './VMComponpent';
const { ccclass, property } = _decorator;

@ccclass('VMData')
export class VMData extends Component {

    /**直接设置私有字段，绕过 setter （防止递归死循环）*/
    public ImmediateChangeProperty(VMCom_Name: string, fieldstr: string, value: any) {
        const privateKey = `__${fieldstr}__value`;
        this[privateKey] = value;
        // 通知其他组件
        this["ReflectOtherProperty"](VMCom_Name, value);
    }
}


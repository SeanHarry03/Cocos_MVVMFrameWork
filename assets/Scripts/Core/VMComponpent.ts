import { _decorator, Component, director, Enum, Node, Sprite } from 'cc';
import { ComponentMap, fieldMapping, VMUpdateType } from './VMConst';
import { VMData } from './VMData';
const { ccclass, property } = _decorator;

@ccclass('VMComponpent')
export class VMComponpent extends Component {

    @property({ type: Enum(VMUpdateType), tooltip: "数据同步的方式" })
    updateType: VMUpdateType = VMUpdateType.OnyWay;

    @property({
        tooltip: "需要绑定的VM数据的字段",
        visible: function (this: VMComponpent) {
            return this.updateType == VMUpdateType.BothWay;
        }
    })
    BindVMData_Field: string = "";

    ComponpentType: string = this.constructor.name.split("VM")[1];



    protected onLoad(): void {

    }

    /**获取直系父节点的VMData */
    protected GetParentVMData(node?: Node) {
        if (!node)
            node = this.node;
        if (node.name == "Canvas") {
            return null;
        }

        if (node.parent.getComponent(VMData))
            return node.parent.getComponent(VMData);
        else
            return this.GetParentVMData(node.parent);
    }

    public SetVMDataField(fieldstr: string, value: any): void {
        let vmData: VMData = this.GetParentVMData();
        if (vmData)
            vmData.ImmediateChangeProperty(this.node.name, fieldstr, value)
        else {
            console.warn(`未找到父级VMData,无法同步属性：${fieldstr}`)
        }
    }

    /**组件的字段改变 */
    public ValueChange(fieldstr: string, value: any) {
        let component: Component = this.getComponent(ComponentMap[this.ComponpentType]);
        if (!component) {
            console.warn(this.node.name, ":", this.constructor.name, '没有找到组件：', ComponentMap[this.ComponpentType]);
            return;
        }
        if (component.hasOwnProperty(fieldstr)) {
            // console.log("绑定成功")
            this.getComponent(ComponentMap[this.ComponpentType])[fieldstr] = value;
        }
        else {
            //模糊查询
            let vagueField = this.CheckProperty(fieldstr)
            if (vagueField && vagueField != "")
                this.getComponent(ComponentMap[this.ComponpentType])[vagueField] = value;
            else
                console.warn(this.node.name, ":", this.constructor.name, '没有找到字段：', fieldstr)
        }
    }

    public

    /**模糊查询是否有该字段 */
    protected CheckProperty(targetField: string): string {
        // console.log("模糊查询字段：", targetField)
        let component: Component = this.getComponent(ComponentMap[this.ComponpentType]);
        const componentFields = Object.getOwnPropertyNames(component);

        let mathc = (innerfield: string, Field: string) => {
            // 精确匹配（忽略大小写）
            if (innerfield.toLowerCase() === Field.toLowerCase()) {
                return innerfield.toLowerCase();
            }
            // 模糊匹配（包含关系）
            else if (innerfield.toLowerCase().includes(Field.toLowerCase()) ||
                Field.toLowerCase().includes(innerfield.toLowerCase())) {
                return Field.toLowerCase()
            } else
                return null

        }
        for (const field of componentFields) {
            // if (field == "_color")
            //     debugger;
            let realField = mathc(field, targetField)
            if (realField) {
                return realField
            } else {
                // 检查字段映射
                const mappedField = fieldMapping[targetField];
                if (mappedField && mathc(field, mappedField)) {
                    return mappedField;
                }
            }
        }
        return null;
    }
}

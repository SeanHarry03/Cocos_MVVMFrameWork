import { _decorator, Component, instantiate, Node, Sprite, ToggleContainer, Vec3 } from 'cc';
import { VMData } from '../../Scripts/Core/VMData';
import { VMScrollView } from '../../Scripts/Core/VMScrollView';
import { BindVMUI } from '../../Scripts/Core/Decorator';
const { ccclass, property } = _decorator;

@ccclass('Demo2')
export class Demo2 extends VMData {

    @property(VMScrollView)
    scrollView: VMScrollView = null;

    @property(Node)
    prefab: Node = null;

    @BindVMUI({ comName: "lablestr" })
    PlayerName: string = "张三";

    @BindVMUI({ comName: "ClickButton" })
    ClickButtonFun: Function = null;

    @BindVMUI({ comName: "Toggle" })
    toggle: boolean = true;

    @BindVMUI({ comName: "Toggle" })
    toggleClickEvent: Function = null;

    @BindVMUI({ comName: "ToggleGroup" })
    toggleGroup: Function = null;

    protected start(): void {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                name: "name" + i,
                headURL: "http://gips3.baidu.com/it/u=1821127123,1149655687&fm=3028&app=3028&f=JPEG&fmt=auto?w=720&h=1280",
                score: i * 10
            });
        }
        this.scrollView.CreateItems(data, null);

        //Toggle 只会响应最后一个
        this.toggleClickEvent = (isChecked: boolean) => {
            console.log("点击了Toggle", isChecked)
        }
        this.toggleClickEvent = (isChecked: boolean) => {
            console.log("点击了Toggle2222", isChecked)
        }
        this.toggleClickEvent = (isChecked: boolean) => {
            console.log("点击了Toggle3333s", isChecked)
        }
        this.toggleClickEvent = null;
        //Button 按钮
        this.ClickButtonFun = () => {
            console.log("按钮点击!");
            this.toggle = !this.toggle;
        }

        //toggleGroup
        this.toggleGroup = (toggleContainer: ToggleContainer) => {
            console.log("点击了Toggle", toggleContainer.toggleItems)
        }
    }
}


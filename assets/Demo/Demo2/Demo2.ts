import { _decorator, Component, instantiate, Node, Sprite, Vec3 } from 'cc';
import { VMData } from '../../Scripts/Core/VMData';
import { VMScrollView } from '../../Scripts/Core/VMScrollView';
const { ccclass, property } = _decorator;

@ccclass('Demo2')
export class Demo2 extends VMData {

    @property(VMScrollView)
    scrollView: VMScrollView = null;

    @property(Node)
    prefab: Node = null;


    protected start(): void { 
        let data = [];
        for(let i=0;i<10;i++){
            data.push({
                name: "name" + i,
                headURL: "http://gips3.baidu.com/it/u=1821127123,1149655687&fm=3028&app=3028&f=JPEG&fmt=auto?w=720&h=1280",
                score: i*10
            });
        }
        this.scrollView.CreateItems(data, null);

        
    }
}


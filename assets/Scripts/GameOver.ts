import { _decorator, Component, instantiate, Node, Sprite, Vec3 } from 'cc';
import { VMData } from './Core/VMData';
import { VMScrollView } from './Core/VMScrollView';
const { ccclass, property } = _decorator;

@ccclass('GameOver')
export class GameOver extends VMData {

    @property(VMScrollView)
    scrollView: VMScrollView = null;

    @property(Node)
    prefab: Node = null;


    protected start(): void { 
        let data = [];
        for(let i=0;i<10;i++){
            data.push({
                name: "name" + i,
                headURL: "https://img.alicdn.com/imgextra/i1/O1CN01q5Yq5j1QYZyhZJxqj_!!6000000002635-0-tps-200-200.png",
                score: i*10
            });
        }
        this.scrollView.CreateItems(data, null);
    }
}


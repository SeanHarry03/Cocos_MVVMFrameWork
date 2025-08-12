import { _decorator, Component, instantiate, Node, Prefab, ScrollBar, ScrollView, Sprite, UITransform, Vec3, Widget } from 'cc';
import { VMData } from './VMData';
import { EDITOR } from 'cc/env';
import { VMComponpent } from './VMComponpent';
const { ccclass, property, requireComponent, executeInEditMode } = _decorator;

@ccclass('VMScrollView')
@requireComponent(ScrollView)
@executeInEditMode(true)
export class VMScrollView extends VMComponpent {

    @property({ group: { name: '需要实例化的Item(选其一)' }, type: Prefab, tooltip: "该滚动列表需要实例化的Item" })
    preItemPrefab: Prefab = null;

    @property({ group: { name: '需要实例化的Item(选其一)' }, type: Node, tooltip: "该滚动列表需要实例化的Item" })
    preItemNode: Node = null;

    _preNum: number = 0;

    @property({
        displayName: "预览的数量",
    })
    set PreNum(value: number) {
        if (value < 0) return;

        // 仅在编辑器中运行
        if (EDITOR) {
            this.updatePreviewItems(value);
        }

        // 保存值用于非编辑器环境
        this._preNum = value;
    }
    get PreNum() {
        return this._preNum;
    } 

    data:any[] = [];

    /**
 * 在编辑器中更新预览项
 * @param count 需要显示的项数量
 */
    private updatePreviewItems(count: number): void {
        let scrollView = this.node.getComponent(ScrollView);
        if (!scrollView || !scrollView.content) return;

        // 清除现有子节点
        scrollView.content.destroyAllChildren();

        if ((this.preItemNode || this.preItemPrefab) && count > 0) {
            for (let i = 0; i < count; i++) {
                let item: Node = null;
                // 使用预先在面板定义的预制体
                item = this.preItemPrefab ? instantiate(this.preItemPrefab) :
                    this.preItemNode ? instantiate(this.preItemNode) : null;
                if (item) {
                    item.active = true;
                    scrollView.content.addChild(item);
                    item.setPosition(Vec3.ZERO);
                }
            }
        }
    }

    /**
     * 
     * @param data 需要实例化的数据
     * @param prefab 使用预制体创建
     * @param node 使用节点创建
     */
    public CreateItems(data: any[], prefab?: Prefab, node?: Node) {
        let scrollView = this.node.getComponent(ScrollView);
        for (let i = 0; i < data.length; i++) {
            let item: Node = null;
            if (prefab || node) {
                item = prefab ? instantiate(prefab) : instantiate(node);
            } else {
                //使用预先在面板定义的预制体
                item = this.preItemPrefab ? instantiate(this.preItemPrefab) : instantiate(this.preItemNode);
            }
            scrollView.content.addChild(item);
            item.setPosition(Vec3.ZERO)
            item.getComponent(VMData)?.Init(data[i])
        }
    }

    public ValueChange(fieldstr: string, value: any[]){
        this.data = value;
        this.CreateItems(this.data,null);
    }
}


import { _decorator, Component, Label, Node, Prefab } from 'cc';
import { VMComponpent } from './VMComponpent';
const { ccclass, property, requireComponent, menu } = _decorator;


@ccclass('VMLabel')
@requireComponent(Label)
export class VMLabel extends VMComponpent {
     
}


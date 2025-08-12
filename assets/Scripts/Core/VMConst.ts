import { _decorator, Button, Component, Enum, Label, Node, ProgressBar, Sprite } from 'cc';
const { ccclass, property } = _decorator;

/**数据更新的方式 */
export enum VMUpdateType {
    /**更新一次 */
    Once,
    /**单向更新 */
    OnyWay,
    /**双向更新 */
    BothWay,
}

// 组件名称到构造函数的映射
export const ComponentMap = {
    "Label": Label,
    "Sprite": Sprite,
    "Button": Button,
    "ProgressBar": ProgressBar,
};

export const ComponentDefaultProperty = {
    "Label": "string",
    "Sprite": "spriteFrame",
    "Button": "string",
    "ProgressBar": "progress",
};

// 预定义常见字段映射
export const fieldMapping: { [key: string]: string } = {
    'colour': 'color',
    'tint': 'color',
    'image': 'spriteFrame',
    'img': 'spriteFrame',
    'pic': 'spriteFrame',
    'text': 'string',
    // 可以根据需要添加更多映射
};
type PropertyDecorator = (
    $class: Record<string, any>,
    $propertyKey: string | symbol,
    $descriptorOrInitializer?: any,
) => void;

import { Button, Label, Node, ProgressBar, Sprite } from "cc"

const searchChild = function (node: Node, name: string) {
    let ret = node.getChildByName(name);
    if (ret) return ret;
    for (let i = 0; i < node.children.length; i++) {
        let child = node.children[i];
        if (!child.isValid) continue;
        ret = searchChild(child, name);
        if (ret) return ret;
    }
    return null;
}

const CookDecoratorKey = ($desc: string) => `__ccc_decorator_${$desc}__`

const KeyChild = CookDecoratorKey("child_cache");
type ParamType = {
    name?: string,
};

export function child($opt?: ParamType): PropertyDecorator {
    console.log("----------")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return ($target, $propertyKey: string, $descriptorOrInitializer) => {
        const cache: { propertyKey: string, childName: string }[] = $target[KeyChild] ??= [];
        if (!cache.some($vo => $vo.propertyKey === $propertyKey)) {
            cache.push({ propertyKey: $propertyKey, childName: $opt?.name || $propertyKey });
        } else {
            throw new Error(`child 装饰器重复绑定属性：${$propertyKey}，class：${$target.name}`);
        }
        if (cache.length === 1) {
            const oldOnLoad: () => void = $target.onLoad || undefined;//$target.onLoad也可以拿到父类的实现
            $target.onLoad = function () {
                console.log(this)
                cache.forEach($vo => this[$vo.propertyKey] = searchChild(this.node, $vo.childName));
                oldOnLoad && oldOnLoad.apply(this);
            };
        }
    };
}

import { Component } from "cc";
import { VMMgr } from "./VMMgr";
import { VMComponpent } from "./VMComponpent";
import { VMData } from "./VMData";
import { ComponentDefaultProperty, ComponentMap } from "./VMConst";

interface INewable<T = any> extends Function {
    new(...args: any[]): T;
}

const KeyComp = CookDecoratorKey("comp_cache");

export function comp($compoentClass: INewable<Component>, $childName?: string, $mute = false): PropertyDecorator {
    return ($target, $propertyKey: string, $descriptorOrInitializer) => {
        const cache: { propertyKey: string, compClass: INewable<Component>, childName: string }[] = $target[KeyComp] ??= [];
        if (!cache.some($vo => $vo.propertyKey === $propertyKey)) {
            cache.push({ propertyKey: $propertyKey, compClass: $compoentClass, childName: $childName || $propertyKey });
        } else {
            if (!$mute) {
                throw new Error(`comp装饰器重复绑定属性：${$propertyKey}，class：${$target.name}`);
            }
            return;
        }
        if (cache.length === 1) {
            const oldOnLoad: () => void = $target.onLoad || undefined;//$target.onLoad也可以拿到父类的实现
            $target.onLoad = function () {
                cache.forEach($vo => {
                    const node = ($vo.childName ? searchChild(this.node, $vo.childName) : this.node);
                    if (!node) {
                        if (!$mute) {
                            throw new Error(`comp装饰器没有找到适合的node节点：class：${$target.name}，组件：${$compoentClass.name}，childName：${$childName}`);
                        } else {
                            return;
                        }
                    }
                    this[$vo.propertyKey] = node.getComponent($vo.compClass) || node.addComponent($vo.compClass);
                });
                oldOnLoad && oldOnLoad.apply(this);
            };
        }
    };
}

/**
 * 自动更新绑定的UI组件
 * @param comName 子级节点
 * @param changeKey 组件的字段
 * @returns 
 */
export function BindVMUI({ comName, changeKey = "" }): PropertyDecorator {
    return ($target, $propertyKey: string, $descriptorOrInitializer) => {
        // 创建私有属性名来存储实际值
        const privateKey = `__${$propertyKey}__value`;

        // 获取初始值（如果有的话）
        let initialValue: any;
        if ($descriptorOrInitializer && typeof $descriptorOrInitializer === 'object' && 'initializer' in $descriptorOrInitializer) {
            initialValue = $descriptorOrInitializer.initializer?.();
        }

        // 在原型上存储属性配置，供实例化时使用
        const bindVMDataKey = '__bind_vm_data_props__';
        if (!$target[bindVMDataKey]) {
            $target[bindVMDataKey] = {};
        }
        $target[bindVMDataKey][$propertyKey] = { privateKey, initialValue };

        // 如果还没有重写构造函数，则重写它
        // if (!$target.__bind_vm_data_initialized__) {
        const originalOnInit = $target.__init || $target.onLoad || function () { };

        $target.onLoad = function () {
            // VMData 的初始化方法
            originalOnInit.apply(this);

            // 为每个实例定义响应式属性
            const vmDataProps = this.constructor.prototype[bindVMDataKey];
            if (vmDataProps) {
                let propKey = $propertyKey
                const { privateKey, initialValue } = vmDataProps[propKey];
                // console.error("初始化UI：", vmDataProps)
                // 定义属性描述符
                Object.defineProperty(this, propKey, {
                    enumerable: true,
                    configurable: true,
                    get() {
                        return this[privateKey];
                    },
                    set(value: any) {
                        console.log(`设置 ${propKey}  comName:${comName}的值为:`, value);
                        // 在这里添加你的自定义逻辑


                        let Component_Node: Node = FindChild(this.node, comName);
                        if (value != null && Component_Node) {
                            let comp: VMComponpent = Component_Node.getComponent(VMComponpent);
                            if (comp == null) {
                                console.warn(`节点：${comName}未找到组件VMComponpent`)
                                return
                            }
                            if (changeKey == "")
                                changeKey = ComponentDefaultProperty[comp.ComponpentType]
                            comp.ValueChange(changeKey, value)
                            // let uiComponent: Component = Component_Node.getComponent(ComponentMap[comp.ComponpentType]);
                            // uiComponent[changeKey] = value
                            // console.log("VM绑定成功")
                        } else if (Component_Node == null) {
                            console.warn(`没有找到节点${comName}`)
                        }

                        // 存储实际值
                        this[privateKey] = value;
                    }
                });

                // 设置初始值
                if (initialValue !== undefined) {
                    this[propKey] = initialValue;
                }

            }

            // VMData 的初始化方法
            // originalOnInit.apply(this);
        };

        // $target.__bind_vm_data_initialized__ = true;
        // }
    }
}

/**向下查找节点 */
function FindChild(node: Node, name: string) {
    if (node == null)
        return null;
    let resChild: Node = node.getChildByName(name);
    if (resChild == null) {
        for (let child of node.children) {
            if (child.getComponent(VMData))
                continue;
            resChild = FindChild(child, name);
            if (resChild)
                return resChild;
        }
    } else {
        return resChild;
    }
}

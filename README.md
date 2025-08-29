# `BindVMUI`  装饰器
```
export function BindVMUI({ comName, changeKeys = "" }): PropertyDecorator {
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


        const originalOnInit = $target.__init || $target.onLoad || function () { };

        $target.onLoad = function () {
            // 保存编辑器面板设置的原始值
            const editorValue = this[$propertyKey];
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
                        // console.log(`设置 ${propKey}  comName:${comName}的值为:`, value);
                        // 在这里添加你的自定义逻辑
                        // 存储实际值
                        this[privateKey] = value;
                    }
                });

                // 恢复编辑器面板设置的值，如果没有则使用默认值
                this[propKey] = editorValue !== undefined ? editorValue : initialValue;
            }

            // VMData 的初始化方法
            originalOnInit.apply(this);
        };
    }
}
```
`$target` 对应ts脚本的对象，该装饰器在哪个脚本。
`$propertyKey` 对应字段



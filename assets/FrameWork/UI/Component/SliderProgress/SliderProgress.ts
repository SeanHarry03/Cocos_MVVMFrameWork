const { ccclass, property, type } = _decorator;

import { _decorator, Component, Node, EventTouch, UITransform, Vec3, math, Enum } from 'cc';
import { v2ToV3 } from '../../../Util/VecUtils';

export enum SliderDirection {
    Horizontal = 0,
    Vertical = 1,
}

@ccclass('SliderProgress')
export class SliderProgress extends Component {

    @property(Node)
    public background: Node | null = null;   // 背景条

    @property(Node)
    public fill: Node | null = null;         // 填充条

    @property(Node)
    public handle: Node | null = null;       // 滑块

    @property
    public minValue: number = 0;

    @property
    public maxValue: number = 1;

    @property
    public step: number = 0;   // 步长（0 表示无限制）

    @property({ type: Enum(SliderDirection) })
    public direction: SliderDirection = SliderDirection.Horizontal; // 滑动方向

    @property
    private _value: number = 0;


    /** 存储 onValueChanged 的回调函数 */
    private _onValueChangedCallbacks: Array<(val: number) => void> = [];

    /** 数值变化回调 支持多个回调 */
    public get onValueChanged(): (val: number) => void {
        return (val: number) => {
            this._onValueChangedCallbacks.forEach(callback => {
                callback(val); // 调用每个绑定的回调
            });
        };
    }

    public set onValueChanged(callback: (val: number) => void) {
        // 允许直接加多个回调
        this._onValueChangedCallbacks.push(callback);
    }

    private invokeValueChanged() {
        this._onValueChangedCallbacks.forEach(callback => {
            callback(this._value);
        });
    }

    /** 当前值 */
    get value() {
        return this._value;
    }

    set value(v: number) {
        v = math.clamp(v, this.minValue, this.maxValue);

        // 步长限制
        if (this.step > 0) {
            let steps = Math.round((v - this.minValue) / this.step);
            v = this.minValue + steps * this.step;
            v = parseFloat(v.toFixed(6)); // 避免浮点误差
        }

        this._value = v;
        this.updateUI();

        this.invokeValueChanged();
    }

    onLoad() {
        if (this.background) {
            this.background.on(Node.EventType.TOUCH_START, this.onTouch, this);
        }
        if (this.handle) {
            this.handle.on(Node.EventType.TOUCH_MOVE, this.onDrag, this);
        }
        this.updateUI();

    }

    private onTouch(event: EventTouch) {
        this.setValueFromTouch(event);
    }

    private onDrag(event: EventTouch) {
        this.setValueFromTouch(event);
    }

    private setValueFromTouch(event: EventTouch) {
        if (!this.background) return;

        const uiTrans = this.background.getComponent(UITransform);
        if (!uiTrans) return;

        const localPos = uiTrans.convertToNodeSpaceAR(v2ToV3(event.getUILocation()));

        if (this.direction === SliderDirection.Horizontal) {
            const width = uiTrans.width;
            const ratio = (localPos.x + width / 2) / width;
            this.value = this.minValue + ratio * (this.maxValue - this.minValue);
        } else {
            const height = uiTrans.height;
            const ratio = (localPos.y + height / 2) / height;
            this.value = this.minValue + ratio * (this.maxValue - this.minValue);
        }
    }

    private updateUI() {
        if (!this.background) return;

        const bgTrans = this.background.getComponent(UITransform);
        if (!bgTrans) return;

        if (this.value < this.minValue) {
            this.value = this.minValue;
        } else if (this.value > this.maxValue) {
            this.value = this.maxValue;
        }

        const ratio = (this._value - this.minValue) / (this.maxValue - this.minValue);

        if (this.direction === SliderDirection.Horizontal) {
            const width = bgTrans.width;

            // 填充条
            if (this.fill) {
                const fillTrans = this.fill.getComponent(UITransform);
                if (fillTrans) {
                    fillTrans.width = width * ratio;
                }
            }

            // 滑块
            if (this.handle) {
                const x = -width / 2 + width * ratio;
                this.handle.setPosition(new Vec3(x, this.handle.position.y, 0));
            }
        } else {
            const height = bgTrans.height;

            // 填充条
            if (this.fill) {
                const fillTrans = this.fill.getComponent(UITransform);
                if (fillTrans) {
                    fillTrans.height = height * ratio;
                }
            }

            // 滑块
            if (this.handle) {
                const y = -height / 2 + height * ratio;
                this.handle.setPosition(new Vec3(this.handle.position.x, y, 0));
            }
        }
    }
}

import { assetManager, ImageAsset, isValid, Sprite, SpriteFrame, Texture2D, UITransform, v3 } from "cc";

export default class Util {

    static formatDate(time?) {
        time = time || Date.now();
        let date = new Date(time);
        let curMonth = date.getMonth() + 1;
        let curDay = date.getDate();
        let curHour = date.getHours();
        let curMinutes = date.getMinutes();
        let curSeconds = date.getSeconds();
        let curMilliseconds = date.getMilliseconds();
        const month: any = curMonth < 10 ? '0' + curMonth : curMonth;
        const day: any = curDay < 10 ? '0' + curDay : curDay;
        const hour = curHour < 10 ? '0' + curHour : curHour;
        const minutes = curMinutes < 10 ? '0' + curMinutes : curMinutes;
        const seconds = curSeconds < 10 ? '0' + curSeconds : curSeconds;
        const milliseconds = curMilliseconds;
        return `${month}月${day}日${hour}时${minutes}分${seconds}秒${milliseconds}`
    }

    public static remoteLogoMap: Map<string, SpriteFrame> = new Map<string, SpriteFrame>();
    static async loadRemoteLogo(url: string, callback: Function) {
        if (this.remoteLogoMap.has(url)) {
            callback && callback(this.remoteLogoMap.get(url));
            return;
        }
        assetManager.loadRemote(url, { ext: ".jpg" }, (err, assert: ImageAsset) => {
            if (!err) {
                let spr = new SpriteFrame();
                let texture = new Texture2D();
                texture.image = assert;
                spr.texture = texture;
                spr.packable = false;
                this.remoteLogoMap.set(url, spr);
                callback && callback(spr);
                return;
            }
            callback && callback(null);
        })
    }
    
    static spriteFrameArray: Map<string, SpriteFrame> = new Map<string, SpriteFrame>();
    static loadRemoteFrame(icon: Sprite, url: string, limitSize?, callback?) {
        if (url == null || url == "") {
            callback && callback();
            return;
        } 
            
        let setFrame = (spr: SpriteFrame) => {
            spr.packable = false;
            limitSize = limitSize || icon.node.getComponent(UITransform).contentSize.width;
            icon.spriteFrame = spr;
            icon.sizeMode = Sprite.SizeMode.RAW;
            let size = icon.node.getComponent(UITransform).contentSize
            let minSize = Math.min(size.width, size.height);
            let scale = limitSize / minSize;
            // icon.node.scale = v3(scale, scale, scale);
            icon.node.getComponent(UITransform).setContentSize(size.width * scale, size.height * scale)
            // console.log("----Util---loadRemoteFrame----!err---url:", url);
        }

        if (this.spriteFrameArray.has(url)) {
            isValid(icon) && setFrame(this.spriteFrameArray.get(url));
            callback && callback();
            return;
        }

        assetManager.loadRemote(url, { ext: ".jpg" }, (err, assert: ImageAsset) => {
            if (!err) {
                let spr = new SpriteFrame()
                let texture = new Texture2D()
                texture.image = assert;
                spr.texture = texture;
                this.spriteFrameArray.set(url, spr);
                isValid(icon) && setFrame(spr);
            }
            callback && callback();
        })
    }

    static loadNftRemoteFrame(icon: Sprite, url: string, limitSize?, avatarUrl?, nftNode?, isVisble?, callback?) {
        if (url == null || url == "") {
            callback && callback();
            return;
        } 

        let setFrame = (spr: SpriteFrame) => {
            spr.packable = false;
            if (!icon || !icon.node || !icon.node.parent) {
                return;
            }
            callback && callback();
            limitSize = limitSize || icon.node.getComponent(UITransform).contentSize.width;
            icon.spriteFrame = spr;
            icon.sizeMode = Sprite.SizeMode.RAW;
            let size = icon.node.getComponent(UITransform).contentSize
            let minSize = Math.min(size.width, size.height);
            let scale = limitSize / minSize;
            // icon.node.scale = v3(scale, scale, scale);
            icon.node.getComponent(UITransform).setContentSize(size.width * scale, size.height * scale)

            if (isVisble == true) {
                if (nftNode) {
                    nftNode.active = true;
                }
            } else {
                if (nftNode) {
                    nftNode.active = false;
                }
            }
            console.log("---Util----loadNftRemoteFrame---!err--url:", url);
        }

        if (this.spriteFrameArray.has(url)) {
            isValid(icon) && setFrame(this.spriteFrameArray.get(url));
            callback && callback();
            return;
        }

        assetManager.loadRemote(url, { ext: ".jpg" }, (err, assert: ImageAsset) => {
            if (!err) {
                let spr = new SpriteFrame()
                let texture = new Texture2D()
                texture.image = assert;
                spr.texture = texture;
                this.spriteFrameArray.set(url, spr);
                isValid(icon) && setFrame(spr);
            } else {
                if (nftNode) {
                    nftNode.active = false;
                }
                this.loadNftRemoteFrame(icon, avatarUrl, limitSize, avatarUrl, nftNode, false);
                callback && callback();
                return;
            }
            callback && callback();
        })
    }
    
    static seekChildByName(node, name) {
        return this._seekChildByName(node, name)
    }

    private static _seekChildByName(node, name) {
        let childrens = node.children;
        if (node.name == name) {
            return node
        }
        let tNode
        for (let index = 0; index < childrens.length; index++) {
            const child = childrens[index];
            tNode = this._seekChildByName(child, name);
            if (tNode) {
                break;
            }
        }
        return tNode;
    }

    static trimNameStringFunc(substring: string, index: number) {
        var hs = substring.charCodeAt(index);
        if (hs >= 0 && hs <= 128) {
            return { index: 1, length: 1, state: 0 };
        }
        else if (0xd800 <= hs && hs <= 0xdbff) {
            var ls = substring.charCodeAt(index + 1);
            var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
            if (0x1d000 <= uc && uc <= 0x1f77f) {
                //1F1E6 A
                //1F1FF Z
                if (0x1f1e6 <= uc && uc <= 0x1f1ff) //国旗的组合标志
                {
                    return { index: 4, length: 4, state: 0 };
                }
                else {
                    let res = this.trimNameStringFunc(substring, index + 2);
                    return (res.state == 0 || res.state == 1) ? { index: 2, length: 2, state: 1 } : { index: 2 + res.index, length: 2, state: 1 }
                }
            }
            else {
                return { index: 2, length: 2, state: 0 };
            }
        }
        else if (hs == 0xfe0f || hs == 0x200d) {
            let res = this.trimNameStringFunc(substring, index + 1);
            return res.state == 0 ? { index: 1, length: 1, state: 2 } : { index: 1 + res.index, length: 1 + res.index, state: 2 };
        }
        else if ((0x2100 <= hs && hs <= 0x27ff) ||
            (0x2B05 <= hs && hs <= 0x2b07) ||
            (0x2934 <= hs && hs <= 0x2935) ||
            (0x3297 <= hs && hs <= 0x3299) ||
            (hs == 0xa9 || hs == 0xae || hs == 0x303d ||
                hs == 0x3030 || hs == 0x2b55 || hs == 0x2b1c ||
                hs == 0x2b1b || hs == 0x2b50 || hs == 0xfe0f)) {
            let res = this.trimNameStringFunc(substring, index + 1);
            return res.state == 0 ? { index: 1, length: 1, state: 1 } : { index: 1 + res.index, length: 1 + res.index, state: 1 };
        } else {
            return { index: 1, length: 2, state: 0 };
        }
    }

    static trimNameString(name: string, length: number) {
        if (name == "" || length <= 0) return "";
        let limitLength = length;
        let str_cut = "";
        let substring = name;
        let strLen = substring.length;
        let len = 0;
        for (let i = 0; i < strLen;) {
            let res = this.trimNameStringFunc(substring, i);
            len += res.length;
            i += res.index;

        }

        for (let i = 0; i < strLen;) {
            let res = this.trimNameStringFunc(substring, i);
            if (length < res.length) {
                break
            } else {
                str_cut += substring.substring(i, i + res.index);
                // console.log("----trimNameString---str_cut======", substring.substring(i, i + res.index), res.index, res.length);
                length -= res.length;
                i += res.index;
            }

        }
        // console.log("----trimNameString---len======", len, length);
        if (len > limitLength) {
            return str_cut + "...";
        } else {
            return str_cut;
        }

    }

}
import { _decorator, js, AssetManager, Sprite, resources, instantiate, Prefab, error, assetManager, SpriteFrame, Texture2D, url, ImageAsset, Node, dragonBones, isValid, BitmapFont } from 'cc';
import { Asset } from 'cc';
import { SpriteAtlas } from 'cc';
import { sp } from 'cc';
import Singleton from './Singleton';

export default class ResMgr extends Singleton {
    private loadedBundles: Map<string, AssetManager.Bundle> = new Map<string, AssetManager.Bundle>();
    public uiMaps = js.createMap();
    public curBundle: AssetManager.Bundle = null;

    public Fonts: Map<string, ImageAsset> = new Map();
    private resourceCache: Map<string, import('cc').Asset> = new Map();

    constructor() {
        super();
        this.loadedBundles.set("resources", resources);
    }

    /**预加载界面 */
    public async preloadUI(uiPrefabPath: string, bundleName, onProgress, onComplete?) {
        let bundle = await this.getBundle(bundleName) as AssetManager.Bundle
        await this.load(bundle, uiPrefabPath, onProgress, onComplete)
    }

    public async load(bundle: AssetManager.Bundle, uiPath, onProgress, onComplete) {
        return new Promise((res, rej) => {
            bundle.load(uiPath, onProgress, (err, assets) => {
                if (err) {
                    rej()
                    return
                }
                this.uiMaps[uiPath] = assets
                if (onComplete) {
                    onComplete()
                }
                res(null);
            })
        })
    }
    /**加载UI文件 */
    public async loadUI(uiPrefabPath: string, bundleName?: string): Promise<Node> {
        bundleName = bundleName || "resources"
        // if (this.uiMaps[uiPrefabPath]) {
        //     instantiate(this.uiMaps[uiPrefabPath])
        //     return
        // }
        let bundle = await this.getBundle(bundleName) as AssetManager.Bundle
        return new Promise((res, rej) => {
            bundle.load(uiPrefabPath, Prefab, (err, assets: Prefab) => {
                //assets.addRef();
                if (err) {
                    res(null);
                    return
                }
                this.uiMaps[uiPrefabPath] = assets;
                res(instantiate(assets));
            })
        })
    }

    public loadDragonRes(path: string) {
        return new Promise((res, rej) => {
            resources.load(path + "_ske", dragonBones.DragonBonesAsset, (err, db) => {
                resources.load(path + "_tex", dragonBones.DragonBonesAtlasAsset, (err, as) => {
                    res({ dragonAsset: db, dragonAtlasAsset: as });
                })
            })
        })
    }

    public async getBundle(bundleName) {
        let bundle = this.loadedBundles.get(bundleName);
        if (bundle) {
            return bundle;
        } else {
            return await this.loadBundle(bundleName);
        }
    }

    async loadBundle(bundleName) {
        return new Promise((res, rej) => {
            assetManager.loadBundle(bundleName, (err, bundle) => {
                if (!err) {
                    this.loadedBundles.set(bundleName, bundle);
                    res(bundle);
                } else {
                    rej(bundle);
                }
            })
        })
    }

    spriteFrameArray: Map<string, SpriteFrame> = new Map<string, SpriteFrame>();
    /**加载远程资源 */
    public loadRemote(containerSp: Sprite, url: string) {
        if (url == null || url == "") return;
        if (this.spriteFrameArray.has(url)) {
            if (isValid(containerSp) && isValid(ResMgr.getIns().spriteFrameArray.get(url))) {
                containerSp.spriteFrame = ResMgr.getIns().spriteFrameArray.get(url);
                return;
            }
        }
        assetManager.loadRemote(url, function (err, texture: ImageAsset) {
            if (err) {
                return
            }
            var sprite = new SpriteFrame();
            let tx = new Texture2D();
            tx.image = texture;
            sprite.texture = tx;
            ResMgr.getIns().spriteFrameArray.set(url, sprite);
            if (isValid(containerSp)) {
                containerSp.spriteFrame = sprite;
            }
        })
    }
    public loadHead(headSp: Sprite, url: string) {
    }
    public loadLocalHead(headSp: Sprite, url: string) {
    }
    public loadRemoteHead(headSp: Sprite, url: string) {
    }

    public getAllBundles() {
        return this.loadedBundles;
    }

    public releaseBundle(bundleName: string) {
        if (this.loadedBundles.has(bundleName)) {
            this.loadedBundles.get(bundleName).releaseAll();
            this.loadedBundles.delete(bundleName);
            console.log(`释放包：${bundleName}`);
        }
    }

    public async loadSpriteFrame(path: string, bundleName?: string) {
        bundleName = bundleName || "resources"
        let bundle = await this.getBundle(bundleName) as AssetManager.Bundle
        if (!path.includes("spriteFrame")) {
            path += "/spriteFrame"
        }
        return new Promise((res, rej) => {
            if (this.spriteFrameArray[bundleName + path])
                return res(this.spriteFrameArray[bundleName + path])
            bundle.load(path, SpriteFrame, (err, assets) => {
                if (assets == null) {
                    console.warn("图片加载失败：", path, bundleName)
                }
                if (err) {
                    res(null);
                    return
                }
                this.spriteFrameArray[bundleName + path] = assets;
                res(assets);
            })
        })
    }

    public async loadSpriteFramebyAtlas(name: string, Atlaspath: string, bundleName?: string) {
        bundleName = bundleName || "resources"
        let bundle = await this.getBundle(bundleName) as AssetManager.Bundle
        const cacheKey = `${bundleName}:${Atlaspath}:SpriteAtlas`;
        return new Promise((res, rej) => {
            let atlas = this.resourceCache.get(cacheKey) as SpriteAtlas
            if (atlas)
                return res(atlas.getSpriteFrame(name))
            bundle.load(Atlaspath, SpriteAtlas, (err, assets) => {
                if (err) {
                    res(null);
                    return
                }
                this.resourceCache.set(cacheKey, assets);
                res(assets.getSpriteFrame(name));
            })
        })
    }

    /**加载位图字体 */
    public async loadBitmapFont(path: string) {
        return new Promise((res, rej) => {
            if (this.Fonts[path])
                return res(this.Fonts[path])
            resources.load(path, BitmapFont, (err, assets) => {
                if (err) {
                    res(null);
                    return
                }
                this.Fonts[path] = assets;
                res(assets);
            })
        })
    }

    /**加载资源
     * @param path 资源路径
     * @param type 资源类型
     * @param bundleName 资源包名
     * @returns 资源
     */
    public async loadResourceAsync(path: string, type?: typeof Asset, bundleName?: string): Promise<Asset | null> {
        bundleName = bundleName || "resources";
        const cacheKey = `${bundleName}:${path}:${type ? type.name : 'any'}`;
        if (this.resourceCache.has(cacheKey)) {
            return this.resourceCache.get(cacheKey);
        }
        let bundle = await this.getBundle(bundleName) as AssetManager.Bundle;
        return new Promise((res, rej) => {
            if (type) {
                bundle.load(path, type, (err, asset) => {
                    if (err) {
                        res(null);
                        return;
                    }
                    this.resourceCache.set(cacheKey, asset);
                    res(asset);
                });
            } else {
                bundle.load(path, (err, asset) => {
                    if (err) {
                        res(null);
                        return;
                    }
                    this.resourceCache.set(cacheKey, asset);
                    res(asset);
                });
            }
        });
    }  

}


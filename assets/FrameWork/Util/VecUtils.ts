import { Vec2, Vec3 } from 'cc';

/**
 * Vec2 → Vec3
 * @param v2 输入的 Vec2
 * @param z  Z 轴（默认 0）
 * @param out 可选的复用 Vec3，避免 GC
 */
export function v2ToV3(v2: Vec2, z: number = 0, out?: Vec3): Vec3 {
    if (out) {
        out.set(v2.x, v2.y, z);
        return out;
    }
    return new Vec3(v2.x, v2.y, z);
}

/**
 * Vec3 → Vec2
 * @param v3 输入的 Vec3
 * @param out 可选的复用 Vec2，避免 GC
 */
export function v3ToV2(v3: Vec3, out?: Vec2): Vec2 {
    if (out) {
        out.set(v3.x, v3.y);
        return out;
    }
    return new Vec2(v3.x, v3.y);
}

import {
    AmbientLight,
    MathUtils,
    PerspectiveCamera,
    SRGBColorSpace,
    Vector3,
} from "three";
import { Sky } from "three/examples/jsm/objects/Sky";
import BaseThreeMap, { BaseThreeMapEvent } from "./Base";

/**
 * three天空场景
 */
export default class SkyThreeMap<
    E extends IEvent = IEvent,
> extends BaseThreeMap<E> {
    public camera: PerspectiveCamera = new PerspectiveCamera(
        75,
        this.aspect,
        0.1,
        100000,
    );

    /**
     * 天空
     */
    protected sky: Sky = new Sky();
    /**
     * 太阳位置
     */
    public sunConfig: SunConfig = new SunConfig();
    /**
     * 环境光
     */
    public ambientLight: AmbientLight = new AmbientLight(0xffffff, 1.0);

    /**
     * 添加太阳
     */
    protected addSky(): void {
        this.scene.add(this.sky);
        this.sky.scale.setScalar(450000);
        this.sky.material.uniforms["turbidity"].value = 5;
        this.sky.material.uniforms["rayleigh"].value = 1;
        this.sky.material.uniforms["mieCoefficient"].value = 0.01;
        this.sky.material.uniforms["mieDirectionalG"].value = 0.7;
    }
    /**
     * 更新太阳
     */
    protected updateSun(): void {
        const phi = MathUtils.degToRad(90 - this.sunConfig.elevation);
        const theta = MathUtils.degToRad(this.sunConfig.azimuth);
        this.sunConfig.intensity = Math.max(
            0,
            (Math.PI - Math.abs(phi)) / (Math.PI / 2) - 1,
        );
        this.sky.material.uniforms["sunPosition"].value.copy(
            new Vector3().setFromSphericalCoords(1, phi, theta),
        );
    }

    protected init(): void {
        this.webglRenderer.outputColorSpace = SRGBColorSpace;
    }

    protected main(): void {
        super.main();
        this.addSky();
        this.scene.add(this.ambientLight);
    }

    protected update(time: number): void {
        super.update(time);
        this.updateSun();
    }
}

export class SunConfig {
    private _elevation: number = 90;
    private _azimuth: number = 0;
    private _intensity: number = 1;

    /**
     * 仰角
     */
    public get elevation(): number {
        return this._elevation;
    }
    public set elevation(v: number) {
        this._elevation = v % 360;
    }
    /**
     * 方位角
     */
    public get azimuth(): number {
        return this._azimuth;
    }
    public set azimuth(v: number) {
        this._azimuth = v % 360;
    }
    /**
     * 強度
     */
    public get intensity(): number {
        return this._intensity;
    }
    public set intensity(v: number) {
        this._intensity = v;
    }
}

interface IEvent extends BaseThreeMapEvent {}

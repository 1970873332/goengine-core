import CanvasComponent from "../component/draw/Canvas";
import Camera from "../object/camera/Camera";
import { Scene } from "../object/node/gl/Index";
import WebglRenderer from "../object/render/Webgl";
import { EventMapEvent } from "./Event";

/**
 * Webgl场景
 */
export default abstract class GLMap<
    E extends IEvent = IEvent,
> extends CanvasComponent<E> {
    /**
     * 相机
     */
    declare public camera: Camera<any, any>;
    /**
     * 渲染器
     */
    declare public webglRenderer: WebglRenderer;

    /**
     * 场景
     */
    public scene: Scene = new Scene();
}

interface IEvent extends EventMapEvent { }

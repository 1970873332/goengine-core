import ResponseAttribute from "../../../attribute/Response";
import BaseGeometry from "../../../geometry/Base";
import BaseMaterial from "../../../material/Base";
import { BaseNodeSaveJSON } from "../../Base";
import BaseGLNode, { BaseGLNodeConfig } from "../Base";

/**
 * 网格
 */
export default class Mesh<
    G extends BaseGeometry = BaseGeometry,
    M extends BaseMaterial = BaseMaterial,
    C extends IConfig = IConfig,
> extends BaseGLNode<C> {
    public readonly isMesh: boolean = true;

    constructor(geometry?: G, material?: M, config?: C) {
        super();
        config && this.setConfig(config);
        this.geometry.silentSetter(geometry);
        this.material.silentSetter(material);
    }
    /**
     * 几何
     */
    public geometry: ResponseAttribute<G | undefined> = new ResponseAttribute(
        void 0,
    );
    /**
     * 材质
     */
    public material: ResponseAttribute<M | undefined> = new ResponseAttribute(
        void 0,
    );

    public toJSON(): ISaveJSON {
        return {
            ...super.toJSON(),
            geometryID: this.geometry.value?.uuid,
            materialID: this.material.value?.uuid,
        };
    }
}

interface IConfig extends BaseGLNodeConfig {}

interface ISaveJSON extends BaseNodeSaveJSON {
    /**
     * 几何id
     */
    geometryID?: string;
    /**
     * 材质id
     */
    materialID?: string;
}

export { IConfig as MeshConfig, ISaveJSON as MeshSaveJSON };

import CanvasComponent from "../components/draw/Canvas";
import { GLSceneDataJSON } from "../datas/GLScene";
import Camera from "../objects/camera/Camera";
import BaseGeometry, { BaseGeometrySaveJSON } from "../objects/geometry/Base";
import PlaneGeometry, {
    PlaneGeometrySaveJSON,
} from "../objects/geometry/nodes/planes/Plane";
import BaseMaterial, { BaseMaterialSaveJSON } from "../objects/material/Base";
import BaseMeshMaterial, {
    BaseMeshMaterialSaveJSON,
} from "../objects/material/BaseMesh";
import { Euler, Vector3 } from "../objects/math/Index";
import BaseGLNode from "../objects/node/gl/Base";
import { Scene } from "../objects/node/gl/Index";
import Collision2D, {
    Collision2DSaveJSON,
} from "../objects/node/gl/nodes/Collision2D";
import Mesh, { MeshConfig, MeshSaveJSON } from "../objects/node/gl/nodes/Mesh";
import BasePhysicsNode, {
    BasePhysicsNodeSaveJSON,
} from "../objects/node/physics/Base";
import { Matter2D } from "../objects/node/physics/Index";
import WebglRenderer from "../objects/render/Webgl";
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
    declare public camera: Camera;
    /**
     * 渲染器
     */
    declare public webglRenderer: WebglRenderer;

    /**
     * 场景
     */
    public scene: Scene = new Scene();

    /**
     * 创建节点
     * @param targetID
     * @param json
     * @returns
     */
    public createNodeByJSON(
        targetID: string,
        json: GLSceneDataJSON,
    ): BaseGLNode | undefined {
        const { nodes, geometrys, materials, physicss } = json;
        const node = nodes.find((node) => node.uuid === targetID);
        if (!node) return void 0;
        const {
            uuid,
            type,
            visible,
            position,
            anchor,
            scale,
            rotation,
            disableHelper,
            instruct,
            controlled,
            children,
        } = node;
        const meshConfig: MeshConfig = {
            uuid,
            visible,
            instruct,
            disableHelper,
            controlled,
            position: new Vector3(position[0], position[1], position[2]),
            anchor: new Vector3(anchor[0], anchor[1], anchor[2]),
            rotation: new Euler(rotation[0], rotation[1], rotation[2]),
            scale: new Vector3(scale[0], scale[1], scale[2]),
        };

        if (type === "Mesh") {
            const { geometryID, materialID } = node as MeshSaveJSON;
            const mesh = new Mesh(
                this.createGeometryByJSON(geometryID, geometrys),
                this.createMaterialByJSON(materialID, materials),
                meshConfig,
            );
            children.forEach((child: string) => {
                const childNode = this.createNodeByJSON(child, json);
                childNode && mesh.add(childNode);
            });
            return mesh;
        } else if (type === "Collision2D") {
            const { geometryID, materialID, rigidBody } =
                node as Collision2DSaveJSON;
            const collision = new Collision2D(
                void 0,
                void 0,
                void 0,
                meshConfig,
            );
            const physicsBody = this.createPhysicsByJSON(rigidBody, physicss);
            collision.geometry.silentSetter(
                this.createGeometryByJSON(geometryID, geometrys),
            );
            collision.material.silentSetter(
                this.createMaterialByJSON(materialID, materials),
            );
            physicsBody instanceof Matter2D &&
                collision.rigidBody.silentSetter(physicsBody);
            collision.setBodyConfig({ position: meshConfig.position?.clone() });
            children.forEach((child: string) => {
                const childNode = this.createNodeByJSON(child, json);
                childNode && collision.add(childNode);
            });
            return collision;
        }
    }

    /**
     * 创建几何体
     * @param targetID
     * @param geometrys
     * @returns
     */
    public createGeometryByJSON(
        targetID: string | undefined,
        geometrys: BaseGeometrySaveJSON[],
    ): BaseGeometry | undefined {
        const geometry = geometrys.find(
            (geometry) => geometry.uuid === targetID,
        );
        if (!geometry) return void 0;
        if (geometry.type === "PlaneGeometry") {
            const { size } = geometry as PlaneGeometrySaveJSON;
            return new PlaneGeometry({ width: size[0], height: size[1] });
        }
    }

    /**
     * 创建材质
     * @param targetID
     * @param materials
     * @returns
     */
    public createMaterialByJSON(
        targetID: string | undefined,
        materials: BaseMaterialSaveJSON[],
    ): BaseMaterial | undefined {
        const material = materials?.find(
            (material) => material.uuid === targetID,
        );
        if (!material) return void 0;
        if (material.type === "BaseMeshMaterial") {
            const { textureAlpha, color, alpha } =
                material as BaseMeshMaterialSaveJSON;
            return new BaseMeshMaterial({ textureAlpha, color, alpha });
        }
    }

    /**
     * 创建物理
     * @param targetID
     * @param physicss
     * @returns
     */
    public createPhysicsByJSON(
        targetID: string | undefined,
        physicss: BasePhysicsNodeSaveJSON[],
    ): BasePhysicsNode<any> | undefined {
        const physics = physicss.find((physics) => physics.uuid === targetID);
        if (!physics) return void 0;
        if (physics.type === "Matter2D") {
            return new Matter2D(physics.config);
        }
    }
}

interface IEvent extends EventMapEvent {}

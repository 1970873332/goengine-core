import { BaseGeometrySaveJSON } from "../objects/geometry/Base";
import { BaseMaterialSaveJSON } from "../objects/material/Base";
import { BaseNodeSaveJSON } from "../objects/node/Base";
import { SceneSaveJSON } from "../objects/node/gl/nodes/Scene";
import { BasePhysicsNodeSaveJSON } from "../objects/node/physics/Base";

interface IJSON {
    /**
     * 节点
     */
    nodes: BaseNodeSaveJSON[];
    /**
     * 几何
     */
    geometrys: BaseGeometrySaveJSON[];
    /**
     * 材质
     */
    materials: BaseMaterialSaveJSON[];
    /**
     * 物理
     */
    physicss: BasePhysicsNodeSaveJSON[];
    /**
     * 场景
     */
    scene: SceneSaveJSON;
}

export { IJSON as GLSceneDataJSON };

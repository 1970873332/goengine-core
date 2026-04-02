import CanvasComponent from "../components/draw/Canvas";
import { Group } from "../objects/node/ctx2d/Index";

/**
 * 2D画布场景
 */
export default abstract class CTXMap extends CanvasComponent {
    /**
     * 场景根节点
     */
    public scene: Group = new Group();
}

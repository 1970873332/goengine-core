import IdentityComponent from "../../components/Identity";
import { UniformType } from "../../enum/GLSL";
import { def as DefaultFrag } from "../glsl/fragment/Index";
import { def as DefaultVert } from "../glsl/vertex/Index";
import BaseMaterial, { MaterialConfig } from "./Base";

/**
 * 着色器材质
 */
export default class ShaderMaterial<
    U extends IUniforms = IUniforms,
> extends BaseMaterial<IConfig<U>> {
    constructor(config?: IConfig<U>) {
        super();
        config && this.setConfig(config);
    }

    /**
     * uniforms
     */
    public uniforms: U = {} as U;
    /**
     * 顶点着色器
     */
    public vertex: IdentityComponent = new IdentityComponent(DefaultVert);
    /**
     * 片元着色器
     */
    public fragment: IdentityComponent = new IdentityComponent(DefaultFrag);

    public setConfig(config: IConfig<U>): void {
        super.setConfig(config);
        this.uniforms = config.uniforms;
        config.vertex && this.vertex.updateChar(config.vertex);
        config.fragment && this.fragment.updateChar(config.fragment);
    }
}

interface IConfig<U extends IUniforms> extends MaterialConfig {
    /**
     * uniforms
     */
    uniforms: U;
    /**
     * 顶点着色器
     */
    vertex?: string;
    /**
     * 片元着色器
     */
    fragment?: string;
}

interface IAttribute {
    /**
     * 类型
     */
    type: UniformType;
    /**
     * 值
     */
    value: unknown;
}

interface IUniforms extends Record<string, IAttribute> {}

export { IUniforms as ShaderMaterialUniform };

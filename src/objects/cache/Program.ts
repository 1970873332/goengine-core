import ShaderState from "../states/Shader";
import MapCache from "./base/Map";

/**
 * 程序缓存
 */
export default class ProgramCache extends MapCache<WebGLProgram> {
    /**
     * 存储
     * @param id
     * @returns
     */
    protected storage(
        id: string,
        vertex: WebGLShader,
        fragment: WebGLShader,
    ): WebGLProgram | undefined {
        if (this.has(id)) return this.get(id)!;
        const program: WebGLProgram = this.gl.createProgram();
        this.gl.attachShader(program, vertex);
        this.gl.attachShader(program, fragment);
        this.gl.linkProgram(program);
        // 检查链接状态
        const linkSuccess: boolean = !!this.gl.getProgramParameter(
            program,
            this.gl.LINK_STATUS,
        );
        if (!linkSuccess) {
            console.error(this.gl.getProgramInfoLog(program));
            this.gl.deleteProgram(program);
            return void 0;
        }
        this.set(id, program);
        return program;
    }
    /**
     * 分配
     * @param shader
     * @returns
     */
    public allocate(
        shader: GLSL.Shader<ShaderState>,
    ): WebGLProgram | undefined {
        const {
                vertex: { id: vertexID, shader: vertex },
                fragment: { id: fragmentID, shader: fragment },
            } = shader,
            id: string = `${vertexID}_${fragmentID}`;
        if (!vertex || !fragment) return void 0;
        return this.storage(id, vertex, fragment);
    }
}

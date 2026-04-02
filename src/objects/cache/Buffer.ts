import { md5 } from "js-md5";
import { AttributeKey } from "../../enum/GLSL";
import ArrayAttribute from "../attribute/Array";
import BaseGeometry, { BaseGeometryAttribute } from "../geometry/Base";
import MapCache from "./base/Map";
import { State } from "./State";

/**
 * 缓冲缓存
 */
export default class BufferCache extends MapCache<WebGLBuffer> {
    /**
     * ID
     * @param array
     */
    protected id(array: ArrayBuffer): string {
        return md5(array);
    }
    /**
     * 缓冲
     * @param id
     * @returns
     */
    protected buffer(id: string): WebGLBuffer {
        return this.get(id) ?? this.gl.createBuffer();
    }
    /**
     * 绑定
     * @param geometry
     */
    public bind(
        geometry: BaseGeometry,
        program: WebGLProgram,
        state: State,
    ): void {
        // 绑定属性缓冲
        Object.keys(geometry.attribute).forEach((key) => {
            const attribute: ArrayAttribute<Float32Array<ArrayBuffer>> =
                    geometry.attribute[key as keyof BaseGeometryAttribute]!,
                id: string = this.id(attribute.array.buffer),
                buffer: WebGLBuffer = this.buffer(id),
                local: number =
                    state.buffer.location[key] ??
                    this.gl.getAttribLocation(
                        program,
                        AttributeKey[key as keyof typeof AttributeKey] ?? key,
                    );
            if (local !== -1) {
                // 更新缓存位置
                if (!(key in state.buffer.location)) {
                    state.expire = true;
                    state.buffer.location[key] = local;
                }
                // 绑定缓冲
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
                // 上传数据
                if (!this.has(id)) {
                    this.gl.bufferData(
                        this.gl.ARRAY_BUFFER,
                        attribute.array,
                        this.gl.STATIC_DRAW,
                    );
                    this.set(id, buffer);
                }
                // 指定缓冲读取规则
                this.gl.vertexAttribPointer(
                    local,
                    attribute.size,
                    this.gl.FLOAT,
                    false,
                    0,
                    0,
                );
                // 启用属性
                this.gl.enableVertexAttribArray(local);
            }
        });
        // 绑定索引缓冲
        if (geometry.index) {
            const id: string = this.id(geometry.index.array.buffer),
                buffer: WebGLBuffer = this.buffer(id);
            // 绑定缓冲
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
            // 上传数据
            if (!this.has(id)) {
                this.gl.bufferData(
                    this.gl.ELEMENT_ARRAY_BUFFER,
                    geometry.index.array,
                    this.gl.STATIC_DRAW,
                );
                this.set(id, buffer);
            }
        }
    }
}

import DuplicatableComponent from "../../components/fussy/Duplicatable";
import { ToggleUtils } from "../../utils/Toggle";

/**
 * 值
 */
export default class Value<T = any> extends DuplicatableComponent<
    Record<any, any>,
    Func.RecordCallBack<T>
> {
    constructor(private _value: T) {
        super();
    }

    public get value(): T {
        return ToggleUtils.lazy(this._value);
    }
    protected set value(v: T) {
        this._value = v;
    }

    public toString(): string {
        return JSON.stringify(this.value);
    }
}

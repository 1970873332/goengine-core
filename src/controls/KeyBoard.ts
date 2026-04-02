import { KeyboardEvent as ReactKeyboardEvent } from "react";
import { EventState, EventTarget } from "../supplements/Event";

/**
 * 键盘控制
 */
export class KeyBoardControl<E extends IEvent = IEvent> extends EventTarget<E> {
    /**
     * 所有键
     */
    public static codeMapping = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "Tab",
        "Shift",
        "Control",
        "Alt",
        "CapsLock",
        "Escape",
        "Enter",
        "Space",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
    ] as const;

    constructor(protected hijack: boolean = true) {
        super();
        KeyBoardControl.codeMapping.forEach((key: TKey) => {
            const type = this.formatCode(key);
            Object.defineProperty(this, `KEY_${type}`, {
                get: () => {
                    return this.keyMapping[type];
                },
            });
        });
        this.keyDownState.wake();
        this.keyUpState.wake();
    }

    protected keyMapping: {
        [k: string]: EventTarget<IEvent> & IKeyEvent;
    } = Object.fromEntries(
        KeyBoardControl.codeMapping.map((key: TKey) => {
            return [
                key,
                Object.assign(new EventTarget<IEvent>(), {
                    enable: false,
                    type: key,
                } as IKeyEvent),
            ];
        }),
    );

    protected keyDownState: EventState<WindowEventMap> = new EventState(
        window,
        "keydown",
        this.handleKeyDown.bind(this),
    );
    protected keyUpState: EventState<WindowEventMap> = new EventState(
        window,
        "keyup",
        this.handleKeyUp.bind(this),
    );

    /**
     * 键盘按下
     * @param event
     */
    protected handleKeyDown(event: TKeyboardEvent): void {
        this.hijack && event.preventDefault();
        const type = this.formatCode(event.code);
        const keyMap = (this as TKeyBoardControl)[`KEY_${type}`];
        if (keyMap) {
            const change: boolean = !keyMap.enable;
            Object.assign(keyMap, {
                enable: true,
                event: event,
            } as Partial<IKeyEvent>);
            this.dispatchCustomEvent("down", keyMap);
            change && this.dispatchCustomEvent("change", keyMap);
            keyMap.dispatchCustomEvent("down", keyMap);
            change && keyMap.dispatchCustomEvent("change", keyMap);
        }
    }
    /**
     * 键盘抬起
     * @param event
     */
    protected handleKeyUp(event: TKeyboardEvent): void {
        this.hijack && event.preventDefault();
        const type = this.formatCode(event.code);
        const keyMap = (this as TKeyBoardControl)[`KEY_${type}`];
        if (keyMap) {
            Object.assign(keyMap, {
                enable: false,
                event: event,
            });
            this.dispatchCustomEvent("up", keyMap);
            this.dispatchCustomEvent("change", keyMap);
            keyMap.dispatchCustomEvent("up", keyMap);
            keyMap.dispatchCustomEvent("change", keyMap);
        }
    }
    /**
     * 格式化
     * @param code
     * @returns
     */
    protected formatCode(code: string): TKey {
        return code.replace("Key", "") as TKey;
    }
    /**
     * 销毁
     */
    public destroy(): void {
        this.keyDownState.break();
        this.keyUpState.break();
    }
}

interface IEvent {
    /**
     * 改变
     */
    change: IKeyEvent;
    /**
     * 按下
     */
    down: IKeyEvent;
    /**
     * 抬起
     */
    up: IKeyEvent;
}

interface IKeyEvent extends EventTarget<IEvent> {
    /**
     * 启用
     */
    enable: boolean;
    /**
     * 类型
     */
    type: TKey;
    /**
     * 事件
     */
    event?: TKeyboardEvent;
}

type TKey = (typeof KeyBoardControl)["codeMapping"][number];

type TKeyboardEvent = KeyboardEvent | ReactKeyboardEvent;

type TKeyMap = {
    [key in TKey as `KEY_${key}`]?: IKeyEvent;
};

type TKeyBoardControl = {
    [key in keyof KeyBoardControl]: KeyBoardControl[key];
} & TKeyMap;

export {
    IEvent as KeyBoardControlEvent,
    TKey as KeyBoardControlKey,
    IKeyEvent as KeyBoardControlKeyEvent,
    TKeyBoardControl as KeyBoardControlMap,
};

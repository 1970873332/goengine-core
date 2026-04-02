import {
    Cell,
    CellErrorValue,
    CellFormulaValue,
    CellHyperlinkValue,
    CellRichTextValue,
    CellSharedFormulaValue,
    CellValue,
    Row,
    Worksheet,
} from "exceljs";
import { Vector4 } from "../objects/math/Index";
import { ArrayUtils } from "../utils/Array";

/**
 * 表格状态
 */
export default class SheetState<
    E extends Record<any, unknown> = Record<any, unknown>,
> {
    /**
     * 格式化值
     * @param value
     * @returns
     */
    public static formatValue(value: CellValue): string {
        switch (typeof value) {
            case "string":
            case "number":
                return value.toString();
            case "boolean":
                return String(~~value);
            case "object":
                if (value === null) return "";
                if (value instanceof Date) return value.toLocaleString();
                /**
                 * Error
                 */
                if (Object.keys(value).includes("error"))
                    return (value as CellErrorValue).error;
                /**
                 * RichText
                 */ else if (Object.keys(value).includes("richText"))
                    return (value as CellRichTextValue).richText
                        .map((rich) => rich.text)
                        .join("");
                /**
                 * Hyperlink
                 */ else if (Object.keys(value).includes("text"))
                    return (value as CellHyperlinkValue).text;
                /**
                 * SharedFormula
                 */ else if (Object.keys(value).includes("sharedFormula"))
                    return (value as CellSharedFormulaValue).sharedFormula;
                /**
                 * Formula
                 */ else if (Object.keys(value).includes("formula"))
                    return (value as CellFormulaValue).formula;
                return String(value);
            default:
                return String(value);
        }
    }
    /**
     * 从表格获取状态
     * @param values
     */
    public static fromSheet(worksheet: Worksheet, head?: boolean): SheetState {
        const state: SheetState = new SheetState();
        state.bindSheet(worksheet, head ? [] : void 0);
        return state;
    }

    /**
     * 当前行
     */
    protected _index: number = 0;
    /**
     * 表格
     */
    public readonly sheet?: Worksheet;
    /**
     * 是否有表头
     */
    public readonly beingHead: boolean = false;
    /**
     * 管道
     */
    public pipe?: Generator<Row, void, void>;

    /**
     * 获取当前行
     */
    public get row(): Row | undefined {
        return this.sheet?.getRow(this.index);
    }
    /**
     * 获取表头
     */
    public get head(): Row | undefined {
        if (!this.beingHead) return void 0;
        return this.sheet?.getRow(1);
    }
    /**
     * 当前行单元格数量
     */
    public get cellCount(): number {
        if (!this.row) return -1;
        return ArrayUtils.normalize(this.row.values).length;
    }
    /**
     * 表头单元格数量
     */
    public get headCellCount(): number {
        if (!this.head) return -1;
        return ArrayUtils.normalize(this.head.values).length;
    }
    /**
     * 当前行索引
     */
    public get index(): number {
        return this._index;
    }
    protected set index(value: number) {
        this._index = value;
    }

    /**
     * 获取行数据
     * @param format
     */
    protected *pipeline(): Generator<Row, void, void> {
        if (!this.sheet) return;
        while (this.sheet.getRow(this.index + 1)?.values.length) {
            yield this.sheet.getRow(++this.index);
        }
        return;
    }
    /**
     * 从表头获取位置
     * @param name
     * @returns
     */
    public locationFromHead(name: keyof E & string): string | number {
        const list: CellValue[] = ArrayUtils.normalize(this.head?.values);
        let index: number = list.findIndex(
            (value) => SheetState.formatValue(value) === name,
        );
        if (index === -1) return name;
        return index;
    }
    /**
     * 从表头获取位置
     * @param name
     */
    public locationFromHeadFormat(name: keyof E & string): number {
        const location: string | number = this.locationFromHead(name);
        return typeof location === "number" ? location : this.headCellCount;
    }
    /**
     * 根据表头链接单元格数据
     * @param name
     */
    public cellValueOfRowLinkHead(
        name: keyof E & string,
        format?: true,
    ): string | undefined;
    public cellValueOfRowLinkHead(
        name: keyof E & string,
        format?: false,
    ): CellValue | undefined;
    public cellValueOfRowLinkHead(
        name: keyof E & string,
        format: boolean = true,
    ): CellValue | string | undefined {
        try {
            const index: number | string = this.locationFromHead(name),
                cell: Cell | undefined = this.row?.getCell(
                    typeof index === "string" ? index : index,
                );
            if (!cell) return;
            return format ? SheetState.formatValue(cell.value) : cell.value;
        } catch {
            throw `获取单元格数据失败,无效的索引-${name}`;
        }
    }
    /**
     * 绑定工作表
     * @param sheet
     */
    public bindSheet(sheet: Worksheet | undefined, head?: string[]): void {
        Object.assign(this, {
            sheet,
            pipe: this.pipeline(),
            beingHead: !!head,
            index: ~~!!head,
        } as Partial<this>);
        head?.forEach((value) =>
            this.setCell(value, this.headCellCount, this.head),
        );
    }
    /**
     * 设置单元格
     * @param index
     * @param value
     * @returns
     */
    public setCell(
        value: CellValue,
        index: number | string = this.cellCount,
        row: Row | undefined = this.row,
    ): CellValue | undefined {
        if (!row) return;
        if (index !== -1 || (typeof index === "string" && index)) {
            try {
                const cell: Cell = row.getCell(
                    typeof index === "string"
                        ? this.locationFromHeadFormat(index)
                        : index,
                );
                cell.alignment = {
                    wrapText: true,
                    horizontal: "center",
                    vertical: "middle",
                };
                return (cell.value = value);
            } catch {
                throw `设置单元格数据失败,无效的索引-${index}`;
            }
        }
    }
    /**
     * 添加图片
     */
    public addImage(id: number, value: Vector4): void {
        const { x, y, width, height } = value,
            w: number = Math.max(
                this.sheet?.properties.defaultColWidth ?? 70,
                70,
            ),
            h: number = Math.max((w / width) * height, 30);
        this.sheet?.addImage(id, {
            tl: { col: x - 1, row: y - 1 },
            ext: { width: w, height: h },
        });
    }
    /**
     * 获取所有行
     */
    public toArray(excludeHead?: boolean): CellValue[][] {
        const start: number = ~~!!(excludeHead && this.beingHead) + 1,
            length: number = this.sheet?.rowCount ?? 0;
        return (
            this.sheet
                ?.getRows(start, length)
                ?.map((value) => ArrayUtils.normalize(value.values)) ?? []
        );
    }
    /**
     * 重置管道
     */
    public destroy(): void {
        Object.assign(this, {
            sheet: undefined,
            pipe: undefined,
            index: 0,
        } as Partial<this>);
    }
    /**
     * 替换行
     */
    public replaceRows(start: number, rows: CellValue[][]): void {
        rows.forEach((row, index) => {
            const sheetRow: Row | undefined = this.sheet?.getRow(
                start + index + 1,
            );
            if (!sheetRow) throw new Error("数据长度不足");
            sheetRow.values = row;
        });
    }
}

/**
 * 时间工具
 */
export abstract class TimeUtils {
    /**
     * 标准化时间格式
     */
    public static normal(date: Date = new Date()): string {
        const year = date.getFullYear(),
            month = String(date.getMonth() + 1).padStart(2, "0"),
            day = String(date.getDate()).padStart(2, "0"),
            hours = String(date.getHours()).padStart(2, "0"),
            minutes = String(date.getMinutes()).padStart(2, "0"),
            seconds = String(date.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day}-${hours}${minutes}${seconds}`;
    }
}

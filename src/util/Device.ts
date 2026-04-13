/**
 * 设备工具类
 */
export abstract class DeviceUtils {
    /**
     * 桌面端
     */
    public static get desktop(): boolean {
        return (
            window.DeviceState?.desktop ??
            !!navigator.userAgent.match(/Windows|Macintosh|Linux/i)
        );
    }
    /**
     * 移动端
     */
    public static get mobile(): boolean {
        return (
            window.DeviceState?.mobile ??
            !!navigator.userAgent.match(/Mobile|Android|iPhone|iPad/i)
        );
    }
    /**
     * Pad端
     */
    public static get pad(): boolean {
        return (
            window.DeviceState?.pad ??
            !!navigator.userAgent.match(/iPad|Android Tablet/i)
        );
    }
    /**
     * 苹果设备
     */
    public static get ios(): boolean {
        return (
            window.DeviceState?.ios ??
            !!navigator.userAgent.match(/iPhone|iPad|iPod/i)
        );
    }
    /**
     * 安卓设备
     */
    public static get android(): boolean {
        return (
            window.DeviceState?.android ??
            !!navigator.userAgent.match(/Android/i)
        );
    }
    /**
     * 微信环境
     */
    public static get weChat(): boolean {
        return !!navigator.userAgent.match(/MicroMessenger/i);
    }
    /**
     * 横屏（分辨率）
     */
    public static get landscape(): boolean {
        return window.innerWidth >= window.innerHeight;
    }

    /**
     * 全屏
     */
    public static fullScreen(): void {
        const doc: Document = document,
            docElement: HTMLElement = doc.documentElement;

        if (
            doc.fullscreenElement ||
            doc.webkitFullscreenElement ||
            doc.mozFullScreenElement ||
            doc.msFullscreenElement
        ) {
            doc.exitFullscreen?.() ??
                doc.webkitExitFullscreen?.() ??
                doc.mozCancelFullScreen?.() ??
                doc.msExitFullscreen?.();
        } else {
            docElement.requestFullscreen?.() ??
                docElement.webkitRequestFullscreen?.() ??
                docElement.mozRequestFullScreen?.() ??
                docElement.msRequestFullscreen?.();
        }
    }
}

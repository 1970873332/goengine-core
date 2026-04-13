import { Secret, TOTP } from "otpauth";

/**
 * OTP验证
 */
export default class OTP {
    constructor(private code?: string) {}

    /**
     * 密钥
     */
    private secret?: Secret;
    /**
     * 令牌
     */
    protected otp: TOTP = new TOTP({
        algorithm: "SHA1",
        digits: 6,
        period: 30,
    });

    /**
     * 生成
     * @param time
     * @returns
     */
    public generate(timestamp: number): string | undefined {
        if (!this.secret) {
            if (this.code)
                this.otp.secret = this.secret = Secret.fromBase32(this.code);
            else return;
        }
        return this.otp.generate({ timestamp });
    }
}

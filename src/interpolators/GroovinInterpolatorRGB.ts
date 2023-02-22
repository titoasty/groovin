import { GroovinInterpolator } from './GroovinInterpolator';

export class GroovinInterpolatorRGB extends GroovinInterpolator {
    get(t: number) {
        return {
            r: this.from.r + t * (this.to.r - this.from.r),
            g: this.from.g + t * (this.to.g - this.from.g),
            b: this.from.b + t * (this.to.b - this.from.b),
        };
    }
}

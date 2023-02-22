import { GroovinInterpolator } from './GroovinInterpolator';

export class GroovinInterpolatorNumber extends GroovinInterpolator {
    get(t: number) {
        return this.from + t * (this.to - this.from);
    }
}

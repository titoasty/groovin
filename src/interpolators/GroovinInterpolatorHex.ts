import { GroovinInterpolatorRGB } from './GroovinInterpolatorRGB';

function hexToRGB(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
}

export class GroovinInterpolatorHex extends GroovinInterpolatorRGB {
    constructor(from: any, to: any) {
        super(hexToRGB(from), hexToRGB(to));
    }
}

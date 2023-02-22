import { GroovinInterpolator } from './interpolators/GroovinInterpolator';
import { parseEase } from './parseEase';

/**
 * parse an object of raw timings and return a parsed object
 * CSS-style transition: duration(s/ms) <ease> <delay(s/ms)>
 * ex: 1s circ-inOut 500ms
 * duration of 1s with the ease function circ-inOut and a delay of 500ms
 * @param timings a list of raw timings with their property name
 * @returns a parsed timing
 */
export function parseTransitionParams<T extends object>(timings: { [key in keyof T]?: string | GroovinTransitionParam }, interpolators: Map<string, typeof GroovinInterpolator>) {
    const parsedTimings: { [key in keyof T]?: GroovinTransition } = {};

    // parse timings
    for (const key in timings) {
        const value = timings[key];
        if (!value) {
            continue;
        }

        let duration: number = 0;
        let easeFn: EasingFn = () => 0;
        let delay = 0;
        let interpolatorName = 'number';

        if (typeof value === 'string') {
            // string timing
            const fields = value.trim().toLowerCase().split(/\s+/);

            if (fields.length <= 0) {
                console.warn('groovin: invalid transition specified for field ' + key);
                continue;
            }

            // interpolator type at the end (ex: 1s sine-out 2s rgb!)
            if (fields[fields.length - 1].endsWith('!')) {
                interpolatorName = fields.pop()!.slice(0, -1);
            }

            // duration
            duration = parseFloat(fields[0]);
            if (fields[0].endsWith('ms')) {
                duration /= 1000;
            }

            // ease
            easeFn = parseEase(fields.length >= 1 ? fields[1] : 'linear');

            // delay
            delay = 0;
            if (fields.length >= 3) {
                delay = parseFloat(fields[2]);

                if (fields[2].endsWith('ms')) {
                    duration /= 1000;
                }
            }
        } else {
            // only have to parse the ease string
            duration = value.duration;
            easeFn = typeof value.ease === 'string' ? parseEase(value.ease) : value.ease;
            delay = value.delay;
            interpolatorName = value.type || 'number';
        }

        parsedTimings[key] = {
            duration,
            ease: easeFn,
            delay,
            interpolator: (interpolators.get(interpolatorName) || interpolators.get('number'))!,
        };
    }

    return parsedTimings;
}

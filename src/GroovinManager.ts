import { GroovinObject } from './GroovinObject';
import { GroovinTweenManager } from './GroovinTweenManager';
import { GroovinInterpolator } from './interpolators/GroovinInterpolator';
import { GroovinInterpolatorHex } from './interpolators/GroovinInterpolatorHex';
import { GroovinInterpolatorNumber } from './interpolators/GroovinInterpolatorNumber';
import { GroovinInterpolatorRGB } from './interpolators/GroovinInterpolatorRGB';
import { parseTransitionParams } from './parseTransitionParams';

export class GroovinManager {
    tweenManager: GroovinTweenManager;
    managed: Map<object, GroovinObject> = new Map<object, GroovinObject>();
    interpolators: Map<string, typeof GroovinInterpolator> = new Map<string, typeof GroovinInterpolator>();

    constructor(tweenManager: GroovinTweenManager) {
        this.tweenManager = tweenManager;

        // interpolators are custom interpolations that you can add instead of the basic number interpolation
        // ex: color interpolation (hex, rgb, ...)
        // to specify them, simply add their name + '!' at the end of a transition string
        // ex: "1s sine-out 2s hex!"
        this.interpolators.set('number', GroovinInterpolatorNumber);
        this.interpolators.set('hex', GroovinInterpolatorHex);
        this.interpolators.set('rgb', GroovinInterpolatorRGB);
    }

    /**
     * Unbind an object
     * @param obj object to unbind
     */
    unbind(obj: object) {
        const managedObj = this.managed.get(obj);
        managedObj?.kill();

        this.managed.delete(obj);
    }

    addInterpolator(name: string, interpolator: typeof GroovinInterpolator) {
        this.interpolators.set(name, interpolator);
    }

    /**
     * Bind an object so its properties can be groovinted like CSS properties
     * @param obj object to bind
     * @param transitions transitions for each properties
     * @param styles optional styles that can be applied with groovin.style
     * @returns
     */
    bind<T extends object>(obj: T, transitions: { [key in keyof T]?: string | GroovinTransitionParam }, styles?: GroovinStylesParam<T>): T {
        this.unbind = this.unbind.bind(this);

        // parse transitions
        const parsedTransitions = parseTransitionParams(transitions, this.interpolators);
        if (!parsedTransitions) {
            return obj;
        }

        // parse styles
        const parsedStyles: GroovinStyles<T> = {};
        if (styles) {
            for (const key in styles) {
                const style = styles[key];

                parsedStyles[key] = {
                    ...style,
                    transitions: style.transitions ? parseTransitionParams(style.transitions, this.interpolators) : {},
                };
            }
        }

        // create the managed object & store it
        const managedObj = new GroovinObject(obj, parsedTransitions, this.tweenManager, parsedStyles);
        this.managed.set(obj, managedObj);

        return obj;
    }

    /**
     * Apply a style to an object
     * @param obj the object to change the style
     * @param styleName style name
     * @returns true if the style exists and is applied
     */
    style<T extends object>(obj: T, styleName: string) {
        const managedObj = this.managed.get(obj);
        if (!managedObj) return false;

        return managedObj.setStyle(styleName);
    }

    /**
     * Unbind all objects
     */
    unbindAll() {
        for (const managed of this.managed.values()) {
            managed.kill();
        }

        this.managed.clear();
    }
}

import { GroovinTweenManager } from './GroovinTweenManager';
import { Tween } from './Tween';

/**
 * Managed object
 * How it works: override a property with getter/setter
 * When set, transition to the new value with corresponding transition
 * Transitions can be overridden by styles
 * Easier than with a proxy because with this technique we don't create another object
 * When killed, getter/setter are removed and instead currValue(s) are set to the corresponding properties
 */
export class GroovinObject {
    private obj: Record<string, any>;
    private tweens = new Map<string, Tween>();
    private styles?: GroovinStyles<Record<string, any>>;

    defaultTransitions: { [key: string]: GroovinTransition | undefined };
    currTransitions: { [key: string]: GroovinTransition | undefined };

    constructor(obj: Record<string, any>, defaultTransitions: { [key: string]: GroovinTransition | undefined }, tweenManager: GroovinTweenManager, styles?: GroovinStyles<Record<string, any>>) {
        this.obj = obj;
        this.styles = styles;
        this.defaultTransitions = defaultTransitions;
        this.currTransitions = {
            ...defaultTransitions,
        };

        const that = this;

        // collect properties affected by transitions (& transitions in styles)
        const properties = new Set<string>(Object.keys(defaultTransitions));
        if (styles) {
            // collection properties from transitions of each styles
            for (const key in styles) {
                const style = styles[key];
                if (!style.transitions) {
                    continue;
                }

                Object.keys(style.transitions).forEach((prop) => properties.add(prop));
            }
        }

        // only modify properties that have transitions
        for (const property of properties) {
            // get the current value
            // currValue is the current value storage, it is *not* in the object
            // because we had getter/setter
            let currValue = obj[property] as number;

            // override property with getter & setter
            Object.defineProperty(obj, property, {
                // and here you are, currValue
                get() {
                    return currValue;
                },
                // transition to newValue on set
                set(newValue: number) {
                    // delete old tween
                    that.tweens.get(property)?.kill();

                    // get transition for the property
                    const transition = that.currTransitions[property]!;

                    if (transition) {
                        // we got a transition, start tween
                        const tween = tweenManager.get();
                        tween.start(tweenManager, transition.duration, transition.ease, transition.delay, new transition.interpolator(currValue, newValue), (newValue) => (currValue = newValue));
                        that.tweens.set(property, tween);
                    } else {
                        // no transition, just set the new value
                        // (no need for default transition)
                        currValue = newValue;
                    }
                },
            });
        }
    }

    /**
     * Set the style of the object by applying the values on the object
     * @param styleName name of the style
     * @returns true if the style exists and is applied
     */
    setStyle(styleName: string) {
        if (!this.styles) return false;

        // no style found
        const style = this.styles[styleName];
        if (!style) return false;

        // set new transitions from style
        this.currTransitions = {
            // first set default transitions
            ...this.defaultTransitions,
            // then override transitions
            ...(style.transitions || {}),
        };

        // apply values
        for (const key in style) {
            this.obj[key] = style[key];
        }

        return true;
    }

    /**
     * Kill a managed object
     */
    kill() {
        for (const property of this.tweens.keys()) {
            // restore value
            const value = this.obj[property];
            delete this.obj[property];
            this.obj[property] = value;

            // kill tween
            const tween = this.tweens.get(property);
            tween?.kill();
        }
    }
}

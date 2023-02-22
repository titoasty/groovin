import { GroovinTweenManager } from './GroovinTweenManager';
import easings from './easings';
import { GroovinInterpolator } from './interpolators/GroovinInterpolator';

export class Tween {
    private _duration: number = 0;
    private _ease: EasingFn = easings.linear();

    private _interpolator?: GroovinInterpolator;
    private _time: number = 0;
    private _onChange: (value: number) => void = () => {};

    manager?: GroovinTweenManager;

    start(manager: GroovinTweenManager, duration: number, ease: EasingFn, delay: number, interpolator: GroovinInterpolator, onChange: (value: number) => void) {
        this.manager = manager;
        manager.add(this);

        this._duration = duration;
        this._ease = ease;

        this._interpolator = interpolator;
        this._time = -delay;
        this._onChange = onChange;
    }

    update(delta: number) {
        // update time
        this._time += delta;

        // compute t [0,1]
        const t = Math.max(0, Math.min(1, this._time / this._duration));

        this._onChange(this._interpolator?.get(this._ease(t)));

        // end of the groovintion
        if (this._time >= this._duration) {
            this.kill();
        }
    }

    kill() {
        this.manager?.kill(this);
    }
}

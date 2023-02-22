import { Tween } from './Tween';

/**
 * Manage tweens
 * Automatically updates them, can also be manual
 */
// TODO: tweens recycling?
export class GroovinTweenManager {
    private tweens: Tween[] = [];
    private lastTime = performance.now();
    private rafID: number = -1;

    // no recycling for now
    // it's causing problem with GroovinObject tweens.get(property)?.kill()
    // private recycled: Tween[] = [];

    constructor(autoUpdate: boolean = true) {
        //, minCapacity = 20) {
        if (autoUpdate) {
            this.rafID = requestAnimationFrame(this.autoUpdate.bind(this));
        }

        // for (let i = 0; i < minCapacity; i++) {
        //     this.recycled.push(new Tween());
        // }
    }

    private autoUpdate() {
        const now = performance.now();
        const delta = (now - this.lastTime) / 1000;
        this.lastTime = now;

        this.update(delta);

        this.rafID = requestAnimationFrame(this.autoUpdate.bind(this));
    }

    /**
     * Update all the tweens
     * @param delta time in seconds since last update
     */
    update(delta: number) {
        let i = this.tweens.length;
        while (i-- > 0) {
            const tween = this.tweens[i];

            tween.update(delta);
        }
    }

    /**
     * Instiantiate a new tween
     * (no recycling yet)
     * @returns a tween
     */
    get() {
        // if (this.recycled.length > 0) {
        //     return this.recycled.pop()!;
        // }

        return new Tween();
    }

    /**
     * Add a tween to this manager
     * @param tween tween to add
     */
    add(tween: Tween) {
        tween.manager = this;
        this.tweens.push(tween);
    }

    /**
     * Kill a tween
     * @param tween tween to kill
     * @returns
     */
    kill(tween: Tween) {
        const pos = this.tweens.indexOf(tween);
        if (pos < 0) {
            return;
        }

        this.tweens.splice(pos, 1);
        // this.recycled.push(tween);
    }

    /**
     * Kill all the tweens
     */
    killAll() {
        let i = this.tweens.length - 1;
        while (i-- > 0) {
            this.kill(this.tweens[i]);
        }

        this.tweens = [];
    }

    /**
     * Destroy the manager
     */
    destroy() {
        this.killAll();

        cancelAnimationFrame(this.rafID);
    }
}

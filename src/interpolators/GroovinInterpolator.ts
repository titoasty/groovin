export abstract class GroovinInterpolator implements IGroovinInterpolator {
    from: any;
    to: any;

    constructor(from: any, to: any) {
        this.from = from;
        this.to = to;
    }

    abstract get(t: number): any;
}

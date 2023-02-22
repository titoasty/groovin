type EasingFn = (t: number) => number;

type IGroovinInterpolator = {
    get(t: number): any;
};

type GroovinTransition = {
    duration: number;
    ease: EasingFn;
    delay: number;
    interpolator: typeof IGroovinInterpolator;
};

type GroovinTransitionParam = {
    type?: string;
    duration: number;
    ease: string | EasingFn;
    delay: number;
};

type GroovinStyle<T extends object> = {
    [key in keyof T]?: any;
};

interface GroovinStylesParam<T extends object> {
    [key: string]: GroovinStyle<T> & {
        transitions?: {
            [key in keyof T]?: string | GroovinTransitionParam;
        };
    };
}

interface GroovinStyles<T extends object> {
    [key: string]: GroovinStyle<T> & {
        transitions?: {
            [key in keyof T]?: GroovinTransition;
        };
    };
}

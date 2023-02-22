import easings from './easings';

/**
 * parse an ease string (with optional parameter)
 * @param ease ease string
 * @returns an ease function
 */
export function parseEase(ease: string) {
    let easeParam = 0;
    ease = ease.trim().toLowerCase();

    // extract parameter
    if (ease.endsWith(')')) {
        const pos = ease.indexOf('(');
        easeParam = parseFloat(ease.substring(pos + 1, ease.length - 1));
        ease = ease.substring(0, pos);
    }

    // easing not found
    // @ts-ignore
    if (!easings[ease]) {
        return easings.linear();
    }

    // @ts-ignore
    return easings[ease](easeParam);
}

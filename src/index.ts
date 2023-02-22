import { GroovinManager } from './GroovinManager';
import { GroovinTweenManager } from './GroovinTweenManager';

const tweenManager = new GroovinTweenManager();
const globalManager = new GroovinManager(tweenManager);

export default {
    inst: () => new GroovinManager(tweenManager),
    bind: globalManager.bind.bind(globalManager),
    unbind: globalManager.unbind.bind(globalManager),
    style: globalManager.style.bind(globalManager),
};

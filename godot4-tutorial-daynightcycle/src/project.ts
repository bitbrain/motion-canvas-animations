import {makeProject} from '@motion-canvas/core';

import setup from './scenes/01-setup?scene';
import colormap from './scenes/02-map-value-to-color?scene';
import explaincolor from './scenes/03-explain-colors?scene';
import caption_measuretime from './scenes/04-caption-measuring-time?scene';
import divideday from './scenes/05-dividing-day-into-chunks?scene';
import signalupcalldown from './scenes/06-signal-up-call-down-explained?scene';
import emitsignalonly from './scenes/07-emit-signal-only-when-changed?scene';
import configurable from './scenes/08-caption-make-it-configurable?scene';
import setterbehavior from './scenes/09-setter-behavior-on-node-initialisation?scene';

import setup_audio from '../audio/intro.wav';
import colormap_audio from '../audio/02-map-to-color.wav';
import explaincolor_audio from '../audio/03-coloring.wav';
import divideday_audio from '../audio/04-divide-day-into-chunks.wav';
import signalupcalldown_audio from '../audio/05-signal-up-call-down.wav';
import emitsignalonly_audio from '../audio/06-call-signal-only-when-updating.wav';
import setterbehavior_audio from '../audio/07-setter-skipped-in-ready-function.wav';

/* 1. SETUP */
export default makeProject({
  scenes: [setup],
  audio:setup_audio
});
/* */

/* 2. MAP TO COLOR 
export default makeProject({
  scenes: [colormap],
  audio:colormap_audio
});
/* */ 

/* 4. MEASURING TIME 
export default makeProject({
  scenes: [caption_measuretime]
});
/* */

/* 5. DIVIDE DAY INTO CHUNKS 
export default makeProject({
  scenes: [divideday],
  audio:divideday_audio
});
/* */

/* 6. SIGNAL UP CALL DOWN 
export default makeProject({
  scenes: [signalupcalldown],
  audio:signalupcalldown_audio
});
/* */

/* 7. EMIT SIGNAL ONLY
export default makeProject({
  scenes: [emitsignalonly],
  audio:emitsignalonly_audio
});
/* */

/* 8. MAKE IT CONFIGURABLE
export default makeProject({
  scenes: [configurable]
});
/* */

/* 9. SETTER BEHAVIOR EXPLAINED
export default makeProject({
  scenes: [setterbehavior],
  audio:setterbehavior_audio
});
/* */

import {makeProject} from '@motion-canvas/core';

import setup from './scenes/01-setup?scene';
import intro from '../audio/intro.wav';

export default makeProject({
  scenes: [setup],
  audio:intro
});

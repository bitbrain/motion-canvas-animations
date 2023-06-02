import {makeProject} from '@motion-canvas/core';

import setup from './scenes/setup?scene';
import setup_sine from './scenes/setup-sine?scene';

export default makeProject({
  scenes: [setup, setup_sine],
});

import {Grid, Layout, makeScene2D, Line, Txt} from '@motion-canvas/2d/lib';
import {createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {

  /*
   * We want a blue tint for night, mimicking a full moon's glow.
   * For day, we'll use white to let the game's color palette shine through.
   * During sunrise and sunset, we'll introduce a pink/orange hue,
   * representing the sun's low angle and the blue wavelengths
   *  not scattering far enough to reach the viewer.
   */

  view.add(
    <Layout>
        <Txt
           text={"Explain colors"}
        />
    </Layout>);

    yield* waitFor(18.7);
});

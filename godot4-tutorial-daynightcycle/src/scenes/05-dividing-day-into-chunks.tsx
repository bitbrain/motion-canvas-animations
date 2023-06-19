import {Grid, Layout, makeScene2D, Line, Txt} from '@motion-canvas/2d/lib';
import {waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {

  /*
   * Looking at our sine graph again we can divide the x axis
   * of one complete day cycle into 1440 segments,
   * each representing a minute in the day.
   * Since x is our time axis, the full cycle of a day equals 2*PI.
   * We can use this knowledge to our advantage
   * to calculate the ingame to real time minute duration. 
   */

  view.add(
    <Layout>
        <Txt
           text={"Divide into chunks"}
        />
    </Layout>);

    yield* waitFor(22);
});

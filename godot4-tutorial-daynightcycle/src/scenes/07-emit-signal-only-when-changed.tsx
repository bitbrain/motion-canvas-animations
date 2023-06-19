import {Grid, Layout, makeScene2D, Line, Txt} from '@motion-canvas/2d/lib';
import {waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {

   /*
    * To optimize performance and avoid unnecessary emissions,
    * the signal should only be emitted when the ingame time changes,
    * not every single frame. 
    */

   view.add(
    <Layout>
        <Txt
           text={"Emit only when changed"}
        />
    </Layout>);

    yield* waitFor(9.5);
});

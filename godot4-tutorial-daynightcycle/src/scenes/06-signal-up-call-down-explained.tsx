import {Grid, Layout, makeScene2D, Line, Txt} from '@motion-canvas/2d/lib';
import {waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {

   /*
    * Next, we need to communicate these values to the UI.
    * For this, we follow Godot's 'Signal up, Call Down' principle
    * to maintain component independence.
    */

   view.add(
    <Layout>
        <Txt
           text={"Signal up call down"}
        />
    </Layout>);

    yield* waitFor(9.5);
});

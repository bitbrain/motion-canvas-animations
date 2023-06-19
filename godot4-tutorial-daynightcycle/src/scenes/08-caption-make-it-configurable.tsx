import {Grid, Layout, makeScene2D, Line, Txt} from '@motion-canvas/2d/lib';
import {waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {

  /* Make it configurable caption */

  view.add(
    <Layout>
        <Txt
           text={"Make it configurable"}
        />
    </Layout>);

    yield* waitFor(3);
});

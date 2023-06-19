import {Grid, Layout, makeScene2D, Line, Txt} from '@motion-canvas/2d/lib';
import {waitFor} from '@motion-canvas/core';


export default makeScene2D(function* (view) {
  
    /*
    * Next we map the current value to a corresponding color.
    */

    view.add(
        <Layout>
            <Txt
               text={"Map value to color"}
            />
        </Layout>);
    
    yield* waitFor(4);
});

import {Grid, Layout, makeScene2D, Line, Txt} from '@motion-canvas/2d/lib';
import {waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {

   /*
    * Keep in mind that we have to keep the statements
    * both in the setter and in the ready() function,
    * as by design, the initial value assignment
    * to a variable does not invoke its setter function!
    */

   view.add(
    <Layout>
        <Txt
           text={"Setter"}
        />
    </Layout>);

    yield* waitFor(10.3);
});

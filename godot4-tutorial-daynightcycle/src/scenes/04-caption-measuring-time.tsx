import {Grid, Layout, makeScene2D, Line, Txt} from '@motion-canvas/2d/lib';
import {waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {

   /* Measuring time caption shown with ticking noise */

   view.add(
      <Layout>
          <Txt
             text={"show caption: measuring time"}
          />
      </Layout>);
  
   yield* waitFor(4.0);
});

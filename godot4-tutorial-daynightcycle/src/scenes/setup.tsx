import {Layout, makeScene2D} from '@motion-canvas/2d/lib';
import {createRef, all} from '@motion-canvas/core';
import { GraphPlot } from '../components/GraphPlot';

export default makeScene2D(function* (view) {

  const plot = createRef<GraphPlot>();

  view.add(
    <Layout>
      <GraphPlot
        ref={plot}
        position={[-1600, 1000]}
      />
    </Layout>
   );

   plot().xMax(0);
   plot().yMax(0);
   plot().stepsVisible(0);

   yield* all(
    plot().yMax(2000, 2.0).to(0, 3.0),
    plot().stepsVisible(1, 2.0).to(0, 3.0),
    plot().xMax(2000, 2.0).to(0, 3.0),
    plot().arrowSize(20, 2.0).to(0, 3.0)
   )
});

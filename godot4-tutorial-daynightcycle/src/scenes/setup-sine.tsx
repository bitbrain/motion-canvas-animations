import {Grid, Layout, makeScene2D, Gradient} from '@motion-canvas/2d/lib';
import {createRef, all, waitUntil} from '@motion-canvas/core';
import { GraphPlot } from '../components/GraphPlot';

export default makeScene2D(function* (view) {

  const plot = createRef<GraphPlot>();

  view.add(
    <Layout>
      <Grid
        width={5000}
        height={5000}
        stroke={'#353e4a11'}
        lineWidth={10}
        spacing={250.0}
      />
      <GraphPlot
        ref={plot}
        stroke={'#dbe5ed00'}
        lineWidth={10}
        position={[-1000, 600]}
        yMax={1200}
        xMax={2300}
        ySteps={4}
        xSteps={7}
      />
    </Layout>
   );

   plot().graphStroke('#55bcff00');
   plot().xMax(0);
   plot().yMax(0);
   plot().stepsVisible(0);
   plot().graphVerticalOffset(0);

   yield* all(
    plot().stroke('#dbe5ed', 1.0),
    plot().yMax(1200, 1.0),
    plot().stepsVisible(1, 1.0),
    plot().xMax(2000, 1.0),
    plot().arrowSize(30, 1.0),
   )
   yield* plot().graphStroke('#55bcff', 1.0)
   yield* all(
     plot().graphStroke('#ff5277', 3).to('#55bcff', 2),
     plot().graphVerticalOffset(-1000, 3).to(0, 2)
   )
   yield* all(
    plot().graphStroke('#ff5277', 3).to('#55bcff00', 2),
    plot().graphVerticalOffset(-1000, 3).to(0, 2)
  )
  yield* all(
    plot().yMax(0, 1.0),
    plot().stepsVisible(0, 1.0),
    plot().xMax(0, 1.0),
    plot().arrowSize(0, 1.0),
    plot().graphStroke('#dbe5ed00', 1.0)
   )
});

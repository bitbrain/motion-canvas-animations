import {Grid, Layout, makeScene2D, Line, Txt, Circle, Gradient} from '@motion-canvas/2d/lib';
import {createRef, createSignal, PossibleVector2, all, chain, Color, waitUntil, useDuration, waitFor} from '@motion-canvas/core';
import {CodeBlock, insert, edit} from '@motion-canvas/2d/lib/components/CodeBlock';

export default makeScene2D(function* (view) {

  /*
   * Looking at our sine graph again we can divide the x axis
   * of one complete day cycle into 1440 segments,
   * each representing a minute in the day.
   * Since x is our time axis, the full cycle of a day equals 2*PI.
   * We can use this knowledge to our advantage
   * to calculate the ingame to real time minute duration. 
   */

  const layout = createRef<Layout>();
  const grid = createRef<Grid>();
  const grid_large = createRef<Grid>();

  const xAxis = createRef<Line>();
  const yAxis = createRef<Line>();
  const xAxisLabel = createRef<Txt>();
  const yAxisLabel = createRef<Txt>();
  const lineFunc = createRef<Line>();
  const yValueBoundaries = createRef<Line>();

  // Create point objects
  const pointSamples = 1000;
  const points:PossibleVector2[] = [];
  for (let i = 0; i < pointSamples; ++i) {
    points[i] = [0, 0];
  }

  // Grid settings
  const gridColor = Color.createSignal('#252a3100');

  // Text settings
  const fontFamily = 'Cascadia Mono';
  const fontWeight = 1000;
  const formula = createRef<CodeBlock>();

  // Graph options
  const xAxisWidth = 1400;
  const pointDistance = 10.0;
  const altitude = createSignal(0.0);
  const pointOffsetY = createSignal(0.0);
  const maxAltitude = 350;
  const graphXAlpha = createSignal(0);
  const graphYAlpha = createSignal(0);
  const graphXLabelAlpha = createSignal(0);
  const graphYLabelAlpha = createSignal(0);
  const graphXLength = createSignal(0);
  const graphYLength = createSignal(0);
  const graphXColor = () => new Color('#dae4ed00').alpha(graphXAlpha());
  const graphYColor = () => new Color('#dae4ed00').alpha(graphYAlpha());
  const graphXLabelColor = () => new Color('#dae4ed00').alpha(graphXLabelAlpha());
  const graphYLabelColor = () => new Color('#dae4ed00').alpha(graphYLabelAlpha());
  const gradientAlpha = createSignal(0);
  const yBoundaryPercentage = createSignal(0.0);

  const gradient = new Gradient({
    type: 'linear',
    from: () => [0, 400 + pointOffsetY()],
    to: () => [0, -300 + pointOffsetY()],
    stops: [
      {offset: 0, color: () => new Color('#2b2e55').alpha(gradientAlpha())}, // night
      {offset: 0.3, color: () => new Color('#6d3190').alpha(gradientAlpha())}, // dusk
      {offset: 0.5, color: () => new Color('#f375ab').alpha(gradientAlpha())}, // sunrise1
      {offset: 0.75, color: () => new Color('#ff989b').alpha(gradientAlpha())}, // sunrise2
      {offset: 0.90, color: () => new Color('#ffdeddfd').alpha(gradientAlpha())}, // morning 
      {offset: 1.0, color: () => new Color('#ffffff').alpha(gradientAlpha())}, // day 
    ],
  });

  // Point options
  const pointAlpha = createSignal(0.0);
  const pointColor = () => new Color('#ffffff').alpha(pointAlpha());
  const pointPercentageZero = 0.042;
  const pointPercentage = createSignal(pointPercentageZero);

  const lineFuncPoints = createSignal(() => {
    // recalculate point positions
    for (let i = 0; i < pointSamples; ++i) {
      points[i] = [i * pointDistance, pointOffsetY() + Math.sin(i * 0.075) * altitude()];
    }
    return points;
  });

  view.add(
    <Layout ref={layout} scale={0.5} x={-0} y={500}>
      <Grid
        ref={grid}
        width={9000}
        height={7000}
        stroke={gridColor}
        lineWidth={8}
        spacing={250.0}
        x={1000 - 680}
      />
      <Grid
        ref={grid_large}
        width={9000}
        height={7000}
        stroke={'#252a31'}
        lineWidth={6}
        spacing={4 * 250.0}
        x={1000  - 680}
      />
      <Layout x={-680}>
        <Circle // graph center
          fill={graphXColor}
          closed={true}
          size={25}
        />
        <Line // x axis
          ref={xAxis}
          lineWidth={10}
          stroke={graphXColor}
          endArrow={true}
          points={() => [
            [0, 0],
            [xAxisWidth * graphXLength(), 0]
            ]}
        />
        <Txt // x axis label
          ref={xAxisLabel}
          text={"time (t)"}
          fontFamily={fontFamily}
          fontWeight={fontWeight}
          fontSize={60}
          fill={graphXLabelColor}
          x={xAxis().x() + xAxisWidth / 2.0}
          y={80}
        />
        <Line // y axis
          ref={yAxis}
          lineWidth={10}
          stroke={graphYColor}
          endArrow={true}
          points={() => [
            [0, 0],
            [0, (-maxAltitude * 2 - 100.0) * graphYLength()]
            ]}
        />
        <Txt // y axis label
          ref={yAxisLabel}
          text={"sun intensity"}
          fontFamily={fontFamily}
          fontWeight={fontWeight}
          fontSize={40}
          fill={graphYLabelColor}
          rotation={-90}
          x={-80}
          y={-maxAltitude - 50}
        />
        <Line // line func
          ref={lineFunc}
          points={lineFuncPoints}
          lineWidth={12}
          stroke={gradient}
          x={-pointDistance * 5025.0 * 0.075}
        />
        <Circle
            fill={pointColor}
            size={75}
            position={() => lineFunc().getPointAtPercentage(pointPercentage()).position.sub([420, 0])}
        />
        <Line // y value between 0 and 1 indicator
           ref={yValueBoundaries}
           lineWidth={20}
           startArrow={true}
           endArrow={true}
           lineDash={[25, 25]}
           points={() => [
            [500, 0],
            [500, yBoundaryPercentage() * (-maxAltitude * 2 - 100.0) * graphYLength()]
            ]}
           stroke={'#50BD6A'}
        />
      </Layout>
      <CodeBlock
        ref={formula}
        fontFamily={fontFamily}
        fontSize={70}
        language='gdscript'
        code={``}
        y={260}
      />
    </Layout>
   );


    /*
      * Let us visualize the 'intensity' of the night for a moment.
      * The x-axis represents time.
      */
    const setupDuration = useDuration('setup');
    yield* all(
      layout().scale(1.5, setupDuration),
      gridColor('#252a31ff', setupDuration),
      graphXAlpha(0.2, setupDuration),
      graphYAlpha(1.0, setupDuration),
      graphYLength(1.0, setupDuration)
    );
    
    yield* graphYLabelAlpha(1.0, useDuration('gradient-y-alpha'));
    
    const introXAxisDuration = useDuration('intro-x-axis');
    yield* all(
      graphXAlpha(1.0, introXAxisDuration),
      graphXLength(1.0, introXAxisDuration)
    );
    const gradientXAlpha = useDuration('gradient-x-alpha');
    yield* all(
      graphXLabelAlpha(1.0, gradientXAlpha),
    );
});

import { Grid, Layout, makeScene2D, Line, Txt, Circle, Gradient } from '@motion-canvas/2d/lib';
import { createRef, createSignal, PossibleVector2, all, chain, Color, range, useDuration, waitFor } from '@motion-canvas/core';

export default makeScene2D(function* (view) {

  const layout = createRef<Layout>();
  const grid = createRef<Grid>();
  const grid_large = createRef<Grid>();

  const xAxis = createRef<Line>();
  const yAxis = createRef<Line>();
  const xAxisLabel = createRef<Txt>();
  const yAxisLabel = createRef<Txt>();
  const lineFunc = createRef<Line>();
  const areaDescription = createRef<Txt>();

  // Create point objects
  const pointSamples = 1000;
  const points: PossibleVector2[] = [];
  for (let i = 0; i < pointSamples; ++i) {
    points[i] = [0, 0];
  }

  // line points
  const linePoints: PossibleVector2[] = [];
  for (let i = 0; i < pointSamples; ++i) {
    linePoints[i] = [0, 0];
  }
  const lineAlpha = createSignal(0.0);

  // Grid settings
  const gridColor = Color.createSignal('#252a3100');

  // Text settings
  const fontFamily = 'Cascadia Mono';
  const fontWeight = 1000;
  const areaDescriptionAlpha = createSignal(0.0);

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
      { offset: 0, color: () => new Color('#2b2e55').alpha(gradientAlpha()) }, // night
      { offset: 0.3, color: () => new Color('#6d3190').alpha(gradientAlpha()) }, // dusk
      { offset: 0.5, color: () => new Color('#f375ab').alpha(gradientAlpha()) }, // sunrise1
      { offset: 0.75, color: () => new Color('#ff989b').alpha(gradientAlpha()) }, // sunrise2
      { offset: 0.90, color: () => new Color('#ffdeddfd').alpha(gradientAlpha()) }, // morning 
      { offset: 1.0, color: () => new Color('#ffffff').alpha(gradientAlpha()) }, // day 
    ],
  });

  const fillGradient = new Gradient({
    type: 'linear',
    from: () => [0, 200 + pointOffsetY()],
    to: () => [0, -500 + pointOffsetY()],
    stops: [
      { offset: 0.0, color: () => new Color('#49d4b4').alpha(lineAlpha()) },
      { offset: 0.4, color: () => new Color('#4fda70').alpha(lineAlpha()) },
      { offset: 0.7, color: () => new Color('#95f564').alpha(lineAlpha()) }
    ],
  });

  const descriptionGradient = new Gradient({
    type: 'linear',
    from: () => [0, 50],
    to: () => [0, -20],
    stops: [
      { offset: 0.0, color: () => new Color('#49d4b4').alpha(areaDescriptionAlpha()) },
      { offset: 0.4, color: () => new Color('#4fda70').alpha(areaDescriptionAlpha()) },
      { offset: 0.7, color: () => new Color('#95f564').alpha(areaDescriptionAlpha()) }
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
      linePoints[i] = [i * pointDistance, 0];
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
        x={1000 - 680}
      />
      <Layout x={-680}>
        <Circle // graph center
          fill={graphXColor}
          closed={true}
          size={25}
        />


        <Layout>
          {range(linePoints.length).map(index => (index > 103 && index < 190) ? (
            <Line
              x={-520}
              lineWidth={7}
              stroke={fillGradient}
              points={() => [
                lineFuncPoints()[index],
                linePoints[index]
              ]}
            />
          ) : '')}
        </Layout>
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
      </Layout>

      <Txt
        ref={areaDescription}
        text={"one day = 2 * PI"}
        fontFamily={fontFamily}
        fontWeight={fontWeight}
        fontSize={60}
        fill={descriptionGradient}
        y={-700}
        x={-150}
      />
    </Layout>
  );

  lineFunc().x(lineFunc().x() - 100.0);
  pointOffsetY(-maxAltitude);


  const setupDuration = useDuration('setup-divide-into-chunks');
  yield* all(
    layout().scale(1.5, setupDuration),
    gridColor('#252a31ff', setupDuration),
    graphXAlpha(1.0, setupDuration),
    graphYAlpha(1.0, setupDuration),
    graphXLength(1.0, setupDuration),
    graphYLength(1.0, setupDuration)
  );

  const labelDuration = useDuration('label-alpha-duration');
  yield* all(
    graphXLabelAlpha(1.0, labelDuration),
    graphYLabelAlpha(1.0, labelDuration)
  );

  /*
   * Looking at our sine graph again we can divide the x axis
   * of one complete day cycle into 1440 segments,
   * each representing a minute in the day.
   * Since x is our time axis, the full cycle of a day equals 2*PI.
   * We can use this knowledge to our advantage
   * to calculate the ingame to real time minute duration. 
   */
  const gradientXAlpha = useDuration('gradient-x-alpha');
  yield* all(
    gradientAlpha(1.0, gradientXAlpha),
    graphXLabelAlpha(1.0, gradientXAlpha),
    altitude(maxAltitude, gradientXAlpha),
  );

  const zoomIn = useDuration('zoom-in');

  yield* all(
    layout().scale(2.8, zoomIn),
    layout().x(-750, zoomIn),
    layout().y(970, zoomIn),
    graphXAlpha(0.0, zoomIn),
    graphXLabelAlpha(0.0, zoomIn)
  );

  const divideIntoSegments = useDuration('divide-into-segments');
  yield* lineAlpha(1.0, divideIntoSegments);

  const showXAgain = useDuration('show-x-again');
  yield* all(
    layout().scale(2, showXAgain),
    layout().x(-150, showXAgain),
    layout().y(700, showXAgain),
    graphXAlpha(1.0, showXAgain),
    graphXLabelAlpha(1.0, showXAgain)
  );

  yield* waitFor(2.0);
  yield* areaDescriptionAlpha(1.0, 1.0);
  yield* waitFor(3.0);

  const fadeOutTime = useDuration('fade-out-all-segments');
  yield* chain(
    all(
      graphXLabelAlpha(0.0, fadeOutTime / 3),
      graphYLabelAlpha(0.0, fadeOutTime / 3),
    ),
    all(
      lineAlpha(0.0, fadeOutTime / 3),
      areaDescriptionAlpha(0.0, fadeOutTime / 3)
    ),
    all(
      altitude(0.0, fadeOutTime / 3),
      graphXLength(0.0, fadeOutTime / 3),
      graphYLength(0.0, fadeOutTime / 3),
      gradientAlpha(0.0, fadeOutTime / 3),
      graphXAlpha(0.0, fadeOutTime / 3),
      graphYAlpha(0.0, fadeOutTime / 3)
    ),
  );

});

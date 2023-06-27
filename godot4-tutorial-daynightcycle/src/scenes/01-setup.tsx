import { Grid, Layout, makeScene2D, Line, Txt, Circle, Gradient } from '@motion-canvas/2d/lib';
import { createRef, createSignal, PossibleVector2, all, chain, Color, waitUntil, useDuration, waitFor } from '@motion-canvas/core';
import { CodeBlock, insert, edit } from '@motion-canvas/2d/lib/components/CodeBlock';

export default makeScene2D(function* (view) {

  const layout = createRef<Layout>();
  const grid = createRef<Grid>();
  const grid_large = createRef<Grid>();

  const xAxis = createRef<Line>();
  const yAxis = createRef<Line>();
  const xAxisLabel = createRef<Txt>();
  const yAxisLabel = createRef<Txt>();
  const lineFunc = createRef<Line>();
  const yValueBoundaries = createRef<Line>();
  const lineFuncText = createRef<Txt>();

  // Create point objects
  const pointSamples = 1000;
  const points: PossibleVector2[] = [];
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
  const funcTextAlpha = createSignal(1);
  const yBoundaryPercentage = createSignal(0.0);
  const functionValue = createSignal(0.0);

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

  const dashTheme = {
    keyword: { text: "#637AFE" },
    entityName: { text: "#DAE4ED" },
    fallback: { text: "#DAE4ED" },
    literal: { text: "#637AFE" },
    operator: { text: "#FFFFFF" },
    atom: { text: "#FFFFFF" },
    stringPunctuation: { text: "#FFFFFF" },
};

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
        x={1000 - 680}
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
        <Txt
          ref={lineFuncText}
          fontFamily={fontFamily}
          fontWeight={fontWeight}
          fontSize={90}
          fill={() => new Color('#f375ab').alpha(gradientAlpha() * funcTextAlpha())}
          x={xAxisLabel().position.x}
          y={() => pointOffsetY() - 150}
          text={() => 'f(t) = ' + functionValue().toFixed(2)}
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
        theme={dashTheme}
        scale={0.8}
        opacity={0.0}
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



  /* 0 is full night, 1 is full day. */
  const fullNightDuration = useDuration('intro-full-night');

  yield* all(
    gradientAlpha(1.0, fullNightDuration),
    pointOffsetY(0, fullNightDuration),
  );

  const fullDayDuration = useDuration('intro-full-day');
  yield* all(
    pointOffsetY(-maxAltitude * 2, fullDayDuration),
    functionValue(1.0, fullDayDuration),
  );

  const resetToZeroDuration = useDuration('reset-to-0');
  yield* all(
    pointOffsetY(0, resetToZeroDuration),
    functionValue(0.0, resetToZeroDuration),
  );

  const useSineFunctionDuration = useDuration('use-sine-function');
  yield* all(
    funcTextAlpha(0.0, useSineFunctionDuration),
    altitude(maxAltitude, useSineFunctionDuration),
    pointAlpha(1.0, useSineFunctionDuration)
  );

  const transitionSmoothlyDuration = useDuration('transition-smoothly');
  yield* all(
    pointPercentage(0.2, transitionSmoothlyDuration)
  );

  const cleanupTransitionSmoothlyDuration = useDuration('transition-cleanup');
  yield* all(
    pointAlpha(0.0, cleanupTransitionSmoothlyDuration),
    gradientAlpha(0.3, cleanupTransitionSmoothlyDuration)
  );

  yield* yBoundaryPercentage(1.0, useDuration('y-value-between-0-1'))

  const hideYValueBetween = useDuration('hide-y-value-between');
  yield* all(
    yBoundaryPercentage(0.0, hideYValueBetween),
    gradientAlpha(1.0, hideYValueBetween)
  )

  /* Since the y value should always be between 0 and 1 we need to move the entire function up
   * by 1 unit and divide it by 2.
   */
  const sineMoveUp = useDuration('sine-move-up');
  yield* all(
    pointOffsetY(-maxAltitude * 2.0, sineMoveUp),
    formula().edit(sineMoveUp, false)`var time = (sin(time)${insert(' + 1.0')})`
  );


  const sineMoveDownDivide = useDuration('sine-move-down-divide');
  yield* all(
    pointOffsetY(-maxAltitude, sineMoveDownDivide),
    formula().opacity(1.0, sineMoveDownDivide),
    formula().scale(1.0, sineMoveDownDivide),
    formula().edit(sineMoveDownDivide, false)`var time = (sin(time) + 1.0)${insert(' / 2.0')}`
  );


  /* At time 0 the value will be in the middle of our y axis, meaning the game will
   * start at dusk and gradually transition to day.
   */

  pointPercentage(pointPercentageZero);
  const pointFadeIn = useDuration('point-at-time-0');
  yield* all(
    pointAlpha(1.0, pointFadeIn)
  );

  const graduallyTransitionToDayDuration = useDuration('gradually-transition-to-day');
  yield* all(
    pointPercentage(0.063, graduallyTransitionToDayDuration)
  );

  yield* pointAlpha(0.0, 1.0);


  /*If you want to adjust the starting time, simply shift the graph along the x-axis.*/


  yield* lineFunc().x(lineFunc().x() + 310.0, useDuration('move-x-axis'))


  /*To start at complete darkness, subtract 0.5 PI from the time value.*/
  const substractPi = useDuration('substract-0.5pi');
  yield* all(
    lineFunc().x(lineFunc().x() - 100.0, substractPi),
    formula().edit(sineMoveDownDivide, false)`var time = (sin(time${insert(' - 0.5 * PI')}) + 1.0) / 2.0`
  );


  yield* waitFor(2.0);

});

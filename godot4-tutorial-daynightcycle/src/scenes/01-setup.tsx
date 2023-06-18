import {Grid, Layout, makeScene2D, Line, Txt, Circle} from '@motion-canvas/2d/lib';
import {createRef, createSignal, PossibleVector2, all, chain, Color, waitUntil, useDuration, waitFor} from '@motion-canvas/core';


export default makeScene2D(function* (view) {

  const layout = createRef<Layout>();
  const grid = createRef<Grid>();

  const xAxis = createRef<Line>();
  const yAxis = createRef<Line>();
  const xAxisLabel = createRef<Txt>();
  const yAxisLabel = createRef<Txt>();
  const lineFunc = createRef<Line>();

  // Create point objects
  const pointSamples = 1000;
  const points:PossibleVector2[] = [];
  for (let i = 0; i < pointSamples; ++i) {
    points[i] = [0, 0];
  }

  // Text settings
  const fontFamily = 'Cascadia Mono';
  const fontWeight = 1000;

  // Graph options
  const xAxisWidth = 1400;
  const pointDistance = 10.0;
  const altitude = createSignal(0.0);
  const pointOffsetY = createSignal(0.0);
  const maxAltitude = 350;
  const graphColor = Color.createSignal('#DAE4ED');
  const lineStroke = Color.createSignal('#00c25b00');

  // Current point settings
  const currentPoint = createRef<Circle>();
  const currentPointPercentage = createSignal(0.05);

  const lineFuncPoints = createSignal(() => {
    // recalculate point positions
    for (let i = 0; i < pointSamples; ++i) {
      points[i] = [i * pointDistance, pointOffsetY() + Math.sin(i * 0.075) * altitude()];
    }
    return points;
  });

  view.add(
    <Layout ref={layout} scale={0.5} x={-700} y={150}>
      <Grid
        ref={grid}
        width={9000}
        height={7000}
        stroke={'#353e4a55'}
        lineWidth={6}
        spacing={250.0}
        x={1200}
      />
      <>
        <Circle // graph center
          fill={graphColor}
          closed={true}
          size={25}
        />
        <Line // x axis
          ref={xAxis}
          lineWidth={10}
          stroke={graphColor}
          endArrow={true}
          points={() => [
            [0, 0],
            [xAxisWidth, 0]
            ]}
        />
        <Txt // x axis label
          ref={xAxisLabel}
          text={"time (t)"}
          fontFamily={fontFamily}
          fontWeight={fontWeight}
          fontSize={60}
          fill={graphColor}
          x={xAxis().x() + xAxisWidth / 2.0}
          y={80}
        />
        <Line // y axis
          ref={yAxis}
          lineWidth={10}
          stroke={graphColor}
          endArrow={true}
          points={() => [
            [0, 0],
            [0, -maxAltitude * 2 - 100.0]
            ]}
        />
        <Txt // y axis label
          ref={yAxisLabel}
          text={"sun intensity"}
          fontFamily={fontFamily}
          fontWeight={fontWeight}
          fontSize={40}
          fill={graphColor}
          rotation={-90}
          x={-80}
          y={-maxAltitude - 50}
        />
        <Line // line func
          ref={lineFunc}
          points={lineFuncPoints}
          lineWidth={8}
          stroke={lineStroke}
          x={-pointDistance * 5025.0 * 0.075}
        />
        <Circle // current point
          ref={currentPoint}
          fill={'#ffffff'}
          size={44}
          closed={true}
          position={() => lineFunc().getPointAtPercentage(currentPointPercentage()).position}
        />
      </>
    </Layout>
   );


    /*
      * Let us visualize the 'intensity' of the night for a moment.
      * The x-axis represents time: 0 is full night, 1 is full day.
      */
    yield* layout().scale(1.0, useDuration('setup'))
    yield* lineStroke('#00c25bff', 1.0)
    yield* pointOffsetY(0, useDuration('intro-full-night'));
    yield* pointOffsetY(-maxAltitude * 2, useDuration('intro-full-day'))

    /* We can use a sine function to transition smoothly between these values.*/

    yield* pointOffsetY(0, 1)

    yield* all(
      altitude(maxAltitude, 3)
    );


    yield* waitFor(5);

    /* Since the y value should always be between 0 and 1 we need to move the entire function up
     * by 1 unit and divide it by 2.
     */
    yield* pointOffsetY(-maxAltitude * 2.0, useDuration('sine-move-up'))
    yield* pointOffsetY(-maxAltitude, useDuration('sine-move-down-divide'))


    /* At time 0 the value will be in the middle of our y axis, meaning the game will
     * start at dusk and gradually transition to day.
     */

    yield* currentPointPercentage(0.0, useDuration('at-point-zero'));

    yield* waitFor(9.0);


    /*If you want to adjust the starting time, simply shift the graph along the x-axis.*/
    

    yield* lineFunc().x(lineFunc().x() + 310.0, useDuration('move-x-axis'))
    

    /*To start at complete darkness, subtract 0.5 PI from the time value.*/

    yield* lineFunc().x(lineFunc().x() - 100.0, useDuration('substract-0.5pi'))

    yield* waitFor(2.0);

});

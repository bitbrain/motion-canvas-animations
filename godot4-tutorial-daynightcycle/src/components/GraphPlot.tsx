import {Shape, ShapeProps, Line, signal, PossibleCanvasStyle, Txt} from '@motion-canvas/2d/lib';
import {createRef, range, PossibleVector2} from '@motion-canvas/core';
import {canvasStyleSignal, CanvasStyleSignal} from '@motion-canvas/2d/lib/decorators/canvasStyleSignal';
import {initial} from '@motion-canvas/2d';
import {SignalValue, SimpleSignal, createSignal} from '@motion-canvas/core/lib/signals';

export interface GridProps extends ShapeProps {
  // line width of the legend
  lineWidth?: SignalValue<number>;
  stepWidth?: SignalValue<number>;
  xMax?: SignalValue<number>;
  yMax?: SignalValue<number>;
  xSteps?: SignalValue<number>;
  ySteps?: SignalValue<number>;
  stepsVisible?: SignalValue<number>;
  stroke?: SignalValue<PossibleCanvasStyle>;
  graphStroke?: SignalValue<PossibleCanvasStyle>;
  arrowSize?: SignalValue<number>;
  graphVerticalOffset?: SignalValue<number>;
}

export class GraphPlot extends Shape {

    @initial(8)
    @signal()
    public declare readonly lineWidth: SimpleSignal<number, this>;

    @initial(10)
    @signal()
    public declare readonly stepWidth: SimpleSignal<number, this>;

    @initial(10)
    @signal()
    public declare readonly xSteps: SimpleSignal<number, this>;

    @initial(10)
    @signal()
    public declare readonly ySteps: SimpleSignal<number, this>;

    @initial(2000)
    @signal()
    public declare readonly xMax: SimpleSignal<number, this>;

    @initial(2000)
    @signal()
    public declare readonly yMax: SimpleSignal<number, this>;

    @initial('#666666')
    @canvasStyleSignal()
    public declare readonly stroke: CanvasStyleSignal<this>;

    @initial('#00c25b')
    @canvasStyleSignal()
    public declare readonly graphStroke: CanvasStyleSignal<this>;

    @initial(15)
    @signal()
    public declare readonly arrowSize: SimpleSignal<number, this>;

    @initial(0.5)
    @signal()
    public declare readonly stepsVisible: SimpleSignal<number, this>;

    @initial(0)
    @signal()
    public declare readonly graphVerticalOffset: SimpleSignal<number, this>;

  
    public constructor(props?: GridProps) {
      super(props);

      const lineX = createRef<Line>();
      const lineY = createRef<Line>();
      const lineGraph = createRef<Line>();

      const samples = 500;

      const points:PossibleVector2[] = [];

      const distance = this.xMax() / samples;

      for (let i = 0; i < samples; ++i) {
        points[i] = [-1800 + i * distance * 3, 0];
      }


      this.add(
        <>
          <Line // x-axis
            ref={lineX}
            lineWidth={this.lineWidth}
            stroke={this.stroke}
            endArrow
            arrowSize={this.arrowSize}
            points={() => [
              [0, 0],
              [this.xMax(), 0]
              ]}
          />
          <Line // y-axis
            ref={lineY}
            lineWidth={this.lineWidth}
            stroke={this.stroke}
            endArrow
            arrowSize={this.arrowSize}
            points={() => [
            [0, 0],
            [0, -this.yMax()]
            ]}
          />
          <Line // graph
            y={this.graphVerticalOffset}
            ref={lineGraph}
            lineWidth={12}
            stroke={this.graphStroke}
            points={() => points}
          >
            <Txt
              text={() => "f(x) = " + (-this.graphVerticalOffset() / 1000).toFixed(2).toString()}
              position={[1000, -100]}
              antialiased={true}
              fontSize={90}
              fill={this.graphStroke}
              fontFamily={'Cascadia Code'}
            />
          </Line>
        </>
      );

      // compute the number of horizontal steps
      // start from 1 as there should not be a step at 0,0
      range(1, this.xSteps() + 1).map(value => lineX().add(<Line
        lineWidth={() => this.lineWidth() * (value < (this.xSteps() * this.stepsVisible()) ? 1 : 0)}
        stroke={this.stroke}
        points={[
          [value * this.xMax() / (this.xSteps() + 1), -this.stepWidth()],
          [value * this.xMax() /(this.xSteps() + 1), this.stepWidth()]
        ]}
      />));

      // compute the number of vertical steps
      // start from 1 as there should not be a step at 0,0
      range(1, this.ySteps() + 1).map(value => lineY().add(<Line
        lineWidth={() => this.lineWidth() * (value <= (this.ySteps() * this.stepsVisible()) ? 1 : 0)}
        stroke={this.stroke}
        points={[
          [-this.stepWidth(), -(value * this.yMax() / (this.ySteps() + 1))], 
          [this.stepWidth(), -(value * this.yMax() / (this.ySteps() + 1))]
        ]}
      />));
    }
  }
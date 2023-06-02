import {Shape, ShapeProps, Line, signal, PossibleCanvasStyle} from '@motion-canvas/2d/lib';
import {createRef, range} from '@motion-canvas/core';
import {canvasStyleSignal, CanvasStyleSignal} from '@motion-canvas/2d/lib/decorators/canvasStyleSignal';
import {initial} from '@motion-canvas/2d';
import {SignalValue, SimpleSignal} from '@motion-canvas/core/lib/signals';

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
  arrowSize?: SignalValue<number>;
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

    @initial(15)
    @signal()
    public declare readonly arrowSize: SimpleSignal<number, this>;

    @initial(0.5)
    @signal()
    public declare readonly stepsVisible: SimpleSignal<number, this>;

  
    public constructor(props?: GridProps) {
      super(props);

      const lineX = createRef<Line>();
      const lineY = createRef<Line>();



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
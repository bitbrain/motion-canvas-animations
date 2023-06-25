import {Grid, Layout, makeScene2D, Line, Txt} from '@motion-canvas/2d/lib';
import {Center, createRef, createSignal, Color, range, all, delay, SimpleSignal, useDuration} from '@motion-canvas/core';
import {CodeBlock, insert, edit} from '@motion-canvas/2d/lib/components/CodeBlock';
import {Rect} from '@motion-canvas/2d/lib/components/Rect';

export default makeScene2D(function* (view) {
  
    /*
    * Next we map the current value to a corresponding color.
    */

    const value = createRef<Txt>();
    const colors = [
        '#2b2e55',
        '#6d3190',
        '#f375ab',
        '#ff989b',
        '#ffdedd',
        '#ffffff'
    ];
    const alphas:Array<SimpleSignal<number>> = [];
    const colorSignals:Array<Function>= [];
    for (let i = 0; i < colors.length; ++i) {
        alphas[i] = createSignal(0.1);
        colorSignals[i] = () => new Color(colors[i]).alpha(alphas[i]());
    }
    const fontFamily = 'Cascadia Mono';
    const valueSignal = createSignal(0.0);

    view.add(
        <Layout>
            <Layout y={-350} x={() => -1500 + (3000 * valueSignal())}>
            <Txt
                layout
                ref={value}
                fontFamily={fontFamily}
                fontSize={110}
                text={() => 'value = ' + valueSignal().toFixed(2)}
                fill={'#ffffff'}
                y={-250}
            />
            <Line // x axis
                lineWidth={40}
                stroke={'#ffffff'}
                endArrow={true}
                arrowSize={85}
                points={() => [
                    [0, -100],
                    [0, 250]
                    ]}
                />
            </Layout>
            <Layout layout gap={100} y={350}>
                {
                    range(colors.length).map(index => (
                        <Rect
                        layout
                        size={[500, 500]}
                        fill={() => colorSignals[index]()}
                        smoothCorners
                        radius={50}
                    />
                    ))
                }
           
            </Layout>
        </Layout>);
    
    const duration = useDuration('map-to-color');
   
    yield*  range(alphas.length)
    .map(index => delay(0.6 * index, alphas[index](10, duration / alphas.length)))
    yield* all(
        valueSignal(1.0, duration),
        
    );
});

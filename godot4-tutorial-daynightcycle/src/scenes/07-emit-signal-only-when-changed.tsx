import {Grid, Layout, makeScene2D, Line, Txt, Rect} from '@motion-canvas/2d/lib';
import {all, range, makeRef, createRef, linear, delay} from '@motion-canvas/core';

export default makeScene2D(function* (view) {

   /*
    * To optimize performance and avoid unnecessary emissions,
    * the signal should only be emitted when the ingame time changes,
    * not every single frame. 
    */

   const rects: Rect[] = [];
   const rectBgs: Rect[] = [];
   const txts: Txt[] = [];
   const fontFamily = 'Cascadia Mono';
   const fontWeight = 1000;

   const layout = createRef<Layout>();

   view.add(
    <Layout ref={layout} layout gap={590} alignItems="center" y={60}>
      {range(80).map(i => (
        <Layout layout direction="column" gap={150}>
            <Rect
            ref={makeRef(rects, i)}
            radius={185}
            width={480}
            height={480}
            fill={'#DAE4ED'}
            >
                
            <Rect
            ref={makeRef(rectBgs, i)}
            radius={185}
            width={480}
            height={480}
            fill={'#00FFA3'}
            opacity={0.0}
            />
            </Rect>
            
            <Txt
                ref={makeRef(txts, i)}
                fontFamily={fontFamily}
                fontWeight={fontWeight}
                text={'Frame ' + i}
                textAlign={'center'}
                width={500}
                fontSize={150}
                fill={'#DAE4ED'}
                
            />
        </Layout>
      ))}
    </Layout>);

    layout().x(14000);

    yield* all(
        layout().x(12000, 10, linear),
        delay(5, rects[27].fill('#00FFA3', 1.0)),
        delay(5, txts[27].fill('#00FFA3', 1.0)),
        delay(5, rectBgs[27].opacity(1.0, 0.25)),
        delay(5, rectBgs[27].scale(1.5, 0.25)),
        delay(5.1, rectBgs[27].opacity(0.0, 0.3)),
        delay(5, txts[27].fill('#00FFA3', 1.0)),
        delay(7, rects[29].fill('#00FFA3', 1.0)),
        delay(7, txts[29].fill('#00FFA3', 1.0)),
        
        delay(7, rectBgs[29].opacity(1.0, 0.25)),
        delay(7, rectBgs[29].scale(1.5, 0.25)),
        delay(7.1, rectBgs[29].opacity(0.0, 0.3)),
    );

});

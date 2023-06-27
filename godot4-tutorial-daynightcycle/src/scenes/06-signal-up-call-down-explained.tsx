import { Grid, Layout, makeScene2D, Line, Txt, Rect } from '@motion-canvas/2d/lib';
import { createRef, useDuration, waitFor, chain, all, createSignal, Color } from '@motion-canvas/core';
import { CodeBlock, insert, edit } from '@motion-canvas/2d/lib/components/CodeBlock';

export default makeScene2D(function* (view) {

    /*
     * Next, we need to communicate these values to the UI.
     * For this, we follow Godot's 'Signal up, Call Down' principle
     * to maintain component independence.
     */

    // Text settings
    const fontFamily = 'Cascadia Mono';
    const dashTheme = {
        keyword: { text: "#637AFE" },
        entityName: { text: "#DAE4ED" },
        fallback: { text: "#DAE4ED" },
        literal: { text: "#DAE4ED" },
        operator: { text: "#FFFFFF" },
        atom: { text: "#FFFFFF" },
        stringPunctuation: { text: "#FFFFFF" },
    };

    const signalUp = createRef<CodeBlock>();
    const callDown = createRef<CodeBlock>();
    const arrow = createRef<Line>();
    const signalUpBackground = createRef<Rect>();
    const callDownBackground = createRef<Rect>();
    const signalUpNode = createRef<Layout>();
    const callDownNode = createRef<Layout>();
    const signalUpHighlightBackground = createRef<Rect>();
    const callDownHighlightBackground = createRef<Rect>();

    const targetSignalUpY = -700;
    const targetCallDownY = 300;

    const arrowAlpha = createSignal(0.0);
    const arrowColor = Color.createSignal(new Color('#252533').alpha(arrowAlpha()));

    const callDownBackgroundAlpha = createSignal(1.0);
    const callDownBackgroundColor = Color.createSignal(new Color('#252533').alpha(callDownBackgroundAlpha()));

    const signalUpBackgroundAlpha = createSignal(1.0);
    const signalUpBackgroundColor = Color.createSignal(new Color('#252533').alpha(signalUpBackgroundAlpha()));

    const callDownCodeAlpha = createSignal(0.0);
    const signalUpCodeAlpha = createSignal(0.0);

    view.add(
        <Layout>
            <Layout y={-2500} ref={signalUpNode}>
                <Rect
                    ref={signalUpHighlightBackground}
                    fill={'#44446b'}
                    size={[2200, 500]}
                    y={225}
                    radius={50}
                />
                <Rect
                    ref={signalUpBackground}
                    fill={signalUpBackgroundColor}
                    size={[2200, 500]}
                    y={225}
                    radius={50}
                />
                <CodeBlock
                    layout
                    ref={signalUp}
                    fontFamily={fontFamily}
                    fontSize={250}
                    language='gdscript'
                    code={`signal up()`}
                    y={260}
                    theme={dashTheme}
                    opacity={signalUpCodeAlpha}
                    scale={0.9}
                />
            </Layout>
            <Layout y={2500} ref={callDownNode}>
                <Rect
                    ref={callDownHighlightBackground}
                    fill={'#44446b'}
                    size={[2200, 500]}
                    y={225}
                    radius={50}
                />
                <Rect
                    ref={callDownBackground}
                    fill={callDownBackgroundColor}
                    size={[2200, 500]}
                    y={225}
                    radius={50}
                />
                <CodeBlock
                    ref={callDown}
                    fontFamily={fontFamily}
                    fontSize={250}
                    language='gdscript'
                    code={`call.down()`}
                    y={260}
                    theme={dashTheme}
                    opacity={callDownCodeAlpha}
                    scale={0.9}
                />
            </Layout>
            <Line
                points={() => [
                    [0, -150],
                    [0, 220]
                ]}
                ref={arrow}
                lineWidth={180}
                stroke={arrowColor}
                endArrow={true}
                arrowSize={170}
                radius={50}

            />
        </Layout>);

        
    yield* waitFor(3.5);

    yield* signalUpNode().y(targetSignalUpY, useDuration('fade-in-duration-signal-up'));

    
    yield* chain(
        all(
            signalUpBackgroundColor('#44446b', 0.3),
            signalUpCodeAlpha(1.0, 0.3),
            signalUpHighlightBackground().scale(1.5, 0.5),
            signalUpHighlightBackground().opacity(0, 0.5),
            signalUp().scale(1, 0.5)
        ),
        all(
        signalUpBackgroundColor('#252533', 0.5),
        callDownNode().y(targetCallDownY, useDuration('fade-in-duration-call-down'))
        )
    );

    
    yield* chain(
        all(callDownBackgroundColor('#44446b', 0.3),
            callDownCodeAlpha(1.0, 0.3),
            callDownHighlightBackground().scale(1.5, 0.5),
            callDownHighlightBackground().opacity(0, 0.5),
            callDown().scale(1, 0.5)
        ),
        all(
        callDownBackgroundColor('#252533', 0.5),
        ),
        arrowAlpha(1.0, 1)
    );
    yield* all(
        signalUpNode().y(-1450, 1),
        callDownNode().y(1000, 1),
        signalUpCodeAlpha(0.0, 1),
        callDownCodeAlpha(0.0, 1),
        signalUpBackgroundColor('#25253300', 1),
        callDownBackgroundColor('#25253300', 1)
    );
});

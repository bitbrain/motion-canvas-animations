import {Grid, Layout, makeScene2D, Line, Txt} from '@motion-canvas/2d/lib';
import {createRef, range, createSignal, PossibleVector2, all} from '@motion-canvas/core';

export default makeScene2D(function* (view) {

   /*
    * To optimize performance and avoid unnecessary emissions,
    * the signal should only be emitted when the ingame time changes,
    * not every single frame. 
    */
});

"use strict";
function defaultSettingsProps(theme) {
    return {
        theme,
        d1: 0,
        d2: 120,
        d3: 240,
        dd1: 1.2,
        dd2: -2,
        dd3: 1,
        wf: 75,
        hf: 45,
        wb: 30.1266,
        hb: 33.1842
    };
}
function setTheme(props) {
    let prevTheme = true;
    return () => {
        if (prevTheme != props.theme) {
            if (props.theme)
                document.body.className = "theme_light";
            else
                document.body.className = "theme_dark";
            prevTheme = props.theme;
        }
    };
}
function draw(props) {
    const rad1 = (2 * Math.PI * props.d1) / 360;
    const rad2 = (2 * Math.PI * props.d2) / 360;
    const rad3 = (2 * Math.PI * props.d3) / 360;
    props.f.style.top = props.yc + "px";
    props.f.style.left = props.xc + "px";
    props.f.setAttribute("width", props.wf * props.k + "pt");
    props.f.setAttribute("height", props.hf * props.k + "pt");
    props.c1.style.top = props.yc + "px";
    props.c1.style.left = props.xc + "px";
    props.c1.style.width = props.r1 * 2 + "px";
    props.c1.style.height = props.r1 * 2 + "px";
    props.c2.style.top = props.yc + "px";
    props.c2.style.left = props.xc + "px";
    props.c2.style.width = props.r2 * 2 + "px";
    props.c2.style.height = props.r2 * 2 + "px";
    props.c3.style.top = props.yc + "px";
    props.c3.style.left = props.xc + "px";
    props.c3.style.width = props.r3 * 2 + "px";
    props.c3.style.height = props.r3 * 2 + "px";
    props.b1.style.top = (props.yc - props.r1 * Math.sin(rad1)).toFixed(3) + "px";
    props.b1.style.left = (props.xc + props.r1 * Math.cos(rad1)).toFixed(3) + "px";
    props.b1.style.transform = "translateX(-50%) translateY(-50%) " + `rotate(${-props.d1}deg)`;
    props.b1.setAttribute("width", props.wb * props.k + "pt");
    props.b1.setAttribute("height", props.hb * props.k + "pt");
    props.b2.style.top = (props.yc - props.r2 * Math.sin(rad2)).toFixed(3) + "px";
    props.b2.style.left = (props.xc + props.r2 * Math.cos(rad2)).toFixed(3) + "px";
    props.b2.style.transform = "translateX(-50%) translateY(-50%) " + `rotate(${-props.d2}deg)`;
    props.b2.setAttribute("width", props.wb * props.k + "pt");
    props.b2.setAttribute("height", props.hb * props.k + "pt");
    props.b3.style.top = (props.yc - props.r3 * Math.sin(rad3)).toFixed(3) + "px";
    props.b3.style.left = (props.xc + props.r3 * Math.cos(rad3)).toFixed(3) + "px";
    props.b3.style.transform = "translateX(-50%) translateY(-50%) " + `rotate(${-props.d3}deg)`;
    props.b3.setAttribute("width", props.wb * props.k + "pt");
    props.b3.setAttribute("height", props.hb * props.k + "pt");
}
function drawWrapper(props, wrapper) {
    const scaling = 0.9;
    const endValueSVGScaling = 0.6;
    props.d1 = props.d1 + props.dd1;
    props.d2 = props.d2 + props.dd2;
    props.d3 = props.d3 + props.dd3;
    let r3 = 0;
    let m = (1 - endValueSVGScaling) / (500 - 300);
    let k = 0;
    if (wrapper.offsetWidth < wrapper.offsetHeight) {
        r3 = scaling * (wrapper.offsetWidth / 2);
        k = m * wrapper.offsetWidth;
        if (wrapper.offsetWidth >= 500)
            k = 1;
        if (wrapper.offsetWidth <= 300)
            k = endValueSVGScaling;
    }
    else {
        r3 = scaling * (wrapper.offsetHeight / 2);
        k = m * wrapper.offsetHeight;
        if (wrapper.offsetHeight >= 500)
            k = 1;
        if (wrapper.offsetHeight <= 300)
            k = endValueSVGScaling;
    }
    const abs = (x) => x >= 0 ? x : -x;
    if (abs(props.d1) >= 360)
        props.d1 = props.d1 - 360;
    if (abs(props.d2) >= 360)
        props.d2 = props.d2 + 360;
    if (abs(props.d3) >= 360)
        props.d3 = props.d3 - 360;
    draw(Object.assign({ xc: Math.round(wrapper.offsetWidth / 2), yc: Math.round(wrapper.offsetHeight / 2), r1: Math.round(1 * r3 / 3), r2: Math.round(2 * r3 / 3), r3: Math.round(r3), k }, props));
}
window.addEventListener("DOMContentLoaded", () => {
    const __allElementsSvg = document.querySelectorAll("main > svg");
    const __allElementsSpan = document.querySelectorAll("main > span");
    // @ts-ignore
    const __main = document.querySelector("main");
    let state = Object.assign(Object.assign({}, defaultSettingsProps(true)), { f: __allElementsSvg[0], b1: __allElementsSvg[1], b2: __allElementsSvg[2], b3: __allElementsSvg[3], c1: __allElementsSpan[0], c2: __allElementsSpan[1], c3: __allElementsSpan[2] });
    window.onmessage = (event) => {
        var _a;
        try {
            const parsedData = JSON.parse(event.data);
            if (parsedData && parsedData.hasOwnProperty("theme")) {
                state.theme = parsedData.theme;
                (_a = event.source) === null || _a === void 0 ? void 0 : _a.postMessage(JSON.stringify({ res: true }), { targetOrigin: event.origin || "*" });
            }
        }
        catch (err) {
            console.warn(err);
        }
    };
    const callBack = setTheme(state);
    function step(timestamp) {
        drawWrapper(state, __main);
        callBack();
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
});

"use strict";
let StateFrame = {
    iFrame: null,
    theme: true,
    __SRC: "index.html"
};
function deleteWidget() {
    if (StateFrame.iFrame != null) {
        StateFrame.iFrame.remove();
        StateFrame.iFrame = null;
    }
}
;
function setThemeMethod(theme) {
    if (StateFrame.iFrame != null) {
        let iteration = 20;
        window.onmessage = (event) => {
            try {
                const parsedData = JSON.parse(event.data);
                if (parsedData && parsedData.hasOwnProperty("res") && parsedData.res) {
                    StateFrame.theme = theme;
                    iteration = 0;
                }
            }
            catch (err) {
                console.warn(err);
            }
        };
        function repeaterHandler() {
            var _a, _b;
            (_b = (_a = StateFrame.iFrame) === null || _a === void 0 ? void 0 : _a.contentWindow) === null || _b === void 0 ? void 0 : _b.postMessage(JSON.stringify({ theme }), "*");
        }
        ;
        function repeater() {
            if (iteration > 0) {
                iteration = iteration - 1;
                repeaterHandler();
                setTimeout(repeater, 50);
            }
        }
        repeater();
    }
    else
        setTimeout(setThemeMethod.bind(null, theme), 25);
}
;
function insertWidget(props) {
    if (StateFrame.iFrame == null) {
        window.addEventListener("DOMContentLoaded", () => {
            const iFrame = document.createElement("iframe");
            iFrame.setAttribute("src", StateFrame.__SRC);
            iFrame.setAttribute("class", props.className || "");
            props.conatiner.append(iFrame);
            StateFrame.iFrame = iFrame;
        });
    }
}
;
// @ts-ignore
insertWidget({ conatiner: document.body.querySelector("main"), className: "iFrameSelector" });
setThemeMethod(false);
const moduleAPI = {
    deleteWidget,
    insertWidget,
    methods: { setThemeMethod }
};
// export {moduleAPI};

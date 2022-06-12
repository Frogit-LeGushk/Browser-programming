interface IStateIFrame {
    iFrame: null | HTMLIFrameElement
    theme: boolean
    readonly __SRC: string
}
interface IPropsInsertFunction {
    className?: string
    conatiner: HTMLElement
}
interface IModule {
    readonly insertWidget: (props: IPropsInsertFunction) => void
    readonly deleteWidget: () => void
    readonly methods: {
        setThemeMethod: (theme: boolean) => void
    }
}
let StateFrame: IStateIFrame = {
    iFrame: null, 
    theme: true,
    __SRC: "index.html"
};


function deleteWidget(): void {
    if(StateFrame.iFrame != null) 
    {
        StateFrame.iFrame.remove();
        StateFrame.iFrame = null;
    }
};
function setThemeMethod(theme: boolean): void {
    if(StateFrame.iFrame != null)
    {
        let iteration = 20; 

        window.onmessage = (event: MessageEvent) => {
            try {
                const parsedData = JSON.parse(event.data);
                if(parsedData && parsedData.hasOwnProperty("res") && parsedData.res)
                {
                    StateFrame.theme = theme;
                    iteration = 0;
                }
            }
            catch(err) {console.warn(err);}
        };

        function repeaterHandler() {
            StateFrame.iFrame?.contentWindow?.postMessage(JSON.stringify({theme}), "*");
        };

        function repeater() {
            if(iteration > 0)
            {
                iteration = iteration - 1;
                repeaterHandler();
                setTimeout(repeater, 50);
            } 
        }
        repeater();
    }
    else
        setTimeout(setThemeMethod.bind(null, theme), 25);
};
function insertWidget(props: IPropsInsertFunction): void {
    if(StateFrame.iFrame == null)
    {
        window.addEventListener("DOMContentLoaded", () => {
            const iFrame = document.createElement("iframe");
            iFrame.setAttribute("src", StateFrame.__SRC);
            iFrame.setAttribute("class", props.className || "");
            props.conatiner.append(iFrame);
            StateFrame.iFrame = iFrame;
        })
    }
};


// @ts-ignore
insertWidget({conatiner: document.body.querySelector("main"), className: "iFrameSelector"});
setThemeMethod(false
);



const moduleAPI: IModule = {
    deleteWidget,
    insertWidget,
    methods: {setThemeMethod}
};

// export {moduleAPI};
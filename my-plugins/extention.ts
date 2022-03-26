/*
    All interfases and classes
*/

interface IDataItem {
    id: string
    className: string
};

interface IListItem {
    position: number
    url: string
    wrapper: IDataItem
    item: IDataItem
};

interface IState {
    key: string
    HOST: string

    isOpen: boolean
    list: IListItem[] | []

    URL_text: string

    Wrapper_id_text: string
    Wrapper_className_text: string

    Item_id_text: string
    Item_className_text: string
};

type TKeyIState = keyof IState;


/*
    Global state of app
*/

const KEY: string = 'extAdvertisingBlock';
const CONTEXT = this;
const STATE: IState = {
    HOST: getCurrentHost(),
    key: KEY,
    isOpen: false,
    list: loadList(),
    URL_text: '',
    Wrapper_id_text: '',
    Wrapper_className_text: '',
    Item_id_text: '',
    Item_className_text: ''
}
let observersArray: MutationObserver[] | [] = [];


/*
    Handlers
*/


function mutationObserverHandler(): void {
    const config = { attributes: true, childList: true, subtree: true };
    Array.prototype.map.call(STATE.list, (li: IListItem) => {
        if(STATE.HOST === li.url)
        {
            const wrapperElement = document.querySelector(li.wrapper.className || 'g') || document.getElementById(li.wrapper.id || 'g');
            
            (function() {
                const item = document.getElementById(li.item.id || 'g') 
                        || wrapperElement?.querySelector(li.item.className || 'g')
                        || document.querySelector(li.item.className || 'g');

                console.log("ITEM: ", item);
                console.log("WRAPPER: ", wrapperElement);

                item && item.parentNode?.removeChild(item);
                
                const observer = new MutationObserver(function(mutationsList, observer) {
                    const itemCallback = document.getElementById(li.item.id || 'g') 
                                    || wrapperElement?.querySelector(li.item.className || 'g')
                                    || document.querySelector(li.item.className || 'g');

                    itemCallback && itemCallback.parentNode?.removeChild(itemCallback);
                });
    
                observer.observe(wrapperElement || document, config);
                observersArray = [...observersArray, observer];
            }());
        }
    })
}

function setHandlersToList(): void {
    const listContainer = document.getElementById(KEY)?.querySelector('ul');

    const deleteH = (index: number) => {
        STATE.list = Array.prototype.filter.call(STATE.list, (li) => li.position !== index);
        updateState(STATE);
    }

    const indertH = (index: number) => {
        
        let finded: IListItem | undefined = undefined;
        for(let i = 0; i < STATE.list.length; i++)
        {
            if(STATE.list[i].position === index)
            {
                finded = STATE.list[i];
                break;
            }
        }

        if(finded) {
            STATE.URL_text = finded.url;
            STATE.Wrapper_id_text = finded.wrapper.id;
            STATE.Wrapper_className_text = finded.wrapper.className;
            STATE.Item_id_text = finded.item.id;
            STATE.Item_className_text = finded.item.className;
            updateState(STATE);
        }
    }

    if(listContainer)
    {
        listContainer.onclick = (event) => listContainer
            .querySelectorAll("button")
            .forEach(btn => {
                if(btn === event.target)
                {    
                    const type = btn.dataset.type;
                    const index = btn.dataset.index;

                    if(type && index)
                    {
                        type === "delete" && deleteH(+index);
                        type === "insert" && indertH(+index);
                    }
                }
            });
    }
}

function setHandlersToForm(): void {
    const form = document.querySelector(`#${KEY} form`);
    const inputHandler = (position: number, input: HTMLInputElement) => {
        const focus = () => {
            const ni: NodeListOf<HTMLInputElement> = document.querySelectorAll(`#${KEY} form input`);
                
            if(ni.length === 5)
            {
                ni[position].focus();
                ni[position].selectionStart = ni[position].value.length;
            }
        }

        switch (position)
        {
            case 0: return () => {
                updateState({...STATE, URL_text: input.value});
                focus();  
            };
            case 1: return () => {
                updateState({...STATE, Wrapper_id_text: input.value});
                focus();  
            };
            case 2: return () => {
                updateState({...STATE, Wrapper_className_text: input.value});
                focus();
            };
            case 3: return () => {
                updateState({...STATE, Item_id_text: input.value});
                focus();
            };
            case 4: return () => {
                updateState({...STATE, Item_className_text: input.value});
                focus();
            };
            default: return () => updateState(STATE);
        }


    };

    const buttonHandler = (event: Event) => {
        event.preventDefault();
        const isNotEmpty = STATE.URL_text && (STATE.Wrapper_id_text || STATE.Wrapper_className_text)
                                          && (STATE.Item_id_text || STATE.Item_className_text);

        if(isNotEmpty)
        {
            const newListItem = {} as IListItem;
            newListItem.url = STATE.URL_text;
            newListItem.position = STATE.list.length + 1;

            newListItem.wrapper = {} as IDataItem;
            newListItem.wrapper.id = STATE.Wrapper_id_text;
            newListItem.wrapper.className = STATE.Wrapper_className_text;

            newListItem.item = {} as IDataItem;
            newListItem.item.id = STATE.Item_id_text;
            newListItem.item.className = STATE.Item_className_text;
            
            STATE.list = [...STATE.list, newListItem];

            STATE.URL_text = '';
            STATE.Wrapper_id_text = '';
            STATE.Wrapper_className_text = '';
            STATE.Item_id_text = '';
            STATE.Item_className_text = '';

            updateState(STATE);
        }
    };

    if(form)
    {
        const inputs = form.querySelectorAll("input");
        const button = form.querySelector("button");

        const allElements = inputs.length === 5 && button !== null;
        if(allElements && button)
        {
            inputs.forEach((input, index) => input.oninput = inputHandler(index, input));
            button.onclick = buttonHandler;
        }
    }
}

function getCurrentHost(): string {
    return window.location.host;
}

function loadList(): IListItem[] | [] {
    const myStorage = window.localStorage;
    const payload: string | null = myStorage.getItem(KEY);
    const isArray: boolean = JSON.parse(payload || '{}') instanceof Array;
    const defaultList: IListItem[] = [
        {
            "position": 1,
            "url": "jut.su",
            "wrapper": {"id": "my-player", "className": ".video-js.vjs-default-skin.vjs-16-9.vjs-paused.vjs-controls-enabled.vjs-workinghover.vjs-v6.vjs-user-active.vjs-videojs-share.vjs-watermark"},
            "item": {"id": "my-player_ima-ad-container", "className": ".my-player_ima-ad-container.ima-ad-container"},
        }
    ];


    if(null === payload || !isArray)
    {
        console.group("Extention:: load list");
            console.log(
                "the field with such a key: ", 
                KEY, 
                "does not exist or wrong format!"
            );
            console.log("created default storage");
        console.groupEnd();

        myStorage.setItem(KEY, JSON.stringify(defaultList));
        return defaultList;
    }
    else
        return JSON.parse(payload) as IListItem[] | [];
}

function updateList(NewList: IListItem[] | []): void {
    const myStorage = window.localStorage;
    myStorage.setItem(KEY, JSON.stringify(NewList));
}

function updateState(newState: IState): void {
    for (const variable in newState)
        if(newState.hasOwnProperty(variable) && STATE.hasOwnProperty(variable))
            // @ts-ignore
            STATE[variable] = newState[variable];

    observersArray.map(observer => observer.disconnect());
    observersArray = [];

    // console.group("Extention:: update state");
    //     console.log("new state set ", STATE);
    // console.groupEnd();

    drawModal(STATE);
    document.onkeydown = keyDownHandler;
    updateList(STATE.list);
    setHandlersToForm();
    setHandlersToList();
    mutationObserverHandler();
}

function drawModal(newState: IState): void {
    const dinamicStyle = {show: 'show', hidden: 'hidden'};
    const newClassName = newState.isOpen ? dinamicStyle.show : dinamicStyle.hidden;

    const UX_List_Item = (li: IListItem) => (
    `<li>
        <p><b>url:</b> ${li.url}
        <p><b>wrapper_id:</b> ${li.wrapper.id}</p>
        <p><b>wrapper_selector:</b> ${li.wrapper.className}</p>
        <p><b>item_id:</b> ${li.item.id}</p>
        <p><b>item_selector:</b> ${li.item.className}</p>
        <button data-index="${li.position}" data-type="delete">d</button>
        <button data-index="${li.position}" data-type="insert">i</button>
    </li>`
    );

    const UX_Content = () => (
    `<h5>List</h5>
    <ul>${
        newState.list.length === 0 ? 'empty list...' :
        newState.list.map((el: IListItem) => UX_List_Item(el)).join('')
    }</ul>
    <h5>Add List Item</h5>
    <form>
        <b>URL:</b>
        <input type="text" value="${newState.URL_text}">

        <p><b>[Wrapper]</b></p>
        <b>id:</b>
        <input type="text" value="${newState.Wrapper_id_text}">
        <b>selector:</b>
        <input type="text" value="${newState.Wrapper_className_text}">

        <p><b>[Item]</b></p>
        <b>id:</b>
        <input type="text" value="${newState.Item_id_text}"> 
        <b>selector:</b>
        <input type="text" value="${newState.Item_className_text}"> 

        <button>Submit</button>
    </form>`
    );
    const UX_Wrapper = (content: string) => (
        `<section id="${KEY}" class="${newClassName}">${content}</section>`
    );

    const wrapper = document.getElementById(KEY);

    if(!wrapper)
        document.body.insertAdjacentHTML("afterbegin", UX_Wrapper(UX_Content()));
    else
    {
        wrapper.className = newClassName;
        wrapper.innerHTML = UX_Content();
    }
}

function keyDownHandler(event: KeyboardEvent) {
    const withAlt = event.altKey;
    const isG = event.key === 'g' || event.key === 'G' || event.keyCode === 71;

    if(withAlt && isG) {
        console.warn("Press: alt + g");
        const newState: IState = {...STATE, isOpen: !STATE.isOpen};
        updateState(newState);
    }  
}


function start(): void {
    // console.group("INFO: ");
    // console.log("state: ", STATE);
    // console.log("context: ", CONTEXT);
    // console.groupEnd();

    updateState(STATE)
    if ("onhashchange" in window) 
    {
        STATE.HOST = getCurrentHost();
        window.onhashchange = () => updateState(STATE);
    }
}


start();
setInterval(start, 5000);
// document.addEventListener("DOMContentLoaded", start);
// document.onload = start;

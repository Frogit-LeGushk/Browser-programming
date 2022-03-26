/*
    All interfases and classes
*/
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
;
;
;
/*
    Global state of app
*/
var KEY = 'extAdvertisingBlock';
var CONTEXT = this;
var STATE = {
    HOST: getCurrentHost(),
    key: KEY,
    isOpen: false,
    list: loadList(),
    URL_text: '',
    Wrapper_id_text: '',
    Wrapper_className_text: '',
    Item_id_text: '',
    Item_className_text: ''
};
var observersArray = [];
/*
    Handlers
*/
function mutationObserverHandler() {
    var config = { attributes: true, childList: true, subtree: true };
    Array.prototype.map.call(STATE.list, function (li) {
        if (STATE.HOST === li.url) {
            var wrapperElement_1 = document.querySelector(li.wrapper.className || 'g') || document.getElementById(li.wrapper.id || 'g');
            (function () {
                var _a;
                var item = document.getElementById(li.item.id || 'g')
                    || (wrapperElement_1 === null || wrapperElement_1 === void 0 ? void 0 : wrapperElement_1.querySelector(li.item.className || 'g'))
                    || document.querySelector(li.item.className || 'g');
                console.log("ITEM: ", item);
                console.log("WRAPPER: ", wrapperElement_1);
                item && ((_a = item.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(item));
                var observer = new MutationObserver(function (mutationsList, observer) {
                    var _a;
                    var itemCallback = document.getElementById(li.item.id || 'g')
                        || (wrapperElement_1 === null || wrapperElement_1 === void 0 ? void 0 : wrapperElement_1.querySelector(li.item.className || 'g'))
                        || document.querySelector(li.item.className || 'g');
                    itemCallback && ((_a = itemCallback.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(itemCallback));
                });
                observer.observe(wrapperElement_1 || document, config);
                observersArray = __spreadArray(__spreadArray([], observersArray), [observer]);
            }());
        }
    });
}
function setHandlersToList() {
    var _a;
    var listContainer = (_a = document.getElementById(KEY)) === null || _a === void 0 ? void 0 : _a.querySelector('ul');
    var deleteH = function (index) {
        STATE.list = Array.prototype.filter.call(STATE.list, function (li) { return li.position !== index; });
        updateState(STATE);
    };
    var indertH = function (index) {
        var finded = undefined;
        for (var i = 0; i < STATE.list.length; i++) {
            if (STATE.list[i].position === index) {
                finded = STATE.list[i];
                break;
            }
        }
        if (finded) {
            STATE.URL_text = finded.url;
            STATE.Wrapper_id_text = finded.wrapper.id;
            STATE.Wrapper_className_text = finded.wrapper.className;
            STATE.Item_id_text = finded.item.id;
            STATE.Item_className_text = finded.item.className;
            updateState(STATE);
        }
    };
    if (listContainer) {
        listContainer.onclick = function (event) { return listContainer
            .querySelectorAll("button")
            .forEach(function (btn) {
            if (btn === event.target) {
                var type = btn.dataset.type;
                var index = btn.dataset.index;
                if (type && index) {
                    type === "delete" && deleteH(+index);
                    type === "insert" && indertH(+index);
                }
            }
        }); };
    }
}
function setHandlersToForm() {
    var form = document.querySelector("#" + KEY + " form");
    var inputHandler = function (position, input) {
        var focus = function () {
            var ni = document.querySelectorAll("#" + KEY + " form input");
            if (ni.length === 5) {
                ni[position].focus();
                ni[position].selectionStart = ni[position].value.length;
            }
        };
        switch (position) {
            case 0: return function () {
                updateState(__assign(__assign({}, STATE), { URL_text: input.value }));
                focus();
            };
            case 1: return function () {
                updateState(__assign(__assign({}, STATE), { Wrapper_id_text: input.value }));
                focus();
            };
            case 2: return function () {
                updateState(__assign(__assign({}, STATE), { Wrapper_className_text: input.value }));
                focus();
            };
            case 3: return function () {
                updateState(__assign(__assign({}, STATE), { Item_id_text: input.value }));
                focus();
            };
            case 4: return function () {
                updateState(__assign(__assign({}, STATE), { Item_className_text: input.value }));
                focus();
            };
            default: return function () { return updateState(STATE); };
        }
    };
    var buttonHandler = function (event) {
        event.preventDefault();
        var isNotEmpty = STATE.URL_text && (STATE.Wrapper_id_text || STATE.Wrapper_className_text)
            && (STATE.Item_id_text || STATE.Item_className_text);
        if (isNotEmpty) {
            var newListItem = {};
            newListItem.url = STATE.URL_text;
            newListItem.position = STATE.list.length + 1;
            newListItem.wrapper = {};
            newListItem.wrapper.id = STATE.Wrapper_id_text;
            newListItem.wrapper.className = STATE.Wrapper_className_text;
            newListItem.item = {};
            newListItem.item.id = STATE.Item_id_text;
            newListItem.item.className = STATE.Item_className_text;
            STATE.list = __spreadArray(__spreadArray([], STATE.list), [newListItem]);
            STATE.URL_text = '';
            STATE.Wrapper_id_text = '';
            STATE.Wrapper_className_text = '';
            STATE.Item_id_text = '';
            STATE.Item_className_text = '';
            updateState(STATE);
        }
    };
    if (form) {
        var inputs = form.querySelectorAll("input");
        var button = form.querySelector("button");
        var allElements = inputs.length === 5 && button !== null;
        if (allElements && button) {
            inputs.forEach(function (input, index) { return input.oninput = inputHandler(index, input); });
            button.onclick = buttonHandler;
        }
    }
}
function getCurrentHost() {
    return window.location.host;
}
function loadList() {
    var myStorage = window.localStorage;
    var payload = myStorage.getItem(KEY);
    var isArray = JSON.parse(payload || '{}') instanceof Array;
    var defaultList = [
        {
            "position": 1,
            "url": "jut.su",
            "wrapper": { "id": "my-player", "className": ".video-js.vjs-default-skin.vjs-16-9.vjs-paused.vjs-controls-enabled.vjs-workinghover.vjs-v6.vjs-user-active.vjs-videojs-share.vjs-watermark" },
            "item": { "id": "my-player_ima-ad-container", "className": ".my-player_ima-ad-container.ima-ad-container" }
        }
    ];
    if (null === payload || !isArray) {
        console.group("Extention:: load list");
        console.log("the field with such a key: ", KEY, "does not exist or wrong format!");
        console.log("created default storage");
        console.groupEnd();
        myStorage.setItem(KEY, JSON.stringify(defaultList));
        return defaultList;
    }
    else
        return JSON.parse(payload);
}
function updateList(NewList) {
    var myStorage = window.localStorage;
    myStorage.setItem(KEY, JSON.stringify(NewList));
}
function updateState(newState) {
    for (var variable in newState)
        if (newState.hasOwnProperty(variable) && STATE.hasOwnProperty(variable))
            // @ts-ignore
            STATE[variable] = newState[variable];
    observersArray.map(function (observer) { return observer.disconnect(); });
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
function drawModal(newState) {
    var dinamicStyle = { show: 'show', hidden: 'hidden' };
    var newClassName = newState.isOpen ? dinamicStyle.show : dinamicStyle.hidden;
    var UX_List_Item = function (li) { return ("<li>\n        <p><b>url:</b> " + li.url + "\n        <p><b>wrapper_id:</b> " + li.wrapper.id + "</p>\n        <p><b>wrapper_selector:</b> " + li.wrapper.className + "</p>\n        <p><b>item_id:</b> " + li.item.id + "</p>\n        <p><b>item_selector:</b> " + li.item.className + "</p>\n        <button data-index=\"" + li.position + "\" data-type=\"delete\">d</button>\n        <button data-index=\"" + li.position + "\" data-type=\"insert\">i</button>\n    </li>"); };
    var UX_Content = function () { return ("<h5>List</h5>\n    <ul>" + (newState.list.length === 0 ? 'empty list...' :
        newState.list.map(function (el) { return UX_List_Item(el); }).join('')) + "</ul>\n    <h5>Add List Item</h5>\n    <form>\n        <b>URL:</b>\n        <input type=\"text\" value=\"" + newState.URL_text + "\">\n\n        <p><b>[Wrapper]</b></p>\n        <b>id:</b>\n        <input type=\"text\" value=\"" + newState.Wrapper_id_text + "\">\n        <b>selector:</b>\n        <input type=\"text\" value=\"" + newState.Wrapper_className_text + "\">\n\n        <p><b>[Item]</b></p>\n        <b>id:</b>\n        <input type=\"text\" value=\"" + newState.Item_id_text + "\"> \n        <b>selector:</b>\n        <input type=\"text\" value=\"" + newState.Item_className_text + "\"> \n\n        <button>Submit</button>\n    </form>"); };
    var UX_Wrapper = function (content) { return ("<section id=\"" + KEY + "\" class=\"" + newClassName + "\">" + content + "</section>"); };
    var wrapper = document.getElementById(KEY);
    if (!wrapper)
        document.body.insertAdjacentHTML("afterbegin", UX_Wrapper(UX_Content()));
    else {
        wrapper.className = newClassName;
        wrapper.innerHTML = UX_Content();
    }
}
function keyDownHandler(event) {
    var withAlt = event.altKey;
    var isG = event.key === 'g' || event.key === 'G' || event.keyCode === 71;
    if (withAlt && isG) {
        console.warn("Press: alt + g");
        var newState = __assign(__assign({}, STATE), { isOpen: !STATE.isOpen });
        updateState(newState);
    }
}
function start() {
    // console.group("INFO: ");
    // console.log("state: ", STATE);
    // console.log("context: ", CONTEXT);
    // console.groupEnd();
    updateState(STATE);
    if ("onhashchange" in window) {
        STATE.HOST = getCurrentHost();
        window.onhashchange = function () { return updateState(STATE); };
    }
}
start();
setInterval(start, 5000);
// document.addEventListener("DOMContentLoaded", start);
// document.onload = start;

// ==UserScript==
// @name         Monday
// @namespace    http://tampermonkey.net/
// @version      2024-07-27
// @description  add link to open ticket
// @author       Zeev Glaizer
// @match        https://wix.monday.com/boards/*/views/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monday.com
// @grant        none
// ==/UserScript==

//https://wix.monday.com/boards/4801364010/views/*/pulses/*

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function waitForElmToDissappear(selector) {
    return new Promise(resolve => {
        if (!document.querySelector(selector)) {
            return resolve();
        }

        const observer = new MutationObserver(mutations => {
            if (!document.querySelector(selector)) {
                observer.disconnect();
                resolve();
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function getTaskUrl() {
    const boardUrl= document.querySelector("#pulse-card-dialog-scrollable-wrapper > div.pulse-card-header > div > div.link-to-pulse > a").href
    const taskId= document.querySelector(".pulse-id-cell-component").innerText;
    return `${boardUrl}/pulses/${taskId}`;
}

function addLink(link) {

    var a = document.createElement('a');
    var linkText = document.createTextNode("link to task");
    a.appendChild(linkText);
    a.title = "link to task";
    a.href = link;
    a.target="_blank";


    const menu = document.querySelector("#pulse-card-dialog-component > div.top-actions-container > div");
    menu.appendChild(a);
}


(async function () {
    'use strict';

    console.log("-Monday Link-");
    while(true) {
        console.log("waiting for menu");
        const elm = await waitForElm('.pulse-card-dialog-component');
        console.log('Element is ready');
        const taskUrl = getTaskUrl();

        console.log('taskUrl', taskUrl);
        addLink(taskUrl);

        const elm2 = await waitForElmToDissappear('.pulse-card-dialog-component');
        console.log("menu closed");
    }

})();


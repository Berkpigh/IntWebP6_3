import { anyElem, swapClass, displayFormData, testFullForm, lo,
    generateSVGMove, generateSVGDel, generateSVGLine, generateSVGAP  } from "./utilitaires.js";
import { removeModal, removeMainModal, removeAPModal, addListenerAPBtn, 
    addListenerValBtn, createAjoutPhotoModal, addModalBtnsListener, 
    createModalBtns, addListenerDelBtns, createMainModal, 
    ajoutPhotoModal, showMainModal, openModal, closeModal } from "./modales.js";
import { getFetch } from "./apifunctions.js";

const por = document.getElementById("portofolio");
let gal = document.querySelector(".gallery");
let alog = document.getElementById("alog");
let admb = document.querySelector(".adminbar");
let modifier = document.querySelector(".modifier");
let outbtn = document.getElementById("outbtn");
document.querySelector(".js-modal").addEventListener('click', (e) => {
    openModal(e, wors);
});
document.querySelector(".js-modal-back").addEventListener("click", (event) => {
    showMainModal(wors);
});

let token = "";
let wors = "";
let cats = "";
let cmax = 0;
let curcat = "0";
let precat = "";
let testlog = false;

outbtn.addEventListener("click", (e) => {
    window.localStorage.removeItem("loginfo");
});

function swapModifier(pswap) {
    console.log("Début swapModifier : ", pswap)
    if (pswap > 0) {
        swapClass(alog,"navenabled","navdisabled");
        swapClass(modifier, "modinvisible", "modvisible");
        alog.innerHTML = "logout";
    } else {
        swapClass(alog,"navdisabled", "navenabled");
        swapClass(modifier, "modvisible", "modinvisible");
        alog.innerHTML = "login";
    }
};
function getLSInfo() {
    const getinfo = window.localStorage.getItem("loginfo");
    if (getinfo === null) {
        console.log("getinfo : null")
        swapModifier(-1);
        return false;
    }
    const gijson = JSON.parse(getinfo);
    let dt = Date.now();
    let dtlog = gijson.timenow;
    let minutes = (dt - dtlog) / 60000;
/*
    if (minutes > session) {
        console.log("getinfo > ", session);
        window.localStorage.removeItem("loginfo");
        swapModifier(-1);
        return true;
    }
*/
    token = gijson.token;
    console.log("token", token);
    //console.log("getinfo < ", session);
    swapModifier(1);
    return true;
};
function removeFigures() {
    try {
        console.log("Début removeFigures");
        let figs = document.querySelector(".gallery");
        figs.parentNode.removeChild(figs);
        return true;
    } catch (error) {
        console.log("Erreur removeFigures " + error.message);
    }
};
function createFigures(pwork)  {
    try {
        console.log("Début createFigures");
        gal = document.createElement("div");
        gal.classList.add("gallery");
        for (let w = 0; w < pwork.length; w++) {
            let fig = document.createElement("figure");
            fig.classList.add("homefig");
            let ima = document.createElement("img");
            let fic = document.createElement("figcaption");
            ima.src = pwork[w].imageUrl;
            ima.alt = pwork[w].title;
            ima.crossOrigin = "Anonymous";
            fic.innerHTML  = pwork[w].title;
            fig.appendChild(ima);
            fig.appendChild(fic);
            gal.appendChild(fig);
        }
        por.appendChild(gal);
        console.log("portofolio",por);
        return true;
    } catch (error) {
        console.log("Erreur createFigures " + error.message);
    }
};
function initialHomePageCreation(pcats) {
    console.log("Début initialHomePageCreation");
    if (testlog === true) {
        swapClass(admb, "adminbar-nodis", "adminbar-dis");
    } else {
        swapClass(admb, "adminbar-dis", "adminbar-nodis");
        cats = pcats;
        console.log("pcats --- ", cats);
        cmax = cats.length -1;
        let div = anyElem("div",null,null,"porcatbtn",null,null,null,null,null,null,null);
        por.appendChild(div);
        div.appendChild(anyElem("button",null,"0","porcatbtn__btnsel","button",null,null,null,"Tous",null,null));
        for (let c = 0; c <= cmax; c++) {
            let bid = (c + 1).toString();
            div.appendChild(anyElem("button",null,bid,"porcatbtn__btn","button",null,null,null,cats[c].name,null,null));
        }
        addListenerCatBtns();
    }
    getFetchThenMainHomePage();
    console.log("initialHomePageCreation Ok");
};
function showSelCatBtn() {
    let btn = document.getElementById(precat);
    swapClass(btn, "porcatbtn__btnsel", "porcatbtn__btn");
    btn = document.getElementById(curcat);
    swapClass(btn, "porcatbtn__btn", "porcatbtn__btnsel");
};
function answerCatBtn(pid) {
    precat = curcat;
    curcat = pid;
    showSelCatBtn();
    if (pid === "0") {
        main(wors);
    } else {
         const worsfiltered = wors.filter(function(work) {
            return work.categoryId === Number(pid);
        });
        main(worsfiltered);
        console.log("worsfiltered", worsfiltered); 
    };
};
function addListenerCatBtns() {
    console.log("Début addListenerCatBtns");
    let allcatbtns = document.querySelectorAll(".porcatbtn button");
    for (let c = 0; c < allcatbtns.length; c++) {
        allcatbtns[c].addEventListener("click", (event) => {
            let btnid = event.target.id;
            if (!(curcat === btnid)) {
                answerCatBtn(btnid);
            }
        });
    };
    console.log("addListenerCatBtns Ok");
};

export function showHomePage(pwork) {
    console.log("Début showHomePage");
    wors = pwork;
    main(wors);
};
function main(pwork) {
    console.log("Début Main");
    console.log("pwork --- ", pwork);
    let b = removeFigures();
    if (b === true) {console.log("removeFigures Ok");
                     b = createFigures(pwork)};
    if (b === true) {console.log("createFigures Ok")};
};
function getFetchThenMainHomePage() {
    getFetch(`http://localhost:5678/api/works`).then(w => showHomePage(w),);
};
/* ---------------------------------------------------------------------------------- */
/* --- --- --- --- --- --- --- --- Lancement du script --- --- --- --- --- --- --- -- */

testlog = getLSInfo();
console.log("testlog : ",testlog);
getFetch(`http://localhost:5678/api/categories`).then(c => initialHomePageCreation(c),);
/* ---------------------------------------------------------------------------------- */

import { anyElem, swapClass, displayFormData, testFullForm, 
    generateSVGMove, generateSVGDel, generateSVGLine, generateSVGAP  } from "./utilitaires.js";
import { removeModal, removeMainModal, removeAPModal, addListenerAPBtn, 
    addListenerValBtn, createAPhotoModal, addModalBtnsListener, 
    createModalBtns, addListenerDelBtns, createMainModal, 
    showAPhotoModal, showMainModal, openModal, closeModal } from "./modales.js";
import { getFetch } from "./apifunctions.js";

const por = document.getElementById("portofolio");
let gal = document.querySelector(".gallery");
let alog = document.getElementById("alog");
let admb = document.querySelector(".adminbar");
let modifier = document.querySelector(".modifier");
document.querySelector(".js-modal").addEventListener('click', (e) => {
    openModal(e, wors);
});
document.querySelector(".js-modal-back").addEventListener("click", (event) => {
    showMainModal(wors);
});

let token = "";
let wors = "";
let cats = "";
let curcat = "0";
let precat = "";
let testlog = false;

// --- listener login/logout
alog.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.innerHTML === "login") {
        window.location.href="login.html";
    } else {
        window.localStorage.removeItem("loginfo");
        testlog = false;
        swapModifier(-1);
        getFetch(`http://localhost:5678/api/categories`).then(c => createHomePage(c),);
    }
});
// --- apparition ou non du bouton modifier
function swapModifier(pswap) {
    console.log("Début swapModifier : ", pswap)
    if (pswap > 0) {
        swapClass(modifier, "modinvisible", "modvisible");
        alog.innerHTML = "logout";
    } else {
        swapClass(modifier, "modvisible", "modinvisible");
        alog.innerHTML = "login";
    }
};
// --- lecture du contenu du local storage de login
// --- retourne true/false si logged/non logged
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
    token = gijson.token;
    console.log("token", token);
    swapModifier(1);
    return true;
};
// --- suppression des figures de la homepage
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
// --- creation des figures de la homepage lues
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
// --- création du haut de la home page
function createHomePage(pcats) {
    console.log("Début createHomePage");
    if (testlog === true) {
        swapClass(admb, "adminbar-nodis", "adminbar-dis");
    } else {
        swapClass(admb, "adminbar-dis", "adminbar-nodis");
        cats = pcats;
        console.log("pcats --- ", cats);
        let div = anyElem("div",null,null,"porcatbtn",null,null,null,null,null,null,null);
        por.appendChild(div);
        div.appendChild(anyElem("button",null,"0","porcatbtn__btnsel","button",null,null,null,"Tous",null,null));
        for (let c = 0; c < cats.length; c++) {
            let bid = (c + 1).toString();
            div.appendChild(anyElem("button",null,bid,"porcatbtn__btn","button",null,null,null,cats[c].name,null,null));
        }
        addListenerCatBtns();
    }
    // --- lecture des projets pour creation de la gallerie
    getFetchThenMainHomePage();
    console.log("createHomePage Ok");
};
// --- changement de couleur des boutons de filtres
// --- l'ancien bouton sélectionné perd son fond vert
// --- le nouveau bouton sélectionné prend un fond vert
function showSelCatBtn() {
    let btn = document.getElementById(precat);
    swapClass(btn, "porcatbtn__btnsel", "porcatbtn__btn");
    btn = document.getElementById(curcat);
    swapClass(btn, "porcatbtn__btn", "porcatbtn__btnsel");
};
// --- traitement de filtrage des projets en fonction de la catégorie
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
// --- listener des boutons de filtrage par catégorie
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
// --- lancement de la procedure main (gallerie) avec sauvegarde des projets
export function showHomePage(pwork) {
    console.log("Début showHomePage");
    wors = pwork;
    main(wors);
};
// --- procedure main (gallerie) pour les projets lus
function main(pwork) {
    console.log("Début Main");
    console.log("pwork --- ", pwork);
    let b = removeFigures();
    if (b === true) {console.log("removeFigures Ok");
                     b = createFigures(pwork)};
    if (b === true) {console.log("createFigures Ok")};
};
// --- lecture asynchrone des projets
// --- la promesse lance la création de la gallerie
function getFetchThenMainHomePage() {
    getFetch(`http://localhost:5678/api/works`).then(w => showHomePage(w),);
};
/* ---------------------------------------------------------------------------------- */
/* --- --- --- --- --- --- --- --- Lancement du script --- --- --- --- --- --- --- -- */
/* ---------------------------------------------------------------------------------- */
testlog = getLSInfo();
console.log("testlog : ",testlog);
// --- lecture asynchrone des categories
// --- la promesse lance la création du haut de la home page
getFetch(`http://localhost:5678/api/categories`).then(c => createHomePage(c),);
/* ---------------------------------------------------------------------------------- */

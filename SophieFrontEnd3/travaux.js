import { anyElem, addClass, swapClass, displayFormData, testFullForm, lo,
    generateSVGMove, generateSVGDel, generateSVGLine, generateSVGAP  } from "./utilitaires.js";
import { getFetch, storeResult, deleteWork, addWork } from "./apifunctions.js";

const por = document.getElementById("portofolio");
let gal = document.querySelector(".gallery");
let alog = document.getElementById("alog");
let amod = document.getElementById("amod");
let modifier = document.querySelector(".modifier");
let modgal = document.querySelector(".modal-gallery");


let token = "";
let wors = "";
let cats = "";
let cmax = 0;
let curcat = "0";
let precat = "";
let testlog = 0;
let session = 1;
let ModNum = 0;
let APUrl = "";

function swapModifier(pswap) {
    if (pswap > 0) {
        swapClass(alog,"navenabled","navdisabled");
        swapClass(modifier, "modinvisible", "modvisible");
    } else {
        swapClass(alog,"navdisabled", "navenabled");
        swapClass(modifier, "modvisible", "modinvisible");
    }
};
function getLSInfo() {
    const getinfo = window.localStorage.getItem("loginfo");
    if (getinfo === null) {
        console.log("getinfo : null")
        swapModifier(-1);
        return true;
    }
    const gijson = JSON.parse(getinfo);
    let dt = Date.now();
    let dtlog = gijson.timenow;
    let minutes = (dt - dtlog) / 60000;
    if (minutes > session) {
        console.log("getinfo > ", session);
        window.localStorage.removeItem("loginfo");
        swapModifier(-1);
        return true;
    }
    token = gijson.token;
    console.log("token", token);
    console.log("getinfo < ", session);
    swapModifier(1);
    return false;
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
function createFigures(pwors)  {
    try {
        console.log("Début createFigures");
        gal = document.createElement("div");
        gal.classList.add("gallery");
        for (let w = 0; w < pwors.length; w++) {
            let fig = document.createElement("figure");
            let ima = document.createElement("img");
            let fic = document.createElement("figcaption");
            ima.src = pwors[w].imageUrl;
            ima.alt = pwors[w].title;
            ima.crossOrigin = "Anonymous";
            fic.innerHTML  = pwors[w].title;
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
amod.addEventListener("mouseover", (event) => {
    testlog = getLSInfo();
    console.log("testlog modifier: ", testlog);
    if (testlog === true) { window.location.href="login.html"; };
});
function MainHomePage(pwors) {
    console.log("Début MainHomePage");
    wors = pwors;
    main(wors);
};
function main(pwors) {
    console.log("Début Main");
    console.log("pwors --- ", pwors);
    let b = removeFigures();
    if (b === true) {console.log("removeFigures Ok");
                     b = createFigures(pwors)};
    if (b === true) {console.log("createFigures Ok")};
};
/* ------------------------------------------------------------------------------------------------- */
/* --- --- --- --- --- --- --- --- --- gestion fenêtre modale --- --- --- --- --- --- --- --- --- ---*/
/* ------------------------------------------------------------------------------------------------- */
const focusableSelector = 'button, a, input, textarea'
let modal = null
let focusables = []
let previouslyFocusedElement = null
document.querySelector(".js-modal-back").addEventListener("click", (event) => {
    mainModal(wors);
});
function removeModal() {
    console.log("Début removeModal - ", ModNum);
    let b = false;
    if (ModNum === 1) {
        b = removeMainModal();
    } else {
        b = removeAPModal();
    };
    return b;
};
function removeMainModal() {
    console.log("Début removeMainModal");
    let modwrap = modal.querySelector(".modal-wrapper");
    let figs = modal.querySelector(".modal-gallery");
    let modbtns = modal.querySelector(".modal-btns");
    modwrap.removeChild(figs);
    modwrap.removeChild(modbtns);
    return true;
};
function removeAPModal() {
    console.log("Début removeAPModal");
    let modwrap = modal.querySelector(".modal-wrapper");
    let cont = modal.querySelector(".APmodal-content");
    modwrap.removeChild(cont);
    return true;
};
function addListenerAPBtn() {
    const apimg = modal.querySelector(".apimg");
    const apifi = modal.querySelector(".apifi");
    const apilab = modal.querySelector(".apilab");
    const aptinp = modal.querySelector(".aptinp");
    const apbval = modal.querySelector(".apbval");
    apifi.onchange = function() {
        const APFil = apifi.files[0];
        APUrl = APFil.name;
        apimg.src = URL.createObjectURL(apifi.files[0]);
        swapClass(apilab, "apilab", "apilab-nodis");
        swapClass(apimg, "apzer", "appho");
        testFullForm(APUrl,aptinp.value,apbval);
    };
};
function addListenerValBtn() {
    const apifi = modal.querySelector(".apifi");
    const fo = modal.querySelector("form");
    fo.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(fo);
        fd.delete("image");
        let ffn = apifi.files[0].name;
        const posext = ffn.indexOf(".");
        const fn = ffn.substring(0,posext);
        const fext = ffn.substring(posext);
        ffn = fn + Date.now()+ fext;
        console.log("new filename",ffn);
        const fname = "http://localhost:5678/images/" + ffn;
        fd.append("image", apifi.files[0], fname)
        displayFormData(fd);
        let urls = "http://localhost:5678/api/works";
        addWork(urls, "formauth", fd, token);
        getFetchThenMainModal();
    });
};
function createAjoutPhotoModal(pwors, pcats)  {
    console.log("Début createAjoutPhotoModal");
    ModNum = 2;
    APUrl = null;
    const bback = modal.querySelector(".js-modal-back");
    swapClass(bback, "js-modal-back-nodis", "js-modal-back-dis");
    const modtit = modal.querySelector(".modal-title");
    modtit.innerHTML = "Ajout photo";
// --- Form
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    modgal = anyElem("form",null,null,"APmodal-content",null,null,null,null,null,null,null)
// --- div ajout
// vvvvvvvvvvvvvvvvv
    let div2 = anyElem("div",null,null,"apdiv",null,null,null,null,null,null,null);
    let img = anyElem("img",null,null,"apimg",null,"/Backend/images/kyswqmsva7nlkdxhpgl.svg","image?",null,null,null,null);
    img.classList.add("apzer");
    div2.appendChild(img);
    div2.appendChild(anyElem("label",null,null,"apilab",null,null,null,"apinp","+ Ajouter photo",null,null));
    const ipfi = anyElem("input","image","apinp","apifi","file",null,null,null,null,null,true);
    ipfi.setAttribute("accept", "image/jpg, image/png");
    div2.appendChild(ipfi);
    div2.appendChild(anyElem("p",null,null,"appar",null,null,null,null,"jpg, png : 4mo max",null,null));
// --- Fin div ajout
// ^^^^^^^^^^^^^^^^^    
    modgal.appendChild(div2);
    modgal.appendChild(anyElem("label",null,null,"aptlab",null,null,null,"aptinp","Titre",null,null));
    modgal.appendChild(anyElem("input","title","aptinp","aptinp","text",null,null,null,null,"indiquer un titre",null));
    modgal.appendChild(anyElem("label",null,null,"apllab",null,null,null,"aplist","Catégorie",null,null));
    let aplist = anyElem("select","category","aplist","aplinp",null,null,null,null,null,null,null);
    for (let c = 0; c < pcats.length; c++) {
        aplist.appendChild(anyElem("option",null,null,null,null,null,null,null,pcats[c].name,pcats[c].id,null));
    }
    modgal.appendChild(aplist);
    modgal.appendChild(anyElem("input",null,null,null,"hidden",null,null,null,null,19,null));
    modgal.appendChild(anyElem("input",null,null,null,"hidden",null,null,null,null,1,null));
    modgal.appendChild(generateSVGLine("modal-svg"));
    let apbval = anyElem("button",null,null,"apbval","submit",null,null,null,"Valider",null,null);
    apbval.classList.add("apbval_disab");
    apbval.disabled = true;
    modgal.appendChild(apbval);
// Fin de la form    
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    const modcontent = modal.querySelector(".modal-wrapper");
    swapClass(modcontent, "modal-modal", "modal-APmodal");
    modcontent.appendChild(modgal);
    addListenerAPBtn();
    addListenerValBtn();
    return true;
};
function addModalBtnsListener() {
    const madd = modal.querySelector(".modal-add");
    madd.addEventListener("click", (event) => {
        ajoutPhotoModal();
    });
    const mdel = modal.querySelector(".modal-del");
    mdel.addEventListener("click", (event) => {
    });
};
function createModalBtns() {
    console.log("Début createModalBtns");
    const modcontent = modal.querySelector(".modal-wrapper");
/* --- Ligne --- */
    let div = anyElem("div",null,null,"modal-btns",null,null,null,null,null,null,null);
    div.appendChild(generateSVGLine("modal-svg"));
/* --- Boutons --- */
    let btn = anyElem("button",null,null,"modal-add","button",null,null,null,"Ajouter une photo",null,null);
    btn.classList.add("porcatbtn__btnsel");
    div.appendChild(btn);

    btn = anyElem("button",null,null,"modal-del","button",null,null,null,"Supprimer la galerie",null,null);
    btn.classList.add("porcatbtn__btnsel");
    div.appendChild(btn);

    modcontent.appendChild(div);
    addModalBtnsListener();
    console.log("createModalBtns Ok");
};
function addListenerDelBtns() {
    let alldelbtns = modal.querySelectorAll(".figdelbtn");
    for (let i = 0; i < alldelbtns.length; i++) {
        alldelbtns[i].addEventListener("click", (event) => {
            let b = event.target.parentNode.id;
            let figid = parseInt(b.substring(6));
            let figs = modal.querySelectorAll(".figs");
            let fig = figs[figid];
            let cn = fig.childNodes;
            let imgx = cn[1];
            let workid = parseInt(imgx.id);
            console.log("workid", workid);
            console.log("token", token);
            deleteWork(workid, "formauth", token);
            getFetchThenMainModal();
        });
    };
};
function createMainModal(pwors)  {
    //try {
        console.log("Début createMainModal");
        ModNum = 1;
        const bback = modal.querySelector(".js-modal-back");
        swapClass(bback, "js-modal-back-dis", "js-modal-back-nodis")
        const modtit = modal.querySelector(".modal-title");
        modtit.innerHTML = "Galerie photo";
//        
        modgal = anyElem("div",null,null,"modal-gallery",null,null,null,null,null,null,null);
        for (let w = 0; w < pwors.length; w++) {
            let fig = anyElem("figure",null,null,"figs",null,null,null,null,null,null,null);
// --- div avec les boutons
            let div = anyElem("div",null,null,"figbtns",null,null,null,null,null,null,null);
            if (w === 0) { div.appendChild(generateSVGMove()); };
            let bdel = anyElem("button",null,null,"figdelbtn","button",null,null,null,null,null,null,null);
            let svg = generateSVGDel();
            svg.id = "figbtn" + w.toString();
            bdel.appendChild(svg);
            div.appendChild(bdel);
// --- image et caption
            let ima = anyElem("img",null,pwors[w].id,"figimg",null,pwors[w].imageUrl,pwors[w].title,null,null,null,null);
            ima.crossOrigin = "Anonymous";
            let afic = document.createElement("a");
            afic.href = "#figbtn" + w.toString();
            afic.classList.add("figcap");
            let fic = document.createElement("figcaption");
            fic.innerHTML  = "éditer";
// --- rattachement au parent
            fig.appendChild(div);
            afic.appendChild(fic);
            fig.appendChild(ima);
            fig.appendChild(afic);
            modgal.appendChild(fig);
        }
        const modcontent = modal.querySelector(".modal-wrapper");
        swapClass(modcontent, "modal-APmodal", "modal-modal");
        modcontent.appendChild(modgal);
        createModalBtns();
        addListenerDelBtns();
        return true;
/*
    } catch (error) {
        console.log("Erreur createMainModal " + error.message);
    }
*/
};

function mainModal(pwors) {
    wors = pwors;
    let b = removeModal();
    if (b === true) {console.log("removeModal Ok");
                     b = createMainModal(pwors)};
    if (b === true) {console.log("createMainModal Ok")};
}
function ajoutPhotoModal() {
    let b = removeModal();
    if (b === true) {console.log("removeModal Ok");
                     b = createAjoutPhotoModal(wors, cats)};
    if (b === true) {console.log("createAjoutPhotoModal Ok")};
}

const openModal = async function (e) {
    e.preventDefault()
    const target = e.target.getAttribute('href')
    modal = document.querySelector(target);
    //console.log(modal);
    previouslyFocusedElement = document.querySelector(':focus')
    modal.style.display = "flex";
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)

    mainModal(wors);
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    console.log("focusables", focusables);
    focusables[0].focus()
}

const closeModal = function (e) {
    console.log("modal", modal);
    if (modal === null) return 
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
    e.preventDefault()
    /* Animation-direction reversed
    modal.style.display = "none"
    modal.offsetWidth
    modal.style.display = null
     */
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    const hideModal = function () {
        modal.style.display = "none"
        modal.removeEventListener('animationend', hideModal)
        modal = null
    }
    modal.addEventListener('animationend', hideModal)
    getFetchThenMainHomePage();
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

const focusInModal = function (e) {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'))
    if (e.shiftKey === true) {
        index--
    } else {
        index++
    }
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus()
}

const loadModal = async function (url) {
    // TODO : Afficher un loader
    const target = '#' + url.split('#')[1]
    const exitingModal = document.querySelector(target)
    if (exitingModal !== null) return exitingModal
    const html = await fetch(url).then(response => response.text())
    const element = document.createRange().createContextualFragment(html).querySelector(target)
    if (element === null) throw `L'élément ${target} n'a pas été trouvé dans la page ${url}`
    document.body.append(element)
    return element
}
document.querySelector(".js-modal").addEventListener('click', openModal);

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e)
    }
})
function getFetchThenMainModal() {
    getFetch(`http://localhost:5678/api/works`).then(w => mainModal(w),);
};
function getFetchThenMainHomePage() {
    getFetch(`http://localhost:5678/api/works`).then(w => MainHomePage(w),);
};
/* --- --- --- --- --- --- --- --- Fin de la gestion de la fenêtre modale --- --- --- */
/* ---------------------------------------------------------------------------------- */
/* --- --- --- --- --- --- --- --- Lancement du script --- --- --- --- --- --- --- -- */

testlog = getLSInfo();
console.log("testlog",testlog);
ModNum = 1;
getFetch(`http://localhost:5678/api/categories`).then(c => initialHomePageCreation(c),);
/* ---------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------- */
/* --- --- --- --- --- --- --- --- --- gestion fenêtre modale --- --- --- --- --- --- --- --- --- ---*/
/* ------------------------------------------------------------------------------------------------- */
import {
	anyElem,
	swapClass,
	displayFormData,
	testFullForm,
	generateSVGMove,
	generateSVGDel,
	generateSVGLine,
	generateSVGAP
} from "./utilitaires.js";
import {
	getFetch,
	deleteWork,
	addWork
} from "./apifunctions.js";

const focusableSelector = 'button, a, input, textarea'
let modgal = document.querySelector(".modal-gallery");

// --- taille max. de l'image (fixée à 1Mo pour avoir des cas de dépassement)
const sizemax = 1000000;
let wors = "";
let cats = "";
let token = "";
let ModNum = 1;
let modal = null
let focusables = []
let previouslyFocusedElement = null

// --- lecture des projets et lancement de la modale
function getFetchThenMainModal() {
	console.log("Début getFetchThenMainModal");
	getFetch(`http://localhost:5678/api/works`).then(w => showMainModal(w), );
};
// --- lecture du local storage pour le token
function getLocalStorage() {
	const getinfo = window.localStorage.getItem("loginfo");
	if (getinfo === null) {
		alert("!!! Local storage vide - besoin de se relogger ?")
		return false;
	}
	const gijson = JSON.parse(getinfo);
	token = gijson.token;
	return true;
};
// --- suppression des éléments de la modale
// --- 1 --> main modale
// --- 2 --> modale Ajout Photo
export function removeModal() {
	console.log("Début removeModal - ", ModNum);
	let b = false;
	if (ModNum === 1) {
		b = removeMainModal();
	} else {
		b = removeAPModal();
	};
	return b;
};
// --- suppression des éléments de la main modale
export function removeMainModal() {
	console.log("Début removeMainModal");
	let modwrap = modal.querySelector(".modal-wrapper");
	let figs = modal.querySelector(".modal-gallery");
	let modbtns = modal.querySelector(".modal-btns");
	modwrap.removeChild(figs);
	modwrap.removeChild(modbtns);
	return true;
};
// --- suppression des éléments de la modale Ajout Photo
export function removeAPModal() {
	console.log("Début removeAPModal");
	let modwrap = modal.querySelector(".modal-wrapper");
	let cont = modal.querySelector(".APmodal-content");
	modwrap.removeChild(cont);
	return true;
};
// --- listener bouton Ajout Photo
export function addListenerAPBtn() {
	const apimg = modal.querySelector(".apimg");
	const apifi = modal.querySelector(".apifi");
	const apilab = modal.querySelector(".apilab");
	const aptinp = modal.querySelector(".aptinp");
	const apbval = modal.querySelector(".apbval");
	const pmes = modal.querySelector(".pmes");
	let mes = "";
	apifi.onchange = function () {
		let APFil = apifi.files[0];
		if (APFil.size > sizemax) {
			console.log("img size : ", APFil.size, " - ", sizemax);
			mes = "- La taille de l'image est supérieure à la limite<br>"
			APFil = null;
			apifi.value = null;
		} else {
			mes = "";
			apimg.src = URL.createObjectURL(apifi.files[0]);
			swapClass(apilab, "apilab", "apilab-nodis");
			swapClass(apimg, "apimg-nodis", "appho");
		}
		testFullForm(mes, APFil, aptinp.value, apbval, pmes);
		mes = "";
	};
};
// --- listener saisie du titre
export function addListenerTitleInput() {
	const apifi = modal.querySelector(".apifi");
	const aptinp = modal.querySelector(".aptinp");
	const apbval = modal.querySelector(".apbval");
	const pmes = modal.querySelector(".pmes");
	aptinp.onchange = function () {
		const APFil = apifi.files[0];
		testFullForm("", APFil, aptinp.value, apbval, pmes);
	}
};
// --- listener bouton valide ajout photo
export function addListenerValBtn() {
	const apifi = modal.querySelector(".apifi");
	const fo = modal.querySelector("form");
	fo.addEventListener("submit", (e) => {
		e.preventDefault();
		const fd = new FormData(fo);
		fd.delete("image");
		let ffn = apifi.files[0].name;
		const posext = ffn.indexOf(".");
		const fn = ffn.substring(0, posext);
		const fext = ffn.substring(posext);
		ffn = fn + Date.now() + fext;
		console.log("new filename", ffn);
		const fname = "http://localhost:5678/images/" + ffn;
		fd.append("image", apifi.files[0], fname)
		displayFormData(fd);
		let urls = "http://localhost:5678/api/works";
		addWork(urls, "formauth", fd, token).then(() => getFetchThenMainModal());
		//getFetchThenMainModal();
	});
};
// --- céation de la modale Ajout Photo
export function createAPhotoModal(pwork, pcats) {
	console.log("Début createAPhotoModal");
	ModNum = 2;
	const bback = modal.querySelector(".js-modal-back");
	swapClass(bback, "js-modal-back-nodis", "js-modal-back-dis");
	const modtit = modal.querySelector(".modal-title");
	modtit.innerHTML = "Ajout photo";
	// --- Form
	// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
	modgal = anyElem("form", null, null, "APmodal-content", null, null, null, null, null, null, null)
	// --- div ajout
	// vvvvvvvvvvvvvvvvv
	let div2 = anyElem("div", null, null, "apdiv", null, null, null, null, null, null, null);
	let svg = generateSVGAP();
	svg.classList.add("apzer");
	div2.appendChild(svg);
	let img = anyElem("img", null, null, "apimg", null, "", "image?", null, null, null, null);
	img.crossOrigin = "anonymous";
	img.classList.add("apimg-nodis");
	div2.appendChild(img);
	div2.appendChild(anyElem("label", null, null, "apilab", null, null, null, "apinp", "+ Ajouter photo", null, null));
	const ipfi = anyElem("input", "image", "apinp", "apifi", "file", null, null, null, null, null, true);
	ipfi.setAttribute("accept", "image/jpg, image/png");
	div2.appendChild(ipfi);
	let txt = "jpg, png : " + (sizemax / 1000000).toString() + "mo max";
	div2.appendChild(anyElem("p", null, null, "appar", null, null, null, null, txt, null, null));
	// --- Fin div ajout
	// ^^^^^^^^^^^^^^^^^    
	modgal.appendChild(div2);
	modgal.appendChild(anyElem("label", null, null, "aptlab", null, null, null, "aptinp", "Titre", null, null));
	modgal.appendChild(anyElem("input", "title", "aptinp", "aptinp", "text", null, null, null, null, null, null));
	modgal.appendChild(anyElem("label", null, null, "apllab", null, null, null, "aplist", "Catégorie", null, null));
	let aplist = anyElem("select", "category", "aplist", "aplinp", null, null, null, null, null, null, null);
	for (let c = 0; c < pcats.length; c++) {
		aplist.appendChild(anyElem("option", null, null, null, null, null, null, null, pcats[c].name, pcats[c].id, null));
	}
	modgal.appendChild(aplist);
	modgal.appendChild(anyElem("input", null, null, null, "hidden", null, null, null, null, 19, null));
	modgal.appendChild(anyElem("input", null, null, null, "hidden", null, null, null, null, 1, null));
	modgal.appendChild(generateSVGLine("modal-svg"));
	const mes = `- Choisir une image<br>- Indiquer un titre d'au moins 4 caractères`;
	const pmes = anyElem("p", null, null, "pmes", null, null, null, null, mes, null, null);
	pmes.classList.add("pmesred");
	modgal.appendChild(pmes);
	let apbval = anyElem("button", null, null, "apbval", "submit", null, null, null, "Valider", null, null);
	apbval.classList.add("apbval_disab");
	apbval.disabled = true;
	modgal.appendChild(apbval);
	// Fin de la form    
	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
	const modcontent = modal.querySelector(".modal-wrapper");
	swapClass(modcontent, "modal-modal", "modal-APmodal");
	modcontent.appendChild(modgal);
	addListenerAPBtn();
	addListenerTitleInput();
	addListenerValBtn();
	return true;
};
// --- listener des boutons de la main modale
export function addModalBtnsListener() {
	const madd = modal.querySelector(".modal-add");
	madd.addEventListener("click", (event) => {
		getFetch(`http://localhost:5678/api/categories`).then(c => showAPhotoModal(c), );
	});
	const mdel = modal.querySelector(".modal-del");
	mdel.addEventListener("click", (event) => {});
};
// --- création des boutons de la main modale
export function createModalBtns() {
	console.log("Début createModalBtns");
	const modcontent = modal.querySelector(".modal-wrapper");
	/* --- Ligne --- */
	let div = anyElem("div", null, null, "modal-btns", null, null, null, null, null, null, null);
	div.appendChild(generateSVGLine("modal-svg"));
	/* --- Boutons --- */
	let btn = anyElem("button", null, null, "modal-add", "button", null, null, null, "Ajouter une photo", null, null);
	btn.classList.add("porcatbtn__btnsel");
	div.appendChild(btn);

	btn = anyElem("button", null, null, "modal-del", "button", null, null, null, "Supprimer la galerie", null, null);
	btn.classList.add("porcatbtn__btnsel");
	div.appendChild(btn);

	modcontent.appendChild(div);
	addModalBtnsListener();
	console.log("createModalBtns Ok");
};
// --- listener des boutons de suppression d'images
export function addListenerDelBtns() {
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
// --- création de la main modale
export function createMainModal(pwork) {
	console.log("Début createMainModal");
	console.log("pwork : ", pwork);
	ModNum = 1;
	if (getLocalStorage() === false) {
		return false
	};
	const bback = modal.querySelector(".js-modal-back");
	swapClass(bback, "js-modal-back-dis", "js-modal-back-nodis")
	const modtit = modal.querySelector(".modal-title");
	modtit.innerHTML = "Galerie photo";
	//        
	modgal = anyElem("div", null, null, "modal-gallery", null, null, null, null, null, null, null);
	for (let w = 0; w < pwork.length; w++) {
		let fig = anyElem("figure", null, null, "figs", null, null, null, null, null, null, null);
		// --- div avec les boutons
		let div = anyElem("div", null, null, "figbtns", null, null, null, null, null, null, null);
		if (w === 0) {
			div.appendChild(generateSVGMove());
		};
		let bdel = anyElem("button", null, null, "figdelbtn", "button", null, null, null, null, null, null, null);
		let svg = generateSVGDel();
		svg.id = "figbtn" + w.toString();
		bdel.appendChild(svg);
		div.appendChild(bdel);
		// --- image et caption
		let ima = anyElem("img", null, pwork[w].id, "figimg", null, pwork[w].imageUrl, pwork[w].title, null, null, null, null);
		ima.crossOrigin = "Anonymous";
		let afic = document.createElement("a");
		afic.href = "#figbtn" + w.toString();
		afic.classList.add("figcap");
		let fic = document.createElement("figcaption");
		fic.innerHTML = "éditer";
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
	console.log("modcontent : ", modcontent);
	createModalBtns();
	addListenerDelBtns();
	return true;
};
// --- lancement création de la modale Ajout Photo
export function showAPhotoModal(pcate) {
	console.log("Début showAPhotoModal");
	cats = pcate;
	let b = removeModal();
	if (b === true) {
		console.log("removeModal Ok");
		b = createAPhotoModal(wors, cats)
	};
	if (b === true) {
		console.log("createAPhotoModal Ok")
	};
}
// --- lancement création de la main modale
export function showMainModal(pwork) {
	console.log("Début showMainModal");
	wors = pwork;
	let b = removeModal();
	if (b === true) {
		console.log("removeModal Ok");
		b = createMainModal(pwork)
	};
	if (b === true) {
		console.log("createMainModal Ok")
	};
};
// --- ouverture de la main modale (code de Grafikart)
export const openModal = async function (e, wors) {
	console.log("Début openModal");
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
	showMainModal(wors);
	focusables = Array.from(modal.querySelectorAll(focusableSelector))
	console.log("focusables", focusables);
	focusables[0].focus()
};
// --- fermeture de la main modale (code de Grafikart)
export const closeModal = function (e) {
	console.log("Début closeModal");
	console.log("modal", modal);
	if (modal === null) return
	if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
	e.preventDefault()
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
	location.reload();
}
// --- stop la propagation de l'événement 
// --- aussi bien en direction des parents que des enfants de l'élément
const stopPropagation = function (e) {
	e.stopPropagation()
}
// --- création de la table des éléments pouvant recevoir le focus
// --- code de grafikart
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
// --- listener touches clavier pour accessibilité (code de Grafikart)
window.addEventListener('keydown', function (e) {
	if (e.key === "Escape" || e.key === "Esc") {
		closeModal(e)
	}
	if (e.key === 'Tab' && modal !== null) {
		focusInModal(e)
	}
})
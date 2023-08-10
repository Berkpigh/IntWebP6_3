// création de tout élément du DOM avec les principaux attributs
export function anyElem(pelem, pname, pid, pclass, ptype, psrc, palt, phtmlfor, phtml, pvalue, preq) {
	let x = document.createElement(pelem);
	if (!(pname === null)) {
		x.name = pname;
	}
	if (!(pid === null)) {
		x.id = pid;
	}
	if (!(pclass === null)) {
		x.classList.add(pclass);
	}
	if (!(ptype === null)) {
		x.type = ptype;
	}
	if (!(psrc === null)) {
		x.src = psrc;
	}
	if (!(palt === null)) {
		x.alt = palt;
	}
	if (!(phtmlfor === null)) {
		x.htmlFor = phtmlfor;
	}
	if (!(phtml === null)) {
		x.innerHTML = phtml;
	}
	if (!(pvalue === null)) {
		x.value = pvalue;
	}
	if (!(preq === null)) {
		x.required = preq;
	}
	return x;
};
// --- log d'objets formData
export function displayFormData(pfd) {
	for (const [i, v] of pfd.entries()) {
		console.log("key: " + i + " - value: " + v);
	}
};
// --- log d'Objets
export function displayObject(pobj) {
	for (const [key, value] of Object.entries(pobj)) {
		console.log(`${key}: ${value}`);
	}
};
// --- log d'objets Headers
export function displayHeaders(phea) {
	for (const pair of phea.entries()) {
		console.log(`${pair[0]}: ${pair[1]}`);
	}
};
// --- test de remplissage de la form Ajout Photo
export function testFullForm(pmes, papfil, ptit, pbval, ppmes) {
	console.log("Début testFullForm", papfil);
	let mes = pmes;
	pmes = "";
	if (papfil == null || papfil === "undefined") {
		mes = mes + "- Choisir une image"
	};
	if (ptit.length < 4) {
		mes = mes + "<br>- Indiquer un titre d'au moins 4 caractères"
	};
	if (!(mes === "")) {
		pbval.disabled = true;
		swapClass(pbval, "porcatbtn__btnsel", "apbval_disab")
		swapClass(ppmes, "pmes", "pmesred");
	} else {
		pbval.removeAttribute("disabled");
		swapClass(pbval, "apbval_disab", "porcatbtn__btnsel")
		swapClass(ppmes, "pmesred", "pmes");
	};
	ppmes.innerHTML = mes;
};
// --- échange de classes d'un élément
export function swapClass(pelem, prem, padd) {
	pelem.classList.remove(prem);
	pelem.classList.add(padd);
	return;
};
// --- génération svg
export function generateSVGMove(pclass) {
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	svg.setAttribute("width", "17");
	svg.setAttribute("height", "17");
	svg.setAttribute("viewBox", "0 0 17 17");
	svg.setAttribute("fill", "none");

	rect.setAttribute("width", "17");
	rect.setAttribute("height", "17");
	rect.setAttribute("rx", "2");
	rect.setAttribute("fill", "black");

	path.setAttribute("d", "M9.05089 3.20363C8.77938 2.93212 8.33845 2.93212 8.06694 3.20363L6.6768 4.59377C6.40529 4.86528 6.40529 5.30621 6.6768 5.57772C6.94831 5.84924 7.38925 5.84924 7.66076 5.57772L7.86493 5.37355V7.86493H5.37355L5.57772 7.66076C5.84924 7.38925 5.84924 6.94831 5.57772 6.6768C5.30621 6.40529 4.86528 6.40529 4.59377 6.6768L3.20363 8.06694C2.93212 8.33845 2.93212 8.77938 3.20363 9.05089L4.59377 10.441C4.86528 10.7125 5.30621 10.7125 5.57772 10.441C5.84924 10.1695 5.84924 9.72858 5.57772 9.45707L5.37355 9.2529H7.86493V11.7465L7.66076 11.5423C7.38925 11.2708 6.94831 11.2708 6.6768 11.5423C6.40529 11.8138 6.40529 12.2547 6.6768 12.5262L8.06694 13.9164C8.33845 14.1879 8.77938 14.1879 9.05089 13.9164L10.441 12.5262C10.7125 12.2547 10.7125 11.8138 10.441 11.5423C10.1695 11.2708 9.72858 11.2708 9.45707 11.5423L9.2529 11.7465V9.25507H11.7465L11.5423 9.45924C11.2708 9.73076 11.2708 10.1717 11.5423 10.4432C11.8138 10.7147 12.2547 10.7147 12.5262 10.4432L13.9164 9.05306C14.1879 8.78155 14.1879 8.34062 13.9164 8.06911L12.5262 6.67897C12.2547 6.40746 11.8138 6.40746 11.5423 6.67897C11.2708 6.95048 11.2708 7.39142 11.5423 7.66293L11.7465 7.8671H9.25507V5.37355L9.45924 5.57772C9.73076 5.84924 10.1717 5.84924 10.4432 5.57772C10.7147 5.30621 10.7147 4.86528 10.4432 4.59377L9.05306 3.20363H9.05089Z");
	path.setAttribute("fill", "white");

	svg.appendChild(rect);
	svg.appendChild(path);
	if (!(pclass === null)) {
		svg.classList.add(pclass);
	}
	return svg;
};
// --- génération svg
export function generateSVGDel(pclass) {
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	svg.setAttribute("width", "17");
	svg.setAttribute("height", "17");
	svg.setAttribute("viewBox", "0 0 17 17");
	svg.setAttribute("fill", "none");

	rect.setAttribute("width", "17");
	rect.setAttribute("height", "17");
	rect.setAttribute("rx", "2");
	rect.setAttribute("fill", "black");

	path.setAttribute("d", "M6.71607 3.35558C6.82455 3.13661 7.04754 3 7.29063 3H9.70938C9.95246 3 10.1754 3.13661 10.2839 3.35558L10.4286 3.64286H12.3571C12.7127 3.64286 13 3.93013 13 4.28571C13 4.64129 12.7127 4.92857 12.3571 4.92857H4.64286C4.28728 4.92857 4 4.64129 4 4.28571C4 3.93013 4.28728 3.64286 4.64286 3.64286H6.57143L6.71607 3.35558ZM4.64286 5.57143H12.3571V12C12.3571 12.7092 11.7806 13.2857 11.0714 13.2857H5.92857C5.21942 13.2857 4.64286 12.7092 4.64286 12V5.57143ZM6.57143 6.85714C6.39464 6.85714 6.25 7.00179 6.25 7.17857V11.6786C6.25 11.8554 6.39464 12 6.57143 12C6.74821 12 6.89286 11.8554 6.89286 11.6786V7.17857C6.89286 7.00179 6.74821 6.85714 6.57143 6.85714ZM8.5 6.85714C8.32321 6.85714 8.17857 7.00179 8.17857 7.17857V11.6786C8.17857 11.8554 8.32321 12 8.5 12C8.67679 12 8.82143 11.8554 8.82143 11.6786V7.17857C8.82143 7.00179 8.67679 6.85714 8.5 6.85714ZM10.4286 6.85714C10.2518 6.85714 10.1071 7.00179 10.1071 7.17857V11.6786C10.1071 11.8554 10.2518 12 10.4286 12C10.6054 12 10.75 11.8554 10.75 11.6786V7.17857C10.75 7.00179 10.6054 6.85714 10.4286 6.85714Z");
	path.setAttribute("fill", "white");

	svg.appendChild(rect);
	svg.appendChild(path);
	if (!(pclass === null)) {
		svg.classList.add(pclass);
	}
	return svg;
};
// --- génération svg
export function generateSVGLine(pclass) {
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
	svg.setAttribute("width", "420");
	svg.setAttribute("height", "1");
	svg.setAttribute("viewBox", "0 0 420 1");
	svg.setAttribute("fill", "none");

	line.setAttribute("x1", "-4.37114e-08");
	line.setAttribute("y1", "0.5");
	line.setAttribute("x2", "420");
	line.setAttribute("y2", "0.499963");
	line.setAttribute("stroke", "#B3B3B3");

	svg.appendChild(line);
	if (!(pclass === null)) {
		svg.classList.add(pclass);
	}
	return svg;
};
// --- génération svg
export function generateSVGAP(pclass) {
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("width", "58");
	svg.setAttribute("height", "58");
	svg.setAttribute("viewBox", "0 0 58 58");
	svg.setAttribute("fill", "none");

	let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.setAttribute("d", "M57 6H1C0.448 6 0 6.447 0 7V51C0 51.553 0.448 52 1 52H57C57.552 52 58 51.553 58 51V7C58 6.447 57.552 6 57 6ZM56 50H2V8H56V50Z");
	path.setAttribute("fill", "#B9C5CC");
	svg.appendChild(path);

	path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.setAttribute("d", "M16 28.138C19.071 28.138 21.569 25.64 21.569 22.57C21.569 19.498 19.071 17 16 17C12.929 17 10.431 19.498 10.431 22.569C10.431 25.64 12.929 28.138 16 28.138ZM16 19C17.968 19 19.569 20.602 19.569 22.569C19.569 24.536 17.968 26.138 16 26.138C14.032 26.138 12.431 24.537 12.431 22.57C12.431 20.603 14.032 19 16 19Z");
	path.setAttribute("fill", "#B9C5CC");
	svg.appendChild(path);

	path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.setAttribute("d", "M7.00004 46C7.23404 46 7.47004 45.918 7.66004 45.751L23.973 31.389L34.275 41.69C34.666 42.081 35.298 42.081 35.689 41.69C36.08 41.299 36.08 40.667 35.689 40.276L30.882 35.469L40.063 25.415L51.324 35.738C51.731 36.111 52.364 36.083 52.737 35.676C53.11 35.269 53.083 34.636 52.675 34.263L40.675 23.263C40.479 23.084 40.218 22.995 39.955 23.001C39.69 23.013 39.44 23.13 39.261 23.326L29.467 34.053L24.724 29.31C24.35 28.937 23.752 28.918 23.356 29.266L6.33904 44.249C5.92404 44.614 5.88404 45.246 6.24904 45.661C6.44704 45.886 6.72304 46 7.00004 46Z");
	path.setAttribute("fill", "#B9C5CC");
	svg.appendChild(path);
	if (!(pclass === null)) {
		svg.classList.add(pclass);
	}
	return svg;
};
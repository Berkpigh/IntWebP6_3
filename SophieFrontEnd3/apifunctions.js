import { displayObject, displayHeaders }  from "./utilitaires.js";
const resp = document.getElementById("presult");

// --- construction de le l'objet Headers en fonction
// --- du content-type et de l'authorization 
function constructHeaders(pcont, ptoken){
    console.log("Début constructHeaders");
    let hea = new Headers();
    switch (pcont) {
        case null:
            hea = null;
            break;
        case "json":
            hea.append('Content-Type', 'application/json');
            break;
        case "jsonauth":
            hea.append('Content-Type', 'application/json');
            hea.append('Authorization', `Bearer ${ptoken}`);
            break;
        case "form":
            break;
        case "formauth":
            hea.append('Authorization', `Bearer ${ptoken}`);
    }
    displayHeaders(hea);
    return hea;
};
// --- construction du 2ème paramètre de l'instruction fetch
function constructRequestOptions(pfun, phea, pbod) {
    console.log("Début constructRequest");
    let settingObj = new Object();
    switch (pfun) {
        case ("login"):
            settingObj['method'] = "POST";
            settingObj['headers'] = phea;
            settingObj['body'] = pbod; 
            break;
        case ("delete"):
            settingObj['method'] = "DELETE";
            settingObj['headers'] = phea;
            break;
        case ("add"):
            settingObj['method'] = "POST";
            settingObj['headers'] = phea;
            settingObj['body'] = pbod; 
    };
    displayObject(settingObj);
    return settingObj;
};
// --- enregistrement des infos de login dans la local storage
export function storeResult(plogresult) {
    const locsto = {
        userid: plogresult.userId,
        token: plogresult.token,
        timenow: Date.now()
    }
    const loginfo = JSON.stringify(locsto);
    window.localStorage.setItem("loginfo", loginfo);
};
// --- GET fetch API
// ---  Récupération des données provenant du back-end
export async function getFetch(purl) {
    const response = await fetch(purl);
    const respjson = await response.json();
    return respjson;
};
// --- login fetch API
export async function loginFetch(purl, pcont, pbod, ptoken) {
    console.log("Début loginFetch");
    console.log("url", purl);
    const headersObj = constructHeaders(pcont, ptoken);
    const settingObj = constructRequestOptions("login", headersObj, pbod);
    try {
        const res = await fetch(purl, settingObj);
        console.log("loginFetch res", res.status);
        if (res.ok === false) {
            resp.innerHTML = "Erreur : Email ou mot de passe non valables";
        } else {
            let logresult = await res.json();
            console.log("loginFetch res.json()", logresult);
            storeResult(logresult);
            window.location.href="index.html";
        }
    } catch (error) {
        console.log(error.message);
    };
};
// --- delete fetch API
export async function deleteWork(pworkid, pcont, ptoken) {
    console.log("Début deleteWork");
    const urls = "http://localhost:5678/api/works/" + pworkid;
    const headersObj = constructHeaders(pcont, ptoken);
    const settingObj = constructRequestOptions("delete", headersObj, null);
    try {
        const res = await fetch(urls, settingObj);
        console.log("loginFetch res", res.status);
    } catch (error) {
        console.log(error.message);
    };
};
// --- add projet fetch API
export async function addWork(purl, pcont, pbod, ptoken) {
    console.log("Début addWork");
    const headersObj = constructHeaders(pcont, ptoken);
    const settingObj = constructRequestOptions("add", headersObj, pbod);
    try {
        const res = await fetch(purl, settingObj);
        console.log("addFetch res", res.status);
        if (res.status === 201) {
            console.log("image correctement ajoutée");
            //console.log("addWork response : ",res);
        } else {
            alert(res.status);
            throw new Error(res.status);
        };
    } catch (error) {
        console.log(error.message);
    };
    return false;
};
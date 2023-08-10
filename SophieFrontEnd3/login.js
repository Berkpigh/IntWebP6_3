import {
	loginFetch,
	storeResult
} from "./apifunctions.js";

const logf = document.querySelector(".loginform");
let result = "";

logf.addEventListener("submit", function (event) {
	console.log("début listener");
	event.preventDefault();
	const logbodobj = {
		email: event.target.querySelector("[name=login-email]").value,
		password: event.target.querySelector("[name=login-pwd]").value
	}
	const logbodjson = JSON.stringify(logbodobj);
	console.log("logbodjson : " + logbodjson);
	loginFetch("http://localhost:5678/api/users/login", "json", logbodjson, null);
});

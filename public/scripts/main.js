/**
 * @author 
 * Ryan Nikolic,
 * Keagan Finkenbine
 */

var rhit = rhit || {};

rhit.ClassName = class {
	constructor() {

	}

	methodName() {

	}
}

rhit.main = function () {
	console.log("Ready");
	document.querySelector("#guestButton").onclick = (event) => {
		console.log("Pressed Guest");
	};
	document.querySelector("#loginButton").onclick = (event) => {
		console.log("Pressed Login");
	};
};

rhit.main();

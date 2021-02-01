/**
 * @author 
 * Ryan Nikolic,
 * Keagan Finkenbine
 */

var rhit = rhit || {};

rhit.lawlController = class {
	constructor() {

	}
}

rhit.lawlManager = class {
	constructor() {
		console.log("--Manager created--");
		this._document = [];
		// this._ref =
		this._unsubscribe = null;
	}
}

rhit.buildManager = class {
	constructor() {
		document.querySelector("#homeButton").onclick = (event) => {
			window.location.href = '/';
		};
	}
}

rhit.main = function () {
	console.log("Ready");

	if (document.querySelector("#loginPage")) {
		console.log("--Currently on Login page--");
		new rhit.lawlController();
		new rhit.lawlManager();

		//	GUEST
		document.querySelector("#guestButton").onclick = (event) => {
			firebase.auth().signInAnonymously().catch(function (error) {
				var errorCode = error.code;
				var errorMessage = error.errorMessage;
				console.log("Anonymous auth error", errorCode, errorMessage);
				return;
			});
			window.location.href = `build.html`;
		};

		const inputEmailEl = document.querySelector("#inputEmail");
		const inputPasswordEl = document.querySelector("#inputPassword");
		//	LOGIN	
		document.querySelector("#loginButton").onclick = (event) => {
			document.querySelector("#submitLogin").onclick = (event) => {
				console.log(`Log in to email: ${inputEmailEl.value} password: ${inputPasswordEl.value}`);
				firebase.auth().signInWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch((error) => {
					var errorCode = error.code;
					var errorMessage = error.message;
					console.log("Existing account log in error", errorCode, errorMessage);
				});
				window.location.href = `build.html`;
			};
		};

		//	NEW ACCOUNT
		document.querySelector("#loginButton").onclick = (event) => {
			document.querySelector("#submitNewAccount").onclick = (event) => {
				console.log(`Created account: ${inputEmailEl.value} password: ${inputPasswordEl.value}`);
				firebase.auth().signInWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch((error) => {
					var errorCode = error.code;
					var errorMessage = error.message;
					console.log("Existing account log in error", errorCode, errorMessage);
				});
			};
		};
	}

	if (document.querySelector("#buildPage")) {
		console.log("--Currently on Build page--");
		new rhit.buildManager();
	}

	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			const displayName = user.displayName;
			const email = user.email;
			const isAnonymous = user.isAnonymous;
			const uid = user.uid;

			console.log("The user is signed in ", uid);
			console.log('displayName :>> ', displayName);
			console.log('email :>> ', email);
			console.log('isAnonymous :>> ', isAnonymous);
			console.log('uid :>> ', uid);
		} else {
			console.log("There is no user signed in");
		}

		//	//SIGN OUT
		// document.querySelector("#signOutButton").onclick = (event) => {
		// 	firebase.auth().signOut().then(() => {
		// 		console.log("You are now signed out");
		// 	}).catch((error) => {
		// 		console.log("Sign out errer");
		// 	});
		// };
	});
}

rhit.main();

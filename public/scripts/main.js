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
		this.updateItems();
	}

	updateItems() {
		this.getItems();
	}

	getItems =	function () {
		console.log("setting up xml");
		let endpoint = "http://ddragon.leagueoflegends.com/cdn/11.3.1/data/en_US/item.json";
		let url = endpoint
	 
		let xhr = new XMLHttpRequest();
		xhr.addEventListener("load", this.responseReceivedHandlerItems);
		xhr.responseType = "json";
		xhr.open("GET", url);
		xhr.send();
	}
	 
	responseReceivedHandlerItems = function () {
		console.log("Getting Response");
		if (this.status === 200) {
			console.log("GOT ITEMS");
			rhit.itemsFull = this.response;
			rhit.itemKeys = [];
			for (var obj in this.response.data) {
				rhit.itemKeys.push(obj);
			}
			
			const newList = htmlToElement('<div id="allItemsContainer"></div>');

			console.log(rhit.itemsFull)
			console.log(rhit.itemKeys)
			for (const key of rhit.itemKeys) {
				const item = rhit.itemsFull.data[key]
				let re1 = /trinket/;
				if (!re1.test(item.colloq)&&item.maps[11]) {
					const newItemCard = htmlToElement(`
					<div class = "itemIMGcontainer">
						<div>
							<img class="itemIMG" src="http://ddragon.leagueoflegends.com/cdn/11.2.1/img/item/${item.image.full}" alt="${item.name}"></img>
							<div class="tooltiptext">
								<div class="itemname">${item.name}</div>
								<div class="itemplaintext">${item.plaintext}</div>
								&nbsp
								<div class="itemdescription">${item.description}</div>
							</div>
						</div>
					</div>
					`
					);
					newItemCard.onmouseover = (event) => {
						console.log(`You moused over ${item.name}`)
					}
					newItemCard.onmouseout = (event) => {
						console.log(`You left ${item.name}`)
					}
					newList.appendChild(newItemCard);
				}
			}
			const oldList = document.querySelector("#allItemsContainer");
			oldList.removeAttribute("id");
			oldList.hidden = true;
			// Put in the new quoteListContainer
			oldList.parentElement.insertBefore(newList, document.querySelector("#champContainer"));
		} else {
			rhit.itemsFull = null;
		}
	}
}

rhit.main = function () {
	console.log("Ready");

	if (document.querySelector("#loginPage")) {
		console.log("--Currently on Login page--");
		new rhit.lawlController();
		new rhit.lawlManager();

		//SIGN OUT
		document.querySelector("#signOutButton").onclick = (event) => {
			firebase.auth().signOut().then(() => {
				console.log("You are now signed out");
			}).catch((error) => {
				console.log("Sign out errer");
			});
		};

		//	GUEST
		document.querySelector("#buildPageRedirect").onclick = (event) => {
			redirect()
		};


		function redirect() {
			if(firebase.auth().currentUser) {
				window.location.href = `build.html`;
			} else {
				firebase.auth().signInAnonymously().catch(function (error) {
					var errorCode = error.code;
					var errorMessage = error.errorMessage;
					console.log("Anonymous auth error", errorCode, errorMessage);
					return;
				});
				setTimeout(() => {
					redirect();
				},500);
			}
		};

		//	LOGIN	
		document.querySelector("#loginButton").onclick = (event) => {
			const inputEmailEl = document.querySelector("#inputEmail");
			const inputPasswordEl = document.querySelector("#inputPassword");
			document.querySelector("#submitLogin").onclick = (event) => {
				console.log(`Log in to email: ${inputEmailEl.value} password: ${inputPasswordEl.value}`);
				firebase.auth().signInWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch((error) => {
					var errorCode = error.code;
					var errorMessage = error.message;
					console.log("Existing account log in error", errorCode, errorMessage);
				});
				setTimeout(() => {
					redirect();
				},500);
			};
		};

		// //	NEW ACCOUNT
		// document.querySelector("#loginButton").onclick = (event) => {
		// 	document.querySelector("#submitNewAccount").onclick = (event) => {
		// 		console.log(`Created account: ${inputEmailEl.value} password: ${inputPasswordEl.value}`);
		// 		firebase.auth().signInWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch((error) => {
		// 			var errorCode = error.code;
		// 			var errorMessage = error.message;
		// 			console.log("Existing account log in error", errorCode, errorMessage);
		// 		});
		// 	};
		// };
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
	});

}

rhit.main();

function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}
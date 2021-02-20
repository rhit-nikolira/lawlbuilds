/**
 * @author 
 * Ryan Nikolic,
 * Keagan Finkenbine
 */

var rhit = rhit || {};

let currentChampion = "";
let champsFull = null;
let itemContainerCounter = 1;
rhit.level = 1;

rhit.FB_COLLECTION_ITEMSETS = "ItemSet";
rhit.FB_KEY_AUTHOR = "author";
rhit.FB_KEY_CHAMPION = "champion";
rhit.FB_KEY_ITEMSET = "itemSet";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.fblawlManager = null;
rhit.displayName = null;
rhit.itemSet = rhit.itemSet || [null, null, null, null, null, null, null];
rhit.currentChampion = rhit.currentChampion || null;

myStorage = window.sessionStorage;

rhit.ItemSetManager = class {
	constructor() {
		if(document.querySelector("#buildButton").onclick = (event) => {
			window.location.href = `/build.html`;
		});
		if(document.querySelector("#allItemSets").onclick = (event) => {
			window.location.href = `/itemSets.html`;
		});
		if(document.querySelector("#myItemSets").onclick = (event) => {
			window.location.href = `/itemSets.html?uid=${rhit.displayName}`;
		});
		rhit.fblawlManager.beginListening(this.updateList.bind(this));
	}
	_createCard(savedData) {
		console.log(savedData)
		const html = `
		<div class="card">
			<div class="card-body">
				<div>
					<img class="itemIMG" src="http://ddragon.leagueoflegends.com/cdn/11.2.1/img/item/${savedData.itemArray[1].image.full}" alt="${savedData.itemArray[1].name}">
				</div>
				<div>
					<img class="itemIMG" src="http://ddragon.leagueoflegends.com/cdn/11.2.1/img/item/${savedData.itemArray[2].image.full}" alt="${savedData.itemArray[1].name}">
				</div>
				<div>
					<img class="itemIMG" src="http://ddragon.leagueoflegends.com/cdn/11.2.1/img/item/${savedData.itemArray[3].image.full}" alt="${savedData.itemArray[1].name}">
				</div>
				<div>
					<img class="itemIMG" src="http://ddragon.leagueoflegends.com/cdn/11.2.1/img/item/${savedData.itemArray[4].image.full}" alt="${savedData.itemArray[1].name}">
				</div>
				<div>
					<img class="itemIMG" src="http://ddragon.leagueoflegends.com/cdn/11.2.1/img/item/${savedData.itemArray[5].image.full}" alt="${savedData.itemArray[1].name}">
				</div>
				<div>
					<img class="itemIMG" src="http://ddragon.leagueoflegends.com/cdn/11.2.1/img/item/${savedData.itemArray[6].image.full}" alt="${savedData.itemArray[1].name}">
				</div>
				<div>
				<img src="http://ddragon.leagueoflegends.com/cdn/11.2.1/img/champion/${savedData.champion.image.full}" alt="${savedData.champion.name}" style="width:58%;">
				</div>
				<h5 class="card-subtitle mb-2 text-muted">${savedData.champion.name}</h6>
				</div>
		</div>
		`;



		return htmlToElement(html);
	}

	updateList() {
		const newList = htmlToElement('<div id="cardContainer"></div>');
		for (let i = 0; i < rhit.fblawlManager.length; i++) {
			const savedData = rhit.fblawlManager.getDataAtIndex(i);
			const newCard = this._createCard(savedData);
			newCard.onclick = (event) => {
				rhit.itemSet = savedData.itemArray;
				rhit.currentChampion = savedData.champion;
				myStorage.setItem("itemSet", JSON.stringify(savedData.itemArray));
				myStorage.setItem("champ", JSON.stringify(savedData.champion));
				window.location.href = `/build.html`;
			};
			newList.appendChild(newCard);
		}
		const oldList = document.querySelector("#cardContainer");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}
}

rhit.lawlManager = class {
	constructor(uid) {
		this._uid = uid;
		this._document = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_ITEMSETS);
		this._unsubscribe = null;
	}

	add(itemArray, champion) {
		this._ref.add({
				[rhit.FB_KEY_AUTHOR]: rhit.displayName,
				[rhit.FB_KEY_ITEMSET]: itemArray,
				[rhit.FB_KEY_CHAMPION]: champion,
				[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			})
			.then(function (docRef) {
				console.log("Document written with ID: ", docRef.id);
			})
			.catch(function (error) {
				console.error("Error adding document: ", error);
			});
	}

	beginListening(changeListener) {
		let query = this._ref.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc").limit(50);
		if(this._uid) {
			query = query.where(rhit.FB_KEY_AUTHOR, "==", this._uid);
		}
		this._unsubscribe = query.onSnapshot((querySnapshot) => {
				console.log("MovieQuote update!");
				this._documentSnapshots = querySnapshot.docs;
				changeListener();
			});
		// this._unsubscribe = this._ref
		// 	.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc")
		// 	.limit(50)
		// 	.onSnapshot((querySnapshot) => {
		// 		console.log("MovieQuote update!");
		// 		this._documentSnapshots = querySnapshot.docs;
		// 		// querySnapshot.forEach((doc) => {
		// 		//  console.log(doc.data());
		// 		// });
		// 		changeListener();
		// 	});
	}

	stopListening() {
		this._unsubscribe();
	}

	get length() {
		return this._documentSnapshots.length;
	}

	getDataAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const card = new rhit.savedData(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_AUTHOR),
			docSnapshot.get(rhit.FB_KEY_CHAMPION),
			docSnapshot.get(rhit.FB_KEY_ITEMSET));
		return card;
	}
}

rhit.savedData = class {
	constructor(id, author, champion, itemArray) {
		this.id = id;
		this.author = author;
		this.itemArray = itemArray;
		this.champion = champion;
	}
}

rhit.champSet = class {
	constructor() {

	}
}

rhit.updateChampStats = function () {
	const champ = rhit.currentChampion;
	const items = rhit.itemSet;
	const level = rhit.level
	statgrowth = function (b, g, n) {
		return b + g * (n - 1) * (0.7025 + 0.01758 * (n - 1))
	}
	// console.log(rhit.itemSet);
	// console.log(rhit.currentChampion);

	itemMoveSpeed = 0
	itemMoveSpeedPercent = 1
	itemArmor = 0
	itemArmorPercent = 1
	itemHealth = 0
	itemHealthPercent = 1
	itemHealthRegen = 0
	itemHealthRegenPercent = 1
	itemMagicResist = 0
	itemMagicResistPercent = 1
	itemMana = 0
	itemManaPercent = 1
	itemManaRegen = 0
	itemManaRegenPercent = 1
	itemAttackDamage = 0
	itemAttackDamagePercent = 1
	itemAbilityPower = 0;
	itemAbilityPowerPercent = 1;
	itemCriticalChance = 0
	itemLifesteal = 0;
	itemAbilityHaste = 0;

	bonusHealth = 0
	bonusHealthRegen = 0
	bonusArmor = 0
	bonusMagicResist = 0
	bonusMoveSpeed = 0
	bonusMana = 0
	bonusManaRegen = 0
	bonusAttackDamage = 0
	bonusCriticalChance = 0
	bonusCriticalDamage = 0
	bonusAbilityPower = 0
	bonusAttackRange = 0

	levelHealth = 0
	levelHealthRegen = 0
	levelArmor = 0
	levelMagicResist = 0
	levelMoveSpeed = 0
	levelMana = 0
	levelManaRegen = 0
	levelAttackDamage = 0
	levelCriticalChance = 0
	levelCriticalDamage = 0
	levelAbilityPower = 0
	levelAttackRange = 0

	baseAttackSpeed = 0

	if (champ) {
		bonusHealth += champ.stats.hpperlevel
		bonusHealthRegen += champ.stats.hpregenperlevel
		bonusArmor += champ.stats.armorperlevel
		bonusMagicResist += champ.stats.spellblockperlevel
		bonusMoveSpeed += 0
		bonusMana += champ.stats.mpperlevel
		bonusManaRegen += champ.stats.mpregenperlevel
		bonusAttackDamage += champ.stats.attackdamageperlevel
		bonusCriticalChance += 0
		bonusCriticalDamage += 0
		bonusAbilityPower += 0
		bonusAttackRange += 0

		levelHealth += statgrowth(champ.stats.hp, bonusHealth, level)
		levelHealthRegen += statgrowth(champ.stats.hpregen, bonusHealthRegen, level)
		levelArmor += statgrowth(champ.stats.armor, bonusArmor, level)
		levelMagicResist += statgrowth(champ.stats.spellblock, bonusMagicResist, level)
		levelMoveSpeed += statgrowth(champ.stats.movespeed, bonusMoveSpeed, level)
		levelMana += statgrowth(champ.stats.mp, bonusMana, level)
		levelManaRegen += statgrowth(champ.stats.mpregen, bonusManaRegen, level)
		levelAttackDamage += statgrowth(champ.stats.attackdamage, bonusAttackDamage, level)
		levelCriticalChance += statgrowth(champ.stats.crit, bonusCriticalChance, level)
		levelCriticalDamage += statgrowth(1.75, bonusCriticalDamage, level)
		levelAbilityPower += statgrowth(0, bonusAbilityPower, level)
		levelAttackRange += statgrowth(champ.stats.attackrange, bonusAttackRange, level)

		baseAttackSpeed += champ.stats.attackspeed
	}

	//How the hell do we deal with unique passives? Those aren't represented on the "stats" callout screen
	//No items with %HP
	//Items do not have a HPRegen Stat
	//No items with %MR
	//No items with %MP
	//No items with %AD
	//No items with %AP
	//Items do not have a MPRegen Stat
	//Lifesteal is only a percent while crit is flat?????? ?????? <- WTF IS THIS RIOT
	//Items do not have Ability Haste
	if (items) {
		for (const item of items) {
			if (item) {

				//test for console regex
				// for (const key of rhit.itemKeys) {const item = rhit.itemsFull.data[key]; descriptionList = item.description.split("<br>"); for(const string of descriptionList) {re1 = /Mana Regen/; if (re1.test(string)) {console.log(string);}}}			

				//set some constants
				manaRegen1 = 0
				healthRegen1 = 0
				abilityHaste1 = 0
				//read the item first
				descriptionList = item.description.split("<br>")
				for (const string of descriptionList) {
					re2 = /passive|active|rarityMythic/
					re1 = /Mana Regen/
					if (re1.test(string) && !re2.test(string)) {
						manaRegen1 = string.match(/\d+/g) / 100;
					}
					re1 = /Health Regen/
					if (re1.test(string) && !re2.test(string)) {
						healthRegen1 = string.match(/\d+/g) / 100;
					}
					re1 = /Ability Haste/
					if (re1.test(string) && !re2.test(string)) {
						abilityHaste1 = string.match(/\d+/g) / 1;
					}

				}
				//then add the stats
				itemMoveSpeed += item.stats.FlatMovementSpeedMod || 0;
				itemMoveSpeedPercent += item.stats.PercentMovementSpeedMod || 0;
				itemArmor += item.stats.FlatArmorMod || 0;
				itemArmorPercent += item.stats.PercentMovementSpeedMod || 0;
				itemHealth += item.stats.FlatHPPoolMod || 0;
				itemHealthPercent += item.stats.PercentHPPoolMod || 0;
				//itemHealthRegen += 
				itemHealthRegenPercent += healthRegen1 || 0;
				itemMagicResist += item.stats.FlatSpellBlockMod || 0;
				itemMagicResistPercent += item.stats.PercentSpellBlockMod || 0;
				itemMana += item.stats.FlatMPPoolMod || 0;
				itemManaPercent += item.stats.PercentMPPoolMod || 0;
				itemAttackDamage += item.stats.FlatPhysicalDamageMod || 0;
				itemAttackDamagePercent += item.stats.PercentPhysicalDamageMod || 0;
				itemAbilityPower += item.stats.FlatMagicDamageMod || 0;
				itemAbilityPowerPercent += item.stats.PercentMagicDamageMod || 0;
				//itemManaRegen += 
				itemManaRegenPercent += manaRegen1 || 0
				itemCriticalChance += item.stats.FlatCritChanceMod || 0;
				itemLifesteal += item.stats.PercentLifeStealMod || 0;
				itemAbilityHaste += abilityHaste1 || 0;
			}
		}
	}

	rhit.champ = new rhit.champSet();

	rhit.champ.level = level;
	rhit.champ.health = (levelHealth + itemHealth) * itemHealthPercent
	rhit.champ.healthRegen = (levelHealthRegen + itemHealthRegen) * itemHealthRegenPercent
	rhit.champ.armor = (levelArmor + itemArmor) * itemArmorPercent
	rhit.champ.magicResist = (levelMagicResist + itemMagicResist) * itemMagicResistPercent
	rhit.champ.moveSpeed = (levelMoveSpeed + itemMoveSpeed) * itemMoveSpeedPercent
	rhit.champ.attackDamage = (levelAttackDamage + itemAttackDamage) * itemAttackDamagePercent
	rhit.champ.criticalChance = (levelCriticalChance + itemCriticalChance) * itemMagicResistPercent
	rhit.champ.criticalDamage = levelCriticalDamage
	rhit.champ.abilityPower = (levelAbilityPower + itemAbilityPower) * itemAbilityPowerPercent
	rhit.champ.attackRange = levelAttackRange
	rhit.champ.lifeSteal = itemLifesteal
	rhit.champ.abilityHaste = itemAbilityHaste

	if (champ) {
		if (champ.stats.mpregenperlevel == 0) {
			if (champ.stats.mpregen == 0) {
				console.log("Manaless")
				rhit.champ.mana = "Manaless"
				rhit.champ.manaRegen = "Manaless"
			} else {
				console.log("Energy");
				rhit.champ.mana = levelMana
				rhit.champ.manaRegen = levelManaRegen
			}
		} else {
			console.log("Mana'd");
			rhit.champ.mana = (levelMana + itemMana) * itemManaPercent
			rhit.champ.manaRegen = (levelManaRegen + itemManaRegen) * itemManaRegenPercent
		}
	} else {
		console.log("No Champ");
		rhit.champ.mana = (levelMana + itemMana) * itemManaPercent
		rhit.champ.manaRegen = (levelManaRegen + itemManaRegen) * itemManaRegenPercent
	}

	rhit.champ.attackSpeed = baseAttackSpeed
	// document.querySelector("#LV").innerHTML = rhit.champ.level;
	document.querySelector("#AP").innerHTML = rhit.champ.abilityPower.toFixed(2);
	document.querySelector("#AM").innerHTML = rhit.champ.armor.toFixed(2)
	document.querySelector("#AD").innerHTML = rhit.champ.attackDamage.toFixed(2)
	document.querySelector("#AR").innerHTML = rhit.champ.attackRange.toFixed(2)
	document.querySelector("#AS").innerHTML = rhit.champ.attackSpeed.toFixed(2)
	document.querySelector("#CC").innerHTML = rhit.champ.criticalChance.toFixed(2)
	document.querySelector("#CD").innerHTML = rhit.champ.criticalDamage.toFixed(2)
	document.querySelector("#HP").innerHTML = rhit.champ.health.toFixed(2)
	document.querySelector("#HR").innerHTML = rhit.champ.healthRegen.toFixed(2)
	document.querySelector("#VP").innerHTML = rhit.champ.lifeSteal.toFixed(2)
	document.querySelector("#MM").innerHTML = rhit.champ.magicResist.toFixed(2)
	document.querySelector("#MP").innerHTML = rhit.champ.mana.toFixed(2)
	document.querySelector("#MR").innerHTML = rhit.champ.manaRegen.toFixed(2)
	document.querySelector("#MS").innerHTML = rhit.champ.moveSpeed.toFixed(2)
	document.querySelector("#AH").innerHTML = rhit.champ.abilityHaste





	// console.log(rhit.champ);
}

rhit.buildManager = class {
	constructor() {
		document.querySelector("#homeButton").onclick = (event) => {
			window.location.href = '/';
		};
		document.querySelector("#selectButton").onclick = (event) => {
			this.updateChamps();
		};
		document.querySelector("#levelDropdown").addEventListener("change", function () {
			rhit.level = document.querySelector("#levelDropdown").value;
			console.log(rhit.level);
			rhit.updateChampStats();
		});

		document.querySelector("#saveButton").onclick = (event) => {
			rhit.fblawlManager.add(rhit.itemSet, rhit.currentChampion);
		};
		document.querySelector("#itemSetButton").onclick = (event) => {
			window.location.href = `itemSets.html`;
		};

		if (JSON.parse(myStorage.getItem("itemSet"))) {
			rhit.itemSet = JSON.parse(myStorage.getItem("itemSet"));
			for (let itemContainerCounter = 1; itemContainerCounter < 7; itemContainerCounter++) {
				if (rhit.itemSet[itemContainerCounter]) {
					if (!document.querySelector(`#grid-item-${itemContainerCounter}`).hasChildNodes()) {
						// console.log(`${itemContainerCounter} HAS NO CHILD`);
						const item = rhit.itemSet[itemContainerCounter]
						const newInvItem = htmlToElement(`
								<div class = "itemIMGcontainer">
									<div>
										<img class="itemIMG" src="http://ddragon.leagueoflegends.com/cdn/11.2.1/img/item/${item.image.full}" alt="${item.name}">
										<div class="tooltiptext">
											<div class="itemname">${item.name}</div>
											<div class="itemplaintext">${item.plaintext}</div>
											&nbsp
											<div class="itemdescription">${item.description}</div>
										</div>
									</div>
								</div>
								`);
						newInvItem.onclick = (event) => {
							rhit.itemSet[itemContainerCounter] = null;
							rhit.updateChampStats();
							document.querySelector(`#grid-item-${itemContainerCounter}`).innerHTML = ``;
						}
						document.querySelector(`#grid-item-${itemContainerCounter}`).appendChild(newInvItem);
					}


				}
			}
		}

		if (JSON.parse(myStorage.getItem("champ"))) {
			rhit.currentChampion = JSON.parse(myStorage.getItem("champ"));
			console.log("This is the champ!", rhit.currentChampion);
			document.querySelector("#championImage").innerHTML = `<img src="http://ddragon.leagueoflegends.com/cdn/11.2.1/img/champion/${rhit.currentChampion.image.full}" alt="${rhit.currentChampion.name}" style="width:58%;">`;
		}
		myStorage.clear();
		this.updateItems();
		rhit.updateChampStats();
	}

	updateChamps() {
		this.getChamps();
	}

	updateItems() {
		this.getItems();
	}

	getItems = function () {
		// console.log("setting up xml");
		let endpoint = "http://ddragon.leagueoflegends.com/cdn/11.3.1/data/en_US/item.json";
		let url = endpoint

		let xhr = new XMLHttpRequest();
		xhr.addEventListener("load", this.responseReceivedHandlerItems);
		xhr.responseType = "json";
		xhr.open("GET", url);
		xhr.send();
	}

	getChamps = function () {
		// console.log("setting up xml");
		// let endpoint = "http://jsonviewer.stack.hu/#http://ddragon.leagueoflegends.com/cdn/11.3.1/data/en_US/champion.json";
		let endpoint = "http://ddragon.leagueoflegends.com/cdn/11.3.1/data/en_US/champion.json";
		let url = endpoint

		let xhr = new XMLHttpRequest();
		xhr.addEventListener("load", this.responseReceivedHandlerChamps);
		xhr.responseType = "json";
		xhr.open("GET", url);
		xhr.send();
	}

	responseReceivedHandlerItems = function () {
		// console.log("Getting Response");
		if (this.status === 200) {
			// console.log("GOT ITEMS");
			rhit.itemsFull = this.response;
			rhit.itemKeys = [];
			for (var obj in this.response.data) {
				rhit.itemKeys.push(obj);
			}

			const newList = htmlToElement('');

			// console.log(rhit.itemsFull)
			// console.log(rhit.itemKeys)
			for (const key of rhit.itemKeys) {
				const item = rhit.itemsFull.data[key]
				let re1 = /trinket/;
				let re2 = /Elixir/
				//Map 11: Summoners Rift
				//Map 12: ARAM
				//Map 21: TT
				//Map 22: ???
				if (!re1.test(item.colloq) && item.maps[11] && !re2.test(item.name)) {
					const newItemCard = htmlToElement(`
					<div class = "itemIMGcontainer">
						<div>
							<img class="itemIMG" src="http://ddragon.leagueoflegends.com/cdn/11.2.1/img/item/${item.image.full}" alt="${item.name}">
							<div class="tooltiptext">
								<div class="itemname">${item.name}</div>
								<div class="itemplaintext">${item.plaintext}</div>
								&nbsp
								<div class="itemdescription">${item.description}</div>
							</div>
						</div>
					</div>
					`);
					newItemCard.onclick = (event) => {
						for (let itemContainerCounter = 1; itemContainerCounter < 7; itemContainerCounter++) {
							if (!document.querySelector(`#grid-item-${itemContainerCounter}`).hasChildNodes()) {
								// console.log(`${itemContainerCounter} HAS NO CHILD`);
								rhit.itemSet[itemContainerCounter] = item
								const newInvItem = htmlToElement(`
								<div class = "itemIMGcontainer">
									<div>
										<img class="itemIMG" src="http://ddragon.leagueoflegends.com/cdn/11.2.1/img/item/${item.image.full}" alt="${item.name}">
										<div class="tooltiptext">
											<div class="itemname">${item.name}</div>
											<div class="itemplaintext">${item.plaintext}</div>
											&nbsp
											<div class="itemdescription">${item.description}</div>
										</div>
									</div>
								</div>
								`);
								newInvItem.onclick = (event) => {
									rhit.itemSet[itemContainerCounter] = null;
									rhit.updateChampStats();
									document.querySelector(`#grid-item-${itemContainerCounter}`).innerHTML = ``;
								}
								rhit.updateChampStats();
								document.querySelector(`#grid-item-${itemContainerCounter}`).appendChild(newInvItem);
								return;
							}
						}
					}
					document.querySelector("#allItemsContainer").appendChild(newItemCard);
				}
			}
		}
	}

	responseReceivedHandlerChamps = function () {
		if (rhit.champsFull == null) {
			// console.log("Getting Response");
			if (this.status === 200) {
				// console.log("GOT Champs");
				rhit.champsFull = this.response;
				rhit.champKeys = [];
				for (var obj in this.response.data) {
					rhit.champKeys.push(obj);
				}

				const newList = htmlToElement('');

				// console.log(rhit.champsFull)
				// console.log(rhit.champKeys)
				for (const key of rhit.champKeys) {
					const champ = rhit.champsFull.data[key]
					const newChampCard = htmlToElement(`
					<div class ="grid-container">
						<div class="grid-item">
							<img src="http://ddragon.leagueoflegends.com/cdn/11.2.1/img/champion/${champ.image.full}" alt="${champ.name}">
						</div>
					</div>
					`);
					newChampCard.onclick = (event) => {
						rhit.currentChampion = champ;
						rhit.updateChampStats();
						document.querySelector("#selectButton").innerHTML = `<img src="http://ddragon.leagueoflegends.com/cdn/11.2.1/img/champion/${champ.image.full}" alt="${champ.name}" style="width:58%;">`;
						// console.log("close modal");
						setTimeout(() => {
							$('#championModal').modal('hide');
						}, 200);
					}
					document.getElementById("allChampionContainer").appendChild(newChampCard);
				}
			}
		}
	}
}

rhit.main = function () {
	if (document.querySelector("#loginPage")) {
		// console.log("--Currently on Login page--");
		// new rhit.lawlController();

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
			if (firebase.auth().currentUser) {
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
				}, 500);
			}
		};

		document.querySelector("#loginButton").onclick = (event) => {
			//	LOGIN	
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
				}, 500);
			};
			// Register
			document.querySelector("#registerTab").onclick = (event) => {
				const registerEmail = document.querySelector("#inputRegisterEmail");
				const registerPassword = document.querySelector("#inputRegisterPassword");
				const repeatPassword = document.querySelector("#inputRepeatPassword");
				document.querySelector("#submitRegisterAccount").onclick = (event) => {
					if (registerPassword == repeatPassword) {
						console.log(`Registered email: ${registerEmail.value} password: ${registerPassword.value}`);
						firebase.auth().createUserWithEmailAndPassword(registerEmail.value, registerPassword.value).catch((error) => {
							var errorCode = error.code;
							var errorMessage = error.message;
							console.log("Registering account error", errorCode, errorMessage);
						});
					}
					console.log(`Created account: ${inputEmailEl.value} password: ${inputPasswordEl.value}`);
					setTimeout(() => {
						redirect();
					}, 500);
				};
			};
		};
	}

	if (document.querySelector("#buildPage")) {
		console.log("--Currently on Build page--");
		new rhit.buildManager();
		rhit.fblawlManager = new rhit.lawlManager(rhit.displayName);
	}

	if (document.querySelector("#itemSetPage")) {
		console.log("--Currently on Item Set Page--");
		const urlParams = new URLSearchParams(window.location.search);
		const uid = urlParams.get("uid");
		console.log(uid);

		rhit.fblawlManager = new rhit.lawlManager(uid);
		rhit.fbItemSetManager = new rhit.ItemSetManager();
	}

	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			const displayName = user.displayName;
			const email = user.email;
			const isAnonymous = user.isAnonymous;
			const uid = user.uid;
			rhit.displayName = uid;

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
/**
 * @author 
 * Ryan Nikolic,
 * Keagan Finkenbine
 */

var rhit = rhit || {};
let currentChampion = "";
let champsFull = null;
let itemContainerCounter = 1;

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

rhit.champSet = class {
	constructor() {

	}
}

rhit.updateChampStats = function () {
	const champ = rhit.currentChampion;
	const items = rhit.itemSet;
	const level = 2
	statgrowth = function (b,g,n) {
		return b + g*(n-1)*(0.7025 + 0.01758*(n-1))
	}
	console.log(rhit.itemSet);
	console.log(rhit.currentChampion);

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
	levelMoveSpeed= 0
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
		levelHealthRegen += statgrowth(champ.stats.hpregen, bonusHealthRegen,level)
		levelArmor += statgrowth(champ.stats.armor, bonusArmor,level)
		levelMagicResist += statgrowth(champ.stats.spellblock, bonusMagicResist,level)
		levelMoveSpeed += statgrowth(champ.stats.movespeed, bonusMoveSpeed,level)
		levelMana += statgrowth(champ.stats.mp, bonusMana,level)
		levelManaRegen += statgrowth(champ.stats.mpregen, bonusManaRegen,level)
		levelAttackDamage += statgrowth(champ.stats.attackdamage, bonusAttackDamage,level)
		levelCriticalChance += statgrowth(champ.stats.crit, bonusCriticalChance,level)
		levelCriticalDamage += statgrowth(1.75, bonusCriticalDamage,level)
		levelAbilityPower += statgrowth(0, bonusAbilityPower,level)
		levelAttackRange += statgrowth(champ.stats.attackrange, bonusAttackRange,level)

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

	for (const item of items) {
		console.log(item);
		if (item) {
			itemMoveSpeed += item.stats.FlatMovementSpeedMod || 0;
			itemMoveSpeedPercent += item.stats.PercentMovementSpeedMod || 0;
			itemArmor += item.stats.FlatArmorMod || 0;
			itemArmorPercent += item.stats.PercentMovementSpeedMod || 0;
			itemHealth += item.stats.FlatHPPoolMod || 0;
			itemHealthPercent += item.stats.PercentHPPoolMod || 0;
			//itemHealthRegen += 
			//itemHealthRegenPercent +=
			itemMagicResist += item.stats.FlatSpellBlockMod || 0;
			itemMagicResistPercent += item.stats.PercentSpellBlockMod || 0;
			itemMana += item.stats.FlatMPPoolMod || 0;
			itemManaPercent += item.stats.PercentMPPoolMod || 0;
			itemAttackDamage += item.stats.FlatPhysicalDamageMod || 0;
			itemAttackDamagePercent += item.stats.PercentPhysicalDamageMod || 0;
			itemAbilityPower += item.stats.FlatMagicDamageMod || 0;
			itemAbilityPowerPercent += item.stats.PercentMagicDamageMod || 0;
			//itemManaRegen += 
			//itemManaRegenPercent +=  
			itemCriticalChance += item.stats.FlatCritChanceMod || 0;
			itemLifesteal += item.stats.PercentLifeStealMod || 0;
			//itemAbilityHaste += 
		}
	}

	rhit.champ = new rhit.champSet();

	rhit.champ.level = level;
	rhit.champ.health = 			(levelHealth + itemHealth)*itemHealthPercent
	rhit.champ.healthRegen = 		(levelHealthRegen + itemHealthRegen)*itemHealthRegenPercent
	rhit.champ.armor = 				(levelArmor + itemArmor)*itemArmorPercent
	rhit.champ.magicResist = 		(levelMagicResist + itemMagicResist)*itemMagicResistPercent
	rhit.champ.moveSpeed = 			(levelMoveSpeed + itemMoveSpeed)*itemMoveSpeedPercent
	
	if(champ) {
		if(champ.stats.mpregenperlevel == 0) {
			if (champ.stats.mpregen == 0) {
				rhit.champ.mana = 		"Manaless"
				rhit.champ.manaRegen = 	"Manaless"
			} else {
				rhit.champ.mana = 		levelMana
				rhit.champ.manaRegen = 	levelManaRegen
			}
		} else {
			rhit.champ.mana = 			(levelMana+itemMana)*itemManaPercent
			rhit.champ.manaRegen = 		(levelManaRegen+itemManaRegen)*itemManaRegenPercent
		}
	} else {
		rhit.champ.mana = 			(levelMana+itemMana)*itemManaPercent
		rhit.champ.manaRegen = 		(levelManaRegen+itemManaRegen)*itemManaRegenPercent
	}
	rhit.champ.attackDamage = 		(levelAttackDamage+itemAttackDamage)*itemAttackDamagePercent
	rhit.champ.criticalChance = 	(levelCriticalChance+itemCriticalChance)*itemMagicResistPercent
	rhit.champ.criticalDamage = 	levelCriticalDamage
	rhit.champ.abilityPower = 		(levelAbilityPower+itemAbilityPower)*itemAbilityPowerPercent
	rhit.champ.attackRange = 		levelAttackRange
	rhit.champ.lifeSteal = 			itemLifesteal	
	rhit.champ.abilityHaste = 		itemAbilityHaste
	
	rhit.champ.attackSpeed = 		baseAttackSpeed
	console.log(document.querySelector("#LV"));
	document.querySelector("#LV").innerHTML=rhit.champ.level.toFixed(0);
	document.querySelector("#AP").innerHTML=rhit.champ.abilityPower.toFixed(2);
	document.querySelector("#AM").innerHTML=rhit.champ.armor.toFixed(2)
	document.querySelector("#AD").innerHTML=rhit.champ.attackDamage.toFixed(2)
	document.querySelector("#AR").innerHTML=rhit.champ.attackRange.toFixed(2)
	document.querySelector("#AS").innerHTML=rhit.champ.attackSpeed.toFixed(2)
	document.querySelector("#CC").innerHTML=rhit.champ.criticalChance.toFixed(2)
	document.querySelector("#CD").innerHTML=rhit.champ.criticalDamage.toFixed(2)
	document.querySelector("#HP").innerHTML=rhit.champ.health.toFixed(2)
	document.querySelector("#HR").innerHTML=rhit.champ.healthRegen.toFixed(2)
	document.querySelector("#VP").innerHTML=rhit.champ.lifeSteal.toFixed(2)
	document.querySelector("#MM").innerHTML=rhit.champ.magicResist.toFixed(2)
	document.querySelector("#MP").innerHTML=rhit.champ.mana.toFixed(2)
	document.querySelector("#MR").innerHTML=rhit.champ.manaRegen.toFixed(2)
	document.querySelector("#MS").innerHTML=rhit.champ.moveSpeed.toFixed(2)
	document.querySelector("#AH").innerHTML=rhit.champ.abilityHaste.toFixed(2)





	console.log(rhit.champ);
}

rhit.buildManager = class {
	constructor() {
		document.querySelector("#homeButton").onclick = (event) => {
			window.location.href = '/';
		};
		document.querySelector("#backButton").onclick = (event) => {
			window.location.href = '/';
		};
		document.querySelector("#selectButton").onclick = (event) => {
			this.updateChamps();
		};
		this.updateItems();
	}

	updateChamps() {
		this.getChamps();
	}

	updateItems() {
		this.getItems();
	}

	getItems = function () {
		console.log("setting up xml");
		let endpoint = "http://ddragon.leagueoflegends.com/cdn/11.3.1/data/en_US/item.json";
		let url = endpoint

		let xhr = new XMLHttpRequest();
		xhr.addEventListener("load", this.responseReceivedHandlerItems);
		xhr.responseType = "json";
		xhr.open("GET", url);
		xhr.send();
	}

	getChamps = function () {
		console.log("setting up xml");
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
		console.log("Getting Response");
		if (this.status === 200) {
			console.log("GOT ITEMS");
			rhit.itemsFull = this.response;
			rhit.itemKeys = [];
			for (var obj in this.response.data) {
				rhit.itemKeys.push(obj);
			}

			const newList = htmlToElement('');

			console.log(rhit.itemsFull)
			console.log(rhit.itemKeys)
			for (const key of rhit.itemKeys) {
				const item = rhit.itemsFull.data[key]
				let re1 = /trinket/;
				//Map 11: Summoners Rift
				//Map 12: ARAM
				//Map 21: TT
				//Map 22: ???
				if (!re1.test(item.colloq) && item.maps[11]) {
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
					rhit.itemSet = []
					newItemCard.onclick = (event) => {
						for (let itemContainerCounter = 1; itemContainerCounter < 7; itemContainerCounter++) {
							if (!document.querySelector(`#grid-item-${itemContainerCounter}`).hasChildNodes()) {
								console.log(`${itemContainerCounter} HAS NO CHILD`);
								rhit.itemSet[itemContainerCounter] = item
								const newInvItem = htmlToElement(`<img src="http://ddragon.leagueoflegends.com/cdn/11.2.1/img/item/${item.image.full}" alt="${item.name}"></img>`);
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
			// 	const oldList = document.querySelector("#allItemsContainer");
			// 	oldList.removeAttribute("id");
			// 	oldList.hidden = true;
			// 	// Put in the new quoteListContainer
			// 	oldList.parentElement.insertBefore(newList, document.querySelector("#champContainer"));
			// } else {
			// 	rhit.itemsFull = null;
			// }
		}
	}

	responseReceivedHandlerChamps = function () {
		if (rhit.champsFull == null) {
			console.log("Getting Response");
			if (this.status === 200) {
				console.log("GOT Champs");
				rhit.champsFull = this.response;
				rhit.champKeys = [];
				for (var obj in this.response.data) {
					rhit.champKeys.push(obj);
				}

				const newList = htmlToElement('');

				console.log(rhit.champsFull)
				console.log(rhit.champKeys)
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
						document.querySelector("#championImage").innerHTML = `<img src="http://ddragon.leagueoflegends.com/cdn/11.2.1/img/champion/${champ.image.full}" alt="${champ.name}" style="width:58%;">`;
						console.log("close modal");
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
$("#p2 .ability").bind("keyup change", function () {
	autosetWeather($(this).val(), 1);
	autosetTerrain($(this).val(), 1);
});

$("#p2 .item").bind("keyup change", function () {
	autosetStatus("#p2", $(this).val());
});

lastManualStatus["#p2"] = "Healthy";
lastAutoStatus["#p1"] = "Healthy";

var resultLocations = [[], []];
for (var i = 0; i < 4; i++) {
	resultLocations[0].push({
		"move": "#resultMoveL" + (i + 1),
		"damage": "#resultDamageL" + (i + 1)
	});
	resultLocations[1].push({
		"move": "#resultMoveR" + (i + 1),
		"damage": "#resultDamageR" + (i + 1)
	});
}

var damageResults;
function performCalculations() {
	var p1info = $("#p1");
	var p2info = $("#p2");
	var p1 = createPokemon(p1info);
	var p2 = createPokemon(p2info);
	var p1field = createField();
	var p2field = p1field.clone().swap();

	damageResults = calculateAllMoves(gen, p1, p1field, p2, p2field);
	p1 = damageResults[0][0].attacker;
	p2 = damageResults[1][0].attacker;
	var battling = [p1, p2];
	p1.maxDamages = [];
	p2.maxDamages = [];
	p1info.find(".sp .totalMod").text(p1.stats.spe);
	p2info.find(".sp .totalMod").text(p2.stats.spe);
	var fastestSide = p1.stats.spe > p2.stats.spe ? 0 : p1.stats.spe === p2.stats.spe ? "tie" : 1;

	var result, maxDamage;
	var bestResult;
	var zProtectAlerted = false;
	for (var i = 0; i < 4; i++) {
		// P1
		result = damageResults[0][i];
		maxDamage = result.range()[1] * p1.moves[i].hits;
		if (!zProtectAlerted && maxDamage > 0 && p1.item.indexOf(" Z") === -1 && p1field.defenderSide.isProtected && p1.moves[i].isZ) {
			alert('Although only possible while hacking, Z-Moves fully damage through protect without a Z-Crystal');
			zProtectAlerted = true;
		}
		p1.maxDamages.push({moveOrder: i, maxDamage: maxDamage});
		p1.maxDamages.sort(function (firstMove, secondMove) {
			return secondMove.maxDamage - firstMove.maxDamage;
		});
		$(resultLocations[0][i].move + " + label").text(p1.moves[i].name.replace("Hidden Power", "HP"));
		$(resultLocations[0][i].damage).text(result.moveDesc(notation));

		// P2
		result = damageResults[1][i];
		maxDamage = result.range()[1] * p2.moves[i].hits;
		if (!zProtectAlerted && maxDamage > 0 && p2.item.indexOf(" Z") === -1 && p2field.defenderSide.isProtected && p2.moves[i].isZ) {
			alert('Although only possible while hacking, Z-Moves fully damage through protect without a Z-Crystal');
			zProtectAlerted = true;
		}
		p2.maxDamages.push({moveOrder: i, maxDamage: maxDamage});
		p2.maxDamages.sort(function (firstMove, secondMove) {
			return secondMove.maxDamage - firstMove.maxDamage;
		});
		$(resultLocations[1][i].move + " + label").text(p2.moves[i].name.replace("Hidden Power", "HP"));
		$(resultLocations[1][i].damage).text(result.moveDesc(notation));

		// BOTH
		var bestMove;
		if (fastestSide === "tie") {
			// Technically the order should be random in a speed tie, but this non-determinism makes manual testing more difficult.
			// battling.sort(function () { return 0.5 - Math.random(); });
			bestMove = battling[0].maxDamages[0].moveOrder;
			var chosenPokemon = battling[0] === p1 ? "0" : "1";
			bestResult = $(resultLocations[chosenPokemon][bestMove].move);
		} else {
			bestMove = battling[fastestSide].maxDamages[0].moveOrder;
			bestResult = $(resultLocations[fastestSide][bestMove].move);
		}
	}
	if ($('.locked-move').length) {
		bestResult = $('.locked-move');
	} else {
		stickyMoves.setSelectedMove(bestResult.prop("id"));
	}
	var isHack = window.location.pathname.includes("hacks.html");
	var params = new URLSearchParams(window.location.search);
	var game = parseInt(params.get("game") || "0");
	if (isHack && [1].includes(game)) {
		predictMidTurnSwitch(p1, p2);
		predictSwitchOrder();
	}
	bestResult.prop("checked", true);
	bestResult.change();
	$("#resultHeaderL").text(p1.name + "'s Moves (select one to show detailed results)");
	$("#resultHeaderR").text(p2.name + "'s Moves (select one to show detailed results)");
}

function calculationsColors(p1info, p2, advanced) {
	if (!p2) {
		var p2info = $("#p2");
		var p2 = createPokemon(p2info);
	}
	var p2info = $("#p2");
	var p1 = createPokemon(p1info);
	var p1field = createField();
	var p2field = p1field.clone().swap();

	damageResults = calculateAllMoves(gen, p1, p1field, p2, p2field);
	p1 = damageResults[0][0].attacker;
	p2 = damageResults[1][0].attacker;
	p1.maxDamages = [];
	p2.maxDamages = [];
	var p1s = p1.stats.spe;
	var p2s = p2.stats.spe;
	var fastest = p1s > p2s ? "F" : p1s < p2s ? "S" : p1s === p2s ? "T" : undefined;
	var result, highestRoll, lowestRoll, damage = 0;
	//goes from the most optimist to the least optimist
	var p1KO = 0, p2KO = 0;
	//Highest damage
	var p1HD = 0, p2HD = 0;
	for (var i = 0; i < 4; i++) {
		// P1
		result = damageResults[0][i];
		//lowest rolls in %
		damage = result.damage[0] ? result.damage[0] : result.damage;
		lowestRoll = damage * p1.moves[i].hits / p2.stats.hp * 100;
		damage = result.damage[15] ? result.damage[15] : result.damage;
		highestRoll = damage * p1.moves[i].hits / p2.stats.hp * 100;
		if (highestRoll > p1HD) {
			p1HD = highestRoll;
		}
		if (lowestRoll >= 100) {
			p1KO = 1;
		} else { //if lowest kill obviously highest will
			//highest rolls in %
			if (highestRoll >= 100) {
				if (p1KO == 0) {
					p1KO = 2;
				}
			}
		}

		// P2
		result = damageResults[1][i];
		//some damage like sonic boom acts a bit weird.
		damage = result.damage[0] ? result.damage[0] : result.damage;
		lowestRoll = damage * p2.moves[i].hits / p1.stats.hp * 100;
		damage = result.damage[15] ? result.damage[15] : result.damage;
		highestRoll = damage * p2.moves[i].hits / p1.stats.hp * 100;
		if (highestRoll > p2HD) {
			p2HD = highestRoll;
		}
		if (lowestRoll >= 100) {
			p2KO = 4;
		} else {
			if (highestRoll >= 100) {
				if (p2KO < 3) {
					p2KO = 3;
				}
			}
		}
	}
	// Checks if the pokemon walls it
	// i wouldn't mind change this algo for a smarter one.

	// if the adversary don't three shots our pokemon
	if (advanced && Math.round(p2HD * 3) < 100) {
		// And if our pokemon does more damage
		if (p1HD > p2HD) {
			if (p1HD > 100) {
				// Then i consider it a wall that may OHKO
				return {speed: fastest, code: "WMO"};
			}
			// if not Then i consider it a good wall
			return {speed: fastest, code: "W"};
		}
	}
	p1KO = p1KO > 0 ? p1KO.toString() : "";
	p2KO = p2KO > 0 ? p2KO.toString() : "";
	return {speed: fastest, code: p1KO + p2KO};
}

function predictMidTurnSwitch(p1, p2) {
	var slower = p1.stats.spe < p2.stats.spe;
	$(resultLocations[0][0]["move"]).removeClass("switch-risk");
	$(resultLocations[0][1]["move"]).removeClass("switch-risk");
	$(resultLocations[0][2]["move"]).removeClass("switch-risk");
	$(resultLocations[0][3]["move"]).removeClass("switch-risk");
	$(".trainer-poke.right-side").removeClass("switch-risk-mon");
	if (slower) {
		var partySpecies = partyOrder[window.CURRENT_TRAINER];
		for (var i in p1.moves) {
			var move = p1.moves[i];
			if (move.category == "Status") continue;
			if (!(calc.calculate(GENERATION, p1, p2, move, createField())).damage) continue;
			for (var j in partySpecies) {
				var enemy = partySpecies[j];
				if (p2.name == enemy) continue;
				var dexMon = pokedex[partySpecies[j]];
				var typeEffectiveness1 = GENERATION.types.get(toID(move.type)).effectiveness[dexMon.types[0]];
				var typeEffectiveness2 = GENERATION.types.get(toID(move.type)).effectiveness[dexMon.types[1]];
				var typeEffectiveness = typeEffectiveness2 !== undefined ? typeEffectiveness1 * typeEffectiveness2 : typeEffectiveness1;
				if (typeEffectiveness < 1) {
					var enemyMoves = setdex[enemy][window.CURRENT_TRAINER].moves;
					for (var k in enemyMoves) {
						var enemyMove = new calc.Move(GENERATION, enemyMoves[k]);
						if (enemyMove.category == "Status") continue;
						var typeEffectiveness1 = GENERATION.types.get(toID(enemyMove.type)).effectiveness[p1.types[0]];
						var typeEffectiveness2 = GENERATION.types.get(toID(enemyMove.type)).effectiveness[p1.types[1]];
						var typeEffectiveness = typeEffectiveness2 !== undefined ? typeEffectiveness1 * typeEffectiveness2 : typeEffectiveness1;
						if (typeEffectiveness > 1) {
							$(resultLocations[0][i]["move"]).addClass("switch-risk");
							$(".trainer-poke.right-side").each(function(index, e) {
								if (index == j) $(this).addClass("switch-risk-mon");
							});
						}
					}
				}
			}
		}
	}
}

var phase1TypeMatchups = {
    "Normal-Rock": 0.5,
    "Normal-Steel": 0.5,
    "Fire-Fire": 0.5,
    "Fire-Water": 0.5,
    "Fire-Grass": 2.0,
    "Fire-Ice": 2.0,
    "Fire-Bug": 2.0,
    "Fire-Rock": 0.5,
    "Fire-Dragon": 0.5,
    "Fire-Steel": 2.0,
    "Water-Fire": 2.0,
    "Water-Water": 0.5,
    "Water-Grass": 0.5,
    "Water-Ground": 2.0,
    "Water-Rock": 2.0,
    "Water-Dragon": 0.5,
    "Electric-Water": 2.0,
    "Electric-Electric": 0.5,
    "Electric-Grass": 0.5,
    "Electric-Ground": 0.0,
    "Electric-Flying": 2.0,
    "Electric-Dragon": 0.5,
    "Grass-Fire": 0.5,
    "Grass-Water": 2.0,
    "Grass-Grass": 0.5,
    "Grass-Poison": 0.5,
    "Grass-Ground": 2.0,
    "Grass-Flying": 0.5,
    "Grass-Bug": 0.5,
    "Grass-Rock": 2.0,
    "Grass-Dragon": 0.5,
    "Grass-Steel": 0.5,
    "Ice-Water": 0.5,
    "Ice-Grass": 2.0,
    "Ice-Ice": 0.5,
    "Ice-Ground": 2.0,
    "Ice-Flying": 2.0,
    "Ice-Dragon": 2.0,
    "Ice-Steel": 0.5,
    "Ice-Fire": 0.5,
    "Fighting-Normal": 2.0,
    "Fighting-Ice": 2.0,
    "Fighting-Poison": 0.5,
    "Fighting-Flying": 0.5,
    "Fighting-Psychic": 0.5,
    "Fighting-Bug": 0.5,
    "Fighting-Rock": 2.0,
    "Fighting-Dark": 2.0,
    "Fighting-Steel": 2.0,
    "Poison-Grass": 2.0,
    "Poison-Poison": 0.5,
    "Poison-Ground": 0.5,
    "Poison-Rock": 0.5,
    "Poison-Ghost": 0.5,
    "Poison-Steel": 0.0,
    "Ground-Fire": 2.0,
    "Ground-Electric": 2.0,
    "Ground-Grass": 0.5,
    "Ground-Poison": 2.0,
    "Ground-Flying": 0.0,
    "Ground-Bug": 0.5,
    "Ground-Rock": 2.0,
    "Ground-Steel": 2.0,
    "Flying-Electric": 0.5,
    "Flying-Grass": 2.0,
    "Flying-Fighting": 2.0,
    "Flying-Bug": 2.0,
    "Flying-Rock": 0.5,
    "Flying-Steel": 0.5,
    "Psychic-Fighting": 2.0,
    "Psychic-Poison": 2.0,
    "Psychic-Psychic": 0.5,
    "Psychic-Dark": 0.0,
    "Psychic-Steel": 0.5,
    "Bug-Fire": 0.5,
    "Bug-Grass": 2.0,
    "Bug-Fighting": 0.5,
    "Bug-Poison": 0.5,
    "Bug-Flying": 0.5,
    "Bug-Psychic": 2.0,
    "Bug-Ghost": 0.5,
    "Bug-Dark": 2.0,
    "Bug-Steel": 0.5,
    "Rock-Fire": 2.0,
    "Rock-Ice": 2.0,
    "Rock-Fighting": 0.5,
    "Rock-Ground": 0.5,
    "Rock-Flying": 2.0,
    "Rock-Bug": 2.0,
    "Rock-Steel": 0.5,
    "Ghost-Normal": 0.0,
    "Ghost-Psychic": 2.0,
    "Ghost-Dark": 0.5,
    "Ghost-Steel": 0.5,
    "Ghost-Ghost": 2.0,
    "Dragon-Dragon": 2.0,
    "Dragon-Steel": 0.5,
    "Dark-Fighting": 0.5,
    "Dark-Psychic": 2.0,
    "Dark-Ghost": 2.0,
    "Dark-Dark": 0.5,
    "Dark-Steel": 0.5,
    "Steel-Fire": 0.5,
    "Steel-Water": 0.5,
    "Steel-Electric": 0.5,
    "Steel-Ice": 2.0,
    "Steel-Rock": 2.0,
    "Steel-Steel": 0.5,
    "Normal-Ghost": 0.0,
    "Fighting-Ghost": 0.0
};

function predictSwitchOrder() {
	var advanced = $("#advanced-bait").is(":checked");
	var p1 = createPokemon($("#p1"));
	var partySpecies = partyOrder[window.CURRENT_TRAINER];
	var partyMons = [];
	for (var i in partySpecies) {
		partyMons.push(setdex[partySpecies[i]][window.CURRENT_TRAINER]);
		try {
			partyMons[i].species = partySpecies[i];
		} catch (ex) {
			$(".trainer-poke-switch-list").html("An error has occured.");
			return;
		}
	}
	var deadList = [];
	for (var i in partyMons) {
		var dead = partyMons[i];
		if ($(`.trainer-poke-switch[data-id='${dead.species} (${window.CURRENT_TRAINER})']`).hasClass("dead")) {
			$(`.trainer-poke-switch-explain[data-id='${dead.species} (${window.CURRENT_TRAINER})']`).html("Dead!");
			deadList.push(dead);
		} else {
			$(`.trainer-poke-switch-explain[data-id='${dead.species} (${window.CURRENT_TRAINER})']`).html("That's it!");
		}
	}
	for (var i in partyMons) {
		var dead = partyMons[i];
		if (deadList.includes(dead)) {
			continue;
		}
		var defender = p1.clone();
		var nextMon = "";
		var phase = 1;

		// Phase 1 => Best super effective move typing, worst pokemon typing
		var scores = {};
		for (var j in partyMons) {
			scores[partySpecies[j]] = 10;
			var enemy = partyMons[j];
			if (deadList.includes(enemy)) {
				continue;
			}
			var enemyDex = pokedex[partySpecies[j]];
			for (var matchup in phase1TypeMatchups) {
				var type1 = matchup.split("-")[0];
				var type2 = matchup.split("-")[1];
				var p1types = defender.types;
				if (!p1types[1]) p1types[1] = p1types[0];
				for (var k in p1types) {
					var type = p1types[k];
					if ((type1 == type) && (type2 == enemyDex.types[0] || type2 == enemyDex.types[1])) {
						scores[partySpecies[j]] = Math.floor(scores[partySpecies[j]] * phase1TypeMatchups[matchup]);
					}
				}
			}
		}

		var sorted = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);

		for (var j in sorted) {
			if (scores[sorted[j]] == 0) continue;
			var enemy = partyMons.filter(x => x.species == sorted[j])[0];
			if (enemy == dead) continue;
			if (deadList.includes(enemy)) {
				continue;
			}
			var enemyDex = pokedex[enemy.species];
			for (var k in enemy.moves) {
				var move = new calc.Move(GENERATION, enemy.moves[k]);
				if (move.category == "Status") continue;
				var typeEffectiveness1 = GENERATION.types.get(toID(move.type)).effectiveness[defender.types[0]];
				var typeEffectiveness2 = GENERATION.types.get(toID(move.type)).effectiveness[defender.types[1]];
				var typeEffectiveness = defender.types[1] ? typeEffectiveness1 * typeEffectiveness2 : typeEffectiveness1;
				if (typeEffectiveness > 1) {
					nextMon = enemy.species;
					break;
				}
			}
			if (nextMon) break;
		}

		// Phase 2 => Simple => Points for STAB moves for the dead mon and effective moves against me
		//         => Adavnced => Actually calculating move damage
		var highestDamage;
		if (!nextMon) {
			phase = 2;
			highestDamage = { pokemon: {}, score: 0 };
			for (var j in partyMons) {
				if (deadList.includes(partyMons[j])) {
					continue;
				}
				var next = structuredClone(partyMons[j]);
				if (next.species == dead.species) continue;
				var moves = [];
				for (var k in next.moves) moves.push(new calc.Move(GENERATION, next.moves[k]));
				var attacker = new calc.Pokemon(GENERATION, dead.species, {
					level: dead.level,
					moves: moves
				});
				for (var j in attacker.moves) {
					if (!advanced) {
						var move = attacker.moves[j];
						if (move.named(
							"Fissure", "Horn Drill", "Guilotine", "Sheer Cold",
							"Flail", "Frustration", "Low Kick", "Magnitude", "Present", "Return", "Reversal",
							"Counter", "Mirror Coat",
							"Dragon Rage", "Endeavor", "Night Shade", "Psywave", "Seismic Toss", "Sonic Boom", "Super Fang",
							"Bide"
						)) continue;
						var score = 1;
						if (attacker.types.includes(move.type)) score *= 1.5;
						if (!(move.type == "Ground" && defender.ability == "Levitate")) {
							score *= getMoveEffectiveness(GENERATION, move, defender.types[0]);
							score *= getMoveEffectiveness(GENERATION, move, defender.types[1]);
						}
						if (score > highestDamage.score) {
							highestDamage.pokemon = next;
							highestDamage.score = score;
						}
					} else {
						var move = new calc.Move(GENERATION, $(".last-move-used > select.move-selector").val(), {
							overrides: {
								type: attacker.moves[j].type,
								category: new calc.Move(GENERATION, $(".last-move-used > select.move-selector").val()).hasType('Normal', 'Fighting', 'Flying', 'Ground', 'Rock', 'Bug', 'Ghost', 'Poison', 'Steel') ? "Physical" : "Special"
							}
						});
						if (move.named(
							"Fissure", "Horn Drill", "Guilotine", "Sheer Cold",
							"Flail", "Frustration", "Low Kick", "Magnitude", "Present", "Return", "Reversal",
							"Counter", "Mirror Coat",
							"Dragon Rage", "Endeavor", "Night Shade", "Psywave", "Seismic Toss", "Sonic Boom", "Super Fang",
							"Bide"
						)) continue;
						if (new calc.Move(GENERATION, $(".last-move-used > select.move-selector").val()).category == "Status") {
							move.bp = 3;
						}
						move.bp = $(".last-move-used > .move-bp").val();
						var calculation = calc.calculateADV(GENERATION, attacker, defender, move, createField());
						var damage = calculation.damage;
						var score = damage ? damage[damage.length - 1] : damage;
						if (score > highestDamage.score) {
							score %= 256;
							highestDamage.pokemon = next;
							highestDamage.score = score;
						}
					}
				}
			}
			nextMon = highestDamage.pokemon.species;
		}

		if (nextMon) $(`.trainer-poke-switch-explain[data-id='${dead.species} (${window.CURRENT_TRAINER})']`).html(`${nextMon} (Phase ${phase})`);
	}
}

$(".result-move").change(function () {
	if (damageResults) {
		var result = findDamageResult($(this));
		if (result) {
			var desc = result.fullDesc(notation, false);
			if (desc.indexOf('--') === -1) desc += ' -- possibly the worst move ever';
			$("#mainResult").text(desc);
			$("#damageValues").text("Possible damage amounts: (" + displayDamageHits(result.damage) + ")");
		}
	}
});

function displayDamageHits(damage) {
	// Fixed Damage
	if (typeof damage === 'number') return damage;
	// Standard Damage
	if (damage.length > 2) return damage.join(', ');
	// Fixed Parental Bond Damage
	if (typeof damage[0] === 'number' && typeof damage[1] === 'number') {
		return '1st Hit: ' + damage[0] + '; 2nd Hit: ' + damage[1];
	}
	// Parental Bond Damage
	return '1st Hit: ' + damage[0].join(', ') + '; 2nd Hit: ' + damage[1].join(', ');
}

function findDamageResult(resultMoveObj) {
	var selector = "#" + resultMoveObj.attr("id");
	for (var i = 0; i < resultLocations.length; i++) {
		for (var j = 0; j < resultLocations[i].length; j++) {
			if (resultLocations[i][j].move === selector) {
				return damageResults[i][j];
			}
		}
	}
}

function checkStatBoost(p1, p2) {
	if ($('#StatBoostL').prop("checked")) {
		for (var stat in p1.boosts) {
			if (stat === 'hp') continue;
			p1.boosts[stat] = Math.min(6, p1.boosts[stat] + 1);
		}
	}
	if ($('#StatBoostR').prop("checked")) {
		for (var stat in p2.boosts) {
			if (stat === 'hp') continue;
			p2.boosts[stat] = Math.min(6, p2.boosts[stat] + 1);
		}
	}
}

function calculateAllMoves(gen, p1, p1field, p2, p2field) {
	checkStatBoost(p1, p2);
	var results = [[], []];
	for (var i = 0; i < 4; i++) {
		results[0][i] = calc.calculate(gen, p1, p2, p1.moves[i], p1field);
		results[1][i] = calc.calculate(gen, p2, p1, p2.moves[i], p2field);
	}
	return results;
}

$(".mode").change(function () {
	var params = new URLSearchParams(window.location.search);
	params.set('mode', $(this).attr("id"));
	var mode = params.get('mode');
	if (mode === 'randoms') {
		window.location.replace('randoms' + linkExtension + '?' + params);
	} else if (mode === 'one-vs-one') {
		window.location.replace('index' + linkExtension + '?' + params);
	} else {
		window.location.replace('honkalculate' + linkExtension + '?' + params);
	}
});

$(".gamemode").change(function () {
	var gamemode = $(this).attr("id");
	if (gamemode === 'vanilla') {
		window.location.replace('index' + linkExtension);
	} else {
		window.location.replace('hacks' + linkExtension);
	}
});

$(".notation").change(function () {
	performCalculations();
});

$(document).ready(function () {
	var params = new URLSearchParams(window.location.search);
	var m = params.get('mode');
	if (m) {
		if (m !== 'one-vs-one' && m !== 'randoms') {
			window.location.replace('honkalculate' + linkExtension + '?' + params);
		} else {
			if ($('#randoms').prop('checked')) {
				if (m === 'one-vs-one') {
					window.location.replace('index' + linkExtension + '?' + params);
				}
			} else {
				if (m === 'randoms') {
					window.location.replace('randoms' + linkExtension + '?' + params);
				}
			}
		}
	}
	$(".calc-trigger").bind("change keyup", function (ev) {
		/*
			This prevents like 8 performCalculations out of 8 that were useless
			without causing bugs (so far)
		*/
		if (window.NO_CALC) {
			return;
		}
		if (document.getElementById("cc-auto-refr").checked) {
			window.refreshColorCode();
		}
		performCalculations();
	});

	$(".bait-trigger").bind("change keyup", function (ev) {
		if (window.NO_CALC) {
			return;
		}
		predictSwitchOrder();
	});
	performCalculations();
});

/* Click-to-copy function */
$("#mainResult").click(function () {
	navigator.clipboard.writeText($("#mainResult").text()).then(function () {
		document.getElementById('tooltipText').style.visibility = 'visible';
		setTimeout(function () {
			document.getElementById('tooltipText').style.visibility = 'hidden';
		}, 1500);
	});
});

var game, gameId, generation, isHack;
$(".game").change(function() {
	game = $("input[name='game']:checked + label").html();
    gameId = ~~$(this).val();
	isHack = ["Emerald Kaizo"].includes(game);
    var params = new URLSearchParams(window.location.search);
	if (game == "None") {
		params.delete('game');
		params = '' + params;
		if (window.history && window.history.replaceState) {
			window.history.replaceState({}, document.title, window.location.pathname + (params.length ? '?' + params : ''));
		}
	} else {
		params.set('game', gameId);
		if (window.history && window.history.pushState) {
			params.sort();
			var path = window.location.pathname + '?' + params;
			window.history.pushState({}, document.title, path);
		}
	}

	updateGenOptions();
	if (game != "None") {
		$(".hide-from-games").hide();
	} else $(".hide-from-games").show();
    generation = gen;
    setdex = !isHack ? CUSTOMSETDEX[gameId] : CUSTOMHACKSETDEX[gameId];
	partyOrder = !isHack ? CUSTOMPARTYORDER[gameId] : CUSTOMHACKPARTYORDER[gameId];
	trainerNames = !isHack ? CUSTOMTRAINERNAMES[gameId] : CUSTOMHACKTRAINERNAMES[gameId];
	flags = !isHack ? CUSTOMFLAGS[gameId] : CUSTOMHACKFLAGS[gameId];
    if (typeof setdex === 'undefined') setdex = SETDEX[generation];
    clearField();
    $("#importedSets").prop("checked", false);
    loadDefaultLists();
    $(".gen-specific.g" + gen).show();
	$(".gen-specific").not(".g" + gen).hide();
	$(".game-specific.gm" + gameId).show();
	$(".game-specific").not(".gm" + gameId).hide();
	var typeOptions = getSelectOptions(Object.keys(typeChart));
	$("select.type1, select.move-type").find("option").remove().end().append(typeOptions);
	$("select.type2").find("option").remove().end().append("<option value=\"\">(none)</option>" + typeOptions);
	var moveOptions = getSelectOptions(Object.keys(moves), true);
	$("select.move-selector").find("option").remove().end().append(moveOptions);
	var abilityOptions = getSelectOptions(abilities, true);
	$("select.ability").find("option").remove().end().append("<option value=\"\">(other)</option>" + abilityOptions);
	var itemOptions = getSelectOptions(items, true);
	$("select.item").find("option").remove().end().append("<option value=\"\">(none)</option>" + itemOptions);

	$(".set-selector").val(getFirstValidSetOption().id);
	$(".set-selector").change();
});

var CUSTOMSETDEX = [
	undefined, // None
    typeof CUSTOMSETDEX_RB === 'undefined' ? {} : CUSTOMSETDEX_RB,
    typeof CUSTOMSETDEX_Y === 'undefined' ? {} : CUSTOMSETDEX_Y,
    typeof CUSTOMSETDEX_GS === 'undefined' ? {} : CUSTOMSETDEX_GS,
	typeof CUSTOMSETDEX_C === 'undefined' ? {} : CUSTOMSETDEX_C,
    typeof CUSTOMSETDEX_RS === 'undefined' ? {} : CUSTOMSETDEX_RS,
	typeof CUSTOMSETDEX_E === 'undefined' ? {} : CUSTOMSETDEX_E,
	typeof CUSTOMSETDEX_FRLG === 'undefined' ? {} : CUSTOMSETDEX_FRLG,
	typeof CUSTOMSETDEX_DP === 'undefined' ? {} : CUSTOMSETDEX_DP,
    typeof CUSTOMSETDEX_Pl === 'undefined' ? {} : CUSTOMSETDEX_Pl,
	typeof CUSTOMSETDEX_HGSS === 'undefined' ? {} : CUSTOMSETDEX_HGSS,
	typeof CUSTOMSETDEX_BW === 'undefined' ? {} : CUSTOMSETDEX_BW,
	typeof CUSTOMSETDEX_B2W2 === 'undefined' ? {} : CUSTOMSETDEX_B2W2,
	typeof CUSTOMSETDEX_XY === 'undefined' ? {} : CUSTOMSETDEX_XY,
	typeof CUSTOMSETDEX_ORAS === 'undefined' ? {} : CUSTOMSETDEX_ORAS,
	typeof CUSTOMSETDEX_SM === 'undefined' ? {} : CUSTOMSETDEX_SM,
	typeof CUSTOMSETDEX_USUM === 'undefined' ? {} : CUSTOMSETDEX_USUM,
	typeof CUSTOMSETDEX_BDSP === 'undefined' ? {} : CUSTOMSETDEX_BDSP,
	typeof CUSTOMSETDEX_SV === 'undefined' ? {} : CUSTOMSETDEX_SV
];

var GAMEGEN = {
    1: 1,
    2: 1,
    3: 2,
    4: 2,
    5: 3,
    6: 3,
    7: 3,
    8: 4,
    9: 4,
	10: 4,
	11: 5,
    12: 5,
    13: 6,
    14: 6,
	15: 7,
	16: 7,
	17: 8,
	18: 8,
	19: 9
};

var CUSTOMTRAINERNAMES = [
	undefined, // None
    typeof CUSTOMTRAINERNAMES_RB === 'undefined' ? {} : CUSTOMTRAINERNAMES_RB,
    typeof CUSTOMTRAINERNAMES_Y === 'undefined' ? {} : CUSTOMTRAINERNAMES_Y,
    typeof CUSTOMTRAINERNAMES_GS === 'undefined' ? {} : CUSTOMTRAINERNAMES_GS,
	typeof CUSTOMTRAINERNAMES_C === 'undefined' ? {} : CUSTOMTRAINERNAMES_C,
    typeof CUSTOMTRAINERNAMES_RS === 'undefined' ? {} : CUSTOMTRAINERNAMES_RS,
	typeof CUSTOMTRAINERNAMES_E === 'undefined' ? {} : CUSTOMTRAINERNAMES_E,
	typeof CUSTOMTRAINERNAMES_FRLG === 'undefined' ? {} : CUSTOMTRAINERNAMES_FRLG,
	typeof CUSTOMTRAINERNAMES_DP === 'undefined' ? {} : CUSTOMTRAINERNAMES_DP,
    typeof CUSTOMTRAINERNAMES_Pl === 'undefined' ? {} : CUSTOMTRAINERNAMES_Pl,
	typeof CUSTOMTRAINERNAMES_HGSS === 'undefined' ? {} : CUSTOMTRAINERNAMES_HGSS,
	typeof CUSTOMTRAINERNAMES_BW === 'undefined' ? {} : CUSTOMTRAINERNAMES_BW,
	typeof CUSTOMTRAINERNAMES_B2W2 === 'undefined' ? {} : CUSTOMTRAINERNAMES_B2W2,
	typeof CUSTOMTRAINERNAMES_XY === 'undefined' ? {} : CUSTOMTRAINERNAMES_XY,
	typeof CUSTOMTRAINERNAMES_ORAS === 'undefined' ? {} : CUSTOMTRAINERNAMES_ORAS,
	typeof CUSTOMTRAINERNAMES_SM === 'undefined' ? {} : CUSTOMTRAINERNAMES_SM
];

var CUSTOMPARTYORDER = [
	undefined, // None
    typeof CUSTOMPARTYORDER_RB === 'undefined' ? {} : CUSTOMPARTYORDER_RB,
    typeof CUSTOMPARTYORDER_Y === 'undefined' ? {} : CUSTOMPARTYORDER_Y,
    typeof CUSTOMPARTYORDER_GS === 'undefined' ? {} : CUSTOMPARTYORDER_GS,
	typeof CUSTOMPARTYORDER_C === 'undefined' ? {} : CUSTOMPARTYORDER_C,
    typeof CUSTOMPARTYORDER_RS === 'undefined' ? {} : CUSTOMPARTYORDER_RS,
	typeof CUSTOMPARTYORDER_E === 'undefined' ? {} : CUSTOMPARTYORDER_E,
	typeof CUSTOMPARTYORDER_FRLG === 'undefined' ? {} : CUSTOMPARTYORDER_FRLG,
	typeof CUSTOMPARTYORDER_DP === 'undefined' ? {} : CUSTOMPARTYORDER_DP,
    typeof CUSTOMPARTYORDER_Pl === 'undefined' ? {} : CUSTOMPARTYORDER_Pl,
	typeof CUSTOMPARTYORDER_HGSS === 'undefined' ? {} : CUSTOMPARTYORDER_HGSS,
	typeof CUSTOMPARTYORDER_BW === 'undefined' ? {} : CUSTOMPARTYORDER_BW,
	typeof CUSTOMPARTYORDER_B2W2 === 'undefined' ? {} : CUSTOMPARTYORDER_B2W2,
	typeof CUSTOMPARTYORDER_XY === 'undefined' ? {} : CUSTOMPARTYORDER_XY,
	typeof CUSTOMPARTYORDER_ORAS === 'undefined' ? {} : CUSTOMPARTYORDER_ORAS,
	typeof CUSTOMPARTYORDER_SM === 'undefined' ? {} : CUSTOMPARTYORDER_SM
];

var CUSTOMFLAGS = [
	undefined, // None
    typeof CUSTOMFLAGS_RB === 'undefined' ? {} : CUSTOMFLAGS_RB,
    typeof CUSTOMFLAGS_Y === 'undefined' ? {} : CUSTOMFLAGS_Y,
    typeof CUSTOMFLAGS_GS === 'undefined' ? {} : CUSTOMFLAGS_GS,
	typeof CUSTOMFLAGS_C === 'undefined' ? {} : CUSTOMFLAGS_C,
    typeof CUSTOMFLAGS_RS === 'undefined' ? {} : CUSTOMFLAGS_RS,
	typeof CUSTOMFLAGS_E === 'undefined' ? {} : CUSTOMFLAGS_E,
	typeof CUSTOMFLAGS_FRLG === 'undefined' ? {} : CUSTOMFLAGS_FRLG,
	typeof CUSTOMFLAGS_DP === 'undefined' ? {} : CUSTOMFLAGS_DP,
    typeof CUSTOMFLAGS_Pl === 'undefined' ? {} : CUSTOMFLAGS_Pl,
	typeof CUSTOMFLAGS_HGSS === 'undefined' ? {} : CUSTOMFLAGS_HGSS,
	typeof CUSTOMFLAGS_BW === 'undefined' ? {} : CUSTOMFLAGS_BW,
	typeof CUSTOMFLAGS_B2W2 === 'undefined' ? {} : CUSTOMFLAGS_B2W2,
	typeof CUSTOMFLAGS_XY === 'undefined' ? {} : CUSTOMFLAGS_XY,
	typeof CUSTOMFLAGS_ORAS === 'undefined' ? {} : CUSTOMFLAGS_ORAS,
	typeof CUSTOMFLAGS_SM === 'undefined' ? {} : CUSTOMFLAGS_SM
];

var CUSTOMHACKSETDEX = [
	undefined, // None
	typeof CUSTOMHACKSETDEX_EK === 'undefined' ? {} : CUSTOMHACKSETDEX_EK
];

var HACKGEN = {
	1: 3
};

var CUSTOMHACKTRAINERNAMES = [
	undefined,
	typeof CUSTOMHACKTRAINERNAMES_EK === 'undefined' ? {} : CUSTOMHACKTRAINERNAMES_EK
];

var CUSTOMHACKPARTYORDER = [
	undefined,
	typeof CUSTOMHACKPARTYORDER_EK === 'undefined' ? {} : CUSTOMHACKPARTYORDER_EK
];

var CUSTOMHACKFLAGS = [
	undefined,
	typeof CUSTOMHACKFLAGS_EK === 'undefined' ? {} : CUSTOMHACKFLAGS_EK
];

function updateGenOptions() {
    var gamegen = !isHack ? GAMEGEN[gameId] : HACKGEN[gameId];
    if (!isHack && gen == gamegen) return;
    gen = gamegen || gen;
    GENERATION = calc.Generations.get(gen);
    $("#gen" + gamegen).prop("checked", true);
    var params = new URLSearchParams(window.location.search);
	if (gen === DEFAULTGEN) {
		params.delete('gen');
		params = '' + params;
		if (window.history && window.history.replaceState) {
			window.history.replaceState({}, document.title, window.location.pathname + (params.length ? '?' + params : ''));
		}
	} else {
		params.set('gen', gen);
		if (window.history && window.history.pushState) {
			params.sort();
			var path = window.location.pathname + '?' + params;
			window.history.pushState({}, document.title, path);
		}
	}
	pokedex = isHack ? calc.HACK_SPECIES[gameId] : calc.SPECIES[gen];
	randdex = RANDDEX[gen];
	typeChart = calc.TYPE_CHART[gen];
	moves = isHack ? calc.HACK_MOVES[gameId] : calc.MOVES[gen];
	items = isHack ? calc.HACK_ITEMS[gameId] : calc.ITEMS[gen];
	abilities = calc.ABILITIES[gen];
}
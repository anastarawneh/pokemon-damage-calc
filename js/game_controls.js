var game, generation;
$(".game").change(function() {
    game = ~~$(this).val();
    var params = new URLSearchParams(window.location.search);
	if (game === 0) {
		params.delete('game');
		params = '' + params;
		if (window.history && window.history.replaceState) {
			window.history.replaceState({}, document.title, window.location.pathname + (params.length ? '?' + params : ''));
		}
	} else {
		params.set('game', game);
		if (window.history && window.history.pushState) {
			params.sort();
			var path = window.location.pathname + '?' + params;
			window.history.pushState({}, document.title, path);
		}
	}

    if (game != 0) {
		updateGenOptions();
		$(".hide-from-games").hide();
	} else $(".hide-from-games").show();
    generation = gen;
    setdex = CUSTOMSETDEX[game];
    if (typeof setdex === 'undefined') setdex = SETDEX[generation];
    clearField();
    $("#importedSets").prop("checked", false);
    loadDefaultLists();
    $(".gen-specific.g" + gen).show();
	$(".gen-specific").not(".g" + gen).hide();
	$(".game-specific.gm" + game).show();
	$(".game-specific").not(".gm" + game).hide();
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
	undefined, // Colosseum
	undefined, // XD
	typeof CUSTOMSETDEX_B2W2 === 'undefined' ? {} : CUSTOMSETDEX_B2W2,
	typeof CUSTOMSETDEX_XY === 'undefined' ? {} : CUSTOMSETDEX_XY,
	typeof CUSTOMSETDEX_ORAS === 'undefined' ? {} : CUSTOMSETDEX_ORAS,
	typeof CUSTOMSETDEX_SM === 'undefined' ? {} : CUSTOMSETDEX_SM
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
    14: 5,
    15: 6,
    16: 6,
	17: 7
}

function updateGenOptions() {
    var gamegen = GAMEGEN[game]
    if (gen == gamegen) return;
    gen = gamegen;
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
    pokedex = calc.SPECIES[gen];
	randdex = RANDDEX[gen];
	typeChart = calc.TYPE_CHART[gen];
	moves = calc.MOVES[gen];
	items = calc.ITEMS[gen];
	abilities = calc.ABILITIES[gen];
}
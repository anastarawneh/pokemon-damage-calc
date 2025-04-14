function placeBsBtn() {
	var importBtn = "<button id='import' class='bs-btn bs-btn-default'>Import</button>";
	$("#import-1_wrapper").append(importBtn);
	var syncBtn = "<button id='sync' class='bs-btn bs-btn-default'>Sync</button>";
	$("#import-1_wrapper").append(syncBtn);
	var uploadBtn = "<input type='file' name='saveFile' id='saveFile' accept='.sav' hidden></input><button id='upload' class='bs-btn bs-btn-default'>Upload Save</button>";
	$("#import-1_wrapper").append(uploadBtn);
	if (gameId > 0 && GAME_FEATURES[game].sync) $("#sync.bs-btn").show();
	else $("#sync.bs-btn").hide();
	if (gameId > 0 && GAME_FEATURES[game].upload) $("#upload.bs-btn").show();
	else $("#upload.bs-btn").hide();

	$("#import.bs-btn").click(function () {
		var pokes = document.getElementsByClassName("import-team-text")[0].value;
		var name = document.getElementsByClassName("import-name-text")[0].value.trim() === "" ? "Custom Set" : document.getElementsByClassName("import-name-text")[0].value;
		addSets(pokes, name);
		if (document.getElementById("cc-auto-refr").checked && $("#show-cc").is(":hidden")) {
			window.refreshColorCode();
		}
		//erase the import text area
		document.getElementsByClassName("import-team-text")[0].value="";
	});

	$("#sync.bs-btn").click(() => {
		fetch("http://localhost:31124/update").then(x => x.text()).then(function (x) {
			addSets(x, "Custom Set");
			if (document.getElementById("cc-auto-refr").checked && $("#show-cc").is(":hidden")) {
				window.refreshColorCode();
			}
		}).catch(() => alert("Please make sure the Lua script is running. A link to the script can be found at the bottom of the page."));
	});

	$("#upload.bs-btn").click(() => {
		$("#saveFile").click();
	});

	$("#saveFile").on("change", function() {
		var file = $(this)[0].files[0];
		var data = [];
		const reader = new FileReader();
		reader.onload = (e) => {
			if (e.target.readyState == FileReader.DONE) {
				var arrayBuffer = e.target.result,
				array = new Uint8Array(arrayBuffer);
				for (var i = 0; i < array.length; i++) {
					data.push(array[i]);
				}
			}
			parseSaveFile(data);
		};
		reader.readAsArrayBuffer(file);
	});
}

function parseSaveFile(data) {
	const charmap = [" ", "À", "Á", "Â", "Ç", "È", "É", "Ê", "Ë", "Ì", "こ", "Î", "Ï", "Ò", "Ó", "Ô","Œ", "Ù", "Ú", "Û", "Ñ", "ß", "à", "á", "ね", "ç", "è", "é", "ê", "ë", "ì", "ま","î", "ï", "ò", "ó", "ô", "œ", "ù", "ú", "û", "ñ", "º", "ª", "�", "&", "+", "あ","ぃ", "ぅ", "ぇ", "ぉ", "v", "=", "ょ", "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ","ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ","っ", "¿", "¡", "P\u{200d}k", "M\u{200d}n", "P\u{200d}o", "K\u{200d}é", "�", "�", "�", "Í", "%", "(", ")", "セ", "ソ","タ", "チ", "ツ", "テ", "ト", "ナ", "ニ", "ヌ", "â", "ノ", "ハ", "ヒ", "フ", "ヘ", "ホ", "í","ミ", "ム", "メ", "モ", "ヤ", "ユ", "ヨ", "ラ", "リ", "⬆", "⬇", "⬅", "➡", "ヲ", "ン", "ァ","ィ", "ゥ", "ェ", "ォ", "ャ", "ュ", "ョ", "ガ", "ギ", "グ", "ゲ", "ゴ", "ザ", "ジ", "ズ", "ゼ","ゾ", "ダ", "ヂ", "ヅ", "デ", "ド", "バ", "ビ", "ブ", "ベ", "ボ", "パ", "ピ", "プ", "ペ", "ポ","ッ", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "!", "?", ".", "-", "・","…", "“", "”", "‘", "’", "♂", "♀", "$", ",", "×", "/", "A", "B", "C", "D", "E","F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U","V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k","l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "▶",":", "Ä", "Ö", "Ü", "ä", "ö", "ü", "⬆", "⬇", "⬅", "�", "�", "�", "�", "�", ""];
	const speciesById = ["", "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise", "Caterpie", "Metapod", "Butterfree", "Weedle", "Kakuna", "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot", "Rattata", "Raticate", "Spearow", "Fearow", "Ekans", "Arbok", "Pikachu", "Raichu", "Sandshrew", "Sandslash", "Nidoran-F", "Nidorina", "Nidoqueen", "Nidoran-M", "Nidorino", "Nidoking", "Clefairy", "Clefable", "Vulpix", "Ninetales", "Jigglypuff", "Wigglytuff", "Zubat", "Golbat", "Oddish", "Gloom", "Vileplume", "Paras", "Parasect", "Venonat", "Venomoth", "Diglett", "Dugtrio", "Meowth", "Persian", "Psyduck", "Golduck", "Mankey", "Primeape", "Growlithe", "Arcanine", "Poliwag", "Poliwhirl", "Poliwrath", "Abra", "Kadabra", "Alakazam", "Machop", "Machoke", "Machamp", "Bellsprout", "Weepinbell", "Victreebel", "Tentacool", "Tentacruel", "Geodude", "Graveler", "Golem", "Ponyta", "Rapidash", "Slowpoke", "Slowbro", "Magnemite", "Magneton", "Farfetch’d", "Doduo", "Dodrio", "Seel", "Dewgong", "Grimer", "Muk", "Shellder", "Cloyster", "Gastly", "Haunter", "Gengar", "Onix", "Drowzee", "Hypno", "Krabby", "Kingler", "Voltorb", "Electrode", "Exeggcute", "Exeggutor", "Cubone", "Marowak", "Hitmonlee", "Hitmonchan", "Lickitung", "Koffing", "Weezing", "Rhyhorn", "Rhydon", "Chansey", "Tangela", "Kangaskhan", "Horsea", "Seadra", "Goldeen", "Seaking", "Staryu", "Starmie", "Mr. Mime", "Scyther", "Jynx", "Electabuzz", "Magmar", "Pinsir", "Tauros", "Magikarp", "Gyarados", "Lapras", "Ditto", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Porygon", "Omanyte", "Omastar", "Kabuto", "Kabutops", "Aerodactyl", "Snorlax", "Articuno", "Zapdos", "Moltres", "Dratini", "Dragonair", "Dragonite", "Mewtwo", "Mew", "Chikorita", "Bayleef", "Meganium", "Cyndaquil", "Quilava", "Typhlosion", "Totodile", "Croconaw", "Feraligatr", "Sentret", "Furret", "Hoothoot", "Noctowl", "Ledyba", "Ledian", "Spinarak", "Ariados", "Crobat", "Chinchou", "Lanturn", "Pichu", "Cleffa", "Igglybuff", "Togepi", "Togetic", "Natu", "Xatu", "Mareep", "Flaaffy", "Ampharos", "Bellossom", "Marill", "Azumarill", "Sudowoodo", "Politoed", "Hoppip", "Skiploom", "Jumpluff", "Aipom", "Sunkern", "Sunflora", "Yanma", "Wooper", "Quagsire", "Espeon", "Umbreon", "Murkrow", "Slowking", "Misdreavus", "Unown", "Wobbuffet", "Girafarig", "Pineco", "Forretress", "Dunsparce", "Gligar", "Steelix", "Snubbull", "Granbull", "Qwilfish", "Scizor", "Shuckle", "Heracross", "Sneasel", "Teddiursa", "Ursaring", "Slugma", "Magcargo", "Swinub", "Piloswine", "Corsola", "Remoraid", "Octillery", "Delibird", "Mantine", "Skarmory", "Houndour", "Houndoom", "Kingdra", "Phanpy", "Donphan", "Porygon2", "Stantler", "Smeargle", "Tyrogue", "Hitmontop", "Smoochum", "Elekid", "Magby", "Miltank", "Blissey", "Raikou", "Entei", "Suicune", "Larvitar", "Pupitar", "Tyranitar", "Lugia", "Ho-Oh", "Celebi", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Treecko", "Grovyle", "Sceptile", "Torchic", "Combusken", "Blaziken", "Mudkip", "Marshtomp", "Swampert", "Poochyena", "Mightyena", "Zigzagoon", "Linoone", "Wurmple", "Silcoon", "Beautifly", "Cascoon", "Dustox", "Lotad", "Lombre", "Ludicolo", "Seedot", "Nuzleaf", "Shiftry", "Nincada", "Ninjask", "Shedinja", "Taillow", "Swellow", "Shroomish", "Breloom", "Spinda", "Wingull", "Pelipper", "Surskit", "Masquerain", "Wailmer", "Wailord", "Skitty", "Delcatty", "Kecleon", "Baltoy", "Claydol", "Nosepass", "Torkoal", "Sableye", "Barboach", "Whiscash", "Luvdisc", "Corphish", "Crawdaunt", "Feebas", "Milotic", "Carvanha", "Sharpedo", "Trapinch", "Vibrava", "Flygon", "Makuhita", "Hariyama", "Electrike", "Manectric", "Numel", "Camerupt", "Spheal", "Sealeo", "Walrein", "Cacnea", "Cacturne", "Snorunt", "Glalie", "Lunatone", "Solrock", "Azurill", "Spoink", "Grumpig", "Plusle", "Minun", "Mawile", "Meditite", "Medicham", "Swablu", "Altaria", "Wynaut", "Duskull", "Dusclops", "Roselia", "Slakoth", "Vigoroth", "Slaking", "Gulpin", "Swalot", "Tropius", "Whismur", "Loudred", "Exploud", "Clamperl", "Huntail", "Gorebyss", "Absol", "Shuppet", "Banette", "Seviper", "Zangoose", "Relicanth", "Aron", "Lairon", "Aggron", "Castform", "Volbeat", "Illumise", "Lileep", "Cradily", "Anorith", "Armaldo", "Ralts", "Kirlia", "Gardevoir", "Bagon", "Shelgon", "Salamence", "Beldum", "Metang", "Metagross", "Regirock", "Regice", "Registeel", "Kyogre", "Groudon", "Rayquaza", "Latias", "Latios", "Jirachi", "Deoxys", "Chimecho"];
	const itemsById = ["", "Master Ball", "Ultra Ball", "Great Ball", "Poké Ball", "Safari Ball", "Net Ball", "Dive Ball", "Nest Ball", "Repeat Ball", "Timer Ball", "Luxury Ball", "Premier Ball", "Potion", "Antidote", "Burn Heal", "Ice Heal", "Awakening", "Parlyz Heal", "Full Restore", "Max Potion", "Hyper Potion", "Super Potion", "Full Heal", "Revive", "Max Revive", "Fresh Water", "Soda Pop", "Lemonade", "Moomoo Milk", "EnergyPowder", "Energy Root", "Heal Powder", "Revival Herb", "Ether", "Max Ether", "Elixir", "Max Elixir", "Lava Cookie", "Blue Flute", "Yellow Flute", "Red Flute", "Black Flute", "White Flute", "Berry Juice", "Sacred Ash", "Shoal Salt", "Shoal Shell", "Red Shard", "Blue Shard", "Yellow Shard", "Green Shard", "", "", "", "", "", "", "", "", "", "", "", "HP Up", "Protein", "Iron", "Carbos", "Calcium", "Rare Candy", "PP Up", "Zinc", "PP Max", "", "Guard Spec.", "Dire Hit", "X Attack", "X Defend", "X Speed", "X Accuracy", "X Special", "Poké Doll", "Fluffy Tail", "", "Super Repel", "Max Repel", "Escape Rope", "Repel", "", "", "", "", "", "", "Sun Stone", "Moon Stone", "Fire Stone", "Thunderstone", "Water Stone", "Leaf Stone", "", "", "", "", "TinyMushroom", "Big Mushroom", "", "Pearl", "Big Pearl", "Stardust", "Star Piece", "Nugget", "Heart Scale", "", "", "", "", "", "", "", "", "", "Orange Mail", "Harbor Mail", "Glitter Mail", "Mech Mail", "Wood Mail", "Wave Mail", "Bead Mail", "Shadow Mail", "Tropic Mail", "Dream Mail", "Fab Mail", "Retro Mail", "Cheri Berry", "Chesto Berry", "Pecha Berry", "Rawst Berry", "Aspear Berry", "Leppa Berry", "Oran Berry", "Persim Berry", "Lum Berry", "Sitrus Berry", "Figy Berry", "Wiki Berry", "Mago Berry", "Aguav Berry", "Iapapa Berry", "Razz Berry", "Bluk Berry", "Nanab Berry", "Wepear Berry", "Pinap Berry", "Pomeg Berry", "Kelpsy Berry", "Qualot Berry", "Hondew Berry", "Grepa Berry", "Tamato Berry", "Cornn Berry", "Magost Berry", "Rabuta Berry", "Nomel Berry", "Spelon Berry", "Pamtre Berry", "Watmel Berry", "Durin Berry", "Belue Berry", "Liechi Berry", "Ganlon Berry", "Salac Berry", "Petaya Berry", "Apicot Berry", "Lansat Berry", "Starf Berry", "Enigma Berry", "", "", "", "BrightPowder", "White Herb", "Macho Brace", "Exp. Share", "Quick Claw", "Soothe Bell", "Mental Herb", "Choice Band", "King's Rock", "SilverPowder", "Amulet Coin", "Cleanse Tag", "Soul Dew", "DeepSeaTooth", "DeepSeaScale", "Smoke Ball", "Everstone", "Focus Band", "Lucky Egg", "Scope Lens", "Metal Coat", "Leftovers", "Dragon Scale", "Light Ball", "Soft Sand", "Hard Stone", "Miracle Seed", "BlackGlasses", "Black Belt", "Magnet", "Mystic Water", "Sharp Beak", "Poison Barb", "NeverMeltIce", "Spell Tag", "TwistedSpoon", "Charcoal", "Dragon Fang", "Silk Scarf", "Up-Grade", "Shell Bell", "Sea Incense", "Lax Incense", "Lucky Punch", "Metal Powder", "Thick Club", "Stick", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Red Scarf", "Blue Scarf", "Pink Scarf", "Green Scarf", "Yellow Scarf", "Mach Bike", "Coin Case", "Itemfinder", "Old Rod", "Good Rod", "Super Rod", "S.S. Ticket", "Contest Pass", "", "Wailmer Pail", "Devon Goods", "Soot Sack", "Basement Key", "Acro Bike", "Pokéblock Case", "Letter", "Eon Ticket", "Red Orb", "Blue Orb", "Scanner", "Go-Goggles", "Meteorite", "Rm. 1 Key", "Rm. 2 Key", "Rm. 4 Key", "Rm. 6 Key", "Storage Key", "Root Fossil", "Claw Fossil", "Devon Scope", "TM01", "TM02", "TM03", "TM04", "TM05", "TM06", "TM07", "TM08", "TM09", "TM10", "TM11", "TM12", "TM13", "TM14", "TM15", "TM16", "TM17", "TM18", "TM19", "TM20", "TM21", "TM22", "TM23", "TM24", "TM25", "TM26", "TM27", "TM28", "TM29", "TM30", "TM31", "TM32", "TM33", "TM34", "TM35", "TM36", "TM37", "TM38", "TM39", "TM40", "TM41", "TM42", "TM43", "TM44", "TM45", "TM46", "TM47", "TM48", "TM49", "TM50", "HM01", "HM02", "HM03", "HM04", "HM05", "HM06", "HM07", "HM08", "", "", "Oak's Parcel", "Poké Flute", "Secret Key", "Bike Voucher", "Gold Teeth", "Old Amber", "Card Key", "Lift Key", "Helix Fossil", "Dome Fossil", "Silph Scope", "Bicycle", "Town Map", "VS Seeker", "Fame Checker", "TM Case", "Berry Pouch", "Teachy TV", "Tri-Pass", "Rainbow Pass", "Tea", "MysticTicket", "AuroraTicket", "Powder Jar", "Ruby", "Sapphire", "Magma Emblem", "Old Sea Map"];
	const abilitiesBySpecies = [[""], ["Overgrow", "Overgrow"], ["Overgrow", "Overgrow"], ["Chlorophyll", "Overgrow"], ["Blaze"], ["Blaze"], ["Blaze"], ["Torrent"], ["Torrent"], ["Torrent"], ["Shield Dust"], ["Shed Skin"], ["Compound Eyes"], ["Shield Dust"], ["Shed Skin"], ["Swarm"], ["Keen Eye"], ["Keen Eye"], ["Early Bird"], ["Run Away", "Run Away"], ["Guts", "Guts"], ["Keen Eye"], ["Early Bird"], ["Intimidate", "Shed Skin"], ["Intimidate", "Shed Skin"], ["Lightning Rod"], ["Lightning Rod"], ["Sand Veil"], ["Sand Veil"], ["Poison Point"], ["Poison Point"], ["Poison Point"], ["Poison Point"], ["Poison Point"], ["Poison Point"], ["Cute Charm"], ["Cute Charm"], ["Pressure"], ["Pressure"], ["Cute Charm"], ["Cute Charm"], ["Inner Focus"], ["Inner Focus"], ["Chlorophyll"], ["Chlorophyll"], ["Chlorophyll"], ["Effect Spore"], ["Effect Spore"], ["Compound Eyes", "Shield Dust"], ["Compound Eyes", "Shield Dust"], ["Arena Trap", "Sand Veil"], ["Arena Trap", "Sand Veil"], ["Limber"], ["Limber"], ["Swift Swim", "Oblivious"], ["Swift Swim", "Oblivious"], ["Vital Spirit"], ["Vital Spirit"], ["Intimidate", "Run Away"], ["Intimidate", "Blaze"], ["Swift Swim", "Swift Swim"], ["Swift Swim", "Swift Swim"], ["Swift Swim", "Swift Swim"], ["Synchronize", "Inner Focus"], ["Synchronize", "Inner Focus"], ["Synchronize", "Inner Focus"], ["Guts"], ["Guts"], ["Guts"], ["Chlorophyll"], ["Chlorophyll"], ["Chlorophyll"], ["Clear Body", "Liquid Ooze"], ["Clear Body", "Liquid Ooze"], ["Rock Head", "Sturdy"], ["Rock Head", "Sturdy"], ["Rock Head", "Sturdy"], ["Flame Body", "Run Away"], ["Flame Body", "Run Away"], ["Oblivious", "Own Tempo"], ["Shell Armor", "Own Tempo"], ["Magnet Pull", "Sturdy"], ["Magnet Pull", "Sturdy"], ["Keen Eye", "Inner Focus"], ["Early Bird", "Run Away"], ["Early Bird", "Run Away"], ["Thick Fat", "Thick Fat"], ["Swift Swim", "Thick Fat"], ["Poison Point", "Sticky Hold"], ["Poison Point", "Sticky Hold"], ["Shell Armor"], ["Shell Armor"], ["Levitate"], ["Levitate"], ["Levitate"], ["Rock Head", "Sturdy"], ["Insomnia"], ["Insomnia"], ["Hyper Cutter", "Shell Armor"], ["Hyper Cutter", "Shell Armor"], ["Static", "Static"], ["Static", "Static"], ["Chlorophyll"], ["Chlorophyll"], ["Lightning Rod", "Rock Head"], ["Lightning Rod", "Rock Head"], ["Limber"], ["Guts"], ["Own Tempo", "Oblivious"], ["Levitate"], ["Levitate"], ["Lightning Rod", "Rock Head"], ["Lightning Rod", "Rock Head"], ["Natural Cure", "Serene Grace"], ["Chlorophyll"], ["Early Bird"], ["Swift Swim"], ["Poison Point"], ["Swift Swim", "Water Veil"], ["Swift Swim", "Water Veil"], ["Natural Cure", "Illuminate"], ["Natural Cure", "Illuminate"], ["Own Tempo"], ["Swarm"], ["Oblivious"], ["Static"], ["Flame Body"], ["Intimidate", "Hyper Cutter"], ["Intimidate"], ["Swift Swim"], ["Intimidate"], ["Shell Armor", "Shell Armor"], ["Shadow Tag"], ["Run Away"], ["Swift Swim"], ["Static"], ["Flame Body"], ["Trace"], ["Swift Swim", "Shell Armor"], ["Swift Swim", "Shell Armor"], ["Swift Swim", "Battle Armor"], ["Swift Swim", "Battle Armor"], ["Rock Head", "Pressure"], ["Guts", "Thick Fat"], ["Pressure"], ["Pressure"], ["Pressure"], ["Shed Skin", "Shed Skin"], ["Shed Skin", "Shed Skin"], ["Thick Fat", "Shed Skin"], ["Pressure", "Run Away"], ["Synchronize"], ["Overgrow", "Overgrow"], ["Overgrow", "Overgrow"], ["Thick Fat", "Overgrow"], ["Blaze"], ["Blaze"], ["Blaze"], ["Torrent", "Torrent"], ["Torrent", "Torrent"], ["Battle Armor", "Torrent"], ["Early Bird", "Keen Eye"], ["Early Bird", "Keen Eye"], ["Insomnia", "Keen Eye"], ["Insomnia", "Keen Eye"], ["Early Bird", "Swarm"], ["Early Bird", "Swarm"], ["Insomnia", "Swarm"], ["Insomnia", "Swarm"], ["Inner Focus"], ["Volt Absorb", "Illuminate"], ["Volt Absorb", "Illuminate"], ["Static"], ["Cute Charm"], ["Cute Charm"], ["Serene Grace", "Hustle"], ["Serene Grace", "Hustle"], ["Early Bird", "Synchronize"], ["Early Bird", "Synchronize"], ["Static"], ["Static"], ["Static"], ["Chlorophyll"], ["Huge Power", "Thick Fat"], ["Huge Power", "Thick Fat"], ["Rock Head", "Sturdy"], ["Swift Swim", "Swift Swim"], ["Chlorophyll"], ["Chlorophyll"], ["Chlorophyll"], ["Vital Spirit", "Own Tempo"], ["Chlorophyll"], ["Chlorophyll"], ["Speed Boost", "Compound Eyes"], ["Water Absorb", "Oblivious"], ["Water Absorb", "Oblivious"], ["Synchronize"], ["Synchronize"], ["Insomnia"], ["Natural Cure", "Own Tempo"], ["Levitate"], ["Levitate"], ["Shadow Tag"], ["Early Bird", "Inner Focus"], ["Rough Skin", "Sturdy"], ["Shell Armor", "Sturdy"], ["Serene Grace", "Run Away"], ["Hyper Cutter", "Sand Veil"], ["Rock Head", "Sturdy"], ["Intimidate", "Run Away"], ["Intimidate", "Intimidate"], ["Swift Swim", "Poison Point"], ["Swarm"], ["Shell Armor", "Sturdy"], ["Guts", "Swarm"], ["Inner Focus", "Keen Eye"], ["Guts"], ["Guts"], ["Flame Body", "Magma Armor"], ["Flame Body", "Flame Body"], ["Oblivious", "Oblivious"], ["Thick Fat", "Oblivious"], ["Natural Cure", "Hustle"], ["Hustle"], ["Suction Cups"], ["Vital Spirit", "Hustle"], ["Swift Swim", "Water Veil"], ["Keen Eye", "Sturdy"], ["Early Bird", "Early Bird"], ["Intimidate", "Early Bird"], ["Swift Swim"], ["Cute Charm", "Cute Charm"], ["Battle Armor", "Sturdy"], ["Trace"], ["Intimidate"], ["Own Tempo"], ["Guts"], ["Intimidate"], ["Oblivious"], ["Static"], ["Flame Body"], ["Thick Fat"], ["Natural Cure", "Serene Grace"], ["Lightning Rod", "Pressure"], ["Inner Focus", "Pressure"], ["Battle Armor", "Pressure"], ["Guts"], ["Shed Skin"], ["Intimidate"], ["Pressure", "Run Away"], ["Pressure", "Run Away"], ["Natural Cure"], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], ["Overgrow"], ["Overgrow"], ["Overgrow"], ["Speed Boost", "Blaze"], ["Blaze", "Blaze"], ["Blaze", "Blaze"], ["Torrent", "Torrent"], ["Torrent", "Torrent"], ["Swift Swim", "Torrent"], ["Run Away"], ["Intimidate"], ["Guts"], ["Guts"], ["Shield Dust"], ["Shed Skin"], ["Swarm"], ["Shed Skin"], ["Shield Dust"], ["Swift Swim", "Rain Dish"], ["Swift Swim", "Rain Dish"], ["Swift Swim", "Rain Dish"], ["Chlorophyll", "Early Bird"], ["Chlorophyll", "Early Bird"], ["Chlorophyll", "Early Bird"], ["Compound Eyes"], ["Speed Boost"], ["Wonder Guard"], ["Guts"], ["Guts"], ["Effect Spore"], ["Effect Spore"], ["Own Tempo"], ["Keen Eye", "Keen Eye"], ["Swift Swim", "Keen Eye"], ["Swift Swim"], ["Intimidate"], ["Pressure", "Oblivious"], ["Pressure", "Oblivious"], ["Cute Charm"], ["Cute Charm"], ["Color Change"], ["Levitate"], ["Levitate"], ["Battle Armor", "Sturdy"], ["White Smoke", "Shell Armor"], ["Pressure"], ["Oblivious", "Oblivious"], ["Swift Swim", "Oblivious"], ["Swift Swim"], ["Shell Armor", "Hyper Cutter"], ["Shell Armor", "Hyper Cutter"], ["Swift Swim", "Swift Swim"], ["Swift Swim", "Marvel Scale"], ["Rough Skin"], ["Rough Skin"], ["Arena Trap", "Hyper Cutter"], ["Levitate", "Levitate"], ["Levitate", "Levitate"], ["Thick Fat", "Guts"], ["Thick Fat", "Guts"], ["Static", "Lightning Rod"], ["Intimidate", "Lightning Rod"], ["Oblivious"], ["Magma Armor"], ["Thick Fat", "Thick Fat"], ["Thick Fat", "Thick Fat"], ["Rain Dish", "Thick Fat"], ["Sand Veil"], ["Sand Veil"], ["Inner Focus", "Inner Focus"], ["Intimidate", "Inner Focus"], ["Levitate"], ["Levitate"], ["Huge Power", "Thick Fat"], ["Thick Fat", "Own Tempo"], ["Thick Fat", "Own Tempo"], ["Plus"], ["Minus"], ["Intimidate", "Hyper Cutter"], ["Pure Power"], ["Pure Power"], ["Natural Cure"], ["Natural Cure"], ["Shadow Tag"], ["Levitate", "Levitate"], ["Pressure", "Keen Eye"], ["Natural Cure", "Poison Point"], ["Truant"], ["Vital Spirit"], ["Truant"], ["Liquid Ooze", "Sticky Hold"], ["Liquid Ooze", "Sticky Hold"], ["Chlorophyll"], ["Vital Spirit"], ["Vital Spirit"], ["Vital Spirit"], ["Shell Armor"], ["Swift Swim"], ["Swift Swim"], ["Pressure"], ["Insomnia"], ["Insomnia"], ["Shed Skin"], ["Guts", "Immunity"], ["Rock Head", "Swift Swim"], ["Rock Head", "Sturdy"], ["Rock Head", "Sturdy"], ["Rock Head", "Sturdy"], ["Forecast"], ["Swarm", "Swarm"], ["Oblivious"], ["Suction Cups"], ["Suction Cups"], ["Battle Armor"], ["Battle Armor"], ["Synchronize", "Synchronize"], ["Synchronize", "Synchronize"], ["Synchronize", "Trace"], ["Rock Head"], ["Rock Head"], ["Intimidate"], ["Clear Body"], ["Clear Body"], ["Clear Body"], ["Clear Body"], ["Clear Body"], ["Clear Body"], ["Pressure", "Run Away"], ["Rock Head", "Run Away"], ["Pressure", "Run Away"], ["Levitate"], ["Levitate"], ["Serene Grace"], ["Pressure"], ["Levitate"]];
	const curvesBySpecies = [0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 4, 4, 4, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 4, 4, 0, 0, 4, 4, 5, 5, 3, 3, 3, 4, 4, 3, 3, 5, 5, 0, 0, 0, 0, 3, 3, 5, 5, 3, 3, 3, 5, 5, 5, 5, 5, 5, 3, 3, 3, 5, 5, 3, 3, 3, 0, 0, 3, 3, 0, 0, 4, 5, 5, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 5, 5, 5, 5, 5, 5, 0, 0, 0, 5, 5, 5, 5, 5, 3, 3, 2, 2, 4, 4, 5, 5, 0, 0, 3, 3, 0, 5, 5, 5, 5, 2, 5, 5, 5, 5, 5, 5, 3, 3, 0, 0, 5, 2, 5, 5, 5, 2, 2, 2, 5, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 0, 4, 4, 4, 4, 0, 0, 5, 5, 5, 3, 3, 3, 0, 3, 3, 3, 3, 4, 4, 4, 3, 5, 5, 5, 5, 4, 3, 5, 2, 5, 0, 5, 5, 3, 3, 5, 0, 0, 0, 5, 5, 5, 4, 3, 3, 4, 4, 5, 5, 4, 0, 0, 4, 3, 5, 5, 5, 2, 3, 3, 5, 0, 4, 0, 0, 3, 3, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 3, 3, 3, 5, 5, 5, 3, 3, 2, 2, 4, 4, 4, 0, 0, 2, 2, 4, 4, 4, 5, 5, 4, 0, 5, 0, 0, 4, 4, 4, 2, 2, 3, 3, 5, 5, 5, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3, 5, 5, 3, 4, 4, 4, 4, 4, 5, 5, 0, 0, 5, 2, 2, 3, 5, 5, 5, 4, 4, 4, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 3, 3, 5, 5, 5, 5, 4, 4, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 2, 2, 5, 5, 5, 5, 5, 5, 5, 4];
	const curves = [
		(lvl) => Math.pow(lvl, 3),
		(lvl) => {
			if (lvl < 50) return Math.floor(Math.pow(lvl, 3) * (100 - lvl) / 50);
			else if (lvl < 68) return Math.floor(Math.pow(lvl, 3) * (150 - lvl) / 100);
			else if (lvl < 98) return Math.floor(Math.pow(lvl, 3) * Math.floor((1911 - 10 * lvl) / 3) / 500);
			else return Math.floor(Math.pow(lvl, 3) * (160 - lvl) / 100);
		},
		(lvl) => {
			if (lvl < 15) return Math.floor(Math.pow(lvl, 3) * (Math.floor((lvl + 1) / 3) + 24) / 50);
			else if (lvl < 36) return Math.floor(Math.pow(lvl, 3) * (lvl + 14) / 50);
			else return Math.floor(Math.pow(lvl, 3) * (Math.floor(lvl / 2) + 32) / 50);
		},
		(lvl) => Math.floor(6 / 5 * Math.pow(lvl, 3) - 15 * Math.pow(lvl, 2) + 100 * lvl - 140),
		(lvl) => Math.floor(4 * Math.pow(lvl, 3) / 5),
		(lvl) => Math.floor(5 * Math.pow(lvl, 3) / 4),
	];
	const naturesByOrder = ["Hardy", "Lonely", "Brave", "Adamant", "Naughty", "Bold", "Docile", "Relaxed", "Impish", "Lax", "Timid", "Hasty", "Serious", "Jolly", "Naive", "Modest", "Mild", "Quiet", "Bashful", "Rash", "Calm", "Gentle", "Sassy", "Careful", "Quirky"];
	const movesById = ["", "Pound", "Karate Chop", "Double Slap", "Comet Punch", "Mega Punch", "Pay Day", "Fire Punch", "Ice Punch", "Thunder Punch", "Scratch", "Vise Grip", "Guillotine", "Razor Wind", "Swords Dance", "Cut", "Gust", "Wing Attack", "Whirlwind", "Fly", "Bind", "Slam", "Vine Whip", "Stomp", "Double Kick", "Mega Kick", "Jump Kick", "Rolling Kick", "Sand Attack", "Headbutt", "Horn Attack", "Fury Attack", "Drill Run", "Tackle", "Body Slam", "Wrap", "Take Down", "Thrash", "Double-Edge", "Tail Whip", "Poison Sting", "Twineedle", "Pin Missile", "Leer", "Bite", "Growl", "Roar", "Sing", "Supersonic", "Sonic Boom", "Disable", "Acid", "Ember", "Flamethrower", "Mist", "Water Gun", "Hydro Pump", "Surf", "Ice Beam", "Blizzard", "Psybeam", "Bubble Beam", "Aurora Beam", "Hyper Beam", "Peck", "Drill Peck", "Submission", "Low Kick", "Counter", "Seismic Toss", "Strength", "Absorb", "Mega Drain", "Leech Seed", "Growth", "Razor Leaf", "Solar Beam", "Poison Powder", "Stun Spore", "Sleep Powder", "Petal Dance", "String Shot", "Dragon Rage", "Fire Spin", "Thunder Shock", "Thunderbolt", "Thunder Wave", "Thunder", "Rock Throw", "Earthquake", "Earth Power", "Dig", "Toxic", "Confusion", "Psychic", "Hypnosis", "Meditate", "Agility", "Quick Attack", "Rage", "Teleport", "Night Shade", "Mimic", "Screech", "Double Team", "Recover", "Harden", "Minimize", "Smokescreen", "Confuse Ray", "Withdraw", "Defense Curl", "Barrier", "Light Screen", "Haze", "Reflect", "Focus Energy", "Bide", "Metronome", "Mirror Move", "Self-Destruct", "Egg Bomb", "Lick", "Smog", "Sludge Bomb", "Bone Club", "Fire Blast", "Waterfall", "Clamp", "Swift", "Head Smash", "Spike Cannon", "Constrict", "Amnesia", "Kinesis", "Soft-Boiled", "High Jump Kick", "Glare", "Dream Eater", "Poison Gas", "Barrage", "Leech Life", "Lovely Kiss", "Sky Attack", "Transform", "Bubble", "Dizzy Punch", "Spore", "Flash", "Psywave", "Splash", "Acid Armor", "Crabhammer", "Explosion", "Fury Swipes", "Bonemerang", "Rest", "Rock Slide", "Hyper Fang", "Sharpen", "Conversion", "Tri Attack", "Super Fang", "Slash", "Substitute", "Struggle", "Sketch", "Triple Kick", "Thief", "Spider Web", "Mind Reader", "Nightmare", "Flame Wheel", "Snore", "Curse", "Flail", "Conversion 2", "Aeroblast", "Cotton Spore", "Reversal", "Spite", "Powder Snow", "Protect", "Mach Punch", "Scary Face", "Feint Attack", "Sweet Kiss", "Belly Drum", "Gunk Shot", "Mud-Slap", "Octazooka", "Spikes", "Zap Cannon", "Foresight", "Destiny Bond", "Perish Song", "Icy Wind", "Detect", "Bone Rush", "Lock-On", "Outrage", "Sandstorm", "Giga Drain", "Endure", "Charm", "Rollout", "False Swipe", "Swagger", "Milk Drink", "Wild Charge", "X-scissors", "Steel Wing", "Mean Look", "Attract", "Sleep Talk", "Heal Bell", "Return", "Present", "Frustration", "Safeguard", "Pain Split", "Sacred Fire", "Magnitude", "Dynamic Punch", "Megahorn", "Dragon Breath", "Baton Pass", "Encore", "Pursuit", "Rapid Spin", "Sweet Scent", "Iron Tail", "Metal Claw", "Vital Throw", "Morning Sun", "Synthesis", "Moonlight", "Hidden Power", "Cross Chop", "Twister", "Rain Dance", "Sunny Day", "Crunch", "Mirror Coat", "Psych Up", "Extreme Speed", "Ancientpower", "Shadow Ball", "Future Sight", "Rock Smash", "Whirlpool", "Beat Up", "Fake Out", "Uproar", "Stockpile", "Spit Up", "Swallow", "Heat Wave", "Hail", "Torment", "Flatter", "Will-O-Wisp", "Memento", "Facade", "Focus Punch", "Smelling Salts", "Follow Me", "Nature Power", "Charge", "Taunt", "Helping Hand", "Trick", "Role Play", "Wish", "Assist", "Ingrain", "Superpower", "Magic Coat", "Recycle", "Revenge", "Brick Break", "Yawn", "Knock Off", "Endeavor", "Draco Meteor", "Skill Swap", "Imprison", "Refresh", "Grudge", "Snatch", "Secret Power", "Dive", "Force Palm", "Camouflage", "Tail Glow", "Luster Purge", "Mist Ball", "Feather Dance", "Teeter Dance", "Blaze Kick", "Mud Sport", "Ice Ball", "Needle Arm", "Slack Off", "Hyper Voice", "Poison Fang", "Crush Claw", "Blast Burn", "Hydro Cannon", "Meteor Mash", "Shadow Sneak", "Weather Ball", "Aromatherapy", "Fake Tears", "Air Slash", "Overheat", "Odor Sleuth", "Rock Tomb", "Silver Wind", "Flash Cannon", "Grass Whistle", "Tickle", "Cosmic Power", "Water Spout", "Signal Beam", "Shadow Punch", "Extrasensory", "Sky Uppercut", "Sand Tomb", "Sheer Cold", "Muddy Water", "Bullet Seed", "Aerial Ace", "Ice Shard", "Iron Defense", "Block", "Howl", "Dragon Claw", "Frenzy Plant", "Bulk Up", "Bounce", "Mud Shot", "Poison Tail", "Covet", "Volt Tackle", "Magical Leaf", "Water Sport", "Calm Mind", "Leaf Blade", "Dragon Dance", "Rock Blast", "Shock Wave", "Water Pulse", "Doom Desire", "Psycho Boost"];

	function readUInt16(array) { return new Uint16Array(new Uint8Array(array).buffer)[0]; }
	function readUInt32(array) { return new Uint32Array(new Uint8Array(array).buffer)[0]; }

	function parsePokemon(array) {
		var personality = readUInt32(array.slice(0x0, 0x4));
		var otid = readUInt32(array.slice(0x4, 0x8));
		var subData = array.slice(0x20, 0x50);
		var subs = [];
		var order = ["GAEM", "GAME", "GEAM", "GEMA", "GMAE", "GMEA", "AGEM", "AGME", "AEGM", "AEMG", "AMGE", "AMEG", "EGAM", "EGMA", "EAGM", "EAMG", "EMGA", "EMAG", "MGAE", "MGEA", "MAGE", "MAEG", "MEGA", "MEAG"][personality % 24];
		var subOrder = ["G", "A", "E", "M"];
		var key = personality ^ otid;
		if (key < 0) key = key >>> 0;
		for (var i = 0; i < 4; i++) {
			var sub = [];
			var encrypted = subData.slice(0xC * i, 0xC * (i + 1));
			for (var j = 0; j < 3; j++) {
				var chunk = readUInt32(encrypted.slice(0x4 * j, 0x4 * (j + 1)));
				var decrypted = chunk ^ key;
				if (decrypted < 0) decrypted = decrypted >>> 0;
				var hex = decrypted.toString(16);
				var bytes = [...Uint8Array.from((hex.length % 2 ? "0" + hex : hex).match(/.{1,2}/g).map((byte) => parseInt(byte, 16))).reverse()];
				while (bytes.length < 4) bytes.push(0);
				sub = sub.concat(bytes);
			}
			var index = subOrder.indexOf(order[i]);
			subs[index] = sub;
		}
		var species = speciesById[readUInt16(subs[0].slice(0x0, 0x2))];
		if (!species) return "";
		var nickname = "";
		for (var i = 0; i < 10; i++) {
			var byte = array[0x08 + i];
			if (byte == 255) break;
			nickname += charmap[byte];
		}
		var item = itemsById[readUInt16(subs[0].slice(0x2, 0x4))];
		var ivBlock = readUInt32(subs[3].slice(0x4, 0x8)).toString(2).padStart(32, "0");
		var ivs = { "HP": parseInt(ivBlock.slice(-5), 2), "Atk": parseInt(ivBlock.slice(-10, -5), 2), "Def": parseInt(ivBlock.slice(-15, -10), 2),
					"SpA": parseInt(ivBlock.slice(-25, -20), 2), "SpD": parseInt(ivBlock.slice(-30, -25), 2), "Spe": parseInt(ivBlock.slice(-20, -15), 2) }
		var speciesAbilities = abilitiesBySpecies[readUInt16(subs[0].slice(0x0, 0x2))];
		var ability = parseInt(ivBlock[0]) && speciesAbilities.length > 1 ? speciesAbilities[1] : speciesAbilities[0];
		var experience = readUInt32(subs[0].slice(0x4, 0x8));
		var level = 1;
		while (level < 100) {
			if (curves[curvesBySpecies[readUInt16(subs[0].slice(0x0, 0x2))]](level + 1) > experience) break;
			level++;
		}
		var nature = naturesByOrder[personality % 25];
		var moves = [];
		for (var i = 0; i < 4; i++) {
			var moveId = readUInt16(subs[1].slice(0x2 * i, 0x2 * (i + 1)));
			if (moveId) moves[i] = movesById[moveId];
		}

		var paste = nickname ? `${nickname} (${species})` : species;
		if (item) paste += ` @ ${item}`;
		if (Object.values(ivs).reduce((a, b) => a + b)) paste += "\nIVs: " + Object.keys(ivs).filter(x => ivs[x] < 31).map(x => `${ivs[x]} ${x}`).join(" / ");
		paste += `\nAbility: ${ability}`;
		if (level < 100) paste += `\nLevel: ${level}`;
		paste += `\n${nature} Nature`;
		for (var i in moves) {
			paste += `\n- ${moves[i]}`;
		}
		paste += "\n\n";
		return paste;
	}

	var paste = "";

	try {
		var saveStart = readUInt32(data.slice(0xDFFC, 0xE000)) > readUInt32(data.slice(0x1BFFC, 0x1C000)) ? 0x0 : 0xE000;
		var saveBlock = data.slice(saveStart, saveStart + 0xE000);
		var sections = [];
		for (var i = 0; i < 14; i++) {
			var section = saveBlock.slice(0x1000 * i, 0x1000 * (i + 1));
			var sectionId = section[0xFF4];
			sections[sectionId] = section;
		}
		var partySize = sections[1][0x234];
		for (var i = 0; i < partySize; i++) {
			var pokemon = parsePokemon(sections[1].slice(0x0238 + 0x64 * i, 0x0238 + 0x64 * (i + 1)));
			paste += pokemon;
		}
		var pcBuffer = [];
		for (var i = 5; i < 14; i++) {
			pcBuffer = pcBuffer.concat(sections[i].slice(0x0, 0xF80));
		}
		pcBuffer = pcBuffer.slice(0, -1968);
		var boxes = pcBuffer.slice(0x4, 0x8344);
		for (var i = 0; i < 360; i++) {
			var pokemon = parsePokemon(boxes.slice(0x50 * i, 0x50 * (i + 1)));
			if (!pokemon) continue;
			paste += pokemon;
		}

		if (!paste.trim()) {
			alert("No Pokémon were imported for some reason.");
		}

		addSets(paste, "Custom Set");
		if (document.getElementById("cc-auto-refr").checked && $("#show-cc").is(":hidden")) {
			window.refreshColorCode();
		}

		alert("Save file successfully imported.");
	} catch (ex) {
		alert("There was an error while reading the save file.");
	}
}

function ExportPokemon(pokeInfo) {
	var pokemon = createPokemon(pokeInfo);
	var setName = $(pokeInfo).find(".select2-chosen")[0].textContent.split(
		/^([^(@]+)(\((.+)\))? ?(@ (.+))?/
	)[3];
	var EV_counter = 0;
	var finalText = "";
	if (setName == "Custom Set" || setName == "Blank Set" || setName in partyOrder) finalText = pokemon.name;
	else finalText = setName + " (" + pokemon.name + ")";
	finalText += (game > 0 && pokemon.gender != "N" ? " (" + pokemon.gender + ") " : "") + (pokemon.item ? " @ " + pokemon.item : "") + "\n";
	finalText += "Level: " + pokemon.level + "\n";
	finalText += pokemon.nature && gen > 2 ? pokemon.nature + " Nature" + "\n" : "";
	if (gen === 9) {
		var teraType = pokeInfo.find(".teraType").val();
		if (teraType !== undefined && teraType !== pokemon.types[0]) {
			finalText += "Tera Type: " + teraType + "\n";
		}
	}
	finalText += pokemon.ability ? "Ability: " + pokemon.ability + "\n" : "";
	if (gen > 2) {
		var EVs_Array = [];
		for (var stat in pokemon.evs) {
			var ev = pokemon.evs[stat] ? pokemon.evs[stat] : 0;
			if (ev > 0) {
				EVs_Array.push(ev + " " + calc.Stats.displayStat(stat));
			}
			EV_counter += ev;
			if (EV_counter > 510) break;
		}
		if (EVs_Array.length > 0) {
			finalText += "EVs: ";
			finalText += serialize(EVs_Array, " / ");
			finalText += "\n";
		}
	}

	var IVs_Array = [];
	for (var stat in pokemon.ivs) {
		var iv = pokemon.ivs[stat] ? pokemon.ivs[stat] : 0;
		if (iv < 31) {
			IVs_Array.push(iv + " " + calc.Stats.displayStat(stat));
		}
	}
	if (IVs_Array.length > 0) {
		finalText += "IVs: ";
		finalText += serialize(IVs_Array, " / ");
		finalText += "\n";
	}

	for (var i = 0; i < 4; i++) {
		var moveName = pokemon.moves[i].name;
		if (moveName !== "(No Move)") {
			finalText += "- " + moveName + "\n";
		}
	}
	finalText = finalText.trim();
	return finalText;
}

$("#exportL").click(function () {
	$("textarea.import-team-text").val(ExportPokemon($("#p1")));
});

$("#exportR").click(function () {
	$("textarea.import-team-text").val(ExportPokemon($("#p2")));
});

$("#saveL").click(function () {
	var pokes = ExportPokemon($("#p1"));
	addSets(pokes, "Custom Set");
	if (document.getElementById("cc-auto-refr").checked && $("#show-cc").is(":hidden")) {
		window.refreshColorCode();
	}
});

function serialize(array, separator) {
	var text = "";
	for (var i = 0; i < array.length; i++) {
		if (i < array.length - 1) {
			text += array[i] + separator;
		} else {
			text += array[i];
		}
	}
	return text;
}

function statToLegacyStat(stat) {
	switch (stat) {
	case 'hp':
		return "hp";
	case 'atk':
		return "at";
	case 'def':
		return "df";
	case 'spa':
		return "sa";
	case 'spd':
		return "sd";
	case 'spe':
		return "sp";
	}
}

function addToDex(poke) {
	var dexObject = {};
	if ($("#randoms").prop("checked")) {
		if (GEN9RANDOMBATTLE[poke.name] == undefined) GEN9RANDOMBATTLE[poke.name] = {};
		if (GEN8RANDOMBATTLE[poke.name] == undefined) GEN8RANDOMBATTLE[poke.name] = {};
		if (GEN7RANDOMBATTLE[poke.name] == undefined) GEN7RANDOMBATTLE[poke.name] = {};
		if (GEN6RANDOMBATTLE[poke.name] == undefined) GEN6RANDOMBATTLE[poke.name] = {};
		if (GEN5RANDOMBATTLE[poke.name] == undefined) GEN5RANDOMBATTLE[poke.name] = {};
		if (GEN4RANDOMBATTLE[poke.name] == undefined) GEN4RANDOMBATTLE[poke.name] = {};
		if (GEN3RANDOMBATTLE[poke.name] == undefined) GEN3RANDOMBATTLE[poke.name] = {};
		if (GEN2RANDOMBATTLE[poke.name] == undefined) GEN2RANDOMBATTLE[poke.name] = {};
		if (GEN1RANDOMBATTLE[poke.name] == undefined) GEN1RANDOMBATTLE[poke.name] = {};
	} else {
		if (SETDEX_SV[poke.name] == undefined) SETDEX_SV[poke.name] = {};
		if (SETDEX_SS[poke.name] == undefined) SETDEX_SS[poke.name] = {};
		if (SETDEX_SM[poke.name] == undefined) SETDEX_SM[poke.name] = {};
		if (SETDEX_XY[poke.name] == undefined) SETDEX_XY[poke.name] = {};
		if (SETDEX_BW[poke.name] == undefined) SETDEX_BW[poke.name] = {};
		if (SETDEX_DPP[poke.name] == undefined) SETDEX_DPP[poke.name] = {};
		if (SETDEX_ADV[poke.name] == undefined) SETDEX_ADV[poke.name] = {};
		if (SETDEX_GSC[poke.name] == undefined) SETDEX_GSC[poke.name] = {};
		if (SETDEX_RBY[poke.name] == undefined) SETDEX_RBY[poke.name] = {};
	}
	if (poke.ability !== undefined) {
		dexObject.ability = poke.ability;
	}
	if (poke.teraType !== undefined) {
		dexObject.teraType = poke.teraType;
	}
	dexObject.level = poke.level;
	dexObject.evs = poke.evs;
	dexObject.ivs = poke.ivs;
	dexObject.dvs = poke.dvs;
	dexObject.moves = poke.moves;
	dexObject.nature = poke.nature;
	dexObject.item = poke.item;
	dexObject.isCustomSet = poke.isCustomSet;
	var customsets;
	if (localStorage.customsets) {
		customsets = JSON.parse(localStorage.customsets);
	} else {
		customsets = {};
	}
	if (!customsets[poke.name]) {
		customsets[poke.name] = {};
	}
	customsets[poke.name][poke.nameProp] = dexObject;
	if (poke.name === "Aegislash-Blade") {
		if (!customsets["Aegislash-Shield"]) {
			customsets["Aegislash-Shield"] = {};
		}
		customsets["Aegislash-Shield"][poke.nameProp] = dexObject;
	}
	updateDex(customsets);
}

function updateDex(customsets, callback = null) {
	for (var pokemon in customsets) {
		for (var moveset in customsets[pokemon]) {
			if (!SETDEX_SV[pokemon]) SETDEX_SV[pokemon] = {};
			SETDEX_SV[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_SS[pokemon]) SETDEX_SS[pokemon] = {};
			SETDEX_SS[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_SM[pokemon]) SETDEX_SM[pokemon] = {};
			SETDEX_SM[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_XY[pokemon]) SETDEX_XY[pokemon] = {};
			SETDEX_XY[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_BW[pokemon]) SETDEX_BW[pokemon] = {};
			SETDEX_BW[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_DPP[pokemon]) SETDEX_DPP[pokemon] = {};
			SETDEX_DPP[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_ADV[pokemon]) SETDEX_ADV[pokemon] = {};
			SETDEX_ADV[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_GSC[pokemon]) SETDEX_GSC[pokemon] = {};
			SETDEX_GSC[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_RBY[pokemon]) SETDEX_RBY[pokemon] = {};
			SETDEX_RBY[pokemon][moveset] = customsets[pokemon][moveset];

			var gamemode = $("input[name='gamemode']:checked + label").html();
			if (gamemode == "Vanilla") {
				if (!CUSTOMSETDEX_Y[pokemon]) CUSTOMSETDEX_Y[pokemon] = {};
				CUSTOMSETDEX_Y[pokemon][moveset] = customsets[pokemon][moveset];
				if (!CUSTOMSETDEX_E[pokemon]) CUSTOMSETDEX_E[pokemon] = {};
				CUSTOMSETDEX_E[pokemon][moveset] = customsets[pokemon][moveset];
				if (!CUSTOMSETDEX_FRLG[pokemon]) CUSTOMSETDEX_FRLG[pokemon] = {};
				CUSTOMSETDEX_FRLG[pokemon][moveset] = customsets[pokemon][moveset];
				if (!CUSTOMSETDEX_Pl[pokemon]) CUSTOMSETDEX_Pl[pokemon] = {};
				CUSTOMSETDEX_Pl[pokemon][moveset] = customsets[pokemon][moveset];
				if (!CUSTOMSETDEX_HGSS[pokemon]) CUSTOMSETDEX_HGSS[pokemon] = {};
				CUSTOMSETDEX_HGSS[pokemon][moveset] = customsets[pokemon][moveset];
				if (!CUSTOMSETDEX_XY[pokemon]) CUSTOMSETDEX_XY[pokemon] = {};
				CUSTOMSETDEX_XY[pokemon][moveset] = customsets[pokemon][moveset];
				if (!CUSTOMSETDEX_SM[pokemon]) CUSTOMSETDEX_SM[pokemon] = {};
				CUSTOMSETDEX_SM[pokemon][moveset] = customsets[pokemon][moveset];
			} else {
				if (!CUSTOMHACKSETDEX_EK[pokemon]) CUSTOMHACKSETDEX_EK[pokemon] = {};
				CUSTOMHACKSETDEX_EK[pokemon][moveset] = customsets[pokemon][moveset];
			}

			var poke = {name: pokemon, nameProp: moveset};	
			addBoxed(poke);
		}
	}
	localStorage.customsets = JSON.stringify(customsets);

	if (callback) {
		callback();
	}
}

function addSets(pokes, name) {
	var rows = pokes.split("\n");
	var currentRow;
	var currentPoke;
	var addedpokes = 0;
	for (var i = 0; i < rows.length; i++) {
		currentRow = rows[i].replace(" (M)", "").replace(" (F)", "");
		var split = currentRow.split(/^([^(@]+)(\((.+)\))? ?(@ (.+))?/);
		if (split[3] && calc.SPECIES[9][checkExeptions(split[3].trim())]) {
			if (currentPoke) {
				addToDex(currentPoke);
				addBoxed(currentPoke);
				addedpokes++;
			}

			currentPoke = Object.assign({}, calc.SPECIES[9][checkExeptions(split[3].trim())]);
			currentPoke.name = split[3].trim().replace("Nidoran-f", "Nidoran-F").replace("Nidoran-m", "Nidoran-M");
			currentPoke.nameProp = split[1].trim();
			currentPoke.moves = [];
			currentPoke.nature = "Hardy";
		} else if (split[1] && calc.SPECIES[9][checkExeptions(split[1].trim())]) {
			if (currentPoke) {
				addToDex(currentPoke);
				addBoxed(currentPoke);
				addedpokes++;
			}

			currentPoke = calc.SPECIES[9][checkExeptions(split[1].trim())];
			currentPoke.name = split[1].trim().replace("-f", "-F").replace("-m", "-M");
			currentPoke.nameProp = name;
			currentPoke.moves = [];
			currentPoke.nature = "Hardy";
		}
		if (!currentPoke) continue;
		if (split[5] && calc.ITEMS[9].includes(split[5].trim())) currentPoke.item = split[5].trim();
		currentPoke.isCustomSet = true;
		if (currentRow.includes("Ability: ")) {
			var ability = currentRow.replace("Ability: ", "").trim();
			if (calc.ABILITIES[9].includes(ability)) currentPoke.ability = ability;
		}
		if (currentRow.includes("Level: ")) {
			var level = currentRow.replace("Level: ", "").trim();
			if (parseInt(level)) currentPoke.level = parseInt(level);
			else currentPoke.level = 100;
		}
		if (currentRow.includes("Tera Type: ")) {
			var teraType = currentRow.replace("Tera Type: ", "").trim();
			if (calc.TYPE_CHART[9][teraType]) currentPoke.teraType = teraType;
		}
		if (currentRow.includes(" Nature")) {
			var nature = currentRow.replace(" Nature", "").trim();
			if (calc.NATURES[nature]) currentPoke.nature = nature;
		}
		if (currentRow.includes("DVs: ")) {
			currentPoke.dvs = {};
			var dvs = currentRow.replace("DVs: ", "").trim().split(" / ");
			for (var j in dvs) {
				var dv = dvs[j];
				var stat = statToLegacyStat(dv.split(" ")[1].toLowerCase());
				var value = parseInt(dv.split(" ")[0]);
				currentPoke.dvs[stat] = value;
			}
			if (currentPoke.dvs["sa"] !== undefined) currentPoke.dvs["sl"] = currentPoke.dvs["sa"];
		}
		if (currentRow.includes("IVs: ")) {
			if (gen < 3) {
				currentPoke.dvs = {};
				var dvs = currentRow.replace("IVs: ", "").trim().split(" / ");
				for (var j in dvs) {
					var dv = dvs[j];
					var stat = statToLegacyStat(dv.split(" ")[1].toLowerCase());
					var value = parseInt(dv.split(" ")[0]);
					currentPoke.dvs[stat] = value;
				}
				if (currentPoke.dvs["sa"] !== undefined) currentPoke.dvs["sl"] = currentPoke.dvs["sa"];
			} else {
				currentPoke.ivs = {};
				var ivs = currentRow.replace("IVs: ", "").trim().split(" / ");
				for (var j in ivs) {
					var iv = ivs[j];
					var stat = statToLegacyStat(iv.split(" ")[1].toLowerCase());
					var value = parseInt(iv.split(" ")[0]);
					currentPoke.ivs[stat] = value;
				}
			}
		}
		if (currentRow.includes("EVs: ")) {
			currentPoke.evs = {};
			var evs = currentRow.replace("EVs: ", "").trim().split(" / ");
			for (var j in evs) {
				var ev = evs[j];
				var stat = statToLegacyStat(ev.split(" ")[1].toLowerCase());
				var value = parseInt(ev.split(" ")[0]);
				currentPoke.evs[stat] = value;
			}
		}
		if (currentRow.startsWith("- ")) {
			var move = currentRow.replace("- ", "").replace("[", "").replace("]", "").trim();
			if (game == "Emerald Kaizo") move = move.replace("High Jump Kick", "Hi Jump Kick").replace("Sonic Boom", "Sonicboom").replace("Ancient Power", "Ancientpower").replace("Feint Attack", "Faint Attack");
			currentPoke.moves.push(move);
		}
	}
	if (currentPoke) {
		addToDex(currentPoke);
		addBoxed(currentPoke);
		addedpokes++;
	}
	if (addedpokes > 0) {
		$(allPokemon("#importedSetsOptions")).css("display", "inline");
	} else {
		alert("No sets imported, please check your syntax and try again");
	}
}

function checkExeptions(poke) {
	switch (poke) {
	case 'Aegislash':
		poke = "Aegislash-Blade";
		break;
	case 'Basculin-Blue-Striped':
		poke = "Basculin";
		break;
	case 'Gastrodon-East':
		poke = "Gastrodon";
		break;
	case 'Mimikyu-Busted-Totem':
		poke = "Mimikyu-Totem";
		break;
	case 'Mimikyu-Busted':
		poke = "Mimikyu";
		break;
	case 'Nidoran-f':
		poke = "Nidoran-F";
		break;
	case 'Nidoran-m':
		poke = "Nidoran-M";
		break;
	case 'Pikachu-Belle':
	case 'Pikachu-Cosplay':
	case 'Pikachu-Libre':
	case 'Pikachu-Original':
	case 'Pikachu-Partner':
	case 'Pikachu-PhD':
	case 'Pikachu-Pop-Star':
	case 'Pikachu-Rock-Star':
		poke = "Pikachu";
		break;
	case 'Vivillon-Fancy':
	case 'Vivillon-Pokeball':
		poke = "Vivillon";
		break;
	case 'Florges-White':
	case 'Florges-Blue':
	case 'Florges-Orange':
	case 'Florges-Yellow':
		poke = "Florges";
		break;
	case 'Shellos-East':
		poke = "Shellos";
		break;
	case 'Deerling-Summer':
	case 'Deerling-Autumn':
	case 'Deerling-Winter':
		poke = "Deerling";
		break;
	}
	return poke;

}

$("#clearSets").click(function () {
	var yes = confirm("Do you really wish to delete all your Pokémon?")
	if (!yes){
		return
	}
	localStorage.removeItem("customsets");
	$(allPokemon("#importedSetsOptions")).hide();
	loadDefaultLists();
	for (let zone of document.getElementsByClassName("dropzone")){
		zone.innerHTML = "";
	}
});

$(allPokemon("#importedSets")).click(function () {
	var pokeID = $(this).parent().parent().prop("id");
	var showCustomSets = $(this).prop("checked");
	if (showCustomSets) {
		loadCustomList(pokeID);
	} else {
		loadDefaultLists();
	}
});

$(document).ready(function () {
	var customSets;
	placeBsBtn();
	if (localStorage.customsets) {
		customSets = JSON.parse(localStorage.customsets);
		updateDex(customSets, selectFirstMon);
		$(allPokemon("#importedSetsOptions")).css("display", "inline");
	} else {
		loadDefaultLists();
	}
});

SETTINGS = {
    switchGuide: true,
    riskyAI: true,
    switchOut: true
};

$("#settings").on("click", function() {
	$("#settings-container").show();
});
$("#settings-exit").on("click", function() {
	$("#settings-container").hide();
});
$("#settings-container").on("click", function(e) {
	if (e.target == this) $("#settings-container").hide();
});

$("input:radio[name='switchGuide']").change(function () {
	SETTINGS.switchGuide = $(this).val() == "On";
	setSwitchGuide();
    saveSettings();
});

$("input:radio[name='riskyAI']").change(function () {
	SETTINGS.riskyAI = $(this).val() == "On";
	setRiskyAI();
    saveSettings();
});

$("input:radio[name='switchOut']").change(function () {
	SETTINGS.switchOut = $(this).val() == "On";
	setSwitchOut();
    saveSettings();
});

function setSwitchGuide() {
    if (SETTINGS.switchGuide) {
        $(`.switchGuide.game-specific.gm${gameId}`).show();
    } else {
        $(`.switchGuide`).hide();
    }
}

function setRiskyAI() {
    if (SETTINGS.riskyAI) {
        $(`.wrapper`).removeClass("ignore-risky");
    } else {
        $(`.wrapper`).addClass("ignore-risky");
    }
}

function setSwitchOut() {
    if (SETTINGS.switchOut) {
        $(`.wrapper`).removeClass("ignore-switch-out");
    } else {
        $(`.wrapper`).addClass("ignore-switch-out");
    }
}



function saveSettings() {
    localStorage.settings = JSON.stringify(SETTINGS);
}

$(document).ready(function() {
    if (!localStorage.settings) {
        saveSettings();
    } else {
        SETTINGS = JSON.parse(localStorage.settings);
        $(`#switchGuide${SETTINGS.switchGuide ? "On" : "Off"}:radio[name='switchGuide']`).prop("checked", true).change();
        $(`#riskyAI${SETTINGS.riskyAI ? "On" : "Off"}:radio[name='riskyAI']`).prop("checked", true).change();
        $(`#switchOut${SETTINGS.switchOut ? "On" : "Off"}:radio[name='switchOut']`).prop("checked", true).change();
    }
    setSwitchGuide();
});

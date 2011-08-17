// Access user settings
var bkground = chrome.extension.getBackgroundPage();

// Store settings for each mode
var normal = new Object();
var productive = new Object();

var saveButton = $('button-save');
var closeButton = $('button-close');

/*
 * Reads the user settings and classifies them by mode
 */
function loadOptions() {
    normal.notifVal = bkground.settings.normalNotif;
    normal.chatVal = bkground.settings.normalChat;

    productive.notifVal = bkground.settings.productiveNotif;
    productive.chatVal = bkground.settings.productiveChat;
};

/*
 * Applies the initial user settings to the options page
 */
function applyCurrentOptions() {
    $('normal_notif').checked = normal.notifVal == "true";
    $('normal_chat').value = normal.chatVal;

    $('productive_notif').checked = productive.notifVal == "true";
    $('productive_chat').value = productive.chatVal;
};

/*
 * Stores the user settings from the options page and then asks the controller
 * to apply the changes right away
 */
function updateForm() {
    bkground.settings.normalNotif = $('normal_notif').checked;
    bkground.settings.normalChat = $('normal_chat').value;

    bkground.settings.productiveNotif = $('productive_notif').checked;
    bkground.settings.productiveChat = $('productive_chat').value;

    var info = $('info-message');
    info.style.opacity = 1;
    setTimeout(function() {
        info.style.opacity = 0.0;
    }, 1000);

    bkground.triggerUpdate();
};

/*
 * Closes the options page
 */
function closeForm() {
    window.close();
};

loadOptions();
applyCurrentOptions();

saveButton.addEventListener('click', updateForm, false);
closeButton.addEventListener('click', closeForm, false);

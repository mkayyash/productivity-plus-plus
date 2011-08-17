
var bkground = chrome.extension.getBackgroundPage();
// sets the initial icon according to mode
chrome.browserAction.setIcon({
    path : 'img/' + bkground.settings.mode + '.gif'
});

/*
 * Informs the relevant content scripts running in the tab (including iframes)
 * to do a refresh
 */
refreshScriptsTab = function(tab) {
    if (tab.url.match("plus.google.com")) {
        chrome.tabs.sendRequest(tab.id, {
            requestType : "updateChat"
        });
    } else if (tab.url.match("google.com")) {
        chrome.tabs.sendRequest(tab.id, {
            requestType : "updateGplusNotif"
        });
    }
};

/*
 * Loops through the tabs in all windows (only the ones listed under permissions
 * in manifest.json) and requests a refresh
 */
triggerUpdate = function() {
    chrome.windows.getAll({}, function(windows) {
        for ( var i in windows) {
            chrome.tabs.getAllInWindow(windows[i].id, function(tabs) {
                for ( var i in tabs) {
                    var tab = tabs[i];
                    refreshScriptsTab(tab);
                }
            }.bind(this));
        }
    }.bind(this));
};

/*
 * Toggles the mode when the user clicks the productivity icon and then triggers
 * an all tab update
 */
chrome.browserAction.onClicked.addListener(function() {
    settings.mode = settings.mode == "normal" ? "productive" : "normal";
    // updates the icon according to new mode
    chrome.browserAction.setIcon({
        path : 'img/' + bkground.settings.mode + '.gif'
    });
    triggerUpdate();
});

/*
 * Listens to messages from content scripts and provides the relevant options
 * according to mode and the script sender's name
 */
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.requestType == "getSettings") {
        var mode = settings.mode;
        var options = "";

        if (request.requestSender == "HideGplus")
            options = mode == "normal" ? settings.normalNotif
                    : settings.productiveNotif;
        if (request.requestSender == "ChatSignOut")
            options = mode == "normal" ? settings.normalChat
                    : settings.productiveChat;

        sendResponse({
            mode : settings.mode,
            options : options
        });
    } else {
        sendResponse({});
    }
});

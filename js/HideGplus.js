/**
 * Injected in all the iFrames of google pages. Controls the visibility of Gplus
 * notifications
 * 
 * @author Mohamad Ayyash (mkayyash@gmail.com) 2011
 * @constructor
 */
HideGplus = function() {
    this.mode = null;
    this.desiredVisib = null;
    this.state = 0;
    this.timerHandler = null;
    this.delay = 100;
    this.maxRuns = 10;
    this.currentRuns = 0;

    this.notifID = 'gbg1';

    // Listens to updates from the background page (e.g. when user toggles the
    // productivity button
    chrome.extension.onRequest.addListener(function(request, sender,
            sendResponse) {
        if (request.requestType == "updateGplusNotif") {
            clearTimeout(this.timerHandler); // kills running instances
            this.init();
        }
        sendResponse({});
    }.bind(this));
};

/**
 * Request configurations from the background page.
 */
HideGplus.prototype.init = function() {
    chrome.extension.sendRequest({
        requestType : "getSettings",
        requestSender : "HideGplus"
    }, function(response) {
        this.mode = response.mode;
        this.desiredVisib = (response.options == "true" ? "block" : "none");
        clearTimeout(this.timerHandler);
        this.state = 0;
        this.currentRuns = 0;
        this.apply();
    }.bind(this));
};

/**
 * Starts the injector's timer-driven process.
 */
HideGplus.prototype.apply = function() {
    this.timerHandler = setTimeout(this.start.bind(this), this.delay);
};

/**
 * Starts the state machine. Hides/Shows the notifications according to settings
 */
HideGplus.prototype.start = function() {
    if (this.currentRuns > this.maxRuns) {
        this.state = 1;
    }
    if (this.state == 0) {
        if ($(this.notifID)) {
            $(this.notifID).style.display = this.desiredVisib;
            this.state = 1;
        }
    }
    if (this.state == 1) {
        clearTimeout(this.timerHandler);
    }
    if (this.state == 0) {
        this.timerHandler = setTimeout(this.start.bind(this), this.delay);
    }
    this.currentRuns++;
};

var ch = new HideGplus();
ch.init();

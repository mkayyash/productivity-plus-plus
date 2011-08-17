/**
 * Injected in all the iFrames of pages that host google's talk gadget (e.g. G+)
 * in order to update the chat status.
 * 
 * TODO Support Gmail's talk gadget
 * 
 * @author Mohamad Ayyash (mkayyash) 2011
 * @constructor
 */
ChatSignOut = function() {
    this.mode = null;
    this.desiredChat = null;
    this.state = 0;
    this.timerHandler = null;
    this.delay = 500;
    this.maxRuns = 10;
    this.currentRuns = 0;

    this.statusID = ':pf';
    this.chatBoxID = ':pe';
    this.availableID = "*mba";
    this.busyID = "*mbb";
    this.invisibleID = "*mi";
    this.chatHoverID = "hover";

    // Listens to updates from the background page (e.g. when user toggles the
    // productivity button
    chrome.extension.onRequest.addListener(function(request, sender,
            sendResponse) {
        if (request.requestType == "updateChat") {
            clearTimeout(this.timerHandler);
            this.state = 0;
            this.currentRuns = 0;
            this.init();
        }
        sendResponse({});
    }.bind(this));
};

/**
 * Request configurations from the background page.
 */
ChatSignOut.prototype.init = function() {
    chrome.extension.sendRequest({
        requestType : "getSettings",
        requestSender : "ChatSignOut"
    }, function(response) {
        this.mode = response.mode;
        this.desiredChat = response.options;
        clearTimeout(this.timerHandler);
        this.state = 0;
        this.currentRuns = 0;
        this.apply();
    }.bind(this));
};

/**
 * Starts the injector's timer-driven process.
 */
ChatSignOut.prototype.apply = function() {
    this.timerHandler = setTimeout(this.start.bind(this), this.delay);
};

/**
 * Starts the state machine. The talk gadget is composed of several iFrames so
 * several content scripts will 'collaborate' in each iFrame according to the
 * existence of several elements.
 */
ChatSignOut.prototype.start = function() {
    // Prevents the script from running pointlessly for too long
    if (this.currentRuns > this.maxRuns) {
        this.state = 1;
    }
    if (this.state == 0) {
        if ($(this.statusID) && $(this.statusID).innerText != this.desiredChat
                && $(this.chatBoxID)) {
            this.clickDiv($(this.chatBoxID));
            this.state = 1;
        } else if ($(this.statusID)
                && $(this.statusID).innerText == this.desiredChat) {
            this.state = 1;
        } else if ($(this.getStatusID(this.desiredChat))
                && $(this.chatHoverID).style.display != 'none') {
            this.clickDiv($(this.getStatusID(this.desiredChat)));
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

/**
 * Simulates clicking on divs. Works only with visible divs.
 * 
 * @param divId
 */
ChatSignOut.prototype.clickDiv = function(divId) {
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('mousedown', true, true);
    divId.dispatchEvent(clickEvent);

    clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('click', true, true);
    divId.dispatchEvent(clickEvent);

    clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('mouseup', true, true);
    divId.dispatchEvent(clickEvent);
};

/**
 * Returns the ID of the relevant chat status item
 * 
 * @param desiredChat
 *            String representation of the chat status item
 * @returns {String} Chat item's ID
 */
ChatSignOut.prototype.getStatusID = function(desiredChat) {
    if (desiredChat == "Available") {
        return this.availableID;
    } else if (desiredChat == "Busy") {
        return this.busyID;
    }
    if (desiredChat == "Invisible") {
        return this.invisibleID;
    }
};

var ch = new ChatSignOut();
ch.init();

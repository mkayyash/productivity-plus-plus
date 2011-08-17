// Some helper functions that might prove handy

$ = function(f, e) {
    if (e) {
        var iframe = document.getElementById(f);
        var frameDoc = iframe.contentWindow;
        if (frameDoc) {
            var el = frameDoc.getElementById(e);
            return el;
        }
    } else {
        var el = document.getElementById(f);
        return el;
    }
};

Node.prototype.insertAfter = function(newNode, refNode) {
    if (refNode.nextSibling) {
        return this.insertBefore(newNode, refNode.nextSibling);
    } else {
        return this.appendChild(newNode);
    }
};

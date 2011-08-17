// General Settings used by all pages via the background page
settings = {
  get mode() {
	  var key = localStorage['mode'];
	  return (typeof key == 'undefined') ? "normal" : key;
  },
  set mode(val) {
	  localStorage['mode'] = val;
  },

  get normalNotif() {
	  var key = localStorage['normalNotif'];
	  return (typeof key == 'undefined') ? "true" : key;
  },
  set normalNotif(val) {
	  localStorage['normalNotif'] = val;
  },

  get normalChat() {
	  var key = localStorage['normalChat'];
	  return (typeof key == 'undefined') ? "Available" : key;
  },
  set normalChat(val) {
	  localStorage['normalChat'] = val;
  },

  get productiveNotif() {
	  var key = localStorage['productiveNotif'];
	  return (typeof key == 'undefined') ? "false" : key;
  },
  set productiveNotif(val) {
	  localStorage['productiveNotif'] = val;
  },

  get productiveChat() {
	  var key = localStorage['productiveChat'];
	  return (typeof key == 'undefined') ? "Busy" : key;
  },
  set productiveChat(val) {
	  localStorage['productiveChat'] = val;
  }		  
};

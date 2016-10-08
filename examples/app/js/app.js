//~ copyright ../copyright.txt

//~ define withError
//~ base ~.Warnings.notification

//~ if withError
	//~ base ~.Warnings.error
//~ endif

(function() {

	//~ component warnings.js

	var body = document.body;

	warnings.notification(body, 'Notification message');
	//~ if withError
	warnings.error(body, 'Error message');
	//~ endif

	//~ part other.js


})();

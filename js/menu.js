var MENU = {
	init: function() {
		if(!$("#onLoadMenu").length) {
			$("body").append("<div id='onLoadMenu'></div>");
			$("#onLoadMenu").load("./menu.html");
		}
	},
	initOnLoad: function() {
		$(".menu .menu-opener").on("click", MENU.toggleMenuVisibility);
	},
	toggleMenuVisibility: function() {
		if($(this).closest(".menu").hasClass("opened")) $(this).closest(".menu").removeClass("opened");
		else $(this).closest(".menu").addClass("opened");
	}
};
$(MENU.init);
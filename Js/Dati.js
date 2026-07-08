/* Dati.js
Gestisce il menu hamburger, il sottomenu "Catalogo" e il modale
"Scarica i dati" della pagina "Dati".
(La tabella dei metadati è ora scritta staticamente in Dati.html,
non serve più nessuno script per popolarla.) */

$(document).ready(function () {

	/* NAVBAR */

	$("#toggleBtn").on("click", function () {
		var isOpen = $("#navMenu").toggleClass("open").hasClass("open");
		$(this).attr("aria-expanded", isOpen);
	});

	/* SOTTOMENU "CATALOGO" */

	$("#catalogoToggle").on("click", function () {
		var isOpen = $("#catalogoMenu").toggleClass("open").hasClass("open");
		$(this).attr("aria-expanded", isOpen);
		$(this).find(".arrow").css(
			"transform",
			isOpen ? "rotate(180deg)" : "rotate(0deg)"
		);
	});

	/* MODALE "SCARICA I DATI" */

	$(".places-btn[data-toggle='dropdown']").on("click", function () {
		$("#dataModal").addClass("open");
		$(this).attr("aria-expanded", true);
	});

	$(".btn-close-m").on("click", function () {
		$("#dataModal").removeClass("open");
	});

	// Chiude il modale cliccando fuori dal contenuto
	$("#dataModal").on("click", function (e) {
		if (e.target === this) {
			$(this).removeClass("open");
		}
	});
});
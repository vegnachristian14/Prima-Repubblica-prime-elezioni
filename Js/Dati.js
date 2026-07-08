/* Dati.js
Popola la tabella #item-table della pagina "Dati" e 
abilita ordinamento, ricerca ed esportazione (CSV/Excel) 
tramite la libreria DataTables */

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

	/* TABELLA DEI METADATI
	Il file è un CSV: necessaria libreria PapaParse per leggerlo e 
	trasformarlo in un array di oggetti prima di passarlo a DataTables */

	Papa.parse("../Csv/Tabella_pag_dati.csv", {
		download: true, /* dice a PapaParse di scaricare il file dall'URL indicato (non di leggere una stringa già in memoria) */
		header: true, /* usa la prima riga del CSV come nomi delle proprietà di ciascun oggetto */
		skipEmptyLines: true,
		complete: function (results) {
			var dati = results.data;
			$("#item-table").DataTable({
				data: dati,
				columns: [
					{
						/* Titolo: link cliccabile che rimanda alla scheda/risorsa (campo nav_link) */
						data: "titolo",
						render: function (titolo, type, row) {
							if (type === "display" && row.nav_link && row.nav_link !== "#") {
								return '<a href="' + row.nav_link + '">' + titolo + "</a>";
							}
							return titolo;
						},
					},
					{ data: "data" },
					{ data: "creatore" },
					{ data: "descrizione" },
				],
				/* TESTI IN ITALIANO PER L'INTERFACCIA DELLA TABELLA */

				language: {
					search: "Cerca:",
					lengthMenu: "Mostra _MENU_ risorse per pagina",
					info: "Da _START_ a _END_ di _TOTAL_ risorse",
					infoEmpty: "Nessuna risorsa disponibile",
					infoFiltered: "(filtrate da _MAX_ risorse totali)",
					zeroRecords: "Nessuna risorsa corrisponde alla ricerca",
					paginate: {
						first: "Prima",
						last: "Ultima",
						next: "Successiva",
						previous: "Precedente",
					},
				},
				/* PULSANTI DI EXPORT: scaricano solo le righe
				filtrate/visibili in tabella (non l'intero catalogo) */

				dom: '<"data-table-top"lf>rt<"data-table-bottom"ip>B',
				buttons: [
					{
						extend: "csvHtml5",
						text: "CSV",
						className: "to-filter-btn",
						title: "dati_filtrati",
						exportOptions: { columns: [0, 1, 2, 3] },
					},
					{
						extend: "excelHtml5",
						text: "Excel",
						className: "to-filter-btn",
						title: "dati_filtrati",
						exportOptions: { columns: [0, 1, 2, 3] },
					},
				],
				pageLength: 10,
			});
		},
		error: function () {
			console.error(
				"Impossibile caricare Csv/Tabella_pag_dati.csv: verifica che il percorso del file sia corretto."
			);
		},
	});
});

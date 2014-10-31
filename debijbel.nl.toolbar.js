/**
 * This code is used to create an toolbar for debijbel.nl
 */

 //global reftagger settings (default settings)
 var refTagger = {
		settings: {
			bibleReader: "bible.faithlife",
			bibleVersion: "NIV"			
		}
	};


// using anonymous self executing function to protect the functions in their own scope
// see: http://markdalgleish.com/2011/03/self-executing-anonymous-functions/
 (function (window, document, $, undefined) {

 	/**
 	 * For including scripts
 	 */
 	 function require(scriptUrl, optionalClassName, onLoadFunction) {
 	 	var s = document.createElement('script');

 	 	s.type = 'text/javascript';
 	 	s.src = scriptUrl;

 	 	if (typeof(optionalClassName) != 'undefined')
 	 		s.className = optionalClassName;

 	 	if (typeof(onLoadFunction) != 'undefined') {
 	 		s.onreadystatechange = onLoadFunction;
 	 		s.onload = onLoadFunction;
 	 	}

 	 	document.getElementsByTagName('head')[0].appendChild(s);

 	 }

 	 var refTaggerLoaded = false;

 	 /**
 	  * Loads the refTagger script with a protocol independant URL
 	  */
 	 function loadRefTagger(onLoadFunction) {
 	 	if (refTaggerLoaded) {
 	 		if (typeof(onLoadFunction) == 'function')
 	 			onLoadFunction();

 	 		return;
 	 	}

 	 	require('//api.reftagger.com/v2/RefTagger.js', 'openbijbelreftaggerscript', function () {
 	 		refTaggerLoaded = true;
 	 		
 	 		if (typeof(onLoadFunction) == 'function')
 	 			onLoadFunction();
 	 	});
 	 }

 	 /**
 	  * Loads the bible translation. By default it's NIV.
 	  */
 	function chooseTranslation(translation) {
 		if (typeof(translation) == 'undefined') {
 			translation = 'NIV';
 		}

 		// set the already existing global variable with new options (so no var before this variable)
 		if (!refTaggerLoaded)
	 		refTagger = {
				settings: {
					bibleReader: "bible.faithlife",
					bibleVersion: translation		
				}
			};

		loadRefTagger(function () {
			$(".rtBibleRef").each(function(){
				var previousTranslation = $(this).attr("data-version");
				$(this).attr("data-version", translation.toLowerCase());
				$(this).attr("href", $(this).attr("href").replace(previousTranslation, translation.toLowerCase()));
			});

			openBijbelToolBar.find(".openbijbelvertaling").html("[[|]] &nbsp; " + translation + " ");
			openBijbelToolBar.find('.vertalingkeus').css("text-decoration","none");
			openBijbelToolBar.find('.vertalingkeus[data-translation="' + translation + '"]').css("text-decoration","underline");
		
			$('.openbijbelvertaling').text(openBijbelToolBar.find(".openbijbelvertaling").text());
		});
		
 	}

 	/**
 	 * Shows references instead of verse numbers
 	 */
 	function showReferences() {
 		$("sup").each(function(){
			$(this).text($(this).attr('id'));
		});
		var startVerse = $("sup").first().text();
 	}

 	/**
 	 * Adds a Biblia embedment in the extra column
 	 */
	function embedBiblia() {
		var startVerse = $("sup").first().text();
		$(".OpenBijbelEmbeddedBiblia").html('<biblia:bible layout="minimal" resource="niv2011" width="400px" height="1200px" startingReference="' + startVerse + '"></biblia:bible>');
		
		var url = "//biblia.com/api/logos.biblia.js";
		$.getScript( url, function() {
			logos.biblia.init();
		});
	}
	
 	/**
 	 * Split columns
 	 */
 	function splitColumns(extraColumnCount) {
 		$(".tr-1").after(
 			'<div class="openbijbelvertalingtekst">'
 				+ '<div id="OpenBijbelEmbeddedBiblia" class="OpenBijbelEmbeddedBiblia">'
				+ '</div>'
 			+ '</div>'
 		);


		embedBiblia();

		$('.openbijbelvertaling').text(openBijbelToolBar.find(".openbijbelvertalingnaam").text());

		$(".openbijbelvertalingtekst").css({
			"float": "right",
			"width": "40%",
			"height": "100%",
			"padding": "10px"
		});

		// breedte van translation - 30 voor bij 2 kolommen en 65 bij 1
		if (extraColumnCount == 1) {
			$(".translation").css({
				"width": "58%"
			});
		} else if (extraColumnCount == 2) {
			$(".translation").css({
				"width": "29%"
			});
		}
		
 	}

 	// This variable will be used to attach a jQuery reference to the Open Bijbel top bar. 
 	// So we can use it in multiple functions.
 	var openBijbelToolBar = undefined;

 	/**
 	 *	Build the top bar
 	 */
 	function setupTopBar() {
 		// add the basics to the stickynotes top bar
 		$(".stickytop").prepend("<div class='openbijbeltoolbar'></div>");

 		openBijbelToolBar = $(".stickytop .openbijbeltoolbar");

 		// build the basic content of the toolbar
 		var toolbarContent = 
			'<div class="openbijbelvertalingnaam openbijbelvertaling">[[|]] &nbsp; NIV</div>'
			+ '<div class="openbijbelknoppenarea">'
				+ '<span class="openbijbelknoptoelichting">Tooltip vertaling: </span>'
				+ '<span class="openbijbelknop vertalingkeus NIV" data-translation="NIV">NIV</span> '
				+ '<span class="openbijbelknop vertalingkeus ESV" data-translation="ESV">ESV</span> '
				+ '<span class="openbijbelknop vertalingkeus KJV" data-translation="KJV">KJV</span> '
				+ '<span class="openbijbelknop vertalingkeus NKJV" data-translation="NKJV">NKJV</span> '
				+ '<span class="openbijbelknop vertalingkeus NLT" data-translation="NLT">NLT</span>'
			+ '</div>';

 		openBijbelToolBar.append(toolbarContent);

		// amount of translations
		var cntTranslations = $('.translation').length;

		if (cntTranslations < 3) {
			openBijbelToolBar.find(".openbijbelknoppenarea").append(
				'&nbsp; | &nbsp;'
				+ '<span class="openbijbelknoptoelichting"> [[|]] Kolom: </span>'
				+ '<span class="openbijbelknop weergavekeus kiesbibliakolom">Toevoegen</span>'
				+ '<span class="openbijbelknop weergavekeus kiesreftagtooltip">Verwijderen</span>'
			);
		}

		openBijbelToolBar.find(".openbijbelknoppenarea").append(' <span class="openbijbelknop kiesReset">(Reset)</span> ');


 		// set styling
 		openBijbelToolBar.css({
			"left":"0px",
			"right":"0px",
			"background-color": "#3352BC",
			"height": "35px",
			"padding":"10px",
			"color": "white",
			"margin-bottom":"5px",
			"-webkit-box-shadow": "0 2px 2px -2px rgba(0, 0, 0, .52)",
			"box-shadow": "0px 2px 2px -2px rgba(0, 0, 0, 0.52)",
		});

 		openBijbelToolBar.find(".openbijbelvertalingnaam").css({
			"font-weight":"bold",
			"float":"left",
			"color": "white"
		});

		openBijbelToolBar.find(".openbijbelknoppenarea").css({
			"color": "#A3A9BC",
			"float":"right"
		});

		openBijbelToolBar.find(".openbijbelknop").css({
			"color": "#93B8F4",
			"cursor":"pointer"
		});

		openBijbelToolBar.find(".openbijbelknoptoelichting").css({
			"font-style": "italic"
		});

		openBijbelToolBar.find(".kiesreftagtooltip").hide();

		openBijbelToolBar.find(".kiesReset").css({
			"color": "#646E8F",
			"cursor":"move"
		});
 	}

 	/**
 	 * Bind the events
 	 */
 	function bindEvents() {

 		openBijbelToolBar.on('click', '.vertalingkeus', function (e) {
 			e.preventDefault();

 			var translation = $(this).data('translation');

 			chooseTranslation(translation);
 			
 		});

 		openBijbelToolBar.on('click', '.kiesReset', function() {
 			showReferences();

 			// choose default translation
 			chooseTranslation("NIV");
 			
		});

 		openBijbelToolBar.on('click', '.kiesbibliakolom', function() {
 			splitColumns($('.translation').length);
			$('.row').css("margin-left","0px");
			$(this).hide();
			openBijbelToolBar.find('.kiesreftagtooltip').show();
			
		});

 		openBijbelToolBar.on('click', '.kiesreftagtooltip', function() {
 			// doet niks
			$('.openbijbelvertalingtekst').remove();
			
			// breedte teruggeven op basis van aantal aanwezige kolommen

                        var columnCount = $('.translation').length;

			if (columnCount > 1) {
			     $(".translation").css("width","45%");
			} else {
			     $(".translation").css("width","90%");	
			}

			$(this).hide();
			openBijbelToolBar.find('.kiesbibliakolom').show();
		});
 	}

 	/**
 	 * This function gets executed after all is loaded. This gives a main entrypoint for the code
 	 */
 	function main() {
 		showReferences();
 		setupTopBar();

 		// choose default translation
 		chooseTranslation("NIV");

 		bindEvents();
 	}

 	// execute the main function
 	main();
 })(window, document, jQuery);

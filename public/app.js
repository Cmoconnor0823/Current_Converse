$(document).ready(function () {
	$(document).on("click", ".save-article", function() {
		var thisId = $(this).attr("data-id");

		$.ajax({
			method: "POST",
			url: "/articles/saved/" + thisId
		}).done(function() {
			window.location = "/";
		});
	});

	$(document).on("click", ".remove-article", function() {
		var thisId = $(this).attr("data-id");

		$.ajax({
			method: "POST",
			url: "/articles/saved/" + thisId + "/remove"
		}).done(function() {
			window.location = "/";
		});
	});

	function clearModal () {
		$("#new-note").val("");	
		$("ul.note-container").html("");
	}

	$(document).on("click", ".add-note", function() {
		clearModal();
		$("#exampleModal").modal("show");
		var thisId = $(this).attr("data-id");
		$("#modal-header").text("Notes for Article: " + thisId);
		$("#save-comment").attr("data-id", thisId);
		$.ajax({
			method: "GET",
			url: "/articles/" + thisId,
		}).then(function(response) {
			response.note.forEach(function(comment) {
				console.log(comment);
				var newComment = $("<li>").attr("class", "mb-2");
				var newCard = $("<div>").attr("class", "card mt-2");
				var cardBody = $("<div>").attr("class", "card-body border ml-2 mr-2").text(comment.body);
				cardBody.append($("<i>").attr("class", "fa fa-times note-delete float-right").attr("style", "font-size: 24px;color:red").attr("note-id", comment._id));

				newCard.append(cardBody);
				newComment.append(newCard);
				$(".comment-container").append(newComment);
			});
		});
	});

	$(document).on("click", "#save-note", function() {

		var newNote = $("#new-note").val();
		var thisId = $("#save-note").attr("data-id");
		clearModal();

		$.ajax({
			method: "POST",
			url: "/articles/" + thisId,
			data: {
				body: newNote
			}
		});
	});

	$(document).on("click", ".note-delete", function() {
		var thisId = $(".note-delete").attr("note-id");

		$.ajax({
			method: "DELETE",
			url: "/comments/" + thisId
		});
	});


	$("#refresh").on("click", function() {
		$.ajax({
			method: "GET",
			url: "/scrape"
		});
	});
});

// // Grab the articles as a json
// $.getJSON("/articles", function (data) {
// 	// For each one
// 	for (var i = 0; i < data.length; i++) {
// 		// Display the apropos information on the page
// 		$("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
// 	}
// });

// // Whenever someone clicks a p tag
// // !!~Make sure to edit the p tag when changing to handle bars
// $(document).on("click", "p", function () {
// 	// Empty the comments from the comment section
// 	$("#comments").empty();
// 	// Save the id from the p tag
// 	//!!~ this one too
// 	var thisId = $(this).attr("data-id");
// 	// Now make an ajax call for the Article
// 	$.ajax({
// 		method: "GET",
// 		url: "/articles/" + thisId
// 	})
// 		// With that done, add the comment information to the page
// 		.then(function (data) {
// 			console.log(data);
// 			// The title of the article
// 			$("#comments").append("<h2>" + data.title + "</h2>");
// 			// An input to enter a new title
// 			$("#comments").append("<input id='titleinput' name='title' >");
// 			// A textarea to add a new comment body
// 			$("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
// 			// A button to submit a new comment, with the id of the article saved to it
// 			$("#comments").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

// 			// If there's a comment in the article
// 			if (data.comment) {
// 				// Place the title of the comment in the title input
// 				$("#titleinput").val(data.comment.title);
// 				// Place the body of the comment in the body textarea
// 				$("#bodyinput").val(data.comment.body);
// 			}
// 		});
// });

// // When you click the savecomment button
// $(document).on("click", "#savecomment", function () {
// 	// Grab the id associated with the article from the submit button
// 	var thisId = $(this).attr("data-id");

// 	// Run a POST request to change the comment, using what's entered in the inputs
// 	$.ajax({
// 		method: "POST",
// 		url: "/articles/" + thisId,
// 		data: {
// 			// Value taken from title input
// 			title: $("#titleinput").val(),
// 			// Value taken from comment textarea
// 			body: $("#bodyinput").val()
// 		}
// 	})
// 		// With that done
// 		.then(function (data) {
// 			// Log the response
// 			console.log(data);
// 			// Empty the comments section
// 			$("#comments").empty();
// 		});

// 	// Also, remove the values entered in the input and textarea for note entry
// 	$("#titleinput").val("");
// 	$("#bodyinput").val("");
// });


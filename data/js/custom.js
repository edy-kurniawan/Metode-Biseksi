$(function () {
	var inputFile = $('input#file');
	var uploadURI = $('#form-upload').attr('action');
	var progressBar = $('#progress-bar');

	listFilesOnServer();

	$('#upload-btn').on('click', function(event) {
		var filesToUpload = inputFile[0].files;
		// make sure there is file(s) to upload
		if (filesToUpload.length > 0) {
			// provide the form data
			// that would be sent to sever through ajax
			var formData = new FormData();

			for (var i = 0; i < filesToUpload.length; i++) {
				var file = filesToUpload[i];

				formData.append("file[]", file, file.name);				
			}

			// now upload the file using $.ajax
			$.ajax({
				url: uploadURI,
				type: 'post',
				data: formData,
				processData: false,
				contentType: false,
				success: function() {
					listFilesOnServer();
				},
				xhr: function() {
					var xhr = new XMLHttpRequest();
					xhr.upload.addEventListener("progress", function(event) {
						if (event.lengthComputable) {
							var percentComplete = Math.round( (event.loaded / event.total) * 100 );
							// console.log(percentComplete);
							
							$('.progress').show();
							progressBar.css({width: percentComplete + "%"});
							progressBar.text(percentComplete + '%');
						};
					}, false);

					return xhr;
				}
			});
		}
	});

	$('body').on('click', '.remove-file', function () {
		var me = $(this);

		$.ajax({
			url: uploadURI,
			type: 'post',
			data: {file_to_remove: me.attr('data-file')},
			success: function() {
				me.closest('li').remove();
			}
		});

	})

	function listFilesOnServer () {
		var items = [];

		$.getJSON(uploadURI, function(data) {
			$.each(data, function(index, element) {
				items.push('<li class="list-group-item">' + element  + '<div class="pull-right"><a href="#" data-file="' + element + '" class="remove-file"><i class="glyphicon glyphicon-remove"></i></a></div></li>');
			});
			$('.list-group').html("").html(items.join(""));
		});
	}

	$('body').on('change.bs.fileinput', function(e) {
		$('.progress').hide();
		progressBar.text("0%");
		progressBar.css({width: "0%"});
	});
});
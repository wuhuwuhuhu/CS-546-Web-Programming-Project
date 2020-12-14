(function ($) {
	var askForm = $('#ask-form');
	var askInput = $('#question-text');
	var askBtn = $('#ask-submit-btn');
	var inputErrorDiv1 = $('#ask-error-div1');
	var remainp = $('#question-remain')
	askForm.on('submit',function(event){
		
		if(!askInput.val() || askInput.val().trim() === '' || askInput.val().trim().length <5){
			event.preventDefault()
			askInput.focus();
			inputErrorDiv1.show()
	
		}
		
		
	})


	askInput.on('keyup blur', function() {
		// Store the maxlength and value of the field.
		var maxlength = $(this).attr('maxlength');
		var val = $(this).val().length;
		remain = parseInt(maxlength - val);
		remainp.text(remain +" characters remaining. ");
		// Trim the field if it has content over the maxlength.
		if (val.length > maxlength) {
			$(this).val(val.slice(0, maxlength));
		}
	});


  })(jQuery);

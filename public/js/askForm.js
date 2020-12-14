(function ($) {
	var askForm = $('#ask-form');
	var askInput = $('#question-text');
	var askBtn = $('#ask-submit-btn');
	var inputErrorDiv1 = $('#ask-error-div1');
	var inputErrorDiv2 = $('#ask-error-div2');
	var remainp = $('#question-remain')
	askForm.on('submit',function(event){
		
		if(!askInput.val() || askInput.val().trim() === '' || askInput.val().trim().length <5){
			event.preventDefault()
			askInput.focus();
			inputErrorDiv1.show()
	
		}
		
		
	})


	askInput.on('keyup blur', function() {
		//get the maxlength attr
		inputErrorDiv1.hide()
		inputErrorDiv2.hide()
		var maxlength = $(this).attr('maxlength');
		var val = $(this).val().length;
		remain = parseInt(maxlength - val);
		remainp.text(remain +" characters remaining");
		//Stop input when length over max
		if (val.length > maxlength) {
			$(this).val(val.slice(0, maxlength));
		}
	});


  })(jQuery);

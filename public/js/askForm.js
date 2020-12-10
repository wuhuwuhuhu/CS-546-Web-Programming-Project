(function ($) {
	var askForm = $('#ask-form');
	var askInput = $('#question-input');
	var askBtn = $('#ask-submit-btn');
	var inputErrorDiv1 = $('#ask-error-div1');
	
	askForm.on('submit',function(event){
		
		if(!askInput.val() && askInput.val().trim() === ''){
			event.preventDefault()
			askInput.focus();
			inputErrorDiv1.show()
	
		}
		
		
	})


  })(jQuery);
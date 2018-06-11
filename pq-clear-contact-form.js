/**
 * Allows a user to clear a contact form if a previous user set a cookie on the machine.
 * Based on Trevor G's helper-pq-contact-forms.js.
 * @title	Clear Contact Form
 * @author	Jim Saiya
 * @date	2018-04-22
 *
 * Requires the following jQuery plug-ins to be loaded on the page:
 * - <script src="//www.proquest.com/includes/parsley.js"></script>
 * - <script src="//www.proquest.com/includes/jquery.cookie.js"></script>
 * - <script src="//www.proquest.com/includes/jquery.form.min.js"></script>
 */


var formID, emailFieldID, nameFieldID;
var parsleyOptions = { excluded: ':hidden', errorMessage: '', errors: { errorsWrapper: '', errorElem: '<span></span>' } };


/**
 * Call this from within a $(document).ready JQuery function on the form page
 * - theForm:		ID string of the form element
 * - emailField:	ID string of the email field input element
 * - nameField:		ID string of field containing the user's first name;
 * 					will become default focus field when email is disabled
 */
function initContactForm(theForm, emailField, nameField) {

	formID = '#'+theForm;
	emailFieldID = '#'+emailField;
	nameFieldID = '#'+nameField;

	// custom config of parsley, to remove error message
	$(formID).parsley(parsleyOptions);

	// enable email field before submitting form, otherwise value will not be sent
	$(formID).submit(function(e) {
		$(emailFieldID).prop('disabled', false);
	});

	// initialize the identity clearing
	// only perform the init if the hidden field with a recipient's ID is present
	if ( $('[name="RECIPIENT_ID_*"]').length )
		initFormIdentityLink();

}


/**
 * Initialize the identity clearing framework
 */
function initFormIdentityLink() {

	var promptText;
	var aTagAttributes = 'href="#" class="clear-identity-action" name="clear_the_form" xt="SPNOTRACK"';

	// build "Clear the form" text based on form language
	switch (formLanguage) {

		case 'zh-Hant':	// Chinese (Traditional)
			promptText = '<a ' + aTagAttributes + '>Clear the form</a>';
			break;

		case 'zh-Hans':	// Chinese (Simplified)
			promptText = '<a ' + aTagAttributes + '>如不是您本人，请重新填写。</a>';
			break;

		case 'ja':		// Japanese
			promptText = $(nameFieldID).val() + 'ではありませんか？<a ' + aTagAttributes + '>フォームをクリア</a>にしてください。';
			break;

		case 'ko':		// Korean
			promptText = $(nameFieldID).val() + '이/가 아닌가요? <a ' + aTagAttributes + '>새로 작성하기</a>.';
			break;

		case 'pt-BR':	// Portuguese (Brazil)
			promptText = 'Se você não é ' + $(nameFieldID).val() + ' <a ' + aTagAttributes + '>limpe aqui o formulário</a>.';
			break;

		case 'es-419':	// Spanish (Latin America)
			promptText = 'Si usted no es ' + $(nameFieldID).val() + ' <a ' + aTagAttributes + '>borre el formulario</a>.';
			break;

		default:		// English
			promptText = 'Not ' + $(nameFieldID).val() + '? <a ' + aTagAttributes + '>Clear the form</a>.';
			break;

	}

	// insert the "Clear the form" prompt above the form
	$(formID).before('<p id="clear-identity-prompt">' + promptText + '</p>');

	// show the email warning prompt
	$('#email-warning').show();

	$(nameFieldID).focus();

	// disable email field
	$(emailFieldID).prop('disabled', 'disabled');

	// do not require validation on disabled fields
	$(emailFieldID).removeProp('required');

	// bind click event function to "Clear the form" link(s)
	$('.clear-identity-action').click(function(e) {

		console.log('"Clear the form" clicked.'); ////////////////////

		// don't reload the page
		e.preventDefault();

		clearIdentity();

	});

}


/**
 * Clear the contact form, including cookie and hidden recipient id field
 */
function clearIdentity() {

	console.log('"clearIdentity()" called.'); ////////////////////

	// remove the recipient id field
	//  only to make sure it does not get sent with the new record
	//  (not sure this is strictly required)
	$('[name="RECIPIENT_ID_*"]').remove();

	// hide the email warning prompt
	$('#email-warning').hide();

	// remove the "Clear the form" prompt from above the form
	$('#clear-identity-prompt').html('');

	// clear the form fields
	$(formID).clearForm();	// (from jquery.form.js)

	// enable email field
	$(emailFieldID).prop('disabled', false);

	// require an email address
	$(emailFieldID).prop('required', 'required');

	$(emailFieldID).focus();

//	}

}

// end of file
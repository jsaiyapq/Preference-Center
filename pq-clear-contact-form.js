/**
 * Allows a user to clear a contact form if a previous user set a cookie on the machine.
 * Based on Trevor G's helper-pq-contact-forms.js.
 * @title	Clear Contact Form
 * @author	Jim Saiya
 * @date	2018-02-20
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

	// initialize the identity clearing
	initFormIdentityLink();

}


/**
 * Initialize the identity clearing framework
 */
function initFormIdentityLink() {

	// only perform the init if the hidden field with a recipient's ID is present
	if ( $('[name="RECIPIENT_ID_*"]').length ) {

		var promptText;
		var aTagAttributes = 'href="#" class="clear-identity-action" name="clear_the_form" xt="SPNOTRACK"';

		// build "Clear the form" text based on form language
		switch (formLanguage) {

			case 'zh-hans':
				promptText = '<a ' + aTagAttributes + '>如不是您本人，请重新填写。</a>';
				break;

			case 'latam-pt': 
				promptText = 'Se você não é ' + $(nameFieldID).val() + ' <a ' + aTagAttributes + '>limpe aqui o formulário</a>.';
				break;

			case 'latam-es':
				promptText = 'Si usted no es ' + $(nameFieldID).val() + ' <a ' + aTagAttributes + '>Borre el formulario</a>.';
				break;

			default:
				promptText = 'Not ' + $(nameFieldID).val() + '? <a ' + aTagAttributes + '>Clear the form</a>.';
				break;

		}

		var promptPara = '<p id="clear-identity-prompt">' + promptText + '</p>';

		// insert the "Clear the form" prompt above the form
		$(formID).before(promptPara);

		// show the email warning prompt
		$('#email-warning').show();

		// set field focus
		$(nameFieldID).focus();

		// disable email field
		$(emailFieldID).prop('disabled', 'disabled');

		// do not require validation on disabled fields
		$(emailFieldID).removeProp('required');

		// bind click event function to "Clear the form" link(s)
		$('.clear-identity-action').click(function(e) {

console.log('"Clear the form" clicked.');

			// don't reload the page
			e.preventDefault();

			// reset the form
			clearIdentity();

		});

	}

}


/**
 * Clear the contact form, including cookie and hidden recipient id field
 */
function clearIdentity() {

console.log('"clearIdentity()" called.');

// code commented out here for testing with mock-up
// make active for production

	// delete the cookie
//	var sp_identity_removed = $.removeCookie('SP_IDENTITY', { path: '/' });

	// if cookie removal was successful, finish the job
//	if( sp_identity_removed ) {

//console.log('Cookie removed successfully.');

		// remove the recipient id field
//		$('[name="RECIPIENT_ID_*"]').remove();

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

		// set field focus
		$(emailFieldID).focus();

//	}

}

// end of file
/**
 * Allows a user to clear a contact form if a previous user set a cookie on the machine.
 * Otherwise prevents a user from updating an email address associated with a record in the DB.
 * Minimal version of pq-clear-preference-center.js.
 * @title   Clear Contact Form
 * @author  Jim Saiya
 * @date    2018-04-26
 *
 * Requires the following jQuery plug-ins to be loaded on the page:
 * - <script src="//www.proquest.com/includes/parsley.js"></script>
 * - <script src="//www.proquest.com/includes/jquery.form.min.js"></script>
 */


var formID, emailFieldID;
var parsleyOptions = { excluded: ':hidden', errorMessage: '', errors: { errorsWrapper: '', errorElem: '<span></span>' } };


/**
 * Initialize the identity clearing framework 
 *  Call this from within a $(document).ready JQuery function on the form page
 *  - theForm:     ID string of the form element
 *  - emailField:  ID string of the email field input element
 */
function initContactForm(theForm, emailField) {

	formID = '#'+theForm;
	emailFieldID = '#'+emailField;

	// custom config of parsley, to remove error message
	$(formID).parsley(parsleyOptions);

	// enable email field before submitting form, otherwise value will not be sent
	$(formID).submit(function(e) {
		$(emailFieldID).prop('disabled', false);
	});

	// set any element with the class "clear-identity-action" to call the clearing function when clicked
	$('.clear-identity-action').click(function() {
		clearIdentity();
	});

	// initialize the identity clearing
	// only perform the init if the hidden field with a recipient's ID is present
	if ( $('[name="RECIPIENT_ID_*"]').length ) {

		// show the "Clear the form" prompt
		$('#clear-identity-prompt').show();

		// show the email warning prompt
		$('#email-warning').show();

		// disable email field
		$(emailFieldID).prop('disabled', 'disabled');

		// do not require validation on disabled fields
		$(emailFieldID).removeProp('required');

  }

}


/**
 * Clear the contact form, including cookie and hidden recipient id field
 *  This is called from any link or button in your page with the class "clear-identity-action"
 */
function clearIdentity() {

	// remove the recipient id field
	//  to make sure it does not get sent with the new record
	$('[name="RECIPIENT_ID_*"]').remove();

	// clear the form fields
	$(formID).clearForm();	// (from jquery.form.js)

	// hide the email warning prompt
	$('#email-warning').hide();

	// hide the "Clear the form" prompt
	$('#clear-identity-prompt').hide();

	// enable email field
	$(emailFieldID).prop('disabled', false);

	// require an email address
	$(emailFieldID).prop('required', 'required');

	$(emailFieldID).focus();

}

// end of file
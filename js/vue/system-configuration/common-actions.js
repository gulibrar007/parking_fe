/*--------- ACTIVE INACTIVE STATUS BUTTON CONTENT ----------*/
function activeInactiveButtonInput() {
  const statusBtns = document.querySelectorAll('.active_inactive_status_button');

  for(let statusNum = 0; statusNum < statusBtns.length; statusNum++) {
    const currentStatus = statusBtns[statusNum].getAttribute('data-current-country-status');
    if(currentStatus === statusObj.active) {
      statusBtns[statusNum].innerHTML = (statusObj.inactive).toLowerCase();
    }
    else if(currentStatus === statusObj.inactive) {
      statusBtns[statusNum].innerHTML = (statusObj.active).toLowerCase();
    }
    statusBtns[statusNum].style.textTransform = "capitalize";
  }

}
/*--------- ACTIVE INACTIVE STATUS BUTTON CONTENT ----------*/

/*--------- CLOSE MODAL ------------------------------------*/
function closeModal (modal) {
  const modalId = '#'+modal;
  $(modalId).modal('hide');
}
/*--------- CLOSE MODAL ------------------------------------*/
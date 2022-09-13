
// walk in reservation button
const walkInReservationBtn = document.querySelector('.walk_in_reservation_btn');
// check in button
const checkInBtn = document.querySelector('.check_in_btn');
// check out button
const checkOutBtn = document.querySelector('.check_out_btn');

walkInReservationBtn.addEventListener('click', () => {
  window.location.pathname = '/reservations.html';
})

checkInBtn.addEventListener('click', () => {
  window.location.pathname = '/checkin.html';
})

checkOutBtn.addEventListener('click', () => {
  window.location.pathname = '/checkout.html';
})
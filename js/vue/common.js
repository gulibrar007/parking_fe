
const baseUrl = "https://api.parkingmis.maverick-is.com"; // BASE URL FOR APIs
let params = null; // NO PARAMETERS IN API CALL
let token; //STORE TOKEN 

// STATUS
const statusObj = {
  active: 'ACTIVE',
  inactive: 'IN ACTIVE'
}

/*--------- COMMON API CALL----------*/
function action (baseUrl, endPoint, params) {
  const res = fetch (baseUrl+endPoint, {
    method: 'POST', 
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(params),
  })
  return res
}
/*--------- COMMON API CALL----------*/ 

/*--------- COMMON API CALL WITH TOKEN----------*/
function actionAPICall (baseUrl, endPoint, params) {
  const res = fetch (baseUrl+endPoint, {
    method: 'POST', 
    headers: {
      'Authorization': token,
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(params),
  })
  return res
}
/*--------- COMMON API CALL WITH TOKEN----------*/ 

/*--------- CHECK FOR TOKEN IN SESSION, RE-DIRECT TO LOGIN IF TOKEN NOT FOUND ---------- */
(function checkTokenInSession () {
  // GET THE VUE SESSION OBJECT
  const vueSession = JSON.parse(sessionStorage.getItem("vue-session-key"));
  
  // IF THE LOADED PAGE IS LOGIN PAGE, STAY THERE
  if(window.location.pathname == '/' || window.location.pathname == '/index.html' || window.location.pathname == '/customerlogin.html') {
    //console.log('login page')
  }
  else { // IF PAGE IS OTHER THAN LOGIN PAGE
    if(!vueSession) { // IF VUE SESSION DOES NOT EXIST, RE-DIRECT TO LOGIN PAGE
      window.location = 'index.html'; 
    }
    else {
      token = JSON.parse(sessionStorage.getItem('vue-session-key')).token; // JWT TOKEN
    }
  }

})()
/*--------- CHECK FOR TOKEN IN SESSION, RE-DIRECT TO LOGIN IF TOKEN NOT FOUND ---------- */

/*--------- EMAIL VERIFICATION --------*/
function validEmail (email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
/*--------- EMAIL VERIFICATION --------*/

/*--------- CNIC VERIFICATION --------*/
function validCnic (cnic) { 
  return /^[0-9+]{13}$/.test(cnic);
}
/*--------- CNIC VERIFICATION --------*/

/*--------- MOBILE NUMBER VERIFICATION --------*/
function mobileNumberVerification (mobileInput) { 
  let input = document.querySelector(`#${mobileInput}`);
  
  errorMap = ["is invalid", "has invalid country code", "is too short", "is too long", "is invalid"];

  // initialise plugin
  var iti = window.intlTelInput(input, {
    placeholderNumberType: "MOBILE",
    preferredCountries: ['pk'],
    utilsScript: "js/assets/International Tel/js/utils.js",
  });

  var reset = function () {
    input.classList.remove("error");
    
  };

  // on blur: validate
  input.addEventListener('blur', function () {
    reset();
    if (input.value.trim()) {
      if (iti.isValidNumber()) {
        //console.log('correct phone number')
        errorMsgMobileNumber = 'valid number';
        //return true;
      } 
      else {
        input.classList.add("error");
        errorCode = iti.getValidationError();
        //console.log('wrong mobile number');
        console.log(errorCode)
        errorMsgMobileNumber = errorMap[errorCode];
        //return false;
        
      }
    }
  });
  // on keyup / change flag: reset
  input.addEventListener('change', reset);
  input.addEventListener('keyup', reset); 
}
/*--------- MOBILE NUMBER VERIFICATION --------*/

/*--------- TOGGLE PASSWORD VISIBILITY --------*/
showHidePassword = () => {
  // GET SHOW/ HIDE PASSWORD BUTTON
  const showHidePasswordBtn = document.querySelector('.btn-show-hide-password');
  // INPUT PASSWORD
  const passwordInput = document.querySelector('.input-password');

  let type;
  // CHECK CURRENT TYPE OF INPUT, PASSWORD OR TEXT
  if( passwordInput.getAttribute("type") === "password") {
    type = "text";
    showHidePasswordBtn.textContent = 'hide';
  }
  else {
    type = "password";
    showHidePasswordBtn.textContent = 'show';
  }
  
  // SET THE INPUT TYPE TO OPPOSITE TO CURRENT ONE
  passwordInput.setAttribute("type", type);
}
/*--------- TOGGLE PASSWORD VISIBILITY --------*/


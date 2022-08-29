
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
  if(window.location.pathname == '/' || window.location.pathname == '/index.html') {
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
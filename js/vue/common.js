
const baseUrl = "https://api.parkingmis.maverick-is.com";
let params = null;

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

/*--------- EMAIL VERIFICATION --------*/
function validEmail (email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
/*--------- EMAIL VERIFICATION --------*/
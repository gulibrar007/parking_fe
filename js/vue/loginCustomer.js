// LOGIN ENDPOINT
const loginCustomerEndPoint = "/login_customer";

// DOCUMENT BODY 
const body = document.querySelector('body');

// LOGIN VARIABLES
let emailLogin, passwordLogin, userIcon, lockIcon;

// WHEN ENTER KEY IS PRESSED 
body.addEventListener("keypress", function(event) {
  // IF USER PRESSES ENTER KEY ON KEYBOARD
  if (event.key === "Enter") {
    // CANCEL THE DEFAULT ACTION; IF NEEDED
    event.preventDefault();
    // TRIGGER LOGIN BUTTON 
    document.querySelector(".login-btn").click();
  }
});

new Vue({
  el: '#loginCustomer',
  data: {
    error: '',
    invalidLoginAlert: true,
    validEmailLogin: false,
    email: '',
    password: '',
    validPasswordLogin: false,  
    loading: true,
    loginText: false,
    removeBgSpinner: false,
  },
  mounted: function () {
    // SHOW LOGIN CONTAINER WHEN VUE IS MOUNTED ON PAGE
    const loginContainer = document.querySelector('.login-container');
    loginContainer.style.display = 'block';

    // LOGIN VARIABLES
    emailLogin = document.querySelector('#inputEmail');
    passwordLogin = document.querySelector('#inputPassword');
    userIcon = document.querySelector('.user-icon');
    lockIcon = document.querySelector('.lock-icon');

  },
  methods: {
    /*---------- USER CLICKS ON LOGIN BUTTON -------------*/
    onClickLoginBtn: function () {

      // LOGIN VARIABLES
      emailLogin = document.querySelector('#inputEmail');
      passwordLogin = document.querySelector('#inputPassword');
      userIcon = document.querySelector('.user-icon');
      lockIcon = document.querySelector('.lock-icon');
      
      if(this.email == '') { // EMPTY EMAIL
        this.validEmailLogin = true;
        this.invalidLoginAlert = false;
        emailLogin.classList.add('invalidInput'); // ADD RED BORDER AROUND EMAIL INPUT
        userIcon.classList.add('inputinvalidField'); // MAKE ICON RED
        this.emptyEmail();
      }  
      else if(!validEmail(this.email)) { // INVALID EMAIL
        this.validEmailLogin = true;
        this.invalidLoginAlert = false;
        emailLogin.classList.add('invalidInput'); // ADD RED BORDER AROUND EMAIL INPUT
        userIcon.classList.add('inputinvalidField'); // MAKE ICON RED
        this.inValidEmail();
      }
      else if(this.password == '') { // EMPTY PASSWORD
        this.validPasswordLogin = true;
        this.invalidLoginAlert = false;
        passwordLogin.classList.add('invalidInput'); // ADD RED BORDER AROUND PASSWORD INPUT
        lockIcon.classList.add('inputinvalidField'); // MAKE ICON RED
        this.emptyPassword();
      }
      else { // LOGIN USER
        
        // SHOW LOADING ICON
        this.removeBgSpinner = true;
        this.loading = false;
        this.loginText = true;

        params = {
          "email": this.email,
          "password": this.password
        }
        
        this.loginUser(params);
      }
    },
    /*---------- USER CLICKS ON LOGIN BUTTON -------------*/
    
    /*---------- LOGIN USER & SAVE SESSION ---------------*/
    loginUser: async function (params){
      const result = await action(baseUrl, loginCustomerEndPoint, params)
      const res = await result.json()
      
      // HIDE LOADING ICON
      this.removeBgSpinner = false; 
      this.loading = true;
      this.loginText = false;
      console.log(res)
      // WRONG CREDENTIALS 
      if(res.error) {
        this.invalidLoginAlert = false;
        this.invalidCredentials();
      }
      else { // CORRECT CREDENTIALS ENTERED, RE-DIRECT TO DASHBOARD
        this.$session.start()
        this.$session.set('data', res.data);
        this.$session.set('token', res.token);
        
        // RE-DIRECT TO DASHBOARD
        window.location.href ="dashboard.html";
      }
    },
    /*---------- LOGIN USER & SAVE SESSION ---------------*/

    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/
    emptyEmail: function () {
      this.error = 'Email in required';
    },
    inValidEmail: function () {
      this.error = 'Email is invalid';
    },
    emptyPassword: function () {
      this.error = 'Password is required';
    },
    invalidCredentials: function () {
      this.error = 'Invalid Credentials';
    },
    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/

    /*----------- REMOVE HIGHLIGHTED ERRORS -----------------------*/
    keyUpEmailLogin: function () {  // KEY IS PRESSED UP ON EMAIL INPUT
      this.validEmailLogin = false;
      this.invalidLoginAlert = true;
      emailLogin.classList.remove('invalidInput'); // REMOVE RED BORDER FROM EMAIL INPUT
      userIcon.classList.remove('inputinvalidField'); // REMOVE RED COLOR FROM ICON
    },
    keyUpPasswordLogin: function () { // KEY IS PRESSED UP ON PASSWORD INPUT
      this.validPasswordLogin = false;
      this.invalidLoginAlert = true;
      passwordLogin.classList.remove('invalidInput'); // REMOVE RED BORDER FROM PASSWORD INPUT
      lockIcon.classList.remove('inputinvalidField'); // REMOVE RED COLOR FROM ICON
    },
    /*----------- REMOVE HIGHLIGHTED ERRORS -----------------------*/

  }
})
// LOGIN
const endPoint = "/login";

new Vue({
  el: '#login',
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
  methods: {
    /*---------- USER CLICKS ON LOGIN BUTTON -------------*/
    onClickLoginBtn: function () {
      
      if(this.email == '') { // EMPTY EMAIL
        this.validEmailLogin = true;
        this.invalidLoginAlert = false;
        this.emptyEmail();
      }  
      else if(!validEmail(this.email)) { // INVALID EMAIL
        this.validEmailLogin = true;
        this.invalidLoginAlert = false;
        this.inValidEmail();
      }
      else if(this.password == '') { // EMPTY PASSWORD
        this.validPasswordLogin = true;
        this.invalidLoginAlert = false;
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
    loginUser: async function loginUser (params){
      const result = await action(baseUrl, endPoint, params)
      const res = await result.json()
      
      // HIDE LOADING ICON
      this.removeBgSpinner = false; 
      this.loading = true;
      this.loginText = false;

      console.log(res)
      if(res.error) {
        this.invalidLoginAlert = false;
        this.invalidCredentials();
      }
      else {
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

    /*----------- HIGHLIGHT ERRORS -----------------------*/
    keyUpEmailLogin: function () {  // KEY IS PRESSED UP ON EMAIL INPUT
      this.validEmailLogin = false;
      this.invalidLoginAlert = true; 
    },
    keyUpPasswordLogin: function () { // KEY IS PRESSED UP ON PASSWORD INPUT
      this.validPasswordLogin = false;
      this.invalidLoginAlert = true;
    },
    /*----------- HIGHLIGHT ERRORS -----------------------*/
  }
})
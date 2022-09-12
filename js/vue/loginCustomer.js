// LOGIN ENDPOINT
const loginCustomerEndPoint = "/login_customer";

// ADD CUSTOMER IN USERS
const addCustomerInUserEndPoint = "/add_customer_user";

// VIEW ALL ACTIVE COUNTRIES
const viewAllActiveCountriesWithoutTokenEndPoint = "/get_active_countries_without_token";

// VIEW CITIES OF SELECTED COUNTRY
const viewCitiesOfSelectedCountryWithoutTokenEndPoint = "/get_all_cities_of_country_without_token";

// CHECK FOR UNIQUE EMAIL AND MOBILE NUMBER FOR CUSTOMER
const checkUniqueEmailMobileNumberCustomerFromSystem = "/check_unique_email_mobile_customer";

// DOCUMENT BODY 
const body = document.querySelector('body');

// LOGIN VARIABLES
let emailLogin, passwordLogin, userIcon, lockIcon;

// ERROR MESSAGE FOR INVALID MOBILE NUMBER
let errorMsgMobileNumber = '';

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

    // CUSTOMER VARIABLES
    invalidCustomerDetails: true,

    validCustomerName: false,
    customerName: '',
    validCustomerEmail: false,
    customerEmail: '',
    validCustomerMobile: false,
    customerMobile: '',
    validCustomerCnic: false,
    customerCnic: '',
    validCustomerPassword: false,
    customerPassword: '',
    validCustomerCountry: false,
    selectedCustomerCountry: '',
    validCustomerCity: false,
    selectedCustomerCity: '',
    validCustomerAddress: false,
    customerAddress: '',

    customerList: [],
    // CUSTOMER VARIABLES
    countryIdSelected: '',
    countryList: [],
    cityList: [],
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

    this.viewAllActiveCountries(); // VIEW ALL ACTIVE COUNTRIES

    mobileNumberVerification('customer_mobile');

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


    /*---------- ADD CUSTOMER -------------------------------------*/
    // ON ADD BUTTON CLICK IN ADD CUSTOMER MODAL
    onClickAddCustomerBtn: function () {
      if(this.customerName === '') { // EMPTY CUSTOMER NAME
        this.validCustomerName = true;
        this.invalidCustomerDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addCustomer, body').animate({ scrollTop: $('#addCustomerName').offset().top }, 800);
        this.emptyCustomerName();
      }
      else if(this.customerEmail === '') { // EMPTY CUSTOMER EMAIL  
        this.validCustomerEmail = true;
        this.invalidCustomerDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addCustomer, body').animate({ scrollTop: $('#addCustomerEmail').offset().top }, 800);
        this.emptyEmail();
      }
      else if(!validEmail(this.customerEmail)) { // INVALID CUSTOMER EMAIL
        this.validCustomerEmail = true;
        this.invalidCustomerDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addCustomer, body').animate({ scrollTop: $('#addCustomer').offset().top }, 800);
        this.invalidEmail();
      }
      else if(this.customerPassword === '') { // EMPTY CUSTOMER PASSWORD
        this.validCustomerPassword = true;
        this.invalidCustomerDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addCustomer, body').animate({ scrollTop: $('#addCustomerPassword').offset().top }, 800);
        this.emptyCustomerPassword();
      }
      else if(this.customerMobile === '') { // EMPTY MOBILE NUMBER
        this.validCustomerMobile = true;
        this.invalidCustomerDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addCustomer, body').animate({ scrollTop: $('#addCustomerMobile').offset().top }, 800);
        this.emptyMobileNumber();
      }
      else if(errorMsgMobileNumber != 'valid number') { // CHECK FOR VALID MOBILE NUMBER
        this.validCustomerMobile = true;
        this.invalidCustomerDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addCustomer, body').animate({ scrollTop: $('#addCustomerMobile').offset().top }, 800);
        this.invalidMobileNumber();
      }
      else if(this.customerCnic === '') { // EMPTY CNIC
        this.validCustomerCnic = true;
        this.invalidCustomerDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addCustomer,body').animate({ scrollTop: $("#addCustomerCnic").offset().top }, 'slow');
        this.emptyCnic();
      }
      else if(!validCnic(this.customerCnic)) { // EMPTY CNIC
        this.validCustomerCnic = true;
        this.invalidCustomerDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addCustomer,body').animate({ scrollTop: $("#addCustomerCnic").offset().top }, 'slow');
        this.invalidCnic();
      }
      else if(this.selectedCustomerCountry === '') { // EMPTY CUSTOMER COUNTRY
        this.validCustomerCountry = true;
        this.invalidCustomerDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addCustomer,body').animate({ scrollTop: $("#addCustomerCountry").offset().top }, 'slow');
        this.emptyCountry();
      }
      else if(this.selectedCustomerCity === '') { // EMPTY CUSTOMER CITY
        this.validCustomerCity = true;
        this.invalidCustomerDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addCustomer,body').animate({ scrollTop: $("#addCustomerCity").offset().top }, 'slow');
        this.emptyCity();
      }
      else if(this.customerAddress === '') { // EMPTY CUSTOMER ADDRESS
        this.validCustomerAddress = true;
        this.invalidCustomerDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addCustomer,body').animate({ scrollTop: $("#addCustomerAddress").offset().top }, 'slow');
        this.emptyAddress();
      }
      
      else { 
        // API PARAMETERS
        params = {
          "name" : this.customerName,
          "email": this.customerEmail,
          "password": this.customerPassword,
          "mobile": this.customerMobile,
          "cnic": this.customerCnic,
          "country": this.selectedCustomerCountry,
          "city": this.selectedCustomerCity,
          "address": this.customerAddress
        }

        // ADD CUSTOMER
        this.addCustomer(params);
      }
    },
    addCustomer: async function (params) {
      const addCustomerModalBtn = document.querySelector('.add-customer-modal-btn');
      
      // DISABLE ADD CUSTOMER BUTTON
      addCustomerModalBtn.disabled = true;

      // API PARAMETERS FOR UNIQUE EMAIL
      let paramsUniqueEmailCustomer = {
        "data": this.customerEmail
      }

      // API PARAMETERS FOR UNIQUE MOBILE NUMBER
      let paramsUniqueMobileNumberCustomer = {
        "data": this.customerMobile
      }

      // CHECK IF ENTERED EMAIL ALREADY EXISTS ON SERVER
      const resultUniqueEmailCheck = await action(baseUrl, checkUniqueEmailMobileNumberCustomerFromSystem, paramsUniqueEmailCustomer);
      const resUniqueEmailCheck = await resultUniqueEmailCheck.json();

      // CHECK IF ENTERED MOBILE NUMBER ALREADY EXISTS ON SERVER
      const resultUniqueMobileNumberCheck = await action(baseUrl, checkUniqueEmailMobileNumberCustomerFromSystem, paramsUniqueMobileNumberCustomer)
      const resUniqueMobileNumberCheck = await resultUniqueMobileNumberCheck.json();

      // EMAIL ALREADY EXISTS ON SERVER
      if(resUniqueEmailCheck.result === true) {
        this.validCustomerEmail = true;
        this.invalidCustomerDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addCustomer, body').animate({ scrollTop: $('#addCustomerEmail').offset().top }, 800);
        this.duplicateEmailInSystem();

        // ENABLE ADD CUSTOMER BUTTON
        addCustomerModalBtn.disabled = false;

      }
      // MOBILE NUMBER ALREADY EXISTS ON SERVER
      else if(resUniqueMobileNumberCheck.result === true) {
        this.validCustomerMobile = true;
        this.invalidCustomerDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addCustomer, body').animate({ scrollTop: $('#addCustomerMobile').offset().top }, 800);
        this.duplicateMobileNumberInSystem();

        // ENABLE ADD CUSTOMER BUTTON
        addCustomerModalBtn.disabled = false;

      }
      // NO DUPLICATE EMAIL/ MOBILE NUMBER
      else {
        // ADD CUSTOMER ON SERVER
        const result = await action(baseUrl, addCustomerInUserEndPoint, params);
        const res = await result.json();

        // CUSTOMER ADDED SUCCESSFULLY
        if(res.result === 'success') {
          // CLOSE MODAL
          closeModal('addCustomer');

          // ENABLE ADD CUSTOMER BUTTON
          addCustomerModalBtn.disabled = false;
          
          toastr.success('Signed up successfully');
          
          // RESET INPUT FIELDS
          this.customerName = '';
          this.customerEmail = '',
          this.customerPassword = '';
          this.customerMobile = '';
          this.customerCnic = '';
          this.selectedCustomerCountry = '';
          this.cityList = [];
          this.selectedCustomerCity = '';
          this.selectedCustomerCity = '';
        }
        else {
          // CLOSE MODAL
          closeModal('addCustomer');

          // ENABLE ADD CUSTOMER BUTTON
          addCustomerModalBtn.disabled = false;

          // ERROR MESSAGE
          toastr.error('There was an error!');
        }
      }
      
    },
    /*---------- ADD CUSTOMER -------------------------------------*/

    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/
    emptyCustomerName: function () {
      this.error = 'Name is empty';
    },
    emptyCustomerPassword: function () {
      this.error = 'Password is empty';
    },
    emptyEmail: function () {
      this.error = 'Email is empty';
    },
    invalidEmail: function () {
      this.error = 'Email is invalid';
    },
    duplicateEmailInSystem: function () {
      this.error = 'Email already exists in system';
    },
    duplicateMobileNumberInSystem: function () {
      this.error = 'Mobile # already exists in system';
    },
    emptyMobileNumber: function () {
      this.error = 'Mobile # is empty';
    },
    invalidMobileNumber: function () {
      this.error = 'Mobile # ' + errorMsgMobileNumber;
    },
    emptyCnic: function () {
      this.error = 'CNIC is empty';
    },
    invalidCnic: function () {
      this.error = 'CNIC in invalid';
    },
    emptyCountry: function () {
      this.error = 'Select country';
    },
    emptyCity: function () {
      this.error = 'Select city';
    },
    emptyAddress: function () {
      this.error = 'Address is empty';
    },
    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/

    /*----------- REMOVE HIGHLIGHTED ERRORS -----------------------*/
    keyUpCustomerName: function () { // KEY IS PRESSED UP ON CUSTOMER NAME INPUT
      this.validCustomerName = false;
      this.invalidCustomerDetails = true;
    },
    keyUpCustomerEmail: function () { // KEY IS PRESSED UP ON CUSTOMER EMAIL INPUT
      this.validCustomerEmail = false;
      this.invalidCustomerDetails = true;
    },
    keyUpCustomerMobile: function () { // KEY IS PRESSED UP ON CUSTOMER MOBILE INPUT
      this.validCustomerMobile = false;
      this.invalidCustomerDetails = true;
    },
    keyUpCustomerCnic: function () { // KEY IS PRESSED UP ON CUSTOMER CNIC INPUT
      this.validCustomerCnic = false;
      this.invalidCustomerDetails = true;
    },
    keyUpCustomerPassword: function () { // KEY IS PRESSED UP ON CUSTOMER PASSWORD INPUT
      this.validCustomerPassword = false;
      this.invalidCustomerDetails = true;
    },
    keyUpCustomerAddress: function () { // KEY IS PRESSED UP ON CUSTOMER ADDRESS INPUT
      this.validCustomerAddress = false;
      this.invalidCustomerDetails = true;
    },
    onFocusCustomerCountry: function () { // ON FOCUS OF CUSTOMER COUNTRY SELECT INPUT
      this.validCustomerCountry = false;
      this.invalidCustomerDetails = true;
    },
    onFocusCustomerCity: function () { // ON FOCUS OF CUSTOMER CITY SELECT INPUT
      this.validCustomerCity = false;
      this.invalidCustomerDetails = true;
    },
    
    /*----------- REMOVE HIGHLIGHTED ERRORS -----------------------*/

    /*-------------------------------------------------------------*/
    /*---------------------- CUSTOMERS ----------------------------*/
    /*-------------------------------------------------------------*/

    /*------------------ VIEW ACTIVE COUNTRIES --------------------*/
    viewAllActiveCountries: async function () {
      // API PARAMETERS
      params = { };

      // GET ACTIVE COUNTRIES FROM SERVER
      const result = await action(baseUrl, viewAllActiveCountriesWithoutTokenEndPoint, params);
      const res = await result.json();
      
      // IF ALL COUNTRIES ARE RETURNED SUCCESSFULLY
      if(res.result === 1) {
        this.countryList = res.data; // STORE THE COUNTRIES RETURNED IN ARRAY
      }
    },
    /*------------------ VIEW ACTIVE COUNTRIES --------------------*/

    /*------------------ VIEW CITIES OF SELECTED COUNTRY --------------------*/
    viewCitiesOfSelectedCountry: async function (e) {
      // VARIABLE TO STORE SELECTED COUNTRY ID
      let countryIdSelected;

      // CHECK IF COUNTRY FIELD IS FOR EMPLOYEE OR CUSTOMER
      if(e.currentTarget.id === 'employee_country') {
        countryIdSelected = this.selectedEmployeeCountry;
      }
      else if(e.currentTarget.id === 'customer_country') {
        countryIdSelected = this.selectedCustomerCountry;
      }

      // API PARAMETERS
      params = { 
        "country_id": countryIdSelected
      };

      // GET CITIES OF SELECTED COUNTRY FROM SERVER
      const result = await action(baseUrl, viewCitiesOfSelectedCountryWithoutTokenEndPoint, params);
      const res = await result.json();
      
      // IF ALL CITIES ARE RETURNED SUCCESSFULLY
      if(res.result === 1) {
        this.cityList = res.data; // STORE THE CITIES RETURNED IN ARRAY
      }
    },
    /*------------------ VIEW CITIES OF SELECTED COUNTRY --------------------*/

    
    
  }
})
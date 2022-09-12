// VIEW ALL USERS
const viewAllUsersEndPoint = "/get_all_users";

// UPDATE USER STATUS 
const updateUserStatusEndPoint = "/update_user_status";

// ADD CUSTOMER IN USERS
const addCustomerInUserEndPoint = "/add_customer_user";

// VIEW ALL ACTIVE COUNTRIES
const viewAllActiveCountriesEndPoint = "/get_active_countries";

// VIEW CITIES OF SELECTED COUNTRY
const viewCitiesOfSelectedCountryEndPoint = "/get_all_cities_of_country";

// VIEW ALL ACTIVE ROLES
const viewAllActiveRolesEndPoint = "/get_active_roles";

// CHECK FOR UNIQUE EMAIL AND MOBILE NUMBER
const checkUniqueEmailMobileNumberFromSystem = "/check_unique_email_mobile";

// CHECK FOR UNIQUE EMAIL AND MOBILE NUMBER FOR CUSTOMER
const checkUniqueEmailMobileNumberCustomerFromSystem = "/check_unique_email_mobile_customer";

// ERROR MESSAGE FOR INVALID MOBILE NUMBER
let errorMsgMobileNumber = '';

new Vue({
  el: '#customersVueApp',
  data: {
    error: '',

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
    roleList: [],
  },
  mounted: function () { // WHEN VUE COMPONENT IS ADDED TO DOM, THIS HOOK IS CALLED
    this.viewAllCustomers(); // VIEW ALL CUSTOMERS

    this.viewAllActiveCountries(); // VIEW ALL ACTIVE COUNTRIES
    this.viewAllActiveRoles(); // VIEW ALL ACTIVE ROLES

    mobileNumberVerification('customer_mobile');
  },
  methods: {

    /*-------------------------------------------------------------*/
    /*---------------------- CUSTOMERS ----------------------------*/
    /*-------------------------------------------------------------*/

    viewAllCustomers: async function () {
      // SPINNER, CUSTOMER TABLE VARIABLES
      const spinner = document.querySelector('.horizontal-loader-customer');
      const addCustomerBtn = document.querySelector('.add-btn');
      const table = document.querySelector('.table-data-table-customer');

      // SHOW SPINNER AND HIDE CUSTOMER TABLE
      spinner.style.display = 'block';
      addCustomerBtn.style.display = 'none';
      table.style.display = 'none';

      // DESTROY THE DATA TABLE
      $('#data_table_customer').DataTable().destroy();

      // PARAMETERS TO VIEW ALL CUSTOMERS
      params = {
        "type": "CUSTOMER"
      }; 
      // GET ALL CUSTOMERS FROM API CALL
      const result = await actionAPICall(baseUrl, viewAllUsersEndPoint, params);
      const res = await result.json();
      
      // IF ALL CUSTOMERS ARE RETURNED SUCCESSFULLY
      if(res.result == 1) {
        this.customerList = res.data; // STORE THE CUSTOMERS RETURNED IN ARRAY
      }

      setTimeout(function(){
        // SHOW CUSTOMER TABLE AND HIDE SPINNER
        spinner.style.display = 'none';
        addCustomerBtn.style.display = 'block';
        table.style.display = 'block';
        
        // DRAW THE DATA TABLE
        $('#data_table_customer').DataTable().draw();

        // SHOW ACTIVE INACTIVE STATUS FOR EACH TABLE ROW
        activeInactiveButtonInput();

      }, 500);
    },

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
          
          toastr.success('Customer added successfully');
          this.viewAllCustomers(); // RELOAD ALL CUSTOMERS VIEW

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
      this.error = 'Customer name is empty';
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

    /*---------- UPDATE EMPLOYEE/ CUSTOMER STATUS ----------------------*/
    onClickUpdateStatus: function (e) {
      
      // GET EMPLOYEE / CUSTOMER ID AND STATUS
      const id = e.currentTarget.getAttribute('data-id');
      const currentStatus = e.currentTarget.getAttribute('data-current-status');
      // VARIABLE TO STORE NEW UPDATED STATUS
      let newStatus;

      // CURRENT STATUS IS ACTIVE
      if(currentStatus === statusObj.active) {
        newStatus = statusObj.inactive; // MAKE THE NEW STATUS INACTIVE
      }
      // CURRENT STATIS IS INACTIVE
      else if(currentStatus === statusObj.inactive) {
        newStatus = statusObj.active; // MAKE THE NEW STATUS ACTIVE
      }

      // UPDATE STATUS
      params = {
        "status": newStatus,
        "user_id": id
      }
      
      this.updateEmployeeCustomerStatus(params);
    },
    // UPDATE EMPLOYEE/ CUSTOMER STATUS
    updateEmployeeCustomerStatus: async function (params) {
      // UPDATE EMPLOYEE/ CUSTOMER STATUS ON SERVER
      const result = await actionAPICall(baseUrl, updateUserStatusEndPoint, params);
      const res = await result.json();
      
      // STATUS UPDATED SUCCESSFULLY
      if(res.result === 'success') {
        toastr.success('Status updated successfully');
        this.viewAllCustomers();
      }
      else {
        toastr.error('There was an error!');
      }
    },
    /*---------- UPDATE EMPLOYEE/ CUSTOMER STATUS ----------------------*/

    /*------------------ VIEW ACTIVE COUNTRIES --------------------*/
    viewAllActiveCountries: async function () {
      // API PARAMETERS
      params = { };

      // GET ACTIVE COUNTRIES FROM SERVER
      const result = await actionAPICall(baseUrl, viewAllActiveCountriesEndPoint, params);
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
      const result = await actionAPICall(baseUrl, viewCitiesOfSelectedCountryEndPoint, params);
      const res = await result.json();
      
      // IF ALL CITIES ARE RETURNED SUCCESSFULLY
      if(res.result === 1) {
        this.cityList = res.data; // STORE THE CITIES RETURNED IN ARRAY
      }
    },
    /*------------------ VIEW CITIES OF SELECTED COUNTRY --------------------*/

    /*------------------ VIEW ACTIVE ROLES --------------------*/
    viewAllActiveRoles: async function () {
      // API PARAMETERS
      params = { };

      // GET ACTIVE ROLES FROM SERVER
      const result = await actionAPICall(baseUrl, viewAllActiveRolesEndPoint, params);
      const res = await result.json();
      
      // IF ALL ROLES ARE RETURNED SUCCESSFULLY
      if(res.result === 1) {
        this.roleList = res.data; // STORE THE ROLES RETURNED IN ARRAY
      }
    },
    /*------------------ VIEW ACTIVE ROLES --------------------*/  
 
  }
})
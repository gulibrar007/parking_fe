// VIEW ALL USERS
const viewAllUsersEndPoint = "/get_all_users";

// UPDATE USER STATUS 
const updateUserStatusEndPoint = "/update_user_status";

// ADD EMPLOYEE IN USERS
const addEmployeeInUserEndPoint = "/add_employee_user";

// VIEW ALL ACTIVE COUNTRIES
const viewAllActiveCountriesEndPoint = "/get_active_countries";

// VIEW CITIES OF SELECTED COUNTRY
const viewCitiesOfSelectedCountryEndPoint = "/get_all_cities_of_country";

// VIEW ALL ACTIVE ROLES
const viewAllActiveRolesEndPoint = "/get_active_roles";

// CUSTOMER TAB CLICK VARIABLE
let customerTabClickOnce = false;
// ERROR MESSAGE FOR INVALID MOBILE NUMBER
let errorMsgMobileNumber = '';

new Vue({
  el: '#usersVueApp',
  data: {
    error: '',
    // EMPLOYEE VARIABLES
    invalidEmployeeDetails: true,

    validEmployeeName: false,
    employeeName: '',
    validEmployeeAddress: false,
    employeeAddress: '',
    validEmployeeMobile: false,
    employeeMobile: '',
    validEmployeeEmail: false,
    employeeEmail: '',
    validEmployeeCountry: false,
    selectedEmployeeCountry: '',
    validEmployeeCity: false,
    selectedEmployeeCity: '',
    validEmployeeRole: false,
    selectedEmployeeRole: '',
    validEmployeeCnic: false,
    employeeCnic: '',

    employeeList: [],
    // EMPLOYEE VARIABLES

    // CUSTOMER VARIABLES
    customerList: [],
    // CUSTOMER VARIABLES

    countryList: [],
    cityList: [],
    roleList: [],
  },
  mounted: function () { // WHEN VUE COMPONENT IS ADDED TO DOM, THIS HOOK IS CALLED
    this.viewAllEmployees(); // VIEW ALL EMPLOYEES

    this.viewAllActiveCountries(); // VIEW ALL ACTIVE COUNTRIES
    this.viewAllActiveRoles(); // VIEW ALL ACTIVE ROLES
    this.mobileNumberVerification(); 
  },
  methods: {
    /*---------- ON CLICKING EMPLOYEE TAB -------------------------*/
    onClickEmployeeTab: function () {
      // GET THE ADD NEW BUTTON
      const addNewBtn = document.querySelector('.add-btn');

      // MAKE ADD NEW BUTTON OPEN MODAL TO ADD NEW EMPLOYEES
      addNewBtn.dataset.target = '#addEmployee';
    },
    /*---------- ON CLICKING EMPLOYEE TAB -------------------------*/
    /*---------- ON CLICKING CUSTOMER TAB -------------------------*/
    onClickCustomerTab: function () {
      // GET THE ADD NEW BUTTON
      const addNewBtn = document.querySelector('.add-btn');
      
      // MAKE ADD NEW BUTTON OPEN MODAL TO ADD NEW CUSTOMERS
      addNewBtn.dataset.target = '#addCustomer';
      
      // FIRST TIME OPENING CUSTOMER TAB
      if(customerTabClickOnce === false) {
        customerTabClickOnce = true; // CUSTOMER TAB CLICKED ONCE

        this.viewAllCustomers(); // VIEW ALL CUSTOMERS
      }
    },
    /*---------- ON CLICKING CUSTOMER TAB -------------------------*/

    /*-------------------------------------------------------------*/
    /*---------------------- EMPLOYEES ----------------------------*/
    /*-------------------------------------------------------------*/

    /*---------- VIEW ALL EMPLOYEES -------------------------------*/
    viewAllEmployees: async function () {
      // SPINNER, ADD EMPLOYEE BTN AND CITY TABLE VARIABLES
      const spinner = document.querySelector('.horizontal-loader-employee');
      const addEmployeeBtn = document.querySelector('.add-btn');
      const table = document.querySelector('.table-data-table-employee');

      // SHOW SPINNER AND HIDE ADD EMPLOYEE BTN, TABLE
      spinner.style.display = 'block';
      addEmployeeBtn.style.display = 'none';
      table.style.display = 'none';

      // DESTROY THE DATA TABLE
      $('#data_table_employee').DataTable().destroy();

      // PARAMETERS TO VIEW ALL EMPLOYEES
      params = {
        "type": "EMPLOYEE"
      }; 
      // GET ALL EMPLOYEES FROM API CALL
      const result = await actionAPICall(baseUrl, viewAllUsersEndPoint, params);
      const res = await result.json();
      
      // IF ALL EMPLOYEES ARE RETURNED SUCCESSFULLY
      if(res.result == 1) {
        this.employeeList = res.data; // STORE THE EMPLOYEES RETURNED IN ARRAY
      }

      setTimeout(function(){
        // SHOW ADD EMPLOYEE BTN, TABLE AND HIDE SPINNER
        spinner.style.display = 'none';
        addEmployeeBtn.style.display = 'block';
        table.style.display = 'block';
        
        // DRAW THE DATA TABLE
        $('#data_table_employee').DataTable().draw();

        // SHOW ACTIVE INACTIVE STATUS FOR EACH TABLE ROW
        activeInactiveButtonInput();

        // SHOW SELECTED STATUS IN UPDATE MODAL
        //activeInactiveModalSelectOptions();

      }, 500);
    },
    /*---------- VIEW ALL EMPLOYEES -------------------------------*/

    /*---------- ADD EMPLOYEE -------------------------------------*/
    // ON ADD BUTTON CLICK IN ADD EMPLOYEE MODAL
    onClickAddBtn: function () {
      if(this.employeeName === '') { // EMPTY EMPLOYEE NAME
        this.validEmployeeName = true;
        this.invalidEmployeeDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addEmployee, body').animate({ scrollTop: $('#addEmployeeName').offset().top }, 800);
        this.emptyEmployeeName();
      }
      else if(this.employeeEmail === '') { // EMPTY EMPLOYEE EMAIL  
        this.validEmployeeEmail = true;
        this.invalidEmployeeDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addEmployee, body').animate({ scrollTop: $('#addEmployeeEmail').offset().top }, 800);
        this.emptyEmployeeEmail();
      }
      else if(!validEmail(this.employeeEmail)) { // INVALID EMPLOYEE EMAIL
        this.validEmployeeEmail = true;
        this.invalidEmployeeDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addEmployee, body').animate({ scrollTop: $('#addEmployeeEmail').offset().top }, 800);
        this.invalidEmployeeEmail();
      }
      else if(this.employeeMobile === '') { // EMPTY MOBILE NUMBER
        this.validEmployeeMobile = true;
        this.invalidEmployeeDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addEmployee, body').animate({ scrollTop: $('#addEmployeeMobile').offset().top }, 800);
        this.emptyEmployeeMobile();
      }
      else if(errorMsgMobileNumber != 'valid number') { // CHECK FOR VALID MOBILE NUMBER
        this.validEmployeeMobile = true;
        this.invalidEmployeeDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addEmployee,body').animate({ scrollTop: $("#addEmployeeMobile").offset().top }, 'slow');
        this.invalidEmployeeMobile();
      }
      else if(this.employeeCnic === '') { // EMPTY CNIC
        this.validEmployeeCnic = true;
        this.invalidEmployeeDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addEmployee,body').animate({ scrollTop: $("#addEmployeeCnic").offset().top }, 'slow');
        this.emptyEmployeeCnic();
      }
      else if(!validCnic(this.employeeCnic)) { // EMPTY CNIC
        this.validEmployeeCnic = true;
        this.invalidEmployeeDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addEmployee,body').animate({ scrollTop: $("#addEmployeeCnic").offset().top }, 'slow');
        this.invalidEmployeeCnic();
      }
      else if(this.selectedEmployeeRole === '') { // EMPTY EMPLOYEE ROLE
        this.validEmployeeRole = true;
        this.invalidEmployeeDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addEmployee,body').animate({ scrollTop: $("#addEmployeeRole").offset().top }, 'slow');
        this.emptyEmployeeRole();
      }
      else if(this.selectedEmployeeCountry === '') { // EMPTY EMPLOYEE COUNTRY
        this.validEmployeeCountry = true;
        this.invalidEmployeeDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addEmployee,body').animate({ scrollTop: $("#addEmployeeCountry").offset().top }, 'slow');
        this.emptyEmployeeCountry();
      }
      else if(this.selectedEmployeeCity === '') { // EMPTY EMPLOYEE CITY
        this.validEmployeeCity = true;
        this.invalidEmployeeDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addEmployee,body').animate({ scrollTop: $("#addEmployeeCity").offset().top }, 'slow');
        this.emptyEmployeeCity();
      }
      else if(this.employeeAddress === '') { // EMPTY EMPLOYEE ADDRESS
        this.validEmployeeAddress = true;
        this.invalidEmployeeDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addEmployee,body').animate({ scrollTop: $("#addEmployeeAddress").offset().top }, 'slow');
        this.emptyEmployeeAddress();
      }
      
      else { 
        // API PARAMETERS
        params = {
          "name" : this.employeeName,
          "email": this.employeeEmail,
          "mobile": this.employeeMobile,
          "cnic": this.employeeCnic,
          "role": this.selectedEmployeeRole,
          "country": this.selectedEmployeeCountry,
          "city": this.selectedEmployeeCity,
          "address": this.employeeAddress,
        }

        // ADD EMPLOYEE
        this.addEmployee(params);
      }
    },
    addEmployee: async function (params) {
      const addEmployeeModalBtn = document.querySelector('.add-employee-modal-btn');
      
      // DISABLE ADD EMPLOYEE BUTTON
      addEmployeeModalBtn.disabled = true;

      // ADD EMPLOYEE ON SERVER
      const result = await actionAPICall(baseUrl, addEmployeeInUserEndPoint, params);
      const res = await result.json();

      // EMPLOYEE ADDED SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('addEmployee');

        // ENABLE ADD EMPLOYEE BUTTON
        addEmployeeModalBtn.disabled = false;
        
        toastr.success('Employee added successfully');
        this.viewAllEmployees(); // RELOAD ALL EMPLOYEES VIEW

        // RESET INPUT FIELDS
        this.employeeName = '';
        this.employeeEmai = '';
        this.employeeMobile = '';
        this.employeeCnic = '';
        this.selectedEmployeeRole = '';
        this.selectedEmployeeCountry = '';
        this.selectedEmployeeCity = '';
        this.employeeAddress = '';
      }
      else {
        // CLOSE MODAL
        closeModal('addEmployee');

        // ENABLE ADD EMPLOYEE BUTTON
        addEmployeeModalBtn.disabled = false;

        // ERROR MESSAGE
        toastr.error('There was an error!');
      }
    },
    /*---------- ADD EMPLOYEE -------------------------------------*/

    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/
    emptyEmployeeName: function () {
      this.error = 'Employee name is empty';
    },
    emptyEmployeeEmail: function () {
      this.error = 'Email is empty';
    },
    invalidEmployeeEmail: function () {
      this.error = 'Email is invalid';
    },
    emptyEmployeeMobile: function () {
      this.error = 'Mobile # is empty';
    },
    invalidEmployeeMobile: function () {
      this.error = 'Mobile # ' + errorMsgMobileNumber;
    },
    emptyEmployeeCnic: function () {
      this.error = 'CNIC is empty';
    },
    invalidEmployeeCnic: function () {
      this.error = 'CNIC in invalid';
    },
    emptyEmployeeRole: function () {
      this.error = 'Select role';
    },
    emptyEmployeeCountry: function () {
      this.error = 'Select country';
    },
    emptyEmployeeCity: function () {
      this.error = 'Select city';
    },
    emptyEmployeeAddress: function () {
      this.error = 'Address is empty';
    },
    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/

    /*----------- REMOVE HIGHLIGHTED ERRORS -----------------------*/
    keyUpEmployeeName: function () { // KEY IS PRESSED UP ON EMPLOYEE NAME INPUT
      this.validEmployeeName = false;
      this.invalidEmployeeDetails = true;
    },
    keyUpEmployeeAddress: function () { // KEY IS PRESSED UP ON EMPLOYEE ADDRESS INPUT
      this.validEmployeeAddress = false;
      this.invalidEmployeeDetails = true;
    },
    keyUpEmployeeMobile: function () { // KEY IS PRESSED UP ON EMPLOYEE MOBILE INPUT
      this.validEmployeeMobile = false;
      this.invalidEmployeeDetails = true;
    },
    keyUpEmployeeEmail: function () { // KEY IS PRESSED UP ON EMPLOYEE EMAIL INPUT
      this.validEmployeeEmail = false;
      this.invalidEmployeeDetails = true;
    },
    keyUpEmployeeCnic: function () { // KEY IS PRESSED UP ON EMPLOYEE CNIC INPUT
      this.validEmployeeCnic = false;
      this.invalidEmployeeDetails = true;
    },
    onFocusEmployeeRole: function () { // ON FOCUS OF EMPLOYEE ROLE SELECT INPUT
      this.validEmployeeRole = false;
      this.invalidEmployeeDetails = true;
    },
    onFocusEmployeeCountry: function () { // ON FOCUS OF EMPLOYEE COUNTRY SELECT INPUT
      this.validEmployeeCountry = false;
      this.invalidEmployeeDetails = true;
    },
    onFocusEmployeeCity: function () { // ON FOCUS OF EMPLOYEE CITY SELECT INPUT
      this.validEmployeeCity = false;
      this.invalidEmployeeDetails = true;
    },
    /*----------- REMOVE HIGHLIGHTED ERRORS -----------------------*/

    /*-------------------------------------------------------------*/
    /*---------------------- EMPLOYEES ----------------------------*/
    /*-------------------------------------------------------------*/

    /*-------------------------------------------------------------*/
    /*---------------------- CUSTOMERS ----------------------------*/
    /*-------------------------------------------------------------*/

    viewAllCustomers: async function () {
      // SPINNER, CUSTOMER TABLE VARIABLES
      const spinner = document.querySelector('.horizontal-loader-customer');
      const table = document.querySelector('.table-data-table-customer');

      // SHOW SPINNER AND HIDE CUSTOMER TABLE
      spinner.style.display = 'block';
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
        table.style.display = 'block';
        
        // DRAW THE DATA TABLE
        $('#data_table_customer').DataTable().draw();

        // SHOW ACTIVE INACTIVE STATUS FOR EACH TABLE ROW
        activeInactiveButtonInput();

        // SHOW SELECTED STATUS IN UPDATE MODAL
        //activeInactiveModalSelectOptions();

      }, 500);
    },

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
        this.viewAllEmployees();
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
    viewCitiesOfSelectedCountry: async function () {
      // API PARAMETERS
      params = { 
        "country_id": this.selectedEmployeeCountry
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
    /*--------- MOBILE NUMBER VERIFICATION --------*/
    mobileNumberVerification: function () { 
      var input = document.querySelector("#employee_mobile");
      //var input2 = document.querySelector("#cell_phone_2");
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
            console.log('correct phone number')
            errorMsgMobileNumber = 'valid number';
            //return true;
          } 
          else {
            input.classList.add("error");
            errorCode = iti.getValidationError();
            console.log('wrong mobile number');
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
 
  }
})
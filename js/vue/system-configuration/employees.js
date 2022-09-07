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

// CHECK FOR UNIQUE EMAIL AND MOBILE NUMBER
const checkUniqueEmailMobileNumberFromSystem = "/check_unique_email_mobile";

// CHECK FOR UNIQUE EMAIL AND MOBILE NUMBER FOR CUSTOMER
const checkUniqueEmailMobileNumberCustomerFromSystem = "/check_unique_email_mobile_customer";

// ERROR MESSAGE FOR INVALID MOBILE NUMBER
let errorMsgMobileNumber = '';

new Vue({
  el: '#employeeVueApp',
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

    countryIdSelected: '',
    countryList: [],
    cityList: [],
    roleList: [],
  },
  mounted: function () { // WHEN VUE COMPONENT IS ADDED TO DOM, THIS HOOK IS CALLED
    this.viewAllEmployees(); // VIEW ALL EMPLOYEES

    this.viewAllActiveCountries(); // VIEW ALL ACTIVE COUNTRIES
    this.viewAllActiveRoles(); // VIEW ALL ACTIVE ROLES

    mobileNumberVerification('employee_mobile');
  },
  methods: {

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
        this.emptyEmail();
      }
      else if(!validEmail(this.employeeEmail)) { // INVALID EMPLOYEE EMAIL
        this.validEmployeeEmail = true;
        this.invalidEmployeeDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addEmployee, body').animate({ scrollTop: $('#addEmployeeEmail').offset().top }, 800);
        this.invalidEmail();
      }
      else if(this.employeeMobile === '') { // EMPTY MOBILE NUMBER
        this.validEmployeeMobile = true;
        this.invalidEmployeeDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addEmployee, body').animate({ scrollTop: $('#addEmployeeMobile').offset().top }, 800);
        this.emptyMobileNumber();
      }
      else if(errorMsgMobileNumber != 'valid number') { // CHECK FOR VALID MOBILE NUMBER
        this.validEmployeeMobile = true;
        this.invalidEmployeeDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addEmployee,body').animate({ scrollTop: $("#addEmployeeMobile").offset().top }, 'slow');
        this.invalidMobileNumber();
      }
      else if(this.employeeCnic === '') { // EMPTY CNIC
        this.validEmployeeCnic = true;
        this.invalidEmployeeDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addEmployee,body').animate({ scrollTop: $("#addEmployeeCnic").offset().top }, 'slow');
        this.emptyCnic();
      }
      else if(!validCnic(this.employeeCnic)) { // EMPTY CNIC
        this.validEmployeeCnic = true;
        this.invalidEmployeeDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addEmployee,body').animate({ scrollTop: $("#addEmployeeCnic").offset().top }, 'slow');
        this.invalidCnic();
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
        this.emptyCountry();
      }
      else if(this.selectedEmployeeCity === '') { // EMPTY EMPLOYEE CITY
        this.validEmployeeCity = true;
        this.invalidEmployeeDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addEmployee,body').animate({ scrollTop: $("#addEmployeeCity").offset().top }, 'slow');
        this.emptyCity();
      }
      else if(this.employeeAddress === '') { // EMPTY EMPLOYEE ADDRESS
        this.validEmployeeAddress = true;
        this.invalidEmployeeDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addEmployee,body').animate({ scrollTop: $("#addEmployeeAddress").offset().top }, 'slow');
        this.emptyAddress();
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
    addEmployee: async function (params) { // CHECK FOR DUPLICATE EMAIL/ MOBILE NUMBER ON SERVER AND THEN ADD EMPLOYEE
      const addEmployeeModalBtn = document.querySelector('.add-employee-modal-btn');
      
      // DISABLE ADD EMPLOYEE BUTTON
      addEmployeeModalBtn.disabled = true;

      // API PARAMETERS FOR UNIQUE EMAIL
      let paramsUniqueEmail = {
        "data": this.employeeEmail
      }

      // API PARAMETERS FOR UNIQUE MOBILE NUMBER
      let paramsUniqueMobileNumber = {
        "data": this.employeeMobile
      }

      // CHECK IF ENTERED EMAIL ALREADY EXISTS ON SERVER
      const resultUniqueEmailCheck = await actionAPICall(baseUrl, checkUniqueEmailMobileNumberFromSystem, paramsUniqueEmail);
      const resUniqueEmailCheck = await resultUniqueEmailCheck.json();

      // CHECK IF ENTERED MOBILE NUMBER ALREADY EXISTS ON SERVER
      const resultUniqueMobileNumberCheck = await actionAPICall(baseUrl, checkUniqueEmailMobileNumberFromSystem, paramsUniqueMobileNumber);
      const resUniqueMobileNumberCheck = await resultUniqueMobileNumberCheck.json();

      // EMAIL ALREADY EXISTS ON SERVER
      if(resUniqueEmailCheck.result === true) {
        this.validEmployeeEmail = true;
        this.invalidEmployeeDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addEmployee, body').animate({ scrollTop: $('#addEmployeeEmail').offset().top }, 800);
        this.duplicateEmailInSystem();

        // ENABLE ADD EMPLOYEE BUTTON
        addEmployeeModalBtn.disabled = false;

      }
      // MOBILE NUMBER ALREADY EXISTS ON SERVER
      else if(resUniqueMobileNumberCheck.result === true) {
        this.validEmployeeMobile = true;
        this.invalidEmployeeDetails = false;
        // SCROLL TO TOP OF MODAL
        $('#addEmployee, body').animate({ scrollTop: $('#addEmployeeMobile').offset().top }, 800);
        this.duplicateMobileNumberInSystem();

        // ENABLE ADD EMPLOYEE BUTTON
        addEmployeeModalBtn.disabled = false;

      }
      // NO DUPLICATE EMAIL/ MOBILE NUMBER
      else {
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
          this.employeeEmail = '';
          this.employeeMobile = '';
          this.employeeCnic = '';
          this.selectedEmployeeRole = '';
          this.selectedEmployeeCountry = '';
          this.cityList = [];
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
      }

      
    },
    /*---------- ADD EMPLOYEE -------------------------------------*/

    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/
    emptyEmployeeName: function () {
      this.error = 'Employee name is empty';
    },
    emptyEmployeeRole: function () {
      this.error = 'Select role';
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
      
      this.updateEmployeeStatus(params);
    },
    // UPDATE EMPLOYEE STATUS
    updateEmployeeStatus: async function (params) {
      // UPDATE EMPLOYEE STATUS ON SERVER
      const result = await actionAPICall(baseUrl, updateUserStatusEndPoint, params);
      const res = await result.json();
      
      // STATUS UPDATED SUCCESSFULLY
      if(res.result === 'success') {
        toastr.success('Status updated successfully');
        this.viewAllEmployees();
      }
      else {
        toastr.error('There was an error!');
      }
    },
    /*---------- UPDATE EMPLOYEE STATUS ----------------------*/

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
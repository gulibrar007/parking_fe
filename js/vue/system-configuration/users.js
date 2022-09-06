// VIEW ALL USERS
const viewAllUsersEndPoint = "/get_all_users";

// UPDATE USER STATUS 
const updateUserStatusEndPoint = "/update_user_status";

// ADD EMPLOYEE IN USERS
const addEmployeeInUserEndPoint = "/add_employee_user";

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
    this.viewAllEmployees(); // VIEW ALL EMPLOYEES

    this.viewAllActiveCountries(); // VIEW ALL ACTIVE COUNTRIES
    this.viewAllActiveRoles(); // VIEW ALL ACTIVE ROLES
  },
  methods: {
    /*---------- ON CLICKING EMPLOYEE TAB -------------------------*/
    onAddNewBtnClick: function (e) {
      // GET THE ADD NEW BUTTON TARGET MODAL
      const addBtnTarget = e.target.dataset.target;

      // IF TARGET MODAL IS ADD EMPLOYEE, VERIFY EMPLOYEE MOBILE NUMBER
      if(addBtnTarget === '#addEmployee') {
        mobileNumberVerification('employee_mobile');
      }
      // IF TARGET MODAL IS ADD CUSTOMER, VERIFY CUSTOMER MOBILE NUMBER
      else if(addBtnTarget === '#addCustomer') {
        mobileNumberVerification('customer_mobile');
      }

    },
    /*---------- ON CLICKING EMPLOYEE TAB -------------------------*/

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
      const resultUniqueEmailCheck = await actionAPICall(baseUrl, checkUniqueEmailMobileNumberCustomerFromSystem, paramsUniqueEmailCustomer);
      const resUniqueEmailCheck = await resultUniqueEmailCheck.json();

      // CHECK IF ENTERED MOBILE NUMBER ALREADY EXISTS ON SERVER
      const resultUniqueMobileNumberCheck = await actionAPICall(baseUrl, checkUniqueEmailMobileNumberCustomerFromSystem, paramsUniqueMobileNumberCustomer)
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
        const result = await actionAPICall(baseUrl, addCustomerInUserEndPoint, params);
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
    
    /*--------- COMMON ERRORS EMPTY/ INVALID INPUT FIELD ------*/
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
    /*--------- COMMON ERRORS EMPTY/ INVALID INPUT FIELD ------*/
 
  }
})
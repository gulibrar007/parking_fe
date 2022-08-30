// VIEW ALL COUNTRIES ENDPOINT
const viewAllCountriesEndPoint = "/get_all_country";

// VIEW ACTIVE COUNTRIES ENDPOINT
const viewActiveCountries = "/get_active_countries";

// VIEW SINGLE COUNTRY
const viewSingleCountryEndPoint= "/get_single_country";

// ADD COUNTRY ENDPOINT
const addCountryEndPoint = "/add_country";

// UPDATE COUNTRY ENDPOINT
const updateCountryEndPoint = "/update_country";

// UPDATE COUNTRY STATUS ENDPOINT
const updateCountryStatusEndPoint = "/update_country_status";

new Vue({
  el: '#country',
  data: {
    error: '',
    invalidCountryDetails: true,

    validCountryName: false,
    countryName: '',
    validCountryShortCode: false,
    countryShortCode: '',
    countryStatus: '',
    countryId: '',

    countryList: [],
  },
  mounted: function () {
    this.viewAllCountries();
  },
  methods: {
    /*---------- VIEW ALL COUNTRIES -------------------------*/
    viewAllCountries: async function () {

      // SPINNER AND ADD COUNTRY BTN, TABLE VARIABLES
      const spinner = document.querySelector('.horizontal-loader');
      const addCountryBtn = document.querySelector('.add-btn');
      const table = document.querySelector('.table-data-table');

      // SHOW SPINNER AND HIDE ADD COUNTRY BTN, TABLE
      spinner.style.display = 'block';
      addCountryBtn.style.display = 'none';
      table.style.display = 'none';

      // DESTROY THE DATA TABLE
      $('#data_table_country').DataTable().destroy();

      // PARAMETERS TO VIEW ALL COUNTRIES
      let params = { }; 
      // GET ALL COUNTRIES FROM API CALL
      const result = await actionAPICall(baseUrl, viewAllCountriesEndPoint, params);
      const res = await result.json();
      
      // IF ALL COUNTRIES ARE RETURNED SUCCESSFULLY
      if(res.result == 1) {
        this.countryList = res.data; // STORE THE COUNTRIES RETURNED IN ARRAY
      }

      setTimeout(function(){
        // SHOW ADD COUNTRY BTN, TABLE AND HIDE SPINNER
        spinner.style.display = 'none';
        addCountryBtn.style.display = 'block';
        table.style.display = 'block';
        
        // DRAW THE DATA TABLE
        $('#data_table_country').DataTable().draw();

        // SHOW ACTIVE INACTIVE STATUS FOR EACH TABLE ROW
        activeInactiveButtonInput();

        // SHOW SELECTED STATUS IN UPDATE MODAL
        activeInactiveModalSelectOptions();

      }, 500);
      

    },
    /*---------- VIEW ALL COUNTRIES -------------------------*/

    /*---------- ADD COUNTRY --------------------------------*/
    // ON ADD BUTTON CLICK IN ADD COUNTRY MODAL
    onClickAddBtn: function () {
      if(this.countryName === '') { // EMPTY COUNTRY NAME
        this.validCountryName = true;
        this.invalidCountryDetails = false;
        this.emptyCountryName();
      }  
      else if(this.countryShortCode === '') { // EMPTY COUNTRY SHORT CODE
        this.validCountryShortCode = true;
        this.invalidCountryDetails = false;
        this.emptyCountryShortCode();
      }
      else { // ADD COUNTRY
        params = {
          "name": this.countryName,
          "short_code": this.countryShortCode
        }

        this.addCountry(params);
      }
    },
    // ADD COUNTRY
    addCountry: async function (params) {
      // ADD COUNTRY ON SERVER
      const result = await actionAPICall(baseUrl, addCountryEndPoint, params);
      const res = await result.json();

      // COUNTRY ADDED SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('addCountry');
        
        toastr.success('Country added successfully');
        this.viewAllCountries(); // RELOAD ALL COUNTRIES VIEW

        // RESET INPUT FIELDS
        this.countryName = '';
        this.countryShortCode = '';
      }
      else {
        // CLOSE MODAL
        closeModal('addCountry');
        // ERROR MESSAGE
        toastr.error('There was an error!');
      }
    },
    /*---------- ADD COUNTRY --------------------------------*/

    /*---------- UPDATE COUNTRY -----------------------------*/
    // GET CURRENT VALUES OF COUNTRY
    onClickOpenUpdateCountryModal: async function (e) {
      // GET COUNTRY ID OF CLICKED ITEM
      this.countryId = e.currentTarget.getAttribute('data-country-id');

      // API PARAMETERS
      params = {
        "country_id": this.countryId
      };

      // VIEW SINGLE COUNTRY INFORMATION
      const result = await actionAPICall(baseUrl, viewSingleCountryEndPoint, params);
      const res = await result.json();

      // SINGLE COUNTRY DATA RETURNED SUCCESSFULLY 
      if(res.result === 1) {
        // STORE SINGLE COUNTRY INFORMATION IN VARIABLE 
        const singleCountryInfo = res.data[0];
        // ASSIGN COUNTRY INFORMATION TO RESPECTIVE INPUT FIELD
        this.countryName = singleCountryInfo.name;
        this.countryShortCode = singleCountryInfo.short_code;
        this.countryStatus = singleCountryInfo.status;
      }
      else {
        toastr.error('There was an error');
      }

    },
    // ON UPDATE BUTTON CLICK IN UPDATE COUNTRY MODAL
    onClickUpdateBtn: function () {
      if(this.countryName === '') { // EMPTY COUNTRY NAME
        this.validCountryName = true;
        this.invalidCountryDetails = false;
        this.emptyCountryName();
      }  
      else if(this.countryShortCode === '') { // EMPTY COUNTRY SHORT CODE
        this.validCountryShortCode = true;
        this.invalidCountryDetails = false;
        this.emptyCountryShortCode();
      }
      else { // UPDATE COUNTRY
        params = {
          "name": this.countryName,
          "country_id": this.countryId,
          "short_code": this.countryShortCode,
          "status": this.countryStatus
        }

        this.updateCountry(params);
      }
    },
    updateCountry: async function (params) {
      const result = await actionAPICall(baseUrl, updateCountryEndPoint, params);
      const res = await result.json();
      
      // UPDATE COUNTRY SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('updateCountry');
        
        toastr.success('Country updated successfully');
        this.viewAllCountries(); // RELOAD ALL COUNTRIES VIEW

        // RESET INPUT FIELDS
        this.countryName = '';
        this.countryShortCode = '';
        this.countryId = '';
        this.countryStatus = statusObj.active;
      }
      else {
        // CLOSE MODAL
        closeModal('updateCountry'); 
        // ERROR MESSAGE
        toastr.error('There was an error!');
      }
    },
    /*---------- UPDATE COUNTRY -----------------------------*/

    /*---------- UPDATE COUNTRY STATUS ----------------------*/
    onClickUpdateStatus: function (e) {
      
      // GET COUNTRY ID AND STATUS
      const countryId = e.currentTarget.getAttribute('data-country-id');
      const currentCountryStatus = e.currentTarget.getAttribute('data-current-status');
      // VARIABLE TO STORE NEW UPDATED STATUS
      let newStatus;

      // CURRENT STATUS IS ACTIVE
      if(currentCountryStatus === statusObj.active) {
        newStatus = statusObj.inactive; // MAKE THE NEW STATUS INACTIVE
      }
      // CURRENT STATIS IS INACTIVE
      else if(currentCountryStatus === statusObj.inactive) {
        newStatus = statusObj.active; // MAKE THE NEW STATUS ACTIVE
      }

      // UPDATE STATUS
      params = {
        "status": newStatus,
        "country_id": countryId
      }
      
      this.updateCountryStatus(params);
    },
    // UPDATE COUNTRY STATUS
    updateCountryStatus: async function (params) {
      // UPDATE COUNTRY STATUS ON SERVER
      const result = await actionAPICall(baseUrl, updateCountryStatusEndPoint, params);
      const res = await result.json();
      
      // STATUS UPDATED SUCCESSFULLY
      if(res.result === 'success') {
        toastr.success('Status updated successfully');
        this.viewAllCountries();
      }
      else {
        toastr.error('There was an error!');
      }
    },
    /*---------- UPDATE COUNTRY STATUS ----------------------*/

    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/
    emptyCountryName: function () {
      this.error = 'Country name is empty';
    },
    emptyCountryShortCode: function () {
      this.error = 'Short code is empty';
    },
    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/

    /*----------- HIGHLIGHT ERRORS -----------------------*/
    keyUpCountryName: function () {  // KEY IS PRESSED UP ON COUNTRY NAME INPUT
      this.validCountryName = false;
      this.invalidCountryDetails = true;
    },
    keyUpCountryShortCode: function () { // KEY IS PRESSED UP ON COUNTRY SHORT CODE INPUT
      this.validCountryShortCode = false;
      this.invalidCountryDetails = true;
    }
    /*----------- HIGHLIGHT ERRORS -----------------------*/
  }
})
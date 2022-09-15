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

// VIEW ALL ACTIVE LANGUAGES
const viewAllActiveLanguagesEndPoint = "/get_active_languages";

new Vue({
  el: '#countryVueApp',
  data: {
    error: '',
    invalidCountryDetails: true,

    validCountryName: false,
    countryName: '',
    validCountryShortCode: false,
    countryShortCode: '',
    validDialingShortCode: false,
    countryDialingCode: '',
    validNativeLanguage: false,
    selectedNativeLanguage: '',
    validNameInNative: false,
    nameInNative: '',
    countryStatus: '',
    countryId: '',

    countryList: [],
    nativeLanguageList: []
  },
  mounted: function () { // WHEN VUE COMPONENT IS ADDED TO DOM, THIS HOOK IS CALLED
    this.viewAllCountries();
    this.viewActiveLanguages();
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

    /*---------- VIEW ALL ACTIVE LANGUAGES ------------------*/
    viewActiveLanguages: async function () {
      // PARAMETERS TO VIEW ALL ACTIVE LANGUAGES
      params = { }; 
      // GET ALL ACTIVE LANGUAGES FROM API CALL
      const result = await actionAPICall(baseUrl, viewAllActiveLanguagesEndPoint, params);
      const res = await result.json();
      
      // IF ALL ACTIVE LANGUAGES ARE RETURNED SUCCESSFULLY
      if(res.result == 1) {
        this.nativeLanguageList = res.data; // STORE THE ACTIVE LANGUAGES RETURNED IN ARRAY
      }
    },
    /*---------- VIEW ALL ACTIVE LANGUAGES ------------------*/

    /*---------- ADD COUNTRY --------------------------------*/
    // ON ADD BUTTON CLICK IN ADD COUNTRY MODAL
    onClickAddBtn: function () {
      if(this.countryName === '') { // EMPTY COUNTRY NAME
        this.validCountryName = true;
        this.invalidCountryDetails = false;
        this.emptyCountryName();
      } 
      else if(this.selectedNativeLanguage === '') { // NO NATIVE LANGUAGE SELECTED
        this.validNativeLanguage = true;
        this.invalidCountryDetails = false;
        this.emptyNativeLanguage();
      }
      else if(this.nameInNative === '') { // EMPTY NAME IN NATIVE
        this.validNameInNative = true;
        this.invalidCountryDetails = false;
        this.emptyNameInNative();
      }
      else if(this.countryShortCode === '') { // EMPTY COUNTRY SHORT CODE
        this.validCountryShortCode = true;
        this.invalidCountryDetails = false;
        this.emptyCountryShortCode();
      }
      else if(this.countryDialingCode === '') { // EMPTY COUNTRY DIALING CODE
        this.validDialingShortCode = true;
        this.invalidCountryDetails = false;
        this.emptyCountryDialingCode();
      }
      else {
        // API PARAMETERS
        params = {
          "name": this.countryName,
          "language_id": this.selectedNativeLanguage,
          "name_native": this.nameInNative,
          "short_code": this.countryShortCode,
          "country_dialing_code": this.countryDialingCode
        }

        // ADD COUNTRY
        this.addCountry(params);
      }
    },
    // ADD COUNTRY
    addCountry: async function (params) {
      const addCountryModalBtn = document.querySelector('.add-country-modal-btn');
      
      // DISABLE ADD COUNTRY BUTTON
      addCountryModalBtn.disabled = true;

      // ADD COUNTRY ON SERVER
      const result = await actionAPICall(baseUrl, addCountryEndPoint, params);
      const res = await result.json();

      // COUNTRY ADDED SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('addCountry');

        // ENABLE ADD COUNTRY BUTTON
        addCountryModalBtn.disabled = false;
        
        toastr.success('Country added successfully');
        this.viewAllCountries(); // RELOAD ALL COUNTRIES VIEW

        // RESET INPUT FIELDS
        this.countryName = '';
        this.selectedNativeLanguage = '';
        this.nameInNative = '';
        this.countryShortCode = '';
        this.countryDialingCode = '';
      }
      else {
        // CLOSE MODAL
        closeModal('addCountry');

        // ENABLE ADD COUNTRY BUTTON
        addCountryModalBtn.disabled = false;

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
        this.selectedNativeLanguage = singleCountryInfo.language_id;
        this.nameInNative = singleCountryInfo.name_native;
        this.countryShortCode = singleCountryInfo.short_code;
        this.countryDialingCode = singleCountryInfo.country_dialing_code;
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
      else if(this.selectedNativeLanguage === '') { // NO NATIVE LANGUAGE SELECTED
        this.validNativeLanguage = true;
        this.invalidCountryDetails = false;
        this.emptyNativeLanguage();
      }
      else if(this.nameInNative === '') { // EMPTY NAME IN NATIVE
        this.validNameInNative = true;
        this.invalidCountryDetails = false;
        this.emptyNameInNative();
      }
      else if(this.countryShortCode === '') { // EMPTY COUNTRY SHORT CODE
        this.validCountryShortCode = true;
        this.invalidCountryDetails = false;
        this.emptyCountryShortCode();
      }
      else if(this.countryDialingCode === '') { // EMPTY COUNTRY DIALING CODE
        this.validDialingShortCode = true;
        this.invalidCountryDetails = false;
        this.emptyCountryDialingCode();
      }
      else { 
        // API PARAMETERS
        params = {
          "name": this.countryName,
          "language_id": this.selectedNativeLanguage,
          "name_native": this.nameInNative,
          "country_id": this.countryId,
          "short_code": this.countryShortCode,
          "country_dialing_code": this.countryDialingCode,
          "status": this.countryStatus
        }

        // UPDATE COUNTRY
        this.updateCountry(params);
      }
    },
    updateCountry: async function (params) {
      const addCountryModalBtn = document.querySelector('.update-country-modal-btn');
      
      // DISABLE ADD COUNTRY BUTTON
      addCountryModalBtn.disabled = true;

      // UPDATE COUNTRY ON SERVER
      const result = await actionAPICall(baseUrl, updateCountryEndPoint, params);
      const res = await result.json();
      
      // UPDATE COUNTRY SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('updateCountry');

        // ENABLE ADD COUNTRY BUTTON
        addCountryModalBtn.disabled = false;
        
        toastr.success('Country updated successfully');
        this.viewAllCountries(); // RELOAD ALL COUNTRIES VIEW

        // RESET INPUT FIELDS
        this.countryName = '';
        this.selectedNativeLanguage = '';
        this.nameInNative = '';
        this.countryId = '';
        this.countryShortCode = '';
        this.countryDialingCode = '';
        this.countryStatus = statusObj.active;
      }
      else {
        // CLOSE MODAL
        closeModal('updateCountry'); 

        // ENABLE ADD COUNTRY BUTTON
        addCountryModalBtn.disabled = false;

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
    emptyNativeLanguage: function () {
      this.error = 'Select native language';
    },
    emptyNameInNative: function () {
      this.error = 'Name in native is empty';
    },
    emptyCountryShortCode: function () {
      this.error = 'Short code is empty';
    },
    emptyCountryDialingCode: function () {
      this.error = 'Dialing code is empty';
    },
    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/

    /*----------- REMOVE HIGHLIGHTED ERRORS -----------------------*/
    keyUpCountryName: function () {  // KEY IS PRESSED UP ON COUNTRY NAME INPUT
      this.validCountryName = false;
      this.invalidCountryDetails = true;
    },
    keyUpCountryShortCode: function () { // KEY IS PRESSED UP ON COUNTRY SHORT CODE INPUT
      this.validCountryShortCode = false;
      this.invalidCountryDetails = true;
    },
    keyUpDialingShortCode: function () { // KEY IS PRESSED UP ON COUNTRY DIALING CODE INPUT
      this.validDialingShortCode = false;
      this.invalidCountryDetails = true;
    },
    onFocusSelectNativeLanguage: function () { // FOCUS ON NATIVE LANGUAGE 
      this.validNativeLanguage = false;
      this.invalidCountryDetails = true;
    },
    keyUpNameInNative: function () { // KEY IS PRESSED UP ON NAME IN NATIVE INPUT
      this.validNameInNative = false;
      this.invalidCountryDetails = true;
    }
    /*----------- REMOVE HIGHLIGHTED ERRORS -----------------------*/
  }
})
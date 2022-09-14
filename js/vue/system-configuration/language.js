// VIEW ALL LANGUAGES ENDPOINT
const viewAllLanguagesEndPoint = "/get_all_languages";

// VIEW ACTIVE LANGUAGES ENDPOINT
const viewActiveCountries = "/get_active_countries";

// VIEW SINGLE LANGUAGE
const viewSingleCountryEndPoint= "/get_single_country";

// ADD LANGUAGE ENDPOINT
const addLanguageEndPoint = "/add_languages";

// UPDATE LANGUAGE ENDPOINT
const updateCountryEndPoint = "/update_country";

// UPDATE LANGUAGE STATUS ENDPOINT
const updateCountryStatusEndPoint = "/update_country_status";

new Vue({
  el: '#languageVueApp',
  data: {
    error: '',
    invalidLanguageDetails: true,

    validLanguageName: false,
    languageName: '',
    validLanguageType: false,
    languageType: '',
    countryStatus: '',
    countryId: '',

    languageList: [],
  },
  mounted: function () { // WHEN VUE COMPONENT IS ADDED TO DOM, THIS HOOK IS CALLED
    this.viewAllLanguages();
  },
  methods: {
    /*---------- VIEW ALL LANGUAGES -------------------------*/
    viewAllLanguages: async function () {

      // SPINNER AND ADD LANGUAGE BTN, TABLE VARIABLES
      const spinner = document.querySelector('.horizontal-loader');
      const addLanguageBtn = document.querySelector('.add-btn');
      const table = document.querySelector('.table-data-table');

      // SHOW SPINNER AND HIDE ADD LANGUAGE BTN, TABLE
      spinner.style.display = 'block';
      addLanguageBtn.style.display = 'none';
      table.style.display = 'none';

      // DESTROY THE DATA TABLE
      $('#data_table_language').DataTable().destroy();

      // PARAMETERS TO VIEW ALL LANGUAGES
      let params = { }; 
      // GET ALL LANGUAGES FROM API CALL
      const result = await actionAPICall(baseUrl, viewAllLanguagesEndPoint, params);
      const res = await result.json();
      
      // IF ALL LANGUAGES ARE RETURNED SUCCESSFULLY
      if(res.result == 1) {
        this.languageList = res.data; // STORE THE LANGUAGES RETURNED IN ARRAY
      }

      setTimeout(function(){
        // SHOW ADD LANGUAGE BTN, TABLE AND HIDE SPINNER
        spinner.style.display = 'none';
        addLanguageBtn.style.display = 'block';
        table.style.display = 'block';
        
        // DRAW THE DATA TABLE
        $('#data_table_language').DataTable().draw();

        // SHOW ACTIVE INACTIVE STATUS FOR EACH TABLE ROW
        activeInactiveButtonInput();

        // SHOW SELECTED STATUS IN UPDATE MODAL
        activeInactiveModalSelectOptions();

      }, 500);

    },
    /*---------- VIEW ALL LANGUAGES -------------------------*/

    /*---------- ADD LANGUAGE --------------------------------*/
    // ON ADD BUTTON CLICK IN ADD LANGUAGE MODAL
    onClickAddBtn: function () {
      if(this.languageName === '') { // EMPTY LANGUAGE NAME
        this.validLanguageName = true;
        this.invalidLanguageDetails = false;
        this.emptyLanguageName();
      }  
      else if(this.languageType === '') { // EMPTY LANGUAGE TYPE
        this.validLanguageType = true;
        this.invalidLanguageDetails = false;
        this.emptyLanguageType();
      }
      else {
        let rtl, ltr;
        if(this.languageType === 'RTL') {
          rtl = 1;
          ltr = 0;
        }
        else if(this.languageType === 'LTR') {
          rtl = 0;
          ltr = 1;
        }

        // API PARAMETERS
        params = {
          "name": this.languageName,
          "is_ltr": ltr,
          "is_rtl": rtl
        }
        
        // ADD LANGUAGE
        this.addLanguage(params);
      }
    },
    // ADD LANGUAGE
    addLanguage: async function (params) {
      const addLanguageModalBtn = document.querySelector('.add-language-modal-btn');
      
      // DISABLE ADD LANGUAGE BUTTON
      addLanguageModalBtn.disabled = true;

      // ADD LANGUAGE ON SERVER
      const result = await actionAPICall(baseUrl, addLanguageEndPoint, params);
      const res = await result.json();

      // LANGUAGE ADDED SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('addLanguage');

        // ENABLE ADD LANGUAGE BUTTON
        addLanguageModalBtn.disabled = false;
        
        toastr.success('Language added successfully');
        this.viewAllLanguages(); // RELOAD ALL LANGUAGES VIEW

        // RESET INPUT FIELDS
        this.languageName = '';
        this.languageType = '';
        document.querySelectorAll('.language-type-input').forEach(input => {
          input.classList.remove('active');
        })
      }
      else {
        // CLOSE MODAL
        closeModal('addLanguage');

        // ENABLE ADD COUNTRY BUTTON
        addLanguageModalBtn.disabled = false;

        // ERROR MESSAGE
        toastr.error('There was an error!');
      }
    },
    /*---------- ADD LANGUAGE --------------------------------*/

    /*---------- UPDATE LANGUAGE -----------------------------*/
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
        this.languageName = singleCountryInfo.name;
        this.languageType = singleCountryInfo.short_code;
        this.countryStatus = singleCountryInfo.status;
      }
      else {
        toastr.error('There was an error');
      }

    },
    // ON UPDATE BUTTON CLICK IN UPDATE LANGUAGE MODAL
    onClickUpdateBtn: function () {
      if(this.languageName === '') { // EMPTY COUNTRY NAME
        this.validLanguageName = true;
        this.invalidLanguageDetails = false;
        this.emptyLanguageName();
      }  
      else if(this.languageType === '') { // EMPTY COUNTRY SHORT CODE
        this.validLanguageType = true;
        this.invalidLanguageDetails = false;
        this.emptyLanguageType();
      }
      else { 
        // API PARAMETERS
        params = {
          "name": this.languageName,
          "country_id": this.countryId,
          "short_code": this.languageType,
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
        this.viewAllLanguages(); // RELOAD ALL COUNTRIES VIEW

        // RESET INPUT FIELDS
        this.languageName = '';
        this.languageType = '';
        this.countryId = '';
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
    /*---------- UPDATE LANGUAGE -----------------------------*/

    /*---------- UPDATE LANGUAGE STATUS ----------------------*/
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
    // UPDATE LANGUAGE STATUS
    updateCountryStatus: async function (params) {
      // UPDATE COUNTRY STATUS ON SERVER
      const result = await actionAPICall(baseUrl, updateCountryStatusEndPoint, params);
      const res = await result.json();
      
      // STATUS UPDATED SUCCESSFULLY
      if(res.result === 'success') {
        toastr.success('Status updated successfully');
        this.viewAllLanguages();
      }
      else {
        toastr.error('There was an error!');
      }
    },
    /*---------- UPDATE LANGUAGE STATUS ----------------------*/

    onClicklanguageType: function (e) {
      this.languageType = e.target.children[0].value;
    },

    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/
    emptyLanguageName: function () {
      this.error = 'Language name is empty';
    },
    emptyLanguageType: function () {
      this.error = 'Select language type';
    },
    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/

    /*----------- REMOVE HIGHLIGHTED ERRORS -----------------------*/
    keyUpLanguageName: function () {  // KEY IS PRESSED UP ON COUNTRY NAME INPUT
      this.validLanguageName = false;
      this.invalidLanguageDetails = true;
    },
    keyUpCountryShortCode: function () { // KEY IS PRESSED UP ON COUNTRY SHORT CODE INPUT
      this.validLanguageType = false;
      this.invalidLanguageDetails = true;
    }
    /*----------- REMOVE HIGHLIGHTED ERRORS -----------------------*/
  }
})
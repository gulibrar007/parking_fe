// VIEW ALL LANGUAGES ENDPOINT
const viewAllLanguagesEndPoint = "/get_all_languages";

// VIEW SINGLE LANGUAGE
const viewSingleLanguageEndPoint= "/get_single_language";

// ADD LANGUAGE ENDPOINT
const addLanguageEndPoint = "/add_languages";

// UPDATE LANGUAGE ENDPOINT
const updateLanguageEndPoint = "/update_languages";

// UPDATE LANGUAGE STATUS ENDPOINT
const updateLanguageStatusEndPoint = "/update_language_status";

new Vue({
  el: '#languageVueApp',
  data: {
    error: '',
    invalidLanguageDetails: true,

    validLanguageName: false,
    languageName: '',
    validLanguageType: false,
    languageType: '',
    languageStatus: '',
    languageId: '',

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
    // GET CURRENT VALUES OF LANGUAGE
    onClickOpenUpdateLanguageModal: async function (e) {
      // GET LANGUAGE ID OF CLICKED ITEM
      this.languageId = e.currentTarget.getAttribute('data-language-id');
      
      // API PARAMETERS
      params = {
        "languages_id": this.languageId
      };

      // VIEW SINGLE LANGUAGE INFORMATION
      const result = await actionAPICall(baseUrl, viewSingleLanguageEndPoint, params);
      const res = await result.json();

      // SINGLE LANGUAGE DATA RETURNED SUCCESSFULLY 
      if(res.result === 1) {
        // STORE SINGLE LANGUAGE INFORMATION IN VARIABLE 
        const singleLanguageInfo = res.data[0];
        // ASSIGN LANGUAGE INFORMATION TO RESPECTIVE INPUT FIELD
        this.languageName = singleLanguageInfo.name;

        this.languageStatus = singleLanguageInfo.status;

        let choosenLanguageType;
        
        if(singleLanguageInfo.is_ltr === 0 || singleLanguageInfo.is_rtl === 1) {
          this.languageType = 'RTL';
          choosenLanguageType = document.querySelector('#rtl-language-type');
          choosenLanguageType.parentElement.click();
        }
        else if(singleLanguageInfo.is_ltr === 1 || singleLanguageInfo.is_rtl === 0) {
          this.languageType = 'LTR';
          choosenLanguageType = document.querySelector('#ltr-language-type');
          choosenLanguageType.parentElement.click();

        }
        
      }
      else {
        toastr.error('There was an error');
      }

    },
    // ON UPDATE BUTTON CLICK IN UPDATE LANGUAGE MODAL
    onClickUpdateBtn: function () {
      if(this.languageName === '') { // EMPTY LANGUAGE NAME
        this.validLanguageName = true;
        this.invalidLanguageDetails = false;
        this.emptyLanguageName();
      }  
      else if(this.languageType === '') { // EMPTY LANGUAGE SHORT CODE
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
          "languages_id": parseInt(this.languageId),
          "is_rtl": rtl,
          "is_ltr": ltr,
          "status": this.languageStatus
        }

        // UPDATE LANGUAGE
        this.updateLanguage(params);
      }
    },
    updateLanguage: async function (params) {
      const addLanguageModalBtn = document.querySelector('.update-language-modal-btn');
      
      // DISABLE ADD LANGUAGE BUTTON
      addLanguageModalBtn.disabled = true;

      // UPDATE LANGUAGE ON SERVER
      const result = await actionAPICall(baseUrl, updateLanguageEndPoint, params);
      const res = await result.json();
      
      // UPDATE LANGUAGE SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('updateLanguage');

        // ENABLE ADD LANGUAGE BUTTON
        addLanguageModalBtn.disabled = false;
        
        toastr.success('Language updated successfully');
        this.viewAllLanguages(); // RELOAD ALL LANGUAGES VIEW

        // RESET INPUT FIELDS
        this.languageName = '';
        this.languageType = '';
        this.languageId = '';
        this.languageStatus = statusObj.active;
        document.querySelectorAll('.language-type-input').forEach(input => {
          input.classList.remove('active');
        })
      }
      else {
        // CLOSE MODAL
        closeModal('updateLanguage'); 

        // ENABLE ADD LANGUAGE BUTTON
        addLanguageModalBtn.disabled = false;

        // ERROR MESSAGE
        toastr.error('There was an error!');
      }
    },
    /*---------- UPDATE LANGUAGE -----------------------------*/

    /*---------- UPDATE LANGUAGE STATUS ----------------------*/
    onClickUpdateStatus: function (e) {
      
      // GET LANGUAGE ID AND STATUS
      const languageId = e.currentTarget.getAttribute('data-language-id');
      const currentLanguageStatus = e.currentTarget.getAttribute('data-current-status');
      // VARIABLE TO STORE NEW UPDATED STATUS
      let newStatus;

      // CURRENT STATUS IS ACTIVE
      if(currentLanguageStatus === statusObj.active) {
        newStatus = statusObj.inactive; // MAKE THE NEW STATUS INACTIVE
      }
      // CURRENT STATUS IS INACTIVE
      else if(currentLanguageStatus === statusObj.inactive) {
        newStatus = statusObj.active; // MAKE THE NEW STATUS ACTIVE
      }

      // UPDATE STATUS
      params = {
        "status": newStatus,
        "languages_id": languageId
      }
      
      this.updateLanguageStatus(params);
    },
    // UPDATE LANGUAGE STATUS
    updateLanguageStatus: async function (params) {
      // UPDATE LANGUAGE STATUS ON SERVER
      const result = await actionAPICall(baseUrl, updateLanguageStatusEndPoint, params);
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
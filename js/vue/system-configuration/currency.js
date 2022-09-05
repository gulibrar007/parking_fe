// VIEW ALL CURRENCIES ENDPOINT
const viewAllCurrenciesEndPoint = "/get_all_currency";

// VIEW ACTIVE CURRENCIES ENDPOINT
const viewActiveCurrenciesEndPoint = "/get_active_currency";

// VIEW ALL ACTIVE COUNTRIES
const viewAllActiveCountriesEndPoint = "/get_active_countries";

// GET SINGLE CURRENCY DETAILS
const getSingleCurrencyDetailsEndPoint = "/get_single_currency";

// ADD CURRENCY ENDPOINT
const addCurrencyEndPoint = "/add_currency";

// UPDATE CURRENCY ENDPOINT
const updateCurrencyEndPoint = "/update_currency";

// UPDATE CURRENCY STATUS ENDPOINT
const updateCurrencyStatusEndPoint = "/update_currency_status";

new Vue({
  el: '#currencyVueApp',
  data: {
    error: '',
    invalidCurrencyDetails: true,

    validCurrencyName: false,
    currencyName: '',
    validCurrencySymbol: false,
    currencySymbol: '',
    validCurrencyShortCode: false,
    currencyShortCode: '',
    validCountry: false,
    selectedCountry: '',
    validCurrencyStatus: false,
    currencyStatus: '',
    cityStatus: '',
    currencyId: '',

    currencyList: [],
    countryList: [],
  },
  mounted: function () { // WHEN VUE COMPONENT IS ADDED TO DOM, THIS HOOK IS CALLED
    this.viewAllCurrencies();
    this.viewAllCountries();
  },
  methods: {
    /*---------- VIEW ALL CURRENCIES -------------------------*/
    viewAllCurrencies: async function () {

      // SPINNER, ADD CURRENCY BTN AND TABLE VARIABLES
      const spinner = document.querySelector('.horizontal-loader');
      const addCurrencyBtn = document.querySelector('.add-btn');
      const table = document.querySelector('.table-data-table');

      // SHOW SPINNER AND HIDE ADD CURRENCY BTN, TABLE
      spinner.style.display = 'block';
      addCurrencyBtn.style.display = 'none';
      table.style.display = 'none';

      // DESTROY THE DATA TABLE
      $('#data_table_currency').DataTable().destroy();

      // PARAMETERS TO VIEW ALL CURRENCIES
      params = { }; 
      // GET ALL CURRENCIES FROM API CALL
      const result = await actionAPICall(baseUrl, viewAllCurrenciesEndPoint, params);
      const res = await result.json();
      
      // IF ALL CITIES ARE RETURNED SUCCESSFULLY
      if(res.result == 1) {
        this.currencyList = res.data; // STORE THE CITIES RETURNED IN ARRAY
      }

      setTimeout(function(){
        // SHOW ADD CITY BTN, TABLE AND HIDE SPINNER
        spinner.style.display = 'none';
        addCurrencyBtn.style.display = 'block';
        table.style.display = 'block';
        
        // DRAW THE DATA TABLE
        $('#data_table_currency').DataTable().draw();

        // SHOW ACTIVE INACTIVE STATUS FOR EACH TABLE ROW
        activeInactiveButtonInput();

        // SHOW SELECTED STATUS IN UPDATE MODAL
        activeInactiveModalSelectOptions();

      }, 500);

    },
    /*---------- VIEW ALL CURRENCIES -------------------------*/

    /*---------- VIEW ALL ACTIVE COUNTRIES ----------------------*/
    viewAllCountries: async function () {
      // PARAMETERS TO VIEW ALL ACTIVE COUNTRIES
      params = { }; 
      // GET ALL ACTIVE COUNTRIES FROM API CALL
      const result = await actionAPICall(baseUrl, viewAllActiveCountriesEndPoint, params);
      const res = await result.json();
      
      // IF ALL COUNTRIES ARE RETURNED SUCCESSFULLY
      if(res.result == 1) {
        this.countryList = res.data; // STORE THE COUNTRIES RETURNED IN ARRAY
      }
    },
    /*---------- VIEW ALL ACTIVE COUNTRIES ----------------------*/

    /*---------- ADD CURRENCY --------------------------------*/
    // ON ADD BUTTON CLICK IN ADD CURRENCY MODAL
    onClickAddBtn: function () {
      if(this.currencyName === '') { // EMPTY CURRENCY NAME
        this.validCurrencyName = true;
        this.invalidCurrencyDetails = false;
        this.emptyCurrencyName();
      }
      else if(this.currencySymbol === '') { // EMPTY CURRENCY SYMBOL
        this.validCurrencySymbol = true;
        this.invalidCurrencyDetails = false;
        this.emptyCurrencySymbol();
      }  
      else if(this.currencyShortCode === '') { // EMPTY CURRENCY SHORT CODE
        this.validCurrencyShortCode = true;
        this.invalidCurrencyDetails = false;
        this.emptyCurrencyShortCode();
      }
      else if(this.selectedCountry === ''){ // EMPTY COUNTRY
        this.validCountry = true;
        this.invalidCurrencyDetails = false;
        this.emptyCountrySelected();
      }
      else { 
        // API PARAMETERS
        params = {
          "name": this.currencyName,
          "symbol": this.currencySymbol,
          "short_code": this.currencyShortCode,
          "country_id": this.selectedCountry
        }
        
        // ADD CURRENCY
        this.addCurrency(params);
      }
    },
    // ADD CURRENCY
    addCurrency: async function (params) {
      const addCurrencyModalBtn = document.querySelector('.add-currency-modal-btn');
      
      // DISABLE ADD CURRENCY BUTTON
      addCurrencyModalBtn.disabled = true;

      // ADD CURRENCY ON SERVER
      const result = await actionAPICall(baseUrl, addCurrencyEndPoint, params);
      const res = await result.json();

      // CURRENCY ADDED SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('addCurrency');

        // ENABLE ADD CURRENCY BUTTON
        addCurrencyModalBtn.disabled = false;
        
        toastr.success('Currency added successfully');
        this.viewAllCurrencies(); // RELOAD ALL CURRENCIES VIEW

        // RESET INPUT FIELDS
        this.currencyName = '';
        this.currencySymbol = '';
        this.currencyShortCode = '';
        this.selectedCountry = '';
      }
      else {
        // CLOSE MODAL
        closeModal('addCurrency');

        // ENABLE ADD CURRENCY BUTTON
        addCurrencyModalBtn.disabled = false;

        // ERROR MESSAGE
        toastr.error('There was an error!');
      }
    },
    /*---------- ADD CURRENCY --------------------------------*/

    /*---------- UPDATE CURRENCY -----------------------------*/
    // GET CURRENT VALUES OF CURRENCY
    onClickOpenUpdateCurrencyModal: async function (e) {
      // GET CURRENCY ID OF CLICKED ITEM
      this.currencyId = e.currentTarget.getAttribute('data-currency-id');
      
      // API PARAMETERS
      params = {
        "currency_id": this.currencyId
      };

      // VIEW SINGLE CURRENCY INFORMATION
      const result = await actionAPICall(baseUrl, getSingleCurrencyDetailsEndPoint, params);
      const res = await result.json();

      // SINGLE CURRENCY DATA RETURNED SUCCESSFULLY 
      if(res.result === 1) {
        // STORE SINGLE CITY INFORMATION IN VARIABLE 
        const singleCurrencyInfo = res.data[0];
        console.log(singleCurrencyInfo)
        // ASSIGN CURRENCY INFORMATION TO RESPECTIVE INPUT FIELD
        this.currencyName = singleCurrencyInfo.name;
        this.currencySymbol = singleCurrencyInfo.symbol;
        this.currencyShortCode = singleCurrencyInfo.short_code;
        this.currencyStatus = singleCurrencyInfo.status;
        this.selectedCountry = singleCurrencyInfo.country_id;
        this.currencyId = singleCurrencyInfo.id;
      }
      else {
        toastr.error('There was an error');
      }

    },
    // ON UPDATE BUTTON CLICK IN UPDATE CURRENCY MODAL
    onClickUpdateBtn: function () {
      if(this.currencyName === '') { // EMPTY CURRENCY NAME
        this.validCurrencyName = true;
        this.invalidCurrencyDetails = false;
        this.emptyCurrencyName();
      }
      else if(this.currencySymbol === '') { // EMPTY CURRENCY SYMBOL
        this.validCurrencySymbol = true;
        this.invalidCurrencyDetails = false;
        this.emptyCurrencySymbol();
      }  
      else if(this.currencyShortCode === '') { // EMPTY CURRENCY SHORT CODE
        this.validCurrencyShortCode = true;
        this.invalidCurrencyDetails = false;
        this.emptyCurrencyShortCode();
      }
      else if(this.selectedCountry === ''){ // EMPTY COUNTRY
        this.validCountry = true;
        this.invalidCurrencyDetails = false;
        this.emptyCountrySelected();
      }
      else { 
        // API PARAMETERS
        params = {
          "name": this.currencyName,
          "symbol": this.currencySymbol,
          "short_code": this.currencyShortCode,
          "currency_id": this.currencyId,
          "country_id": this.selectedCountry,
          "status": this.currencyStatus
        }
        console.log(params);
        // UPDATE CURRENCY
        this.updateCurrency(params);
      }
    },
    updateCurrency: async function (params) {
      const updateCurrencyModalBtn = document.querySelector('.update-currency-modal-btn');
      
      // DISABLE UPDATE CURRENCY BUTTON
      updateCurrencyModalBtn.disabled = true;

      // UPDATE CURRENCY ON SERVER
      const result = await actionAPICall(baseUrl, updateCurrencyEndPoint, params);
      const res = await result.json();
      
      // UPDATE CURRENCY SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('updateCurrency');

        // ENABLE UPDATE CURRENCY BUTTON
        updateCurrencyModalBtn.disabled = false;
        
        toastr.success('Currency updated successfully');
        this.viewAllCurrencies(); // RELOAD ALL CURRENCIES VIEW

        // RESET INPUT FIELDS
        this.currencyName = '';
        this.currencySymbol = '';
        this.currencyShortCode = '';
        this.currencyId = '';
        this.countryId = '';
        this.cityStatus = statusObj.active;
      }
      else {
        // CLOSE MODAL
        closeModal('updateCity'); 

        // ENABLE UPDATE CITY BUTTON
        updateCurrencyModalBtn.disabled = false;

        // ERROR MESSAGE
        toastr.error('There was an error!');
      }
    },
    /*---------- UPDATE CITY -----------------------------*/

    /*---------- UPDATE CITY STATUS ----------------------*/
    onClickUpdateStatus: function (e) {
      
      // GET CURRENCY ID AND STATUS
      const currencyId = e.currentTarget.getAttribute('data-currency-id');
      const currentCurrencyStatus = e.currentTarget.getAttribute('data-current-status');
      // VARIABLE TO STORE NEW UPDATED STATUS
      let newStatus;

      // CURRENT STATUS IS ACTIVE
      if(currentCurrencyStatus === statusObj.active) {
        newStatus = statusObj.inactive; // MAKE THE NEW STATUS INACTIVE
      }
      // CURRENT STATIS IS INACTIVE
      else if(currentCurrencyStatus === statusObj.inactive) {
        newStatus = statusObj.active; // MAKE THE NEW STATUS ACTIVE
      }

      // UPDATE STATUS
      params = {
        "status": newStatus,
        "currency_id": currencyId
      }
      
      this.updateCurrencyStatus(params);
    },
    // UPDATE CURRENCY STATUS
    updateCurrencyStatus: async function (params) {
      // UPDATE CURRENCY STATUS ON SERVER
      const result = await actionAPICall(baseUrl, updateCurrencyStatusEndPoint, params);
      const res = await result.json();
      
      // STATUS UPDATED SUCCESSFULLY
      if(res.result === 'success') {
        toastr.success('Status updated successfully');
        this.viewAllCurrencies();
      }
      else {
        toastr.error('There was an error!');
      }
    },
    /*---------- UPDATE CURRENCY STATUS ----------------------*/

    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/
    emptyCurrencyName: function () {
      this.error = 'Currency name is empty';
    },
    emptyCurrencySymbol: function () {
      this.error = 'Symbol is empty';
    },
    emptyCurrencyShortCode: function () {
      this.error = 'Short code is empty';
    },
    emptyCountrySelected: function () {
      this.error = 'Select country';
    },
    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/

    /*----------- REMOVE HIGHLIGHTED ERRORS -----------------------*/
    keyUpCurrencyName: function () {  // KEY IS PRESSED UP ON CURRENCY NAME INPUT
      this.validCurrencyName = false;
      this.invalidCurrencyDetails = true;
    },
    keyUpCurrencySymbol: function () { // KEY IS PRESSED UP ON CURRENCY SYMBOL INPUT
      this.validCurrencySymbol = false;
      this.invalidCurrencyDetails = true;
    },
    keyUpCurrencyShortCode: function () { // KEY IS PRESSED UP ON CURRENCY SHORT CODE INPUT
      this.validCurrencyShortCode = false;
      this.invalidCurrencyDetails = true;
    },
    onFocusSelectCountry: function () { // COUNTRY SELECT DROPDOWN IS FOCUSED
      this.validCountry = false;
      this.invalidCurrencyDetails = true;
    }

    /*----------- REMOVE HIGHLIGHTED ERRORS -----------------------*/
  }
})
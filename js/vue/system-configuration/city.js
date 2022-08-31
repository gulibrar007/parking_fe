// VIEW ALL CITIES ENDPOINT
const viewAllCitiesEndPoint = "/get_all_cities";

// VIEW ACTIVE CITY ENDPOINT
const viewActiveCitiesEndPoint = "/get_active_cities";

// VIEW ALL ACTIVE COUNTRIES
const viewAllActiveCountriesEndPoint = "/get_active_countries";

// GET ALL CITIES OF COUNTRY
const getAllCitiesOfCountryEndPoint = "/get_all_cities_of_country";

// GET SINGLE CITY DETAILS
const getSingleCityDetailsEndPoint = "/get_single_city";

// ADD CITY ENDPOINT
const addCityEndPoint = "/add_city";

// UPDATE CITY ENDPOINT
const updateCityEndPoint = "/update_city";

// UPDATE CITY STATUS ENDPOINT
const updateCityStatusEndPoint = "/update_city_status";

new Vue({
  el: '#cityVueApp',
  data: {
    error: '',
    invalidCityDetails: true,

    validCityName: false,
    cityName: '',
    validCityShortCode: false,
    cityShortCode: '',
    validCountry: false,
    selectedCountry: '',
    validCityStatus: false,
    cityStatus: '',
    cityId: '',

    cityList: [],
    countryList: [],
  },
  mounted: function () { // WHEN VUE COMPONENT IS ADDED TO DOM, THIS HOOK IS CALLED
    this.viewAllCities();
    this.viewAllCountries();
  },
  methods: {
    /*---------- VIEW ALL CITIES -------------------------*/
    viewAllCities: async function () {

      // SPINNER, ADD CITY BTN AND CITY TABLE VARIABLES
      const spinner = document.querySelector('.horizontal-loader');
      const addCityBtn = document.querySelector('.add-btn');
      const table = document.querySelector('.table-data-table');

      // SHOW SPINNER AND HIDE ADD CITY BTN, TABLE
      spinner.style.display = 'block';
      addCityBtn.style.display = 'none';
      table.style.display = 'none';

      // DESTROY THE DATA TABLE
      $('#data_table_city').DataTable().destroy();

      // PARAMETERS TO VIEW ALL CITIES
      params = { }; 
      // GET ALL CITIES FROM API CALL
      const result = await actionAPICall(baseUrl, viewAllCitiesEndPoint, params);
      const res = await result.json();
      
      // IF ALL CITIES ARE RETURNED SUCCESSFULLY
      if(res.result == 1) {
        this.cityList = res.data; // STORE THE CITIES RETURNED IN ARRAY
      }

      setTimeout(function(){
        // SHOW ADD CITY BTN, TABLE AND HIDE SPINNER
        spinner.style.display = 'none';
        addCityBtn.style.display = 'block';
        table.style.display = 'block';
        
        // DRAW THE DATA TABLE
        $('#data_table_city').DataTable().draw();

        // SHOW ACTIVE INACTIVE STATUS FOR EACH TABLE ROW
        activeInactiveButtonInput();

        // SHOW SELECTED STATUS IN UPDATE MODAL
        activeInactiveModalSelectOptions();

      }, 500);

    },
    /*---------- VIEW ALL CITIES -------------------------*/

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

    /*---------- ADD CITY --------------------------------*/
    // ON ADD BUTTON CLICK IN ADD CITY MODAL
    onClickAddBtn: function () {
      if(this.cityName === '') { // EMPTY CITY NAME
        this.validCityName = true;
        this.invalidCityDetails = false;
        this.emptyCityName();
      }  
      else if(this.cityShortCode === '') { // EMPTY CITY SHORT CODE
        this.validCityShortCode = true;
        this.invalidCityDetails = false;
        this.emptyCityShortCode();
      }
      else if(this.selectedCountry === ''){ // EMPTY COUNTRY
        this.validCountry = true;
        this.invalidCityDetails = false;
        this.emptyCountrySelected();
      }
      else { 
        // API PARAMETERS
        params = {
          "name": this.cityName,
          "short_code": this.cityShortCode,
          "country_id": this.selectedCountry
        }
        
        // ADD CITY
        this.addCity(params);
      }
    },
    // ADD CITY
    addCity: async function (params) {
      const addCityModalBtn = document.querySelector('.add-city-modal-btn');
      
      // DISABLE ADD CITY BUTTON
      addCityModalBtn.disabled = true;

      // ADD CITY ON SERVER
      const result = await actionAPICall(baseUrl, addCityEndPoint, params);
      const res = await result.json();

      // CITY ADDED SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('addCity');

        // ENABLE ADD CITY BUTTON
        addCityModalBtn.disabled = false;
        
        toastr.success('City added successfully');
        this.viewAllCities(); // RELOAD ALL CITIES VIEW

        // RESET INPUT FIELDS
        this.cityName = '';
        this.cityShortCode = '';
      }
      else {
        // CLOSE MODAL
        closeModal('addCity');

        // ENABLE ADD CITY BUTTON
        addCityModalBtn.disabled = false;

        // ERROR MESSAGE
        toastr.error('There was an error!');
      }
    },
    /*---------- ADD CITY --------------------------------*/

    /*---------- UPDATE CITY -----------------------------*/
    // GET CURRENT VALUES OF CITY
    onClickOpenUpdateCityModal: async function (e) {
      // GET CITY ID OF CLICKED ITEM
      this.cityId = e.currentTarget.getAttribute('data-city-id');
      
      // API PARAMETERS
      params = {
        "city_id": this.cityId
      };

      // VIEW SINGLE CITY INFORMATION
      const result = await actionAPICall(baseUrl, getSingleCityDetailsEndPoint, params);
      const res = await result.json();

      // SINGLE CITY DATA RETURNED SUCCESSFULLY 
      if(res.result === 1) {
        // STORE SINGLE CITY INFORMATION IN VARIABLE 
        const singleCityInfo = res.data[0];
        // ASSIGN CITY INFORMATION TO RESPECTIVE INPUT FIELD
        this.cityName = singleCityInfo.name;
        this.cityShortCode = singleCityInfo.short_code;
        this.cityStatus = singleCityInfo.status;
        this.selectedCountry = singleCityInfo.country_id;
      }
      else {
        toastr.error('There was an error');
      }

    },
    // ON UPDATE BUTTON CLICK IN UPDATE CITY MODAL
    onClickUpdateBtn: function () {
      if(this.cityName === '') { // EMPTY CITY NAME
        this.validCityName = true;
        this.invalidCityDetails = false;
        this.emptyCityName();
      }  
      else if(this.cityShortCode === '') { // EMPTY CITY SHORT CODE
        this.validCityShortCode = true;
        this.invalidCityDetails = false;
        this.emptyCityShortCode();
      }
      else if(this.selectedCountry === '') { // EMPTY COUNTRY SELECTED
        this.validCountry = true;
        this.invalidCityDetails = false;
        this.emptyCountrySelected();
      }
      else { 
        // API PARAMETERS
        params = {
          "name": this.cityName,
          "short_code": this.cityShortCode,
          "city_id": this.cityId,
          "country_id": this.selectedCountry,
          "status": this.cityStatus 
        }

        // UPDATE CITY
        this.updateCity(params);
      }
    },
    updateCity: async function (params) {
      const updateCityModalBtn = document.querySelector('.update-city-modal-btn');
      
      // DISABLE UPDATE CITY BUTTON
      updateCityModalBtn.disabled = true;

      // UPDATE CITY ON SERVER
      const result = await actionAPICall(baseUrl, updateCityEndPoint, params);
      const res = await result.json();
      
      // UPDATE CITY SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('updateCity');

        // ENABLE UPDATE CITY BUTTON
        updateCityModalBtn.disabled = false;
        
        toastr.success('City updated successfully');
        this.viewAllCities(); // RELOAD ALL CITIES VIEW

        // RESET INPUT FIELDS
        this.cityName = '';
        this.cityShortCode = '';
        this.cityId = '';
        this.cityStatus = statusObj.active;
      }
      else {
        // CLOSE MODAL
        closeModal('updateCity'); 

        // ENABLE UPDATE CITY BUTTON
        updateCityModalBtn.disabled = false;

        // ERROR MESSAGE
        toastr.error('There was an error!');
      }
    },
    /*---------- UPDATE CITY -----------------------------*/

    /*---------- UPDATE CITY STATUS ----------------------*/
    onClickUpdateStatus: function (e) {
      
      // GET CITY ID AND STATUS
      const cityId = e.currentTarget.getAttribute('data-city-id');
      const currentCityStatus = e.currentTarget.getAttribute('data-current-status');
      // VARIABLE TO STORE NEW UPDATED STATUS
      let newStatus;

      // CURRENT STATUS IS ACTIVE
      if(currentCityStatus === statusObj.active) {
        newStatus = statusObj.inactive; // MAKE THE NEW STATUS INACTIVE
      }
      // CURRENT STATIS IS INACTIVE
      else if(currentCityStatus === statusObj.inactive) {
        newStatus = statusObj.active; // MAKE THE NEW STATUS ACTIVE
      }

      // UPDATE STATUS
      params = {
        "status": newStatus,
        "city_id": cityId
      }
      
      this.updateCityStatus(params);
    },
    // UPDATE CITY STATUS
    updateCityStatus: async function (params) {
      // UPDATE CITY STATUS ON SERVER
      const result = await actionAPICall(baseUrl, updateCityStatusEndPoint, params);
      const res = await result.json();
      
      // STATUS UPDATED SUCCESSFULLY
      if(res.result === 'success') {
        toastr.success('Status updated successfully');
        this.viewAllCities();
      }
      else {
        toastr.error('There was an error!');
      }
    },
    /*---------- UPDATE CITY STATUS ----------------------*/

    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/
    emptyCityName: function () {
      this.error = 'City name is empty';
    },
    emptyCityShortCode: function () {
      this.error = 'Short code is empty';
    },
    emptyCountrySelected: function () {
      this.error = 'Select country';
    },
    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/

    /*----------- HIGHLIGHT ERRORS -----------------------*/
    keyUpCityName: function () {  // KEY IS PRESSED UP ON CITY NAME INPUT
      this.validCityName = false;
      this.invalidCityDetails = true;
    },
    keyUpCityShortCode: function () { // KEY IS PRESSED UP ON CITY SHORT CODE INPUT
      this.validCityShortCode = false;
      this.invalidCityDetails = true;
    },
    onFocusSelectCountry: function () { // COUNTRY SELECT DROPDOWN IS FOCUSED
      this.validCountry = false;
      this.invalidCityDetails = true;
    }

    /*----------- HIGHLIGHT ERRORS -----------------------*/
  }
})
// VIEW ALL CITIES ENDPOINT
const viewAllCitiesEndPoint = "/get_all_cities";

// VIEW ACTIVE CITY ENDPOINT
const viewActiveCities = "/get_active_cities";

// VIEW ALL COUNTRIES
const viewAllCountries = "/get_all_country";

// GET ALL CITIES OF COUNTRY
const getAllCitiesOfCountry = "/get_all_cities_of_country";

// ADD CITY ENDPOINT
const addCityEndPoint = "/add_city";

// UPDATE CITY ENDPOINT
const updateCityEndPoint = "/update_city";

// UPDATE CITY STATUS ENDPOINT
const updateCityStatusEndPoint = "/update_city_status";

new Vue({
  el: '#city',
  data: {
    error: '',
    invalidCityDetails: true,
    dismissModal: '',

    validCityName: false,
    cityName: '',
    validCityShortCode: false,
    cityShortCode: '',
    validCountry: false,
    cityStatus: '',
    cityId: '',

    cityList: [],
    countryList: [],
  },
  mounted: function () {
    this.viewAllCities();
    this.viewAllCountries();
  },
  methods: {
    /*---------- VIEW ALL CITIES -------------------------*/
    viewAllCities: async function () {

      // SPINNER AND CITY TABLE VARIABLES
      const spinner = document.querySelector('.horizontal-loader');
      const table = document.querySelector('.table-data-table');

      // SHOW SPINNER AND HIDE TABLE
      spinner.style.display = 'block';
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
        // SHOW TABLE AND HIDE SPINNER
        spinner.style.display = 'none';
        table.style.display = 'block';
        
        // DRAW THE DATA TABLE
        $('#data_table_city').DataTable().draw();

        // SHOW ACTIVE INACTIVE STATUS FOR EACH TABLE ROW
        activeInactiveButtonInput();

      }, 500);
      

    },
    /*---------- VIEW ALL CITIES -------------------------*/

    /*---------- VIEW ALL COUNTRIES ----------------------*/
    viewAllCountries: async function () {
      // PARAMETERS TO VIEW ALL CITIES
      params = { }; 
      // GET ALL COUNTRIES FROM API CALL
      const result = await actionAPICall(baseUrl, viewAllCountries, params);
      const res = await result.json();
      
      // IF ALL COUNTRIES ARE RETURNED SUCCESSFULLY
      if(res.result == 1) {
        this.countryList = res.data; // STORE THE COUNTRIES RETURNED IN ARRAY
      }
    },
    /*---------- VIEW ALL COUNTRIES ----------------------*/

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
      else { // ADD CITY
        params = {
          "name": this.cityName,
          "short_code": this.cityShortCode
        }

        this.addCity(params);
      }
    },
    // ADD CITY
    addCity: async function (params) {
      // ADD CITY ON SERVER
      const result = await actionAPICall(baseUrl, addCityEndPoint, params);
      const res = await result.json();

      // CITY ADDED SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('addCity');
        
        toastr.success('City added successfully');
        this.viewAllCities(); // RELOAD ALL CITIES VIEW

        // RESET INPUT FIELDS
        this.cityName = '';
        this.cityShortCode = '';
      }
      else {
        // CLOSE MODAL
        closeModal('addCity');
        // ERROR MESSAGE
        toastr.error('There was an error!');
      }
    },
    /*---------- ADD CITY --------------------------------*/

    /*---------- UPDATE CITY -----------------------------*/
    // GET CURRENT VALUES OF CITY
    onClickOpenUpdateCityModal: function (e) {

      this.cityId = e.currentTarget.getAttribute('data-city-id');
      const cityName = e.currentTarget.getAttribute('data-city-name');
      const cityShortCode = e.currentTarget.getAttribute('data-city-short-code');
      const cityStatus = e.currentTarget.getAttribute('data-current-city-status');

      this.cityName = cityName;
      this.cityShortCode = cityShortCode;
      this.cityStatus = cityStatus;

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
      else { // UPDATE CITY
        params = {
          "name": this.cityName,
          "city_id": this.cityId,
          "short_code": this.cityShortCode,
          "status": this.cityStatus
        }

        this.updateCity(params);
      }
    },
    updateCity: async function (params) {
      const result = await actionAPICall(baseUrl, updateCityEndPoint, params);
      const res = await result.json();
      
      // UPDATE CITY SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('updateCity');
        
        toastr.success('City updated successfully');
        this.viewAllCountries(); // RELOAD ALL COUNTRIES VIEW

        // RESET INPUT FIELDS
        this.cityName = '';
        this.cityShortCode = '';
        this.cityId = '';
        this.cityStatus = statusObj.active;
      }
      else {
        // CLOSE MODAL
        closeModal('updateCity'); 
        // ERROR MESSAGE
        toastr.error('There was an error!');
      }
    },
    /*---------- UPDATE CITY -----------------------------*/

    /*---------- UPDATE CITY STATUS ----------------------*/
    onClickUpdateStatus: function (e) {
      
      // GET CITY ID AND STATUS
      const cityId = e.currentTarget.getAttribute('data-city-id');
      const currentCityStatus = e.currentTarget.getAttribute('data-current-city-status');
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
        this.viewAllCountries();
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
    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/

    /*----------- HIGHLIGHT ERRORS -----------------------*/
    keyUpCityName: function () {  // KEY IS PRESSED UP ON CITY NAME INPUT
      this.validCityName = false;
      this.invalidCityDetails = true;
    },
    keyUpCityShortCode: function () { // KEY IS PRESSED UP ON CITY SHORT CODE INPUT
      this.validCityShortCode = false;
      this.invalidCityDetails = true;
    }
    /*----------- HIGHLIGHT ERRORS -----------------------*/
  }
})
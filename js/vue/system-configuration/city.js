// VIEW ALL CITIES ENDPOINT
const viewAllCitiesEndPoint = "/get_all_cities";

// VIEW ACTIVE CITY ENDPOINT
const viewActiveCities = "/get_active_cities";

// VIEW ALL ACTIVE COUNTRIES
const viewAllActiveCountries = "/get_active_countries";

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

    /*---------- VIEW ALL ACTIVE COUNTRIES ----------------------*/
    viewAllCountries: async function () {
      // PARAMETERS TO VIEW ALL ACTIVE COUNTRIES
      params = { }; 
      // GET ALL ACTIVE COUNTRIES FROM API CALL
      const result = await actionAPICall(baseUrl, viewAllActiveCountries, params);
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
      else if(this.selectedCountry === ''){
        this.validCountry = true;
        this.invalidCityDetails = false;
        this.emptyCountrySelected();
      }
      else { // ADD CITY
        params = {
          "name": this.cityName,
          "short_code": this.cityShortCode,
          "country_id": this.selectedCountry
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
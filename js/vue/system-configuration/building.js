// VIEW ALL BUILDINGS ENDPOINT
const viewAllBuildingsEndPoint = "/get_all_buildings";

// VIEW ACTIVE BUILDINGS ENDPOINT
const viewActiveBuildings = "/get_active_buildings";

// VIEW SINGLE BUILDING
//const viewSingleBuildingEndPoint= "/get_single_building";

// ADD BUILDING ENDPOINT
const addBuildingEndPoint = "/add_building";

// UPDATE BUILDING ENDPOINT
const updateBuildingEndPoint = "/update_building";

// UPDATE building STATUS ENDPOINT
const updateBuildingStatusEndPoint = "/update_building_status";

new Vue({
  el: '#buildingVueApp',
  data: {
    error: '',
    invalidBuildingDetails: true,

    validBuildingName: false,
    buildingName: '',
    validBuildingShortCode: false,
    buildingShortCode: '',
    buildingStatus: '',
    buildingId: '',

    buildingList: [],
  },
  mounted: function () { // WHEN VUE COMPONENT IS ADDED TO DOM, THIS HOOK IS CALLED
    this.viewAllBuildings();
  },
  methods: {
    /*---------- VIEW ALL BUILDINGS -------------------------*/
    viewAllBuildings: async function () {

      // SPINNER AND ADD BUILDING BTN, TABLE VARIABLES
      const spinner = document.querySelector('.horizontal-loader');
      const addBuildingBtn = document.querySelector('.add-btn');
      const table = document.querySelector('.table-data-table');

      // SHOW SPINNER AND HIDE ADD BUILDING BTN, TABLE
      spinner.style.display = 'block';
      addBuildingBtn.style.display = 'none';
      table.style.display = 'none';

      // DESTROY THE DATA TABLE
      $('#data_table_building').DataTable().destroy();

      // PARAMETERS TO VIEW ALL BUILDINGS
      let params = { }; 
      // GET ALL BUILDINGS FROM API CALL
      const result = await actionAPICall(baseUrl, viewAllBuildingsEndPoint, params);
      const res = await result.json();
      
      // IF ALL BUILDINGS ARE RETURNED SUCCESSFULLY
      if(res.result == 1) {
        this.buildingList = res.data; // STORE THE BUILDINGS RETURNED IN ARRAY
      }

      setTimeout(function(){
        // SHOW ADD BUILDINGS BTN, TABLE AND HIDE SPINNER
        spinner.style.display = 'none';
        addBuildingBtn.style.display = 'block';
        table.style.display = 'block';
        
        // DRAW THE DATA TABLE
        $('#data_table_building').DataTable().draw();

        // SHOW ACTIVE INACTIVE STATUS FOR EACH TABLE ROW
        activeInactiveButtonInput();

        // SHOW SELECTED STATUS IN UPDATE MODAL
        activeInactiveModalSelectOptions();

      }, 500);

    },
    /*---------- VIEW ALL BUILDINGS -------------------------*/

    /*---------- ADD BUILDING --------------------------------*/
    // ON ADD BUTTON CLICK IN ADD BUILDING MODAL
    onClickAddBtn: function () {
      if(this.buildingName === '') { // EMPTY BUILDING NAME
        this.validBuildingName = true;
        this.invalidBuildingDetails = false;
        this.emptyBuildingName();
      }
      else { 
        // API PARAMETERS
        params = {
          "name": this.buildingName
        }

        // ADD BUILDING
        this.addBuilding(params);
      }
    },
    // ADD BUILDING
    addBuilding: async function (params) {
      const addBuildingModalBtn = document.querySelector('.add-building-modal-btn');
      
      // DISABLE ADD BUILDING BUTTON
      addBuildingModalBtn.disabled = true;

      // ADD BUILDING ON SERVER
      const result = await actionAPICall(baseUrl, addBuildingEndPoint, params);
      const res = await result.json();

      // BUILDING ADDED SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('addBuilding');

        // ENABLE ADD BUILDING BUTTON
        addBuildingModalBtn.disabled = false;
        
        toastr.success('Building added successfully');
        this.viewAllBuildings(); // RELOAD ALL BUILDINGS VIEW

        // RESET INPUT FIELDS
        this.buildingName = '';
      }
      else {
        // CLOSE MODAL
        closeModal('addBuilding');

        // ENABLE ADD BUILDING BUTTON
        addBuildingModalBtn.disabled = false;

        // ERROR MESSAGE
        toastr.error('There was an error!');
      }
    },
    /*---------- ADD BUILDINGS --------------------------------*/

    /*---------- UPDATE BUILDING -----------------------------*/
    // GET CURRENT VALUES OF building
    onClickOpenUpdatebuildingModal: async function (e) {
      // GET building ID OF CLICKED ITEM
      //this.buildingId = e.currentTarget.getAttribute('data-building-id');
      

      // API PARAMETERS
      //params = {
      //  "building_id": this.buildingId
      //};

      // VIEW SINGLE building INFORMATION
      //const result = await actionAPICall(baseUrl, viewSinglebuildingEndPoint, params);
      //const res = await result.json();

      // SINGLE building DATA RETURNED SUCCESSFULLY 
      //if(res.result === 1) {
        // STORE SINGLE building INFORMATION IN VARIABLE 
        //const singlebuildingInfo = res.data[0];
        // ASSIGN building INFORMATION TO RESPECTIVE INPUT FIELD
        //this.buildingName = singlebuildingInfo.name;
        //this.buildingShortCode = singlebuildingInfo.short_code;
        //this.buildingStatus = singlebuildingInfo.status;
      //}
      //else {
        //toastr.error('There was an error');
      //}

      // GET CURRENT BUILDING VALUES
      this.buildingId = e.currentTarget.getAttribute('data-building-id');
      this.buildingName = e.currentTarget.getAttribute('data-name');
      this.buildingStatus = e.currentTarget.getAttribute('data-status');
    },
    // ON UPDATE BUTTON CLICK IN UPDATE BUILDING MODAL
    onClickUpdateBtn: function () {
      if(this.buildingName === '') { // EMPTY BUILDING NAME
        this.validBuildingName = true;
        this.invalidBuildingDetails = false;
        this.emptyBuildingName();
      }
      else {
        // API PARAMETERS 
        params = {
          "name": this.buildingName,
          "building_id": this.buildingId,
          "status": this.buildingStatus,
        };

        // UPDATE BUILDING
        this.updateBuilding(params);
      }
    },
    updateBuilding: async function (params) {
      const updateBuildingModalBtn = document.querySelector('.update-building-modal-btn');
      
      // DISABLE UPDATE BUILDING BUTTON
      updateBuildingModalBtn.disabled = true;

      // UPDATE BUILDING ON SERVER
      const result = await actionAPICall(baseUrl, updateBuildingEndPoint, params);
      const res = await result.json();
      
      // UPDATE BUILDING SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('updateBuilding');

        // ENABLE UPDATE BUILDING BUTTON
        updateBuildingModalBtn.disabled = false;
        
        toastr.success('Building updated successfully');
        this.viewAllBuildings(); // RELOAD ALL BUILDINGS VIEW

        // RESET INPUT FIELDS
        this.buildingName = '';
        this.buildingStatus = statusObj.active;
      }
      else {
        // CLOSE MODAL
        closeModal('updateBuilding'); 

        // ENABLE UPDATE BUILDING BUTTON
        updateBuildingModalBtn.disabled = false;

        // ERROR MESSAGE
        toastr.error('There was an error!');
      }
    },
    /*---------- UPDATE BUILDING -----------------------------*/

    /*---------- UPDATE BUILDING STATUS ----------------------*/
    onClickUpdateStatus: function (e) {
      
      // GET BUILDING ID AND STATUS
      const buildingId = e.currentTarget.getAttribute('data-building-id');
      const currentBuildingStatus = e.currentTarget.getAttribute('data-current-status');
      // VARIABLE TO STORE NEW UPDATED STATUS
      let newStatus;

      // CURRENT STATUS IS ACTIVE
      if(currentBuildingStatus === statusObj.active) {
        newStatus = statusObj.inactive; // MAKE THE NEW STATUS INACTIVE
      }
      // CURRENT STATIS IS INACTIVE
      else if(currentBuildingStatus === statusObj.inactive) {
        newStatus = statusObj.active; // MAKE THE NEW STATUS ACTIVE
      }

      // API PARAMETERS
      params = {
        "status": newStatus,
        "building_id": buildingId
      };

      // UPDATE STATUS
      this.updateBuildingStatus(params);
    },
    // UPDATE BUILDING STATUS
    updateBuildingStatus: async function (params) {
      // UPDATE BUILDING STATUS ON SERVER
      const result = await actionAPICall(baseUrl, updateBuildingStatusEndPoint, params);
      const res = await result.json();
      
      // STATUS UPDATED SUCCESSFULLY
      if(res.result === 'success') {
        toastr.success('Status updated successfully');
        this.viewAllBuildings();
      }
      else {
        toastr.error('There was an error!');
      }
    },
    /*---------- UPDATE BUILDING STATUS ----------------------*/

    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/
    emptyBuildingName: function () {
      this.error = 'Building name is empty';
    },
    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/

    /*----------- HIGHLIGHT ERRORS -----------------------*/
    keyUpBuildingName: function () {  // KEY IS PRESSED UP ON BUILDING NAME INPUT
      this.validBuildingName = false;
      this.invalidBuildingDetails = true;
    }
    /*----------- HIGHLIGHT ERRORS -----------------------*/
  }
})
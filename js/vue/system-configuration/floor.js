// VIEW ALL FLOORS ENDPOINT
const viewAllFloorsEndPoint = "/get_all_floors";

// VIEW ACTIVE FLOORS ENDPOINT
const viewActiveFloorsEndPoint = "/get_active_floors";

// VIEW ALL ACTIVE BUILDINGS
const viewAllActiveBuildingsEndPoint = "/get_active_buildings";

// VIEW SINGLE FLOOR
const viewSingleFloorEndPoint= "/get_single_floor";

// ADD FLOOR ENDPOINT
const addFloorEndPoint = "/add_floors";

// UPDATE FLOOR ENDPOINT
const updateFloorEndPoint = "/update_floor";

// UPDATE FLOOR STATUS ENDPOINT
const updateFloorStatusEndPoint = "/update_floor_status";

new Vue({
  el: '#floorVueApp',
  data: {
    error: '',
    invalidFloorDetails: true,

    validFloorNumber: false,
    floorNumber: '',
    validBuilding: false,
    selectedBuilding: '',
    validFloorStatus: false,
    floorStatus: '',
    floorId: '',

    floorList: [],
    buildingList: [],
  },
  mounted: function () { // WHEN VUE COMPONENT IS ADDED TO DOM, THIS HOOK IS CALLED
    this.viewAllFloors();
    this.viewAllActiveBuildings();
  },
  methods: {
    /*---------- VIEW ALL FLOORS -------------------------*/
    viewAllFloors: async function () {

      // SPINNER AND ADD FLOOR BTN, TABLE VARIABLES
      const spinner = document.querySelector('.horizontal-loader');
      const addFloorBtn = document.querySelector('.add-btn');
      const table = document.querySelector('.table-data-table');

      // SHOW SPINNER AND HIDE ADD FLOOR BTN, TABLE
      spinner.style.display = 'block';
      addFloorBtn.style.display = 'none';
      table.style.display = 'none';

      // DESTROY THE DATA TABLE
      $('#data_table_floor').DataTable().destroy();

      // PARAMETERS TO VIEW ALL FLOORS
      let params = { }; 
      // GET ALL FLOORS FROM API CALL
      const result = await actionAPICall(baseUrl, viewAllFloorsEndPoint, params);
      const res = await result.json();
      
      // IF ALL FLOORS ARE RETURNED SUCCESSFULLY
      if(res.result == 1) {
        this.floorList = res.data; // STORE THE FLOORS RETURNED IN ARRAY
      }

      setTimeout(function(){
        // SHOW ADD FLOORS BTN, TABLE AND HIDE SPINNER
        spinner.style.display = 'none';
        addFloorBtn.style.display = 'block';
        table.style.display = 'block';
        
        // DRAW THE DATA TABLE
        $('#data_table_floor').DataTable().draw();

        // SHOW ACTIVE INACTIVE STATUS FOR EACH TABLE ROW
        activeInactiveButtonInput();

        // SHOW SELECTED STATUS IN UPDATE MODAL
        activeInactiveModalSelectOptions();

      }, 500);
      

    },
    /*---------- VIEW ALL FLOORS -------------------------*/

    /*---------- VIEW ALL ACTIVE BUILDINGS -------------------------*/
    viewAllActiveBuildings: async function () {
      // PARAMETERS TO VIEW ALL ACTIVE BUILDINGS
      let params = { }; 
      // GET ALL ACTIVE BUILDINGS FROM API CALL
      const result = await actionAPICall(baseUrl, viewAllActiveBuildingsEndPoint, params);
      const res = await result.json();
      
      // IF ALL ACTIVE BUILDINGS ARE RETURNED SUCCESSFULLY
      if(res.result == 1) {
        this.buildingList = res.data; // STORE THE ACTIVE BUILDINGS RETURNED IN ARRAY
      }
    },
    /*---------- VIEW ALL ACTIVE BUILDINGS -------------------------*/

    /*---------- ADD FLOOR --------------------------------*/
    // ON ADD BUTTON CLICK IN ADD FLOOR MODAL
    onClickAddBtn: function () {
      if(this.floorNumber === '') { // EMPTY FLOOR NAME
        this.validFloorNumber = true;
        this.invalidFloorDetails = false;
        this.emptyFloorNumber();
      }
      else if(this.selectedBuilding === '') { // EMPTY BUILDING SELECTED
        this.validBuilding = true;
        this.invalidFloorDetails = false;
        this.emptyBuildingSelected();
      }
      else { 
        // API PARAMETERS
        params = {
          "floor_number": this.floorNumber,
          "building_id": this.selectedBuilding
        };

        // ADD FLOOR
        this.addFloor(params);
      }
    },
    // ADD FLOOR
    addFloor: async function (params) {
      const addFloorModalBtn = document.querySelector('.add-floor-modal-btn');
      
      // DISABLE ADD FLOOR BUTTON
      addFloorModalBtn.disabled = true;

      // ADD FLOOR ON SERVER
      const result = await actionAPICall(baseUrl, addFloorEndPoint, params);
      const res = await result.json();

      // FLOOR ADDED SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('addFloor');

        // ENABLE ADD FLOOR BUTTON
        addFloorModalBtn.disabled = false;

        toastr.success('Floor added successfully');
        this.viewAllFloors(); // RELOAD ALL FLOORS VIEW

        // RESET INPUT FIELDS
        this.floorNumber = '';
        this.selectedBuilding = '';
      }
      else {
        // CLOSE MODAL
        closeModal('addFloor');

        // ENABLE ADD FLOOR BUTTON
        addFloorModalBtn.disabled = false;
        
        // ERROR MESSAGE
        toastr.error('There was an error!');
      }
    },
    /*---------- ADD BUILDINGS --------------------------------*/

    /*---------- UPDATE FLOOR -----------------------------*/
    // GET CURRENT VALUES OF FLOOR
    onClickOpenUpdateFloorModal: async function (e) {
      // GET FLOOR ID OF CLICKED ITEM
      this.floorId = e.currentTarget.getAttribute('data-floor-id');

      // API PARAMETERS
      params = {
        "floor_id": this.floorId
      };

      // VIEW SINGLE FLOOR INFORMATION
      const result = await actionAPICall(baseUrl, viewSingleFloorEndPoint, params);
      const res = await result.json();

      // SINGLE FLOOR DATA RETURNED SUCCESSFULLY 
      if(res.result === 1) {
        // STORE SINGLE FLOOR INFORMATION IN VARIABLE 
        const singleFloorInfo = res.data[0];
        // ASSIGN FLOOR INFORMATION TO RESPECTIVE INPUT FIELD
        
        this.floorNumber = singleFloorInfo.floor_number;
        this.floorId = singleFloorInfo.id;
        this.floorStatus = singleFloorInfo.status;
        this.selectedBuilding = singleFloorInfo.building_id;
      }
      else {
        toastr.error('There was an error');
      }

    },
    // ON UPDATE BUTTON CLICK IN UPDATE FLOOR MODAL
    onClickUpdateBtn: function () {
      if(this.floorNumber === '') { // EMPTY FLOOR NAME
        this.validFloorNumber = true;
        this.invalidFloorDetails = false;
        this.emptyFloorNumber();
      }
      else if(this.selectedBuilding === '') { // EMPTY BUILDING SELECTED
        this.validBuilding = true;
        this.invalidFloorDetails = false;
        this.emptyBuildingSelected();
      }
      else {
        // API PARAMETERS 
        params = {
          "floor_number": this.floorNumber,
          "floor_id": this.floorId,
          "building_id": this.selectedBuilding,
          "status": this.floorStatus
        };

        // UPDATE FLOOR
        this.updateFloor(params);
      }
    },
    updateFloor: async function (params) {
      const updateFloorModalBtn = document.querySelector('.update-floor-modal-btn');
      
      // DISABLE UPDATE FLOOR BUTTON
      updateFloorModalBtn.disabled = true;

      // UPDATE FLOOR ON SERVER
      const result = await actionAPICall(baseUrl, updateFloorEndPoint, params);
      const res = await result.json();
      
      // UPDATE FLOOR SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('updateFloor');

        // ENABLE UPDATE FLOOR BUTTON
        updateFloorModalBtn.disabled = false;
        
        toastr.success('Floor updated successfully');
        this.viewAllFloors(); // RELOAD ALL FLOORS VIEW

        // RESET INPUT FIELDS
        this.floorNumber = '';
        this.floorId = '';
        this.selectedBuilding = '';
        this.buildingStatus = statusObj.active;
      }
      else {
        // CLOSE MODAL
        closeModal('updateFloor'); 

        // ENABLE UPDATE FLOOR BUTTON
        updateFloorModalBtn.disabled = false;

        // ERROR MESSAGE
        toastr.error('There was an error!');
      }
    },
    /*---------- UPDATE FLOOR -----------------------------*/

    /*---------- UPDATE FLOOR STATUS ----------------------*/
    onClickUpdateStatus: function (e) {
      
      // GET FLOOR ID AND STATUS
      const floorId = e.currentTarget.getAttribute('data-floor-id');
      const currentFloorStatus = e.currentTarget.getAttribute('data-current-status');
      // VARIABLE TO STORE NEW UPDATED STATUS
      let newStatus;

      // CURRENT STATUS IS ACTIVE
      if(currentFloorStatus === statusObj.active) {
        newStatus = statusObj.inactive; // MAKE THE NEW STATUS INACTIVE
      }
      // CURRENT STATIS IS INACTIVE
      else if(currentFloorStatus === statusObj.inactive) {
        newStatus = statusObj.active; // MAKE THE NEW STATUS ACTIVE
      }

      // API PARAMETERS
      params = {
        "status": newStatus,
        "floor_id": floorId
      };

      // UPDATE STATUS
      this.updateFloorStatus(params);
    },
    // UPDATE FLOOR STATUS
    updateFloorStatus: async function (params) {
      // UPDATE FLOOR STATUS ON SERVER
      const result = await actionAPICall(baseUrl, updateFloorStatusEndPoint, params);
      const res = await result.json();
      
      // STATUS UPDATED SUCCESSFULLY
      if(res.result === 'success') {
        toastr.success('Status updated successfully');
        this.viewAllFloors(); // RELOAD ALL FLOORS VIEW
      }
      else {
        toastr.error('There was an error!');
      }
    },
    /*---------- UPDATE FLOOR STATUS ----------------------*/

    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/
    emptyFloorNumber: function () {
      this.error = 'Floor number is empty';
    },
    emptyBuildingSelected: function () {
      this.error = 'Select building';
    },
    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/

    /*----------- REMOVE HIGHLIGHTED ERRORS -----------------------*/
    keyUpFloorNumber: function () {  // KEY IS PRESSED UP ON FLOOR NUMBER INPUT
      this.validFloorNumber = false;
      this.invalidFloorDetails = true;
    },
    onFocusSelectBuilding: function () { // BUILDING SELECT DROPDOWN IS FOCUSED
      this.validBuilding = false;
      this.invalidFloorDetails = true;
    }
    /*----------- REMOVE HIGHLIGHT ERRORS -----------------------*/
  }
})
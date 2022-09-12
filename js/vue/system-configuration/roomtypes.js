// VIEW ALL ROOM TYPES ENDPOINT
const viewAllRoomTypesEndPoint = "/get_all_room_types";

// VIEW ACTIVE ROOM TYPE ENDPOINT
const viewActiveRoomTypesEndPoint = "/get_active_room_types";

// VIEW SINGLE ROOM TYPES
const viewSingleRoomTypeEndPoint= "/get_single_room_type";

// ADD ROOM TYPE ENDPOINT
const addRoomTypeEndPoint = "/add_room_type";

// UPDATE ROOM TYPE ENDPOINT
const updateRoomTypeEndPoint = "/update_room_types";

// UPDATE ROOM TYPE STATUS ENDPOINT
const updateRoomTypeStatusEndPoint = "/update_roomtype_status";

new Vue({
  el: '#roomTypeVueApp',
  data: {
    error: '',
    invalidRoomTypeDetails: true,

    validRoomType: false,
    roomTypeName: '',
    validRoomTypeStatus: false,
    roomTypeStatus: '',
    roomTypeId: '',

    roomTypeList: [],
  },
  mounted: function () { // WHEN VUE COMPONENT IS ADDED TO DOM, THIS HOOK IS CALLED
    this.viewAllRoomTypes();
  },
  methods: {
    /*---------- VIEW ALL ROOM TYPES -------------------------*/
    viewAllRoomTypes: async function () {

      // SPINNER AND ADD ROOM TYPES BTN, TABLE VARIABLES
      const spinner = document.querySelector('.horizontal-loader');
      const addRoomTypesBtn = document.querySelector('.add-btn');
      const table = document.querySelector('.table-data-table');

      // SHOW SPINNER AND HIDE ADD ROOM TYPES BTN, TABLE
      spinner.style.display = 'block';
      addRoomTypesBtn.style.display = 'none';
      table.style.display = 'none';

      // DESTROY THE DATA TABLE
      $('#data_table_room_types').DataTable().destroy();

      // PARAMETERS TO VIEW ALL ROOM TYPES
      let params = { }; 
      // GET ALL ROOM TYPES FROM API CALL
      const result = await actionAPICall(baseUrl, viewAllRoomTypesEndPoint, params);
      const res = await result.json();
      
      // IF ALL ROOM TYPES ARE RETURNED SUCCESSFULLY
      if(res.result == 1) {
        this.roomTypeList = res.data; // STORE THE ROOM TYPES RETURNED IN ARRAY
      }
      
      setTimeout(function(){
        // SHOW ADD ROOM TYPES BTN, TABLE AND HIDE SPINNER
        spinner.style.display = 'none';
        addRoomTypesBtn.style.display = 'block';
        table.style.display = 'block';
        
        // DRAW THE DATA TABLE
        $('#data_table_room_types').DataTable().draw();

        // SHOW ACTIVE INACTIVE STATUS FOR EACH TABLE ROW
        activeInactiveButtonInput();

        // SHOW SELECTED STATUS IN UPDATE MODAL
        activeInactiveModalSelectOptions();

      }, 500);

    },
    /*---------- VIEW ALL ROOM TYPES -------------------------*/

    /*---------- ADD ROOM TYPE --------------------------------*/
    // ON ADD BUTTON CLICK IN ADD ROOM TYPE MODAL
    onClickAddBtn: function () {
      if(this.roomTypeName === '') { // EMPTY ROOM TYPE NAME
        this.validRoomType = true;
        this.invalidRoomTypeDetails = false;
        this.emptyRoomType();
      }
      else { 
        // API PARAMETERS
        params = {
          "name": this.roomTypeName
        };

        // ADD ROOM TYPE
        this.addRoomType(params);
      }
    },
    // ADD ROOM TYPE
    addRoomType: async function (params) {
      const addRoomTypeModalBtn = document.querySelector('.add-room-type-modal-btn');
      
      // DISABLE ADD ROOM TYPE BUTTON
      addRoomTypeModalBtn.disabled = true;

      // ADD ROOM TYPE ON SERVER
      const result = await actionAPICall(baseUrl, addRoomTypeEndPoint, params);
      const res = await result.json();

      // ROOM TYPE ADDED SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('addRoomType');

        // ENABLE ADD ROOM TYPE BUTTON
        addRoomTypeModalBtn.disabled = false;

        toastr.success('Room type added successfully');
        this.viewAllRoomTypes(); // RELOAD ALL ROOM TYPES VIEW

        // RESET INPUT FIELDS
        this.roomTypeName = '';
      }
      else {
        // CLOSE MODAL
        closeModal('addRoomType');

        // ENABLE ADD ROOM TYPE BUTTON
        addRoomTypeModalBtn.disabled = false;
        
        // ERROR MESSAGE
        toastr.error('There was an error!');
      }
    },
    /*---------- ADD ROOM TYPE --------------------------------*/

    /*---------- UPDATE ROOM TYPE -----------------------------*/
    // GET CURRENT VALUES OF ROOM TYPE
    onClickOpenUpdateRoomTypeModal: async function (e) {
      // GET ROOM TYPE ID OF CLICKED ITEM
      this.roomTypeId = e.currentTarget.getAttribute('data-room-type-id');

      // API PARAMETERS
      params = {
        "room_type_id": this.roomTypeId
      };

      // VIEW SINGLE ROOM TYPE INFORMATION
      const result = await actionAPICall(baseUrl, viewSingleRoomTypeEndPoint, params);
      const res = await result.json();

      // SINGLE ROOM TYPE DATA RETURNED SUCCESSFULLY 
      if(res.result === 1) {
        // STORE SINGLE ROOM TYPE INFORMATION IN VARIABLE 
        const singleRoomTypeInfo = res.data[0];
        // ASSIGN ROOM TYPE INFORMATION TO RESPECTIVE INPUT FIELD
        
        this.roomTypeName = singleRoomTypeInfo.name;
        this.roomTypeId = singleRoomTypeInfo.id;
        this.roomTypeStatus = singleRoomTypeInfo.status;
      }
      else {
        toastr.error('There was an error');
      }

    },
    // ON UPDATE BUTTON CLICK IN UPDATE ROOM TYPE MODAL
    onClickUpdateBtn: function () {
      if(this.roomTypeName === '') { // EMPTY ROOM TYPE NAME
        this.validRoomType = true;
        this.invalidRoomTypeDetails = false;
        this.emptyRoomType();
      }
      else {
        // API PARAMETERS 
        params = {
          "name": this.roomTypeName,
          "room_type_id": this.roomTypeId,
          "status": this.roomTypeStatus
        };

        // UPDATE ROOM TYPE
        this.updateRoomType(params);
      }
    },
    updateRoomType: async function (params) {
      const updateRoomTypeModalBtn = document.querySelector('.update-room-type-modal-btn');
      
      // DISABLE UPDATE ROOM TYPE BUTTON
      updateRoomTypeModalBtn.disabled = true;

      // UPDATE ROOM TYPE ON SERVER
      const result = await actionAPICall(baseUrl, updateRoomTypeEndPoint, params);
      const res = await result.json();
      
      // UPDATE ROOM TYPE SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('updateRoomType');

        // ENABLE UPDATE ROOM TYPE BUTTON
        updateRoomTypeModalBtn.disabled = false;
        
        toastr.success('Room type updated successfully');
        this.viewAllRoomTypes(); // RELOAD ALL ROOM TYPES VIEW

        // RESET INPUT FIELDS
        this.roomTypeName = '';
        this.roomTypeId = '';
        this.buildingStatus = statusObj.active;
      }
      else {
        // CLOSE MODAL
        closeModal('updateRoomType'); 

        // ENABLE UPDATE ROOM TYPE BUTTON
        updateRoomTypeModalBtn.disabled = false;

        // ERROR MESSAGE
        toastr.error('There was an error!');
      }
    },
    /*---------- UPDATE ROOM TYPE -----------------------------*/

    /*---------- UPDATE ROOM TYPE STATUS ----------------------*/
    onClickUpdateStatus: function (e) {
      
      // GET ROOM TYPE ID AND STATUS
      const roomTypeId = e.currentTarget.getAttribute('data-room-type-id');
      const currentRoomTypeStatus = e.currentTarget.getAttribute('data-current-status');
      // VARIABLE TO STORE NEW UPDATED STATUS
      let newStatus;

      // CURRENT STATUS IS ACTIVE
      if(currentRoomTypeStatus === statusObj.active) {
        newStatus = statusObj.inactive; // MAKE THE NEW STATUS INACTIVE
      }
      // CURRENT STATIS IS INACTIVE
      else if(currentRoomTypeStatus === statusObj.inactive) {
        newStatus = statusObj.active; // MAKE THE NEW STATUS ACTIVE
      }

      // API PARAMETERS
      params = {
        "status": newStatus,
        "room_type_id": roomTypeId
      };

      // UPDATE STATUS
      this.updateRoomTypeStatus(params);
    },
    // UPDATE FLOOR STATUS
    updateRoomTypeStatus: async function (params) {
      // UPDATE ROOM TYPE STATUS ON SERVER
      const result = await actionAPICall(baseUrl, updateRoomTypeStatusEndPoint, params);
      const res = await result.json();
      
      // STATUS UPDATED SUCCESSFULLY
      if(res.result === 'success') {
        toastr.success('Status updated successfully');
        this.viewAllRoomTypes(); // RELOAD ALL ROOM TYPES VIEW
      }
      else {
        toastr.error('There was an error!');
      }
    },
    /*---------- UPDATE ROOM TYPE STATUS ----------------------*/

    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/
    emptyRoomType: function () {
      this.error = 'Room type is empty';
    },
    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/

    /*----------- REMOVE HIGHLIGHTED ERRORS -----------------------*/
    keyUpRoomType: function () {  // KEY IS PRESSED UP ON ROOM TYPE INPUT
      this.validRoomType = false;
      this.invalidRoomTypeDetails = true;
    }
    /*----------- REMOVE HIGHLIGHT ERRORS -----------------------*/
  }
})
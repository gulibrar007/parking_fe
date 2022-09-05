// VIEW ALL ROLES ENDPOINT
const viewAllRolesEndPoint = "/get_all_roles";

// VIEW ACTIVE ROLES ENDPOINT
const viewActiveRolesEndPoint = "/get_active_roles";

// VIEW SINGLE ROLE
const viewSingleRoleEndPoint= "/get_single_role";

// ADD ROLE ENDPOINT
const addRoleEndPoint = "/add_user_role";

// UPDATE ROLE ENDPOINT
const updateRoleEndPoint = "/update_user_role";

// UPDATE ROLE STATUS ENDPOINT
const updateRoleStatusEndPoint = "/update_user_role_status";

new Vue({
  el: '#roleVueApp',
  data: {
    error: '',
    invalidRoleDetails: true,

    validRoleName: false,
    roleName: '',
    validRoleStatus: false,
    roleStatus: '',
    roleId: '',

    roleList: []
  },
  mounted: function () { // WHEN VUE COMPONENT IS ADDED TO DOM, THIS HOOK IS CALLED
    this.viewAllRoles();
  },
  methods: {
    /*---------- VIEW ALL ROLES -------------------------*/
    viewAllRoles: async function () {

      // SPINNER AND ADD ROLE BTN, TABLE VARIABLES
      const spinner = document.querySelector('.horizontal-loader');
      const addRoleBtn = document.querySelector('.add-btn');
      const table = document.querySelector('.table-data-table');

      // SHOW SPINNER AND HIDE ADD ROLE BTN, TABLE
      spinner.style.display = 'block';
      addRoleBtn.style.display = 'none';
      table.style.display = 'none';

      // DESTROY THE DATA TABLE
      $('#data_table_role').DataTable().destroy();

      // PARAMETERS TO VIEW ALL ROLES
      let params = { }; 
      // GET ALL ROLES FROM API CALL
      const result = await actionAPICall(baseUrl, viewAllRolesEndPoint, params);
      const res = await result.json();
      
      // IF ALL ROLES ARE RETURNED SUCCESSFULLY
      if(res.result == 1) {
        this.roleList = res.data; // STORE THE FLOORS RETURNED IN ARRAY
      }

      setTimeout(function(){
        // SHOW ADD ROLE BTN, TABLE AND HIDE SPINNER
        spinner.style.display = 'none';
        addRoleBtn.style.display = 'block';
        table.style.display = 'block';
        
        // DRAW THE DATA TABLE
        $('#data_table_role').DataTable().draw();

        // SHOW ACTIVE INACTIVE STATUS FOR EACH TABLE ROW
        activeInactiveButtonInput();

        // SHOW SELECTED STATUS IN UPDATE MODAL
        activeInactiveModalSelectOptions();

      }, 500);
      

    },
    /*---------- VIEW ALL ROLES -------------------------*/

    /*---------- ADD ROLE --------------------------------*/
    // ON ADD BUTTON CLICK IN ADD ROLE MODAL
    onClickAddBtn: function () {
      if(this.roleName === '') { // EMPTY ROLE NAME
        this.validRoleName = true;
        this.invalidRoleDetails = false;
        this.emptyRoleName();
      }
      else { 
        // API PARAMETERS
        params = {
          "name": this.roleName
        };

        // ADD ROLE
        this.addRole(params);
      }
    },
    // ADD ROLE
    addRole: async function (params) {
      const addRoleModalBtn = document.querySelector('.add-role-modal-btn');
      
      // DISABLE ADD ROLE BUTTON
      addRoleModalBtn.disabled = true;

      // ADD ROLE ON SERVER
      const result = await actionAPICall(baseUrl, addRoleEndPoint, params);
      const res = await result.json();

      // ROLE ADDED SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('addRole');

        // ENABLE ADD ROLE BUTTON
        addRoleModalBtn.disabled = false;

        toastr.success('Role added successfully');
        this.viewAllRoles(); // RELOAD ALL ROLES VIEW

        // RESET INPUT FIELDS
        this.roleName = '';
      }
      else {
        // CLOSE MODAL
        closeModal('addRole');

        // ENABLE ADD ROLE BUTTON
        addRoleModalBtn.disabled = false;
        
        // ERROR MESSAGE
        toastr.error('There was an error!');
      }
    },
    /*---------- ADD ROLE --------------------------------*/

    /*---------- UPDATE ROLE -----------------------------*/
    // GET CURRENT VALUES OF ROLE
    onClickOpenUpdateRoleModal: async function (e) {
      // GET ROLE ID OF CLICKED ITEM
      this.roleId = e.currentTarget.getAttribute('data-role-id');
      

      // API PARAMETERS
      params = {
        "role_id": this.roleId
      };

      // VIEW SINGLE ROLE INFORMATION
      const result = await actionAPICall(baseUrl, viewSingleRoleEndPoint, params);
      const res = await result.json();

      // SINGLE ROLE DATA RETURNED SUCCESSFULLY 
      if(res.result === 1) {
        // STORE SINGLE ROLE INFORMATION IN VARIABLE 
        const singleRoleInfo = res.data[0];
        
        // ASSIGN ROLE INFORMATION TO RESPECTIVE INPUT FIELD
        this.roleName = singleRoleInfo.name;
        this.roleId = singleRoleInfo.id;
        this.roleStatus = singleRoleInfo.status;
      }
      else {
        toastr.error('There was an error');
      }

    },
    // ON UPDATE BUTTON CLICK IN UPDATE ROLE MODAL
    onClickUpdateBtn: function () {
      if(this.roleName === '') { // EMPTY ROLE NAME
        this.validRoleName = true;
        this.invalidRoleDetails = false;
        this.emptyRoleName();
      }
      else {
        // API PARAMETERS 
        params = {
          "name": this.roleName,
          "status": this.roleStatus,
          "user_role_id": this.roleId
        };

        // UPDATE ROLE
        this.updateRole(params);
      }
    },
    updateRole: async function (params) {
      const updateRoleModalBtn = document.querySelector('.update-role-modal-btn');
      
      // DISABLE UPDATE ROLE BUTTON
      updateRoleModalBtn.disabled = true;

      // UPDATE ROLE ON SERVER
      const result = await actionAPICall(baseUrl, updateRoleEndPoint, params);
      const res = await result.json();
      
      // UPDATE ROLE SUCCESSFULLY
      if(res.result === 'success') {
        // CLOSE MODAL
        closeModal('updateRole');

        // ENABLE UPDATE ROLE BUTTON
        updateRoleModalBtn.disabled = false;
        
        toastr.success('Role updated successfully');
        this.viewAllRoles(); // RELOAD ALL ROLES VIEW

        // RESET INPUT FIELDS
        this.roleName = '';
        this.roleStatus = statusObj.active;
      }
      else {
        // CLOSE MODAL
        closeModal('updateRole'); 

        // ENABLE UPDATE ROLE BUTTON
        updateRoleModalBtn.disabled = false;

        // ERROR MESSAGE
        toastr.error('There was an error!');
      }
    },
    /*---------- UPDATE ROLE -----------------------------*/

    /*---------- UPDATE ROLE STATUS ----------------------*/
    onClickUpdateStatus: function (e) {
      
      // GET ROLE ID AND STATUS
      const roleId = e.currentTarget.getAttribute('data-role-id');
      const currentRoleStatus = e.currentTarget.getAttribute('data-current-status');
      // VARIABLE TO STORE NEW UPDATED STATUS
      let newStatus;

      // CURRENT STATUS IS ACTIVE
      if(currentRoleStatus === statusObj.active) {
        newStatus = statusObj.inactive; // MAKE THE NEW STATUS INACTIVE
      }
      // CURRENT STATIS IS INACTIVE
      else if(currentRoleStatus === statusObj.inactive) {
        newStatus = statusObj.active; // MAKE THE NEW STATUS ACTIVE
      }

      // API PARAMETERS
      params = {
        "status": newStatus,
        "user_role_id": roleId
      };

      // UPDATE STATUS
      this.updateRoleStatus(params);
    },
    // UPDATE ROLE STATUS
    updateRoleStatus: async function (params) {
      // UPDATE ROLE STATUS ON SERVER
      const result = await actionAPICall(baseUrl, updateRoleStatusEndPoint, params);
      const res = await result.json();
      
      // STATUS UPDATED SUCCESSFULLY
      if(res.result === 'success') {
        toastr.success('Status updated successfully');
        this.viewAllRoles(); // RELOAD ALL ROLES VIEW
      }
      else {
        toastr.error('There was an error!');
      }
    },
    /*---------- UPDATE ROLE STATUS ----------------------*/

    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/
    emptyRoleName: function () {
      this.error = 'Role name is empty';
    },
    /*---------- EMPTY/INVALID FIELD MESSAGE ---------------------*/

    /*----------- REMOVE HIGHLIGHTED ERRORS -----------------------*/
    keyUpRoleName: function () {  // KEY IS PRESSED UP ON ROLE NAME INPUT
      this.validRoleName = false;
      this.invalidRoleDetails = true;
    }
    /*----------- REMOVE HIGHLIGHTED ERRORS -----------------------*/
  }
})
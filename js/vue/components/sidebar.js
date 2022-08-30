Vue.component('sidebarcomponents',{
    template: `
      <div>
        <!-- menu prile quick info -->
          <div class="profile">
            <div class="profile_pic">
              <img src="images/img.jpg" alt="..." class="img-circle profile_img">
            </div>
            <div class="profile_info">
              <span>Welcome,</span>
              <h2>John Doe</h2>
            </div>
          </div>
          <!-- /menu prile quick info -->

          <br />

          <!-- sidebar menu -->
          <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">

            <div class="menu_section">
              <h3>General</h3>
              <ul class="nav side-menu">
                <li><a href="index.html"><i class="fa fa-home"></i> Home </a>
                </li>
                <li><a><i class="fa fa-cog"></i> System Configuration <span class="fa fa-chevron-down"></span></a>
                  <ul class="nav child_menu" style="display: none">
                    <li>
                      <a href="city.html">City</a>
                    </li>
                    <li>
                      <a href="country.html">Country</a>
                    </li>
                    <li>
                      <a href="building.html">Building</a>
                    </li>
                    <li>
                      <a href="floor.html">Floors</a>
                    </li>
                    <li>
                      <a href="role.html">Roles</a>
                    </li>
                  </ul>
                </li>

              </ul>
            </div>


          </div>
          <!-- /sidebar menu -->
      </div>
    `
    
    
});

new Vue({
  el: '#sideBarComponent'
})

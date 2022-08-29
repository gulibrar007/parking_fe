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
                    <li><a href="city.html">City</a>
                    </li>
                    <li><a href="country.html">Country</a>
                    </li>
                  </ul>
                </li>
                <li><a><i class="fa fa-cog"></i> Accounts <span class="fa fa-chevron-down"></span></a>
                  <ul class="nav child_menu" style="display: none">
                     <li><a href="other.html?data=Income Heads">Income Heads</a>
                    </li>
                    <li><a href="other.html?data=Add Income">Add Income</a>
                    </li>
                    <li><a href="other.html?data=Expense Head">Expense Head</a>
                    </li>
                    <li><a href="other.html?data=Add Expense">Add Expense</a>
                    </li>
                  </ul>
                </li>
                <li><a><i class="fa fa-cog"></i> HR <span class="fa fa-chevron-down"></span></a>
                  <ul class="nav child_menu" style="display: none">
                    <li><a href="other.html?data=Add Employee">Add Employee</a>
                    </li>
                    <li><a href="other.html?data=ALeave Types">Leave Types</a>
                    </li>
                    <li><a href="other.html?data=Employee Leave Request">Employee Leave Request</a>
                    </li>
                    <li><a href="other.html?data=Employement Type">Employement Type</a>
                    </li>
                    <li><a href="other.html?data=Employee Grade">Employee Grade</a>
                    </li>
                    <li><a href="other.html?data=Employee Shits">Employee Shits</a>
                    </li>
                  </ul>
                </li>

                <li><a><i class="fa fa-cog"></i> Guest Services <span class="fa fa-chevron-down"></span></a>
                  <ul class="nav child_menu" style="display: none">
                     <li><a href="checkin.html">Check In</a>
                    </li>
                    <li><a href="checkout.html">Check Out</a>
                    </li>
                    <li><a href="addtional_charges.html">Additional Charges</a>
                    </li>
                    <li><a href="reservations.html">Reservations</a>
                    </li>
                  </ul>
                </li>

                <li><a><i class="fa fa-file"></i> Reports <span class="fa fa-chevron-down"></span></a>
                  <ul class="nav child_menu" style="display: none">
                     <li><a href="report_daily_occupancy.html">Daily Occupancy</a>
                    </li>
                    <li><a href="report_hotel_revenue_occupency.html">Hotel Revenue & Occupency</a>
                    </li>
                    <li><a href="report_room_availability.html">Room Availability</a>
                    </li>
                    <li><a href="report_info_graphical.html">Infographic Reports</a>
                    </li>
                    <li><a href="report_history.html">History</a>
                    </li>
                  </ul>
                </li>

                <li><a href="currency_conversion.html"><i class="fa fa-exchange"></i> Currency Conversion </a>
                </li>
                <li><a href="lost_found.html"><i class="fa fa-home"></i> Lost & Found </a>
                </li>

                <li><a><i class="fa fa-cog"></i> System Setup <span class="fa fa-chevron-down"></span></a>
                  <ul class="nav child_menu" style="display: none">
                    <li><a href="other.html?data=Building">Building</a>
                    </li>
                    <li><a href="other.html?data=Floors">Floors</a>
                    </li>
                    <li><a href="other.html?data=Rooms">Rooms</a>
                    </li>
                    <li><a href="other.html?data=Room Type">Room Type</a>
                    </li>
                    <li><a href="other.html?data=Room Rates">Room Rates</a>
                    </li>
                    <li><a href="other.html?data=Room Facilities">Room Facilities</a>
                    </li>
                    <li><a href="other.html?data=Department">Department</a>
                    </li>
                    <li><a href="other.html?data=Designation">Designation</a>
                    </li>
                    <li><a href="other.html?data=Dept / Agencies">Dept / Agencies</a>
                    </li>
                    <li><a href="other.html?data=Currency">Currency</a>
                    </li>
                    <li><a href="other.html?data=Exchange Rate">Exchange Rate</a>
                    </li>
                    <li><a href="other.html?data=Hotel Facilities">Hotel Facilities</a>
                    </li>
                    <li><a href="other.html?data=General Settings">General Settings</a>
                    </li>

                  </ul>
                </li>

                <li><a href="day_close.html"><i class="fa fa-exchange"></i> Daily Close </a>
                </li>
                <li><a href="receive_daily_cash.html"><i class="fa fa-exchange"></i> Receive Daily Cash</a>
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

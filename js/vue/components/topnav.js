Vue.component('topnavcomponents',{
    template : `
    <div class="nav_menu">
          <nav class="" role="navigation">
            <div class="nav toggle">
              <a id="menu_toggle"><i class="fa fa-bars"></i></a>
            </div>

            <ul class="nav navbar-nav navbar-right">
              <li class="">
                <a href="javascript:;" class="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                  <img src="images/img.jpg" alt="">Admin
                  <span class=" fa fa-angle-down"></span>
                </a>
                <ul class="dropdown-menu dropdown-usermenu animated fadeInDown pull-right">
                  <li><a href="javascript:;">  Profile</a>
                  </li>
                  <li>
                    <a href="javascript:;">
                      <span class="badge bg-red pull-right">50%</span>
                      <span>Settings</span>
                    </a>
                  </li>
                  <li>
                    <a href="javascript:;">Help</a>
                  </li>
                  <li><a href="javascript:;" onclick="logOutSession()"><i class="fa fa-sign-out pull-right"></i> Log Out</a>
                  </li>
                </ul>
              </li>

              

            </ul>
          </nav>
        </div>
    `
});

new Vue({
  el: '#topNavComponent'
})

let logoutEndPoint = '/logout'; // LOGOUT ENDPOINT

// LOGOUT FROM SESSION
async function logOutSession () {
  const result = await actionAPICall(baseUrl, logoutEndPoint, '')
  const res = await result.json()
  
  // LOGOUT SECCESSFUL 
  if(res.result === 'success') {
    window.location.href = 'index.html'; //RE-DIRECT TO LOGIN PAGE
    sessionStorage.clear() //CLEAR SESSION
  }
}

const API_KEY = "3a9653ac9ea0461da6998c006a486ae5";
const BASE_URL = "https://api.football-data.org/v2/";

const LEAGUE_ID = 2014;

const ENDPOINT_STANDING = `${BASE_URL}competitions/${LEAGUE_ID}/standings`;
const ENDPOINT_ALLTEAM = `${BASE_URL}competitions/${LEAGUE_ID}/teams`;
const ENDPOINT_TEAMBYID = `${BASE_URL}teams/`;

const fetchAPI = (url) => {
  return fetch(url, {
    headers: {
      "X-Auth-Token": API_KEY,
    },
  })
    .then((res) => {
      if (res.status !== 200) {
        console.log("Error: " + res.status);
        return Promise.reject(new Error(res.statusText));
      } else {
        return Promise.resolve(res);
      }
    })
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });
};

function getAllStandings() {
  if ("caches" in window) {
    caches.match(ENDPOINT_STANDING).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          console.log("Competition Data: " + data);
          showStanding(data);
        });
      }
    });
  }

  fetchAPI(ENDPOINT_STANDING)
    .then((data) => {
      showStanding(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function getAllTeam() {
  if ("caches" in window) {
    caches.match(ENDPOINT_ALLTEAM).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          console.log("Team Data: " + data);
          showAllTeam(data);
        });
      }
    });
  }

  fetchAPI(ENDPOINT_ALLTEAM)
    .then((data) => {
      showAllTeam(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function getTeamById() {
  return new Promise(function (resolve, reject) {
    // Ambil nilai query parameter (?id=)
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");
    if ("caches" in window) {
      caches.match(ENDPOINT_TEAMBYID + idParam).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            console.log("Team Data: " + data);
            showTeamById(data);
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }

    fetchAPI(ENDPOINT_TEAMBYID + idParam)
      .then((data) => {
        showTeamById(data);
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

function showStanding(data) {
  let standings = "";
  let standingElement = document.getElementById("homeStandings");

  data.standings[0].table.forEach(function (standing) {
    let logoTeam = standing.team.crestUrl.replace(/^http:\/\//i, "https://");
    standings += `
                <tr>
                    <td>${standing.position}</td>
                    <td><img src="${logoTeam}" width="30px" alt="badge"/></td>
                    <td>${standing.team.name}</td>
                    <td>${standing.points}</td>
                    <td>${standing.playedGames}</td>
                    <td>${standing.won}</td>
                    <td>${standing.draw}</td>
                    <td>${standing.lost}</td>
                    <td>${standing.goalsFor}</td>
                    <td>${standing.goalsAgainst}</td>
                    <td>${standing.goalDifference}</td>
                </tr>
        `;
  });

  standingElement.innerHTML = `
                <div class="card" 
                style="padding-left: 24px; 
                padding-right: 24px; 
                margin-top: 30px; 
                background:#FOEFEA;">

                <table class="striped responsive-table">
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>TEAM</th>
                            <th>NAME</th>
                            <th>PTS</th>
                            <th>PG</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>GF</th>
                            <th>GA</th>
                            <th>GD</th>
                        </tr>
                     </thead>
                    <tbody id="standings">
                        ${standings}
                    </tbody>
                </table>
                
                </div>
    `;
}

function showAllTeam(data) {
  let squads = "";
  let teamElement = document.getElementById("teams");

  data.teams.forEach(function (team) {
    squads += `
                <a href="pages/teamdetail.html?id=${team.id}" style="color:black;">

                    <div class="col s12 m4 l3" 
                    style="float:left; 
                    height: 22rem; 
                    margin: 0; 
                    padding: 5px; ">

                        <div class="card" style="background: gold;">
                            <div class="card-image" style="height : 15rem;">

                            <img src="${team.crestUrl}" 
                            style="margin: auto; 
                            padding: 1rem 1rem 0 1rem; 
                            height: 100%; 
                            width:auto; 
                            max-width: 100%; ">
                            </div>

                            <div class="card-content" 
                            style="padding-top: 0.5rem; 
                            color : black;
                            text-align : center;
                            height : 6rem;">
                            <h5><b>${team.name}</b></h5>
                            </div>
                            
                            <a href="pages/teamdetail.html?id=${team.id}"</a>
                            
                        </div>
                    </div>
                </a>
                `;
  });

  teamElement.innerHTML = ` 
        <div class="row">    
        ${squads}
        </div>
    `;
}

function showTeamById(data) {
  let squads = "";
  let info = "";
  let teamElement = document.getElementById("body-content");
  let logoTeam = data.crestUrl.replace(/^http:\/\//i, "https://");

  info += `
            <div class="card" style="text-align:center;">
            <div class="row">
            <div class="col s3 l5"></div>
            <div class="col s6 l2" 
            style="margin-bottom: 0; 
            padding:0; ">

                <img src="${logoTeam}"
                style="padding-top: 2rem;
                width:100%;
                height: auto;" 
                align="middle" >
                </div>
            </div>

            <div class="card-content" 
            style="margin-top: 0;
            padding:0; ">

            <h3 >${data.name}</h3>
            <h6 ><b><u>Address</u><br>${data.address}</b></h6>
            <h6 ><b><u>Website</u><br>${data.website}</b></h6>
            <h6 ><b><u>Email</u><br>${data.email}</b></h6>
            <br>
            <h6 ><b>Founded on ${data.founded}</b></h6>
            <h6 ><b>Stadion at ${data.venue}</b></h6>
            <br>
            </div>
        `;

  data.squad.forEach(function (member) {
    squads += `
            <tr style="text-align: center; font-weight: bold;">
            <td>${member.shirtNumber}</td>
                <td>${member.name}</td>
                <td>${member.countryOfBirth}</td>
                <td>${member.nationality}</td>
                <td>${member.position}</td></b>
                </tr>
    `;
  });

  teamElement.innerHTML = `
                            ${info}
                            <div class="card"
                            style="padding-left: 30px; 
                            padding-right: 30px;">

                                    <table class="striped responsive-table">
                                        <thead>
                                        <tr><h3 
                                        style="text-align: center; 
                                        color: blue;
                                        padding-top: 15px;">
                                        <b>TEAM PLAYER</b></h3></tr>

                                        <hr>
                                        
                                        
                                        <tr style="color:red; text-align: center;">
                                            <th>NO</th>
                                            <th>NAME</th>
                                            <th>NATIONALITY</th>
                                            <th>COUNTRY OF BIRTH</th>
                                            <th>POSITION</th>
                                        </tr>
                                        </thead>

                                        <tbody id="standings" >
                                            ${squads}
                                        </tbody>
                                    </table>
                                    </div>
                            </div>
                            `;
}

function getSavedTeams() {
  getAll().then(function (teams) {
    console.log(teams);
    // Menyusun komponen card artikel secara dinamis
    let squads = "";

    teams.forEach(function (team) {
      let logoTeam = team.crestUrl.replace(/^http:\/\//i, "https://");
      squads += `
                    <a href="pages/teamdetail.html?id=${team.id}&saved=true" style="color:black;">

                        <div class="col s12 m4 l3" 
                        style="float: left; 
                        height: 20rem; 
                        margin: 0; 
                        padding: 10px; ">

                            <div class="card">

                                <div class="card-image" style="height : 15rem;">
                                <img src="${logoTeam}" 
                                style="margin: auto; 
                                padding: 1rem 1rem 0 1rem; 
                                height: 100%; 
                                width:auto; 
                                max-width: 100%; ">
                                </div>

                                <div class="card-content" 
                                style="padding-top: 0.5rem;
                                text-align: center;
                                Width : 100%; 
                                height : 4rem;">
                                <h10><b>${team.name}</b></h10>
                                </div>
                               
                                <a href="pages/teamdetail.html?id=${team.id}&saved=true" style="float: left;"></a>
                                
                            </div>
                        </div>
                    </a>
                    `;
    });

    document.getElementById("saved").innerHTML = ` 
                    <div class="row">    
                    ${squads}
                    </div>
                `;
  });
}
function getSavedTeamById() {
  let urlParams = new URLSearchParams(window.location.search);
  let idParam = parseInt(urlParams.get("id"));

  getById(idParam).then(function (team) {
    console.log(team);
    showTeamById(team);
  });
}

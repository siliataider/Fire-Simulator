
// -------------------- Variables --------------------
const facilityID = 663103;

var map = L.map('map').setView([45.76, 4.84], 12);
//mapboxgl.accessToken = 'https://api.mapbox.com/directions/v5/mapbox/cycling/-84.518641,39.134270;-84.512023,39.102779?geometries=geojson&access_token=pk.eyJ1IjoidHNpbGlhIiwiYSI6ImNsNDQzYXVoZDAwM2szZHFtMHR4eGRmcjQifQ.OSLL3C6ckL9HIrHSrIs5sA';

const truckLocation = [45.76, 4.84];

const vehicle_layer = L.layerGroup();
const fire_layer = L.layerGroup();
const facility_layer = L.layerGroup();

function print(){
    console.log("je sleep");
    setTimeout(print, 1000); 
}

// -------------------- INITIALISATION DE L AFFICHAGE --------------------
update_view();
/*retour_caserne();
displayMap();
display_facilities();
display_fires();
display_vehicles();*/


// -------------------- Fonctions Display --------------------
// fonction pour afficher la map
function displayMap(){

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

}

// fonction pour afficher les casernes
async function display_facilities(){
    var data_facility = await getapi('facility');
    place('facility', data_facility);
    
}

// fonction pour afficher les feux
async function display_fires(){
    var data_fire = await getapi('fire');
    place('fire', data_fire);
    
}

// fonction pour afficher les casernes
async function display_vehicles(){
    var data_vehicle = await getapi('vehicle');
    place('vehicle', data_vehicle);
    
}

async function retour_caserne(){
    var data_vehicle = await getapi('vehicle');
    var our_vehicle = data_vehicle.filter( element => element.facilityRefID == facilityID);
    
    for (r in our_vehicle){
        setVehicle(our_vehicle[r].id, 45.74197012, 4.77509451);
    }
    
    
}
// -------------------- Fonctions UPDATE VIEW --------------------

function update_view(){
    
    retour_caserne();
    
    map.eachLayer((layer) => {
        layer.remove();
    });
    
    displayMap();
    display_facilities();
    display_fires();
    display_vehicles();

    
    //eteindre_feu();
    
    setTimeout(update_view, 1000); 
    
}

// -------------------- Fonction API --------------------

// fonction generale pour recuperer depuis l api en format json les donnes de ce qu on lui passe en parametre
async function getapi(param) {
    
    var url = 'http://vps.cpe-sn.fr:8081/'+param;

    // Storing response
    const response = await fetch(url);
    
    // Storing data in form of JSON
    var data = await response.json();
    //console.log(data);

    return data;
}

// -------------------- Fonctions Ajout Vehicule --------------------

function newLocation(){
    window.location.replace("http://localhost:8081/html/index.html");
    //console.log(location);
}

function handleSubmit(){
    
    let form = document.getElementById("formVehicle");
    let data = new FormData(form);

    const value = Object.fromEntries(data.entries());
    //console.log({value});
    sendVehicle(value);

}

function sendVehicle(data){

    const POST_URL="http://vps.cpe-sn.fr:8081/vehicle/94a7c3fd-5078-4046-b7a2-70fab15c7222"; 
    let context =   {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify(data),
                    };
    
    /*console.log(data);
    console.log("coucou c est la fonction ajout vehicule");*/
    
    fetch(POST_URL,context)
            .then(response => callback(response))
            .catch(error => err_callback(error));

}


function callback(response){
    if (!response.ok) {
        alert("Pas possible de rajouter ce vehicule!");
        return err_callback(response);
    }
    newLocation();
    //console.log(response.value);
}

function err_callback(error){
    console.log(error);
}

// -------------------- Fonction Place --------------------
// fonction asynchrone qui place un composant qu on lui passe ne parametre et qui affiche des popup selon lui
async function place(param, data){    

    for (let r in data) {
        lon = data[r].lon;
        lat = data[r].lat;


        if (param == 'facility'){
            //console.log("j ajoute une caserne");
            
            var caserneIcon = L.icon({
                iconUrl: '/images/caserne.png',
            
                iconSize:     [45, 45], // size of the icon
                iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 62],  // the same for the shadow
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            });

            var facility_marker = L.marker([lat, lon],{
                icon: caserneIcon
            })
    
            facility_marker.bindPopup('name: '+data[r].name + '<br> id: ' + data[r].id+ '<br> peopleCapacity: ' + data[r].peopleCapacity + '<br> ' + data[r].lat + '<br> ' + data[r].lon)
            facility_marker.openPopup();
            
            facility_marker.addTo(facility_layer);
            
            facility_layer.addTo(map);
        }

        if (param == 'fire'){
            //console.log("j ajoute un feu");

            var fire_marker = L.circle([lat, lon], {
                color: '     #FF4500',
                fillColor: '#FF8C00',
                fillOpacity: 0.8,
                radius: 300
            })
            fire_marker.bindPopup('Intensity: '+data[r].intensity + '<br> Range: ' + data[r].range + '<br> Type: '+data[r].type)
            fire_marker.openPopup();

            //circle.addTo(map);
            fire_marker.addTo(fire_layer);

            fire_layer.addTo(map);
        }

        if (param == 'vehicle'){
            //console.log("j ajoute un vehicule");

            if (data[r].facilityRefID == facilityID){
                var vehiculeIcon = L.icon({
                    iconUrl: '/images/vehicule.png',
                
                    iconSize:     [60, 60], // size of the icon
                    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                    shadowAnchor: [4, 62],  // the same for the shadow
                    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                });
    
                var vehicle_marker = L.marker([lat, lon],{
                    icon: vehiculeIcon
                });
                vehicle_marker.bindPopup('vehicule id: '+ data[r].id);
                vehicle_marker.openPopup();
                
                vehicle_marker.addTo(vehicle_layer);
                vehicle_layer.addTo(map);

            }
            
        }
    }

}

// -------------------- Fonctions Eteindre feu --------------------
/*async function eteindre_feu(){
    
    var data_fire = await getapi('fire');
    var data_vehicle = await getapi('vehicle');
    var our_vehicle = data_vehicle.filter( element => element.facilityRefID == 251);
    
    for (let r in data_fire){
                    
        lat = data_fire[r].lat;
        lon = data_fire[r].lon;
        
        id = data_vehicle[r].id;
        setVehicle(id, lat, lon);
        console.log("je suis la fonction eteindre feu");

    }
    
}*/
async function eteindre_feu(){
    
    var data_fire = await getapi('fire');
    var data_vehicle = await getapi('vehicle');
    var our_vehicle = data_vehicle.filter( element => element.facilityRefID == facilityID);
    
    var attribue = new Array();
    
    var i = 0;
    var id = 0;
    var diff_lat = 0;
    var diff_lon = 0;
    var lat_fin = 0;
    var lon_fin = 0;
    var lat_deb = 0;
    var lon_deb = 0;
    var bool = new Boolean(false);
    
    var length = our_vehicle.length;
    console.log("on a ce nombre de vehicules "+length);
        
    for (let r in data_fire){
        i = 0;
        bool = false;
        
        while (i < length){
            
            if ( !(attribue.includes(our_vehicle[i].id) )){
                lat_fin = data_fire[r].lat;
                lon_fin = data_fire[r].lon;
        
                lat_deb = our_vehicle[i].lat;
                lon_deb = our_vehicle[i].lon;
                        
                id = our_vehicle[i].id;
                
                diff_lat = Math.abs(lat_fin - lat_deb);
                diff_lon = Math.abs(lon_fin - lon_deb);
                
                x_lat = diff_lat/5;
                x_lon = diff_lon/5;
                var distance = Math.sqrt(Math.pow(diff_lat,2)+Math.pow(diff_lon,2));
                console.log( "la distance avant est " + distance);
                //console.log( "condition lat "+Math.abs(our_vehicle[i].lat - lat_fin)+" condition lon "+Math.abs(our_vehicle[i].lon - lon_fin)); 
                
                //while (distance > 0.01){
                /*while ( Math.abs(our_vehicle[i].lat - lat_fin)>= 0.001){

                            console.log("je suis dans le while 2");
            
                            setVehicle(id, our_vehicle[i].lat + x_lat, our_vehicle[i].lon + x_lon);
                            diff_lat = Math.abs(lat_fin - our_vehicle[i].lat);
                            diff_lon = Math.abs(lon_fin - our_vehicle[i].lon);
                            distance = Math.sqrt(Math.pow(diff_lat,2)+Math.pow(diff_lon,2));
                            console.log( "la distance est " + distance);
                            //setTimeout(() => {console.log("je sleep");}, 1000);        
                }*/
                
                setVehicle(id, lat_fin, lon_fin);
                attribue.push(our_vehicle[i].id);
                bool = true;
                
                diff_lat = Math.abs(lat_fin - our_vehicle[i].lat);
                diff_lon = Math.abs(lon_fin - our_vehicle[i].lon);
                distance = Math.sqrt(Math.pow(diff_lat,2)+Math.pow(diff_lon,2));
                console.log( "la distance apres " + distance);
                
                console.log("Le vehicule avec le id : "+id+" a bouge au feu de coordonnees: "+lat_fin+" "+lon + " ses coord fin: "+lat_deb+" "+"lon_deb");
                
                //console.log("diff lat "+diff_lat+" x lat "+x_lat+ " diff lon "+diff_lon+" x lon "+x_lon);
            }

            i++;
            if (bool){
                break;
            }        
        }
    }    
}

// -------------------- Fonctions SetVehicle --------------------

async function setVehicle(id, lat_fin, lon_fin){
    
    console.log("fonction set vehicule, ID:  "+id+" lat:  "+lat_fin+" lon  "+lon_fin)

    const PUT_URL="http://vps.cpe-sn.fr:8081/vehicle/94a7c3fd-5078-4046-b7a2-70fab15c7222/"+id;
    
    var data_vehicle = await getapi('vehicle');

    for (let r in data_vehicle){
        if ((data_vehicle[r].id == id) && (data_vehicle[r].facilityRefID == facilityID)){

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            
            var data = {      "crewMember": data_vehicle[r].crewMember,
                              "facilityRefID": data_vehicle[r].facilityRefID,
                              "fuel": data_vehicle[r].fuel,
                              "id": id,
                              "lat": lat_fin,
                              "liquidQuantity": data_vehicle[r].liquidQuantity,
                              "liquidType": data_vehicle[r].liquidType,
                              "lon": lon_fin,
                              "type": data_vehicle[r].type
                            }
            
            var raw = JSON.stringify(data);
            
            var requestOptions = {
              method: 'PUT',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };
            
            fetch(PUT_URL, requestOptions)
              .then(response => response.text())
              .then(result => console.log(result))
              .catch(error => console.log('error', error));
    
        }
        
        //update_view();
    }
}

function callback_vehicle(response){
    if (!response.ok) {
        alert("Ce vehicule n arrive pas a bouger!");
        return err_callback(response);
    }
   // console.log(response.value);
}

// ------------------- Fonction get vehicule ----------------
async function getVehicle(){
        
    const p = document.getElementById('list_vehicles');
    var data = await getapi('vehicle');
    
    var data_vehicle = data.filter( element => element.facilityRefID == facilityID);
    
    var mainContainer = document.getElementById("myData");

    for (var i in data_vehicle) {
        var div = document.createElement("div");
        div.innerHTML = 'Vehicule ID: ' + data_vehicle[i].id + ',  FacilityRefID: ' +data_vehicle[i].facilityRefID+ ', Vehicle Type: ' +data_vehicle[i].type + ', lat:  ' + data_vehicle[i].lat + ', longitude:  ' + data_vehicle[i].lon+'<br><br>';
        mainContainer.appendChild(div);
    }
    
    
}

// ------------------- Fonction delete vehicule ----------------

function deleteVehicle(){
    
    let form = document.getElementById("formDelete");
    let data = new FormData(form);

    const id = Object.fromEntries(data.entries());
    console.log(id.id);

    const DELETE_URL="http://vps.cpe-sn.fr:8081/vehicle/94a7c3fd-5078-4046-b7a2-70fab15c7222/"+(id.id); 
    console.log(DELETE_URL);
    fetch(DELETE_URL,{
        method: 'DELETE',
    })
            .then(res => res.json())
            .then(res => del_callback(res))
            .catch(error => del_err(error));
}

function del_callback(response){
    if (!response.ok) {
        alert('Impossible de supprimer le vehicule, verifier votre requete!')
        return del_err(response);
    }
}

function del_err(error){
    console.log(error);
}
// -------------------- Fonctions Filtre --------------------
async function filterFire(c, criteria){

    map.eachLayer((layer) => {
        layer.remove();
      });

    displayMap();
    //display_facilities();
    console.log("fonction filtre a tout efface de la map");

    if (criteria == 'type'){
        if (c == 'all'){
            var data = await getapi('fire');
        }
    
        else {
            var liste_fire = await getapi('fire');
            var data = liste_fire.filter( element => element.type == c);
            console.log(data);
            console.log('fonction de filtre par type sur le critere '+ c);
        }
    }

    else if (criteria == 'intensity'){
        if (c == 'all'){
            var data = await getapi('fire');
        }
    
        else {
            var liste_fire = await getapi('fire');
            var data = liste_fire.filter( element => (element.intensity <= c && element.intensity > c-10));
            console.log(data);
            console.log('fonction de filtre par intensity sur le critere '+ c);
        }
    }

    else if (criteria == 'range'){
        if (c == 'all'){
            var data = await getapi('fire');
        }
    
        else {
            var liste_fire = await getapi('fire');
            var data = liste_fire.filter( element => (element.range <= c && element.range > c-10));
            console.log(data);
            console.log('fonction de filtre par range sur le critere '+ c);
        }
    }

    place('fire', data);
}

// -------------------- Fonctions REQUEST ITINERAIRE --------------------
// fonction qui recupere depuis le controleur une liste de correspondance entre nos vehicules et les feux 
function match_fire_vehicle(){
    
    console.log("j envoie une requete pour matcher les fire et les vehicules");
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("http://localhost:8081/FireVehicle", requestOptions)
      .then(response => response.text())
      //.then(response => console.log("resultat de mariem "+response))
      .then(result => fight_fire(result))
      .catch(error => console.log('error', error));

    //setTimeout(match_fire_vehicle, 30000); 
}
match_fire_vehicle();

function fight_fire(liste_correspondance){
	
	//liste_correspondance = JSON.stringify(liste_correspondance);
	var parsed = JSON.parse(liste_correspondance);
	
    for (key in parsed){
        var id_feu = key;
        var id_vehicle = parsed[key];
        
        console.log(id_feu + " "+id_vehicle);
        
        getRoute(id_vehicle, id_feu);
    }
    
}

async function getRoute(id_vehicle, id_fire) {

    var data_vehicle = await getapi('vehicle');
    var data_fire = await getapi('fire');

    var lat_deb = 0;
    var lon_deb = 0;
    var lat_fin = 0;
    var lon_fin = 0;
        
    for (let r in data_vehicle){
        if (data_vehicle[r].id == id_vehicle){
            lat_deb = data_vehicle[r].lat;
            lon_deb = data_vehicle[r].lon;
        }
    }
    
    for (let i in data_fire){
        if (data_fire[i].id == id_fire){
            lat_fin = data_fire[i].lat;
            lon_fin = data_fire[i].lon;
        }
    }

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    var ROUTE_URL = 'https://api.mapbox.com/directions/v5/mapbox/driving/'+lat_deb+','+lon_deb+';'+lat_fin+','+lon_fin+'?geometries=geojson&access_token=pk.eyJ1IjoidHNpbGlhIiwiYSI6ImNsNDQzYXVoZDAwM2szZHFtMHR4eGRmcjQifQ.OSLL3C6ckL9HIrHSrIs5sA';
        
    console.log(lat_deb+" "+lon_deb+" "+lat_fin+" "+lon_fin)
    console.log("url "+ROUTE_URL)
    
    fetch(ROUTE_URL, requestOptions)
    //fetch('https://api.mapbox.com/directions/v5/mapbox/driving/ 45.77036991, 4.88580151; 45.721839937555565, 4.792258384694939?steps=false&geometries=geojson&access_token=pk.eyJ1IjoidHNpbGlhIiwiYSI6ImNsNDJ1ajRsMjB5aDUzb3FsYjBiZ3J4Y2YifQ.-PG2Q4r2pbwpZoGgq2GNvA', requestOptions)
      .then(response => response.json())
      .then(response => route_callback(response, id_vehicle))
      .catch(error => console.log('error', error));
 }

//getRoute(663127, 186);

function route_callback(data, id_vehicle){
    console.log(data.routes[0].geometry);
    var coords = data.routes[0].geometry.coordinates;
    console.log("coordinates: "+coords +" de type "+typeof(coords))
    console.log("body "+JSON.stringify(coords));
    send_itenerary(coords, id_vehicle);
    
}

function send_itenerary(response, id_vehicle){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
        "id": id_vehicle,
          "response": response
    });
    
    console.log("type "+ typeof(raw)+ " body: "+raw);
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("http://localhost:8081/itineraire", requestOptions)
      .then(response => response.text())
      .then(result => console.log("post envoye au back "+result))
      .catch(error => console.log('error', error));
}


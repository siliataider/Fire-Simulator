// fonction pour afficher la map avec la librairie leaflet

var map = L.map('map').setView([45.76, 4.84], 12);

displayMap();
display_facilities();
display_fires();
//display_vehicles();

// fonction pour afficher la map
function displayMap(){

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([45.76, 4.84]).addTo(map)
        .bindPopup('Coucou je suis le centre de lyon')
        .openPopup();
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
  
// fonction generale pour recuperer depuis l api en format json les donnes de ce qu on lui passe en parametre
async function getapi(param) {
    
    var url = 'http://vps.cpe-sn.fr:8081/'+param;

    // Storing response
    const response = await fetch(url);
    
    // Storing data in form of JSON
    var data = await response.json();
    console.log(data);

    return data;
}


// fonction asynchrone qui place un composant qu on lui passe ne parametre et qui affiche des popup selon
async function place(param, data){

    for (let r in data) {
        lon = data[r].lon;
        lat = data[r].lat;

        if (param == 'facility'){

            var caserneIcon = L.icon({
                iconUrl: '/images/caserne.png',
            
                iconSize:     [45, 45], // size of the icon
                iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 62],  // the same for the shadow
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            });

            L.marker([lat, lon],{
                icon: caserneIcon
            }).addTo(map)

            .bindPopup('name: '+data[r].name + '<br> maxVehicleSpace: ' + data[r].maxVehicleSpace+ '<br> peopleCapacity: ' + data[r].peopleCapacity)
            .openPopup();
        }

        if (param == 'fire'){

            var circle = L.circle([lat, lon], {
                color: ' 	#FF4500',
                fillColor: '#FF8C00',
                fillOpacity: 0.8,
                radius: 300
            })
            circle.bindPopup('Intensity: '+data[r].intensity + '<br> Range: ' + data[r].range + '<br> Type: '+data[r].type)
            circle.openPopup();

            circle.addTo(map);
        }

        if (param == 'vehicle'){

            var caserneIcon = L.icon({
                iconUrl: '/images/caserne.jpg',
            
                iconSize:     [45, 45], // size of the icon
                iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 62],  // the same for the shadow
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            });

            L.marker([lat, lon],{
                icon: caserneIcon
            }).addTo(map)

            .bindPopup('name: '+data[r].name + '<br> maxVehicleSpace: ' + data[r].maxVehicleSpace+ '<br> peopleCapacity: ' + data[r].peopleCapacity)
            .openPopup();
        }
    }

}


async function filterFire(c, criteria){
    map.eachLayer((layer) => {
        layer.remove();
      });

    displayMap();
    display_facilities();

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

// AJOUTER UN VEHICULE

function newLocation(){
	window.location.replace("http://127.0.0.1:8080/index.html");
	console.log(location);
}

function handleSubmit(){
	
    let form = document.getElementById("formVehicle");
    let data = new FormData(form);

    const value = Object.fromEntries(data.entries());
    console.log({value});
    sendVehicle(value);
}

function sendVehicle(data){

    const POST_URL="http://localhost:8080/vehicles/94a7c3fd-5078-4046-b7a2-70fab15c7222"; 
    let context =   {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify(data),
                    };
    
	console.log(data);
	console.log("coucou c est la fonction ajout vehicule");
	
    fetch(POST_URL,context)
            .then(response => callback(response))
            .catch(error => err_callback(error));
}



function callback(response){
	if (!response.ok) {
		alert("Ce vehicule existe déjà!");
		return err_callback(response);
	}
	newLocation();
    console.log(response.value);
}

function err_callback(error){
    console.log(error);
}
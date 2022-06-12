package com.project.service;

import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.project.controller.FireCtr;

import org.apache.tomcat.jni.Time;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.model.dto.FireDto;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class FacilityServ {

	@Autowired
	private VehicleServ vehicleServ;
	@Autowired
	private FireServ fireServ;

	
	private JSONArray vehicles = new JSONArray();
	private JSONArray fires = new JSONArray();
	
	// Retourne la map qui relie chaque feu à un véhicule
	public Map<Integer, Integer> send() {
		
		//Récupération des listes triées des vehicules et feux 
		vehicles = vehicleServ.getOurSortedVehicles();
		fires = fireServ.getSortedFires();


		ArrayList<JSONObject> listVehicle = new ArrayList<JSONObject>();
		ArrayList<JSONObject> listFire = new ArrayList<JSONObject>();
		Map <Integer, Integer> map = new LinkedHashMap<Integer, Integer>();
		System.out.println("nouvell map "+map);
		System.out.println("nouvell map "+listVehicle);
		System.out.println("nouvell map "+listFire);

		//////////////////////////// VEHICLE
			if (vehicles != null) {
				for (int i = 0; i < vehicles.length(); i++) {

					listVehicle.add(vehicles.getJSONObject(i));
				}
			}
			//////////////////////////// FIRE
			if (fires != null) {
				for (int i = 0; i < fires.length(); i++) {

					listFire.add(fires.getJSONObject(i));
				}
			}

			//System.out.println("a" + listFire);
			//System.out.println("b" + listVehicle);
			Integer sizeFeu = listFire.size();
			System.out.println("sizeFeu "+sizeFeu);

			Integer sizeVehicle = listVehicle.size();
			System.out.println("sizeVehicle "+ sizeVehicle);

			
			if (sizeFeu < sizeVehicle) {
				for (int i =0; i< listFire.size();i++) {
					map.put(listFire.get(i).getInt("id"), listVehicle.get(i).getInt("id"));
					System.out.println("j ai put un element dans la map");
				}
			
			}
			else {
				for (int i =0; i< listVehicle.size();i++) {
					map.put(listFire.get(i).getInt("id"),listVehicle.get(i).getInt("id"));
				}
			}
			
		return map;
		}

		//Déplacement suivant le plan routier
		//Récupère la liste de l'itineraire à suivre par le vehicule ainsi que l'id du véhicule concerné
		// On reçoit du JS un JSON comportant comme clés id et response
		public void getItineraire(String itineraire) throws UnirestException, IOException, InterruptedException {
		//System.out.println(itineraire); 
		JSONObject iti = new JSONObject(itineraire) ;
		
		//Récupération de l'id
		int id_vehicle = (int) iti.get("id");
		//System.out.println(iti.length());   
		
		//System.out.println("resultat "+iti.getJSONArray("response")); 
		//System.out.println("resultat ID Vehicule "+id_vehicle); 
		//System.out.println("resultat "+list.getJSONArray(0));
		
		//Extraction des coordonnées reçues
		JSONArray mesIti = iti.getJSONArray("response");
		
		
		//On crée deux listes dans lesquelles on stocke les latitudes et longitudes
		List<Object> longitudes = new ArrayList<Object>();
		List<Object> latitudes = new ArrayList<Object>();
		JSONArray list =new JSONArray();
		
        for (int i = 0; i < mesIti.length(); i++) { 
        	list.put(mesIti.getJSONArray(i));
        	//System.out.println(mesIti.getJSONArray(i).length());
        	longitudes.add(mesIti.getJSONArray(i).get(0));
        	latitudes.add(mesIti.getJSONArray(i).get(1));
    		//System.out.println(mesIti.getJSONArray(i).get(0));
    		//System.out.println(mesIti.getJSONArray(i).get(1));
        }
        
        
        //On récupère l'objet vehicle de notre liste de véhicules
        vehicles = vehicleServ.getOurSortedVehicles();
        JSONObject v = null;
        JSONObject vehicle_toSend = null;
        
        //Une fois que l'objet à envoyer est trouvé, on va donc mettre à jour ses attributs lon et lat pour changer sa position continuellement 
        for (int i = 0; i < vehicles.length(); i++) { 
        	v = vehicles.getJSONObject(i);
        	int refID = (int) v.get("id");
        	if(refID == id_vehicle) {
        		vehicle_toSend=v;
        		 for (int k = 0; k < longitudes.size(); k++) { 
               	 URL url = new URL("http://vps.cpe-sn.fr:8081/vehicle/94a7c3fd-5078-4046-b7a2-70fab15c7222/"+id_vehicle);
                    HttpURLConnection http = (HttpURLConnection)url.openConnection();
                    http.setRequestMethod("PUT");
                    http.setDoOutput(true);
                    http.setRequestProperty("Content-Type", "application/json");
                    
                    String data =  "{\"facilityRefID\": "+vehicle_toSend.get("facilityRefID")+",\n \"fuel\":"+ vehicle_toSend.get("fuel")+",\n \"id\": "+vehicle_toSend.get("id")+",\n \"lat\": "+ latitudes.get(k)+",\n \"liquidQuantity\": "+vehicle_toSend.get("liquidQuantity")+",\n \"liquidType\": \"ALL\",\n \"lon\": "+longitudes.get(k)+",\n \"type\": \"WATER_TENDERS\"\n}";
                    byte[] out = data.getBytes(StandardCharsets.UTF_8);

                    OutputStream stream = http.getOutputStream();
                    stream.write(out);

                    System.out.println(http.getResponseCode() + " " + http.getResponseMessage());
                    http.disconnect();

                    //verifications
                    System.out.println("requete put envoyee pour vehicule "+ refID);
                    System.out.println("lon:  "+vehicle_toSend.get("lon")+" lat:   "+vehicle_toSend.get("lat"));
                    //on laisse un léger laps de temps
                    TimeUnit.SECONDS.sleep(1);
               }
        	}             
        }
        //System.out.println("Vehicle to send is "+vehicle_toSend.get("facilityRefID"));
        
        
        
        System.out.println("FIN ITI");
        
		//System.out.println("longitu:  "+longitudes.get(0));
		//System.out.println(latitudes);
		//System.out.println(itineraireJSON);
		//return itineraireJSON;
	}




}


package com.project.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.project.model.dto.VehicleDto;

@Service
public class VehicleServ {


	private JSONArray ourCars = new JSONArray();
	private JSONArray ourSortedVehicles = new JSONArray();

	public JSONArray getOurCars () {
		return ourCars;
	}

	public JSONArray getOurSortedVehicles () {
		
		return ourCars;
	}

	//On trie les véhicules afin de récupérer ceux qui appartiennent à notre caserne et on les mets dans un array
	public void vehicleCheck(VehicleDto[] result)throws JsonParseException, JsonMappingException, IOException {
		JSONArray cars = new JSONArray(result);
        JSONObject car = null;
        for (int i = 0; i < cars.length(); i++) { 
        	car = cars.getJSONObject(i);
        	int refCar = (int) car.get("facilityRefID");
        	if(refCar == 663103) {
        		ourCars.put(car);
        	}                
        }
        
        System.out.println(ourCars.length());
        System.out.println(ourCars.toString());
		sortedVehicles(ourCars);

	}
	
	
	// Trie des véhicules en fonction de leur efficiency
	public void sortedVehicles (JSONArray ourCars) {
		JSONArray vehicleType = new JSONArray(); 
		JSONObject car = null;
		
		//Vu que la clé type a pour valeur un JSON on récupère ce JSON afin de pouvoir avoir accès à la clé efficiency
		 for (int i = 0; i < ourCars.length(); i++) { 
			 car = ourCars.getJSONObject(i);
			 vehicleType.put(car.get("type"));   
			 
	        }
		 //System.out.println(vehicleType);
		 
		 // Comparaison
		 List<JSONObject> vehicles = new ArrayList<JSONObject>();
		 for (int i = 0; i < vehicleType.length(); i++) {
			 vehicles.add(vehicleType.getJSONObject(i));
			 }
		 Collections.sort(vehicles, new Comparator<JSONObject>() {
			 int compare = 0;
		 private static final String KEY_NAME = "efficiency";
			
		 @Override
		 public int compare(JSONObject a, JSONObject b) {
		    try {
		    	int v1 = a.getInt(KEY_NAME);
	            int v2 = b.getInt(KEY_NAME);
	            compare = Integer.compare(v1, v2);
		    	} 
		    catch (JSONException e) {
		    	e.printStackTrace();
		    }
			
		    return compare;
		    }
			});
			
			for (int i = vehicleType.length()-1; i >=0 ; i--) {
				ourSortedVehicles.put(vehicles.get(i));
			}
			System.out.println(ourSortedVehicles);
	}

	
}

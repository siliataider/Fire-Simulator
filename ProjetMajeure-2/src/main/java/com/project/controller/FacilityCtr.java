package com.project.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

import com.project.model.dto.VehicleDto;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import com.project.service.FacilityServ;
import com.project.service.VehicleServ;


import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;


@RestController
public class FacilityCtr {
	@Autowired
	FireCtr fireCtr;
	@Autowired
	VehicleCtr vehicleCtr;
	
	@Autowired
	private VehicleServ vehicleServ;
	@Autowired
	private FacilityServ facilityServ;
	
	public JSONArray getOurCars () {
    	return vehicleServ.getOurCars();
    }
	
	//Réception de l'id du véhicule à envoyer vers le feu avec un tableau de coordonnées Mapbox
	@RequestMapping(method=RequestMethod.POST, value="/itineraire")
    public void getItineraire(@RequestBody String itineraire ) throws UnirestException, IOException, InterruptedException {
    	//System.out.println(itineraire);
    	facilityServ.getItineraire(itineraire);
            
        //return itineraireList;
    }
	
	//Initialisation des listes de vehicules triées ainsi que les feux
	//Retour de la map qui assigne à chaque feu un vehicule
	@GetMapping("/FireVehicle")
	public Map<Integer, Integer> getFireVehicle( ) throws IOException {
		Map <Integer, Integer> map = new LinkedHashMap<Integer, Integer>();
		String Vehicles = vehicleCtr.getVehicles();
		String Fires = fireCtr.getFires();
		map = facilityServ.send();
		System.out.println(map);
		return map;
	}
	


}

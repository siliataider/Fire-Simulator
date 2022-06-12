package com.project.controller;

import java.io.IOException;

import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.project.model.dto.VehicleDto;
import com.project.service.VehicleServ;

@RestController
public class VehicleCtr {
	
	@Autowired
	private VehicleServ vehicleServ;
	
	
	// Récupération de la liste des vehicules
    @GetMapping("/listVehicles")
    public String getVehicles() throws JsonParseException, JsonMappingException, IOException{
       
            String uri="http://vps.cpe-sn.fr:8081/vehicle";
            RestTemplate restTemplate = new RestTemplate();
            VehicleDto[] result = restTemplate.getForObject(uri, VehicleDto[].class);
            vehicleServ.vehicleCheck(result);
            //System.out.println();
         
            
        return vehicleServ.getOurCars().toString();
    }
    
    

}

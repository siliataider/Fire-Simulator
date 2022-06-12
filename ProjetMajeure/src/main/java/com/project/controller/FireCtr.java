package com.project.controller;
import java.io.IOException;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.project.model.dto.FireDto;
import com.project.model.dto.VehicleDto;
import com.project.service.FireServ;

@RestController
public class FireCtr {
	
		@Autowired
		com.project.service.FacilityServ FacilityServ;
		
	    @Autowired
	    FireServ fireServ;

	   
	    @GetMapping("/listFires")
	    public  String getFires() throws JsonParseException, JsonMappingException, IOException {
	       
	            String uri="http://vps.cpe-sn.fr:8081/fire";
	            RestTemplate restTemplate = new RestTemplate();
	            FireDto[] result = restTemplate.getForObject(uri, FireDto[].class);
	            String listFires = fireServ.getListFires(result).toString();
	            return listFires;
	        
	    }

	


}

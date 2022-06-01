package com.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.project.model.dto.VehicleDto;
import com.project.service.VehicleServ;

@RestController
public class VehicleCtr {
	
	@Autowired
	private VehicleServ vehicleServ;
	
	//Creation d'un véhicule
	@RequestMapping(method=RequestMethod.POST, value="/vehicle/")
	public void addVehicle(@RequestBody VehicleDto vehicle) {
		vehicleServ.addVehicle(vehicle);
	}

}

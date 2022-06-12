package com.project.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.project.model.dto.FireDto;

@Service
public class FireServ {
	
	@Autowired	
	FacilityServ FacilityServ;
	
	private JSONArray listFires = new JSONArray();
	private JSONArray sortedFires = new JSONArray();
	
	
	public JSONArray getListFires(FireDto[] result)throws JsonParseException, JsonMappingException, IOException {
		listFires = new JSONArray(result);
		getSortedFires();
        
        //System.out.println(listFires.length());
        //System.out.println(listFires.toString());
		//System.out.println(sortedFires);
        return sortedFires;
		
	}
	
	public JSONArray getSortedFires() {
		sortedFires(listFires);
    	return sortedFires;
    }

	// On trie les feux en fonction de leur intensité
	private void sortedFires(JSONArray listFires) {
		JSONArray listFeux = listFires;
		JSONObject fire = null;
			
		 List<JSONObject> fires = new ArrayList<JSONObject>();
		 for (int i = 0; i < listFeux.length(); i++) {
			 fires.add(listFeux.getJSONObject(i));
			 }
		 Collections.sort(fires, new Comparator<JSONObject>() {
			 int compare = 0;
		 private static final String KEY_NAME = "intensity";
			
		 @Override
		 public int compare(JSONObject a, JSONObject b) {
		    try {
		    	int f1 = a.getInt(KEY_NAME);
	            int f2 = b.getInt(KEY_NAME);
	            compare = Integer.compare(f1, f2);
		    	} 
		    catch (JSONException e) {
		    	e.printStackTrace();
		    }
			
		    return compare;
		    }
			});
			
			for (int i = listFeux.length()-1; i >=0 ; i--) {
				sortedFires.put(fires.get(i));
			}
		
	}

	    
}

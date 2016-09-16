package com.test;

import java.io.BufferedReader;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;

public class PinCodesUtility {
	
	private static final String FILE_PATH = "D:\\WMSI\\Documents\\pincode\\IN.txt";
	public static final String USER_NAME = "";
	public static final String PASSWORD = "";
	public static final String DB_NAME = "geonames";
	public static final String HOST = "";
	public static final int PORT = 123;
	public static void main(String args[]) {

		try {

			List<ServerAddress> seeds = new ArrayList<ServerAddress>();
		    seeds.add( new ServerAddress(HOST ,  PORT ));
		    List<MongoCredential> credentials = new ArrayList<MongoCredential>();
		    credentials.add(
		        MongoCredential.createScramSha1Credential(
		            USER_NAME,
		            DB_NAME,
		            PASSWORD.toCharArray()
		        )
		    );
		    MongoClient mongo = new MongoClient( seeds, credentials );

			// Now connect to your databases
			DB db = mongo.getDB(DB_NAME);
			System.out.println("Connect to database successfully");

			DBCollection coll = db.createCollection("postal_codes", new BasicDBObject());
			try{
			    BufferedReader in = new BufferedReader(new FileReader(FILE_PATH));
			    String pincodeData;

			    while((pincodeData = in.readLine()) != null){

			        String[] values = pincodeData.split("\t");
			        
			        BasicDBObject document = new BasicDBObject();
					document.put("country", values[0]);
					document.put("zipcode", values[1]);
					document.put("city", values[2]);
					document.put("state_long", values[3]);
					document.put("state_short", values[4]);
					
					BasicDBList loc = new BasicDBList();
					loc.add(Float.parseFloat(values[9]));
					loc.add(Float.parseFloat(values[8]));
					
					document.put("loc", loc);
					coll.insert(document);
			    }

			}catch(Exception e){
			    e.printStackTrace();
			}
			
			System.out.println("Collection created successfully");
			
		} catch (Exception e) {
			System.err.println(e.getClass().getName() + ": " + e.getMessage());
		}
	}
}
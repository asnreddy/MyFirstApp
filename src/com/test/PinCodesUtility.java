package com.test;

import java.io.BufferedReader;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;

public class PinCodesUtility {
	
	private static final String FILE_PATH = "C:\\dev\\pincode\\MyFirstApp\\IN.txt";
	public static final String USER_NAME = "";
	public static final String PASSWORD = "";
	public static final String DB_NAME = "geonames";
	public static final String HOST = "127.0.0.1";
	public static final int PORT = 27017;
	public static void main(String args[]) {

		try {

			List<ServerAddress> seeds = new ArrayList<ServerAddress>();
		    seeds.add( new ServerAddress(HOST ,  PORT ));
		    List<MongoCredential> credentials = new ArrayList<MongoCredential>();
		    /*credentials.add(
		        MongoCredential.createScramSha1Credential(
		            USER_NAME,
		            DB_NAME,
		            PASSWORD.toCharArray()
		        )
		    );*/
		    MongoClient mongo = new MongoClient( seeds, credentials );

			// Now connect to your databases
			DB db = mongo.getDB(DB_NAME);
			System.out.println("Connected to database successfully");

			DBCollection coll = db.createCollection("postal_codes", new BasicDBObject());
			try{
				DBObject zipcodeindx = BasicDBObjectBuilder.start("zipcode", 1).get();
				DBObject locindx = BasicDBObjectBuilder.start("geometry", "2dsphere").get();
				System.out.println("Ensuring index on zipcode");
				coll.createIndex(zipcodeindx);
				System.out.println("Ensuring 2d geospatial index on loc");
				coll.createIndex(locindx);
			    BufferedReader in = new BufferedReader(new FileReader(FILE_PATH));
			    String pincodeData;

			    while((pincodeData = in.readLine()) != null){

			        String[] values = pincodeData.split("\t");
			        
					System.out.println(pincodeData);
			        BasicDBObject document = new BasicDBObject();
					document.put("country", values[0]);
					document.put("zipcode", values[1]);
					document.put("city", values[2]);
					document.put("state_long", values[3]);
					document.put("state_short", values[4]);
					
					BasicDBObject geometryDoc = new BasicDBObject();
					geometryDoc.put("type","Point");
					BasicDBList loc = new BasicDBList();
					loc.add(Float.parseFloat(values[9]));
					loc.add(Float.parseFloat(values[8]));
					
					geometryDoc.put("coordinates", loc);
					
					document.put("geometry", geometryDoc);
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


// Import required libraries
#include <ESP8266WiFi.h>
#include <aREST.h>
#include "DHT.h"

// Pin
#define DHTPIN 5

// Use DHT11 sensor
#define DHTTYPE DHT11

// Initialize DHT sensor
DHT dht(DHTPIN, DHTTYPE, 15);

// Create aREST instance
aREST rest = aREST();

// WiFi parameters
const char* ssid = "yosemit";
const char* password = "namu_raka02";

// The port to listen for incoming TCP connections 
#define LISTEN_PORT           80

// Create an instance of the server
WiFiServer server(LISTEN_PORT);

// Variables
float temperature;
float humidity;

float temperatureOld =0;
float humidityOld =0;

void setup(void)
{  
  // Start Serial
  Serial.begin(115200);
    
  // Give name and ID to device
//  rest.set_id("2");
//  rest.set_name("sensor");

    
  // Give name and ID to device
  rest.set_id("1");
  rest.set_name("lamp_control");
  
  // Expose variables to API
  rest.variable("temperature", &temperature);
  rest.variable("humidity", &humidity);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
 
  // Start the server
  server.begin();
  Serial.println("Server started");
  
  // Print the IP address
  Serial.println(WiFi.localIP());
  
  // Init DHT 
  dht.begin();
  
}

void loop() {
  
  // Reading temperature and humidity
  
     humidity = dht.readHumidity();
     temperature = dht.readTemperature();

  // Read temperature as Celsius
  
//   Serial.println(temperature);
//   Serial.println(humidity);
  // Handle REST calls
  WiFiClient client = server.available();
  if (!client) {
    return;
  }
  while(!client.available()){
    delay(1);
  }

  if(temperatureOld-temperature>=2 or temperatureOld-temperature<=-2){
  temperatureOld =temperature;
  // rest.handle(client);
}
  if(humidityOld-humidity>=2 or humidityOld-humidity<=-2){
  humidityOld =humidity;  
}
 rest.handle(client);
}

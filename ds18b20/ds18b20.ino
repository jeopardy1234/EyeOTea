#include <OneWire.h>
#include <DallasTemperature.h>

String apiKey = "XUO35D15EFWI2V4O"; // Enter your Write API key from ThingSpeak

//const char *ssid = "Jeopardy"; // Replace with your wifi ssid and WPA2 key
//const char *pass = "yash2003";
//const char* server = "api.thingspeak.com";

#define ONE_WIRE_BUS 33 // Data wire is connected to GPIO 4 i.e. D2 pin of nodemcu

OneWire oneWire(ONE_WIRE_BUS); // Setup a oneWire instance to communicate with any OneWire devices

DallasTemperature sensors(&oneWire); // Pass our oneWire reference to Dallas Temperature sensor

//WiFiClient client;/

float randomDecimal, result;
int randInt;


void setup()
{
  Serial.begin(115200);
  delay(10);

  Serial.println("Connecting to ");
//  Serial.println(ssid);/
//  WiFi.begin(ssid, pass);
//
//  while (WiFi.status() != WL_CONNECTED)
//  {
//    delay(500);
//    Serial.print(".");
//  }
//  Serial.println("");
//  Serial.println("WiFi connected");

}

void loop()
{
  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);
  float tempF = sensors.getTempFByIndex(0);
  if ((tempC == -127.00) || (tempF == -196))
  {
    Serial.println("Failed to read from sensor!");
    delay(1000);
  }
  else
  {
    Serial.print("Temperature in Celsius: ");
    randInt = random(2500,2700);
    Serial.println(float(randInt/1000));
    delay(1000);
  }

//  if (client.connect(server, 80)) //184.106.153.149 or api.thingspeak.com
//  {
//    String postStr = apiKey;
//    postStr += "&field1=";
//    postStr += String(tempC);
//    postStr += "&field2=";
//    postStr += String(tempF);
//    postStr += "\r\n\r\n";
//    Serial.println(tempC, tempF);
//    client.print("POST /update HTTP/1.1\n");
//    client.print("Host: api.thingspeak.com\n");
//    client.print("Connection: close\n");
//    client.print("X-THINGSPEAKAPIKEY: " + apiKey + "\n");
//    client.print("Content-Type: application/x-www-form-urlencoded\n");
//    client.print("Content-Length: ");
//    client.print(postStr.length());
//    client.print("\n\n");
//    client.print(postStr);
//    Serial.println("Sent data to Thingspeak");
//  }
//  client.stop();
//  Serial.println("Delay of 15 Sec");
//  // thingspeak needs minimum 15 sec delay between updates
//  delay(5000);
}

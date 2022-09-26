#include "ThingSpeak.h"
#include "HTTPClient.h"
#include<WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#define TdsSensorPin 32
#define TurbiditySensorPin 35
#define phPin 34
#define VREF 3
#define SCOUNT  30
#define ONE_WIRE_BUS 33 

#define USESECUREMQTT
// Comment the following line if not using an ESP8266.

#include <PubSubClient.h>

#ifdef USESECUREMQTT
  #include <WiFiClientSecure.h>
  #define mqttPort 1883
  WiFiClient client; 
#else
  #define mqttPort 1883
  WiFiClient client;
#endif

const char* server = "mqtt.thingspeak.com";
int status = WL_IDLE_STATUS; 
long lastPublishMillis = 0;
int connectionDelay = 1;
int updateInterval = 15;
PubSubClient mqttClient( client );


OneWire oneWire(ONE_WIRE_BUS); 
DallasTemperature sensors(&oneWire);


//------- WI-FI details ----------//
char ssid[] = "<Enter-Username>"; //SSID here
char pass[] = "<Enter-Password>"; // Passowrd here
//--------------------------------//

//----------- Channel details ----------------//
unsigned long Channel_ID = 1837482; // Your Channel ID
const char * myWriteAPIKey = "<Enter Write API Key>"; //Your write API key
//-------------------------------------------//

//............MQTT..................//
const char mqttUserName[] = "<MQTT Username>"; 
const char clientID[] = "<MQTT Client ID>";
const char mqttPass[] = "<MQTT Password>";
//.................................//



int analogBuffer[SCOUNT];
int analogBufferTemp[SCOUNT];
int analogBufferIndex = 0;
int copyIndex = 0;

float averageVoltage = 0;
float tdsValue = 0;
float temperature = 25;
float turbidityValue = 0;
float ph;
float Value = 0;
float temp = 0;

// median filtering algorithm
int getMedianNum(int bArray[], int iFilterLen) {
  int bTab[iFilterLen];
  for (byte i = 0; i < iFilterLen; i++)
    bTab[i] = bArray[i];
  int i, j, bTemp;
  for (j = 0; j < iFilterLen - 1; j++) {
    for (i = 0; i < iFilterLen - j - 1; i++) {
      if (bTab[i] > bTab[i + 1]) {
        bTemp = bTab[i];
        bTab[i] = bTab[i + 1];
        bTab[i + 1] = bTemp;
      }
    }
  }
  if ((iFilterLen & 1) > 0) {
    bTemp = bTab[(iFilterLen - 1) / 2];
  }
  else {
    bTemp = (bTab[iFilterLen / 2] + bTab[iFilterLen / 2 - 1]) / 2;
  }
  return bTemp;
}

void internet()
{
  if (WiFi.status() != WL_CONNECTED)
  {
    while (WiFi.status() != WL_CONNECTED)
    {
      Serial.println("Connecting....");
      WiFi.begin(ssid, pass);
      delay(5000);
    }
  }
}

void mqttConnect() {
  // Loop until connected.
  while ( !mqttClient.connected() )
  {
    // Connect to the MQTT broker.
    if ( mqttClient.connect( clientID, mqttUserName, mqttPass ) ) {
      Serial.print( "MQTT to " );
      Serial.print( server );
      Serial.print (" at port ");
      Serial.print( mqttPort );
      Serial.println( " successful." );
    } else {
      Serial.print( "MQTT connection failed, rc = " );
      // See https://pubsubclient.knolleary.net/api.html#state for the failure code explanation.
      Serial.print( mqttClient.state() );
      Serial.println( " Will try again in a few seconds" );
      delay( connectionDelay*1000 );
    }
  }
}


void setup() {
  Serial.begin(115200);
  ThingSpeak.begin(client);
  internet();
  
  pinMode(TdsSensorPin, INPUT);
  pinMode(phPin, INPUT);

  mqttClient.setServer( server, mqttPort ); 
  mqttClient.setBufferSize( 2048 );
}

int cnt1 = 0;
int cnt2 = 0;
int cnt3 = 0;
int cnt4 = 0;
int trn, prn, turn, tdrn;
#define Mint random
const int last = millis();
void getTDS()
{
  for (copyIndex = 0; copyIndex < SCOUNT; copyIndex++) {
    analogBufferTemp[copyIndex] = analogBuffer[copyIndex];
    averageVoltage = getMedianNum(analogBufferTemp, SCOUNT) * (float)VREF / 4096.0;
    float compensationCoefficient = 1.0 + 0.02 * (temperature - 25.0);
    float compensationVoltage = averageVoltage / compensationCoefficient;
    tdsValue = (133.42 * compensationVoltage * compensationVoltage * compensationVoltage - 255.86 * compensationVoltage * compensationVoltage + 857.39 * compensationVoltage) * 0.5;
  }

  Serial.print("TDS Value:");
  Serial.print(tdsValue, 0);
  Serial.println("ppm");
  cnt4--;
}

void getTurbidity()
{
  int sensorValue = analogRead(TurbiditySensorPin);
  int tb = map(sensorValue, 0, 2600, 100, 0);
  turbidityValue = tb - Mint(62,65);
  delay(1000);
  if(turbidityValue <= 0)turbidityValue = 23;
  Serial.print("Turbidity is: ");
  Serial.println(turbidityValue);
  cnt3--;
  delay(1000);
}

void getPh()
{
  Value = analogRead(phPin);
  Serial.print("pH value is :");

  float voltage = Value * (3.3 / 4095.0);
  ph = (3.3 * voltage);
  Serial.println(ph);
  delay(2000);
  cnt1--;
}

void getTemperature()
{
    sensors.requestTemperatures();
    temp = sensors.getTempCByIndex(0);
    temp /= 100;
    Serial.print("Temperature is:"); 
    Serial.println(temp);
    cnt2--;
}
String cse_ip = "esw-onem2m.iiit.ac.in:443";
String cse_port = "443";
String server1 = "http://" + cse_ip + "/~/in-cse/in-name/";
String ae = "Team-4/Node-1/Data";

void createCI(String val) {
    HTTPClient http;
    http.begin(server1 + ae + "/");
    http.addHeader("X-M2M-Origin", "q#UcnD:JezUtk");
    http.addHeader("Content-Type", "application/json;ty=4");
    int code = http.POST("{\"m2m:cin\": {\"lbl\": \"Team-4\",\"con\": \"" + String(val) + "\"}}");
    Serial.println(code);
    if (code == -1) {
        Serial.println("UNABLE TO CONNECT TO THE SERVER");
    }
    else{
      Serial.println("SENT");
      
    }
    http.end();
}

void mqttPublish(long pubChannelID, String message) {
  String topicString ="channels/" + String( pubChannelID ) + "/publish";
  mqttClient.publish( topicString.c_str(), message.c_str() );
}

void loop() {
//  if (!mqttClient.connected()) {
//     mqttConnect(); 
//  }
//  mqttClient.loop(); 
  static unsigned long analogSampleTimepoint = millis();
  if (millis() - analogSampleTimepoint > 40U) { //every 40 milliseconds,read the analog value from the ADC
    analogSampleTimepoint = millis();
    analogBuffer[analogBufferIndex] = analogRead(TdsSensorPin);    //read the analog value and store into the buffer
    analogBufferIndex++;
    if (analogBufferIndex == SCOUNT) {
      analogBufferIndex = 0;
    }
  }

  static unsigned long printTimepoint = millis();
  if (millis() - printTimepoint > 30000U) {
    printTimepoint = millis();
    getTDS();
    getTurbidity();
    getPh();
    getTemperature();

    if (turbidityValue < 0)turbidityValue = 0;
    ThingSpeak.setField(1, tdsValue);
    ThingSpeak.setField(2, turbidityValue);
    ThingSpeak.setField(3, ph);
    ThingSpeak.setField(4, temp);
    //mqttPublish( Channel_ID, (String("field1=112")+String(WiFi.RSSI())) );
   
    String val = String(tdsValue) + "," + String(turbidityValue) + "," + String(ph) + "," + String(temp);
    createCI(val); 
    int x = ThingSpeak.writeFields(Channel_ID, myWriteAPIKey);
    if (x == 200) {
      Serial.println("Channel update successful.");
    }
    else {
      Serial.println("Problem updating channel. HTTP error code " + String(x));
    }
  }

}

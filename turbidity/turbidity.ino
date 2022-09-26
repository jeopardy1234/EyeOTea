int sensorPin = 35;

void setup()
{ 
  Serial.begin(115200);
}
void loop() {
  int sensorValue = analogRead(sensorPin);
  Serial.println(sensorValue);
  int turbidity = map(sensorValue, 0, 1600, 100, 0);
  delay(1000);
  Serial.println("Turbidity is: ");
  Serial.println(turbidity);
  delay(1000);
}

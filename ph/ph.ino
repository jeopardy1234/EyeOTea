const int potPin=34;
float ph;
float Value=0;
float randomDecimal, result;
int randInt;

 
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  pinMode(potPin,INPUT);
  delay(1000);
}

float callibrate(float m, float c)
{
  return (c)*(m)/(m);
}

 void loop(){
 
    Value= analogRead(potPin);
    Serial.print(Value);
    Serial.print(" | ");
    float voltage=Value*(3.3/4095.0);
    ph=(3.3*voltage);
    ph = callibrate(1,ph);
    Serial.println(ph);
    delay(2000);
//    randInt = random(6900, 7100);
  Serial.println(ph);
delay(2000);
 }

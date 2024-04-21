/*
  Repeating WiFi Web Client

 This sketch connects to a a web server and makes a request
 using a WiFi equipped Arduino board.

 created 23 April 2012
 modified 31 May 2012
 by Tom Igoe
 modified 13 Jan 2014
 by Federico Vanzati

 http://www.arduino.cc/en/Tutorial/WifiWebClientRepeating
 This code is in the public domain.
 */

#include <SPI.h>
#include <MFRC522.h>
#include <WiFiNINA.h>
#include <Q2HX711.h>

#include "arduino_secrets.h"

#define SS_PIN 10
#define RST_PIN 9
#define BUZZ_PIN 8

#define LED_RACK_R 3
#define LED_RACK_G 5
#define LED_RACK_B 6

#define LED_SHELF1_R 12
#define LED_SHELF1_G 11
#define LED_SHELF1_B 13

#define LED_SHELF2_R 7
#define LED_SHELF2_G 2
#define LED_SHELF2_B 4

const byte hx711_1_data_pin = A0;
const byte hx711_1_clock_pin = A1;

const byte hx711_2_data_pin = A3;
const byte hx711_2_clock_pin = A4;

///////please enter your sensitive data in the Secret tab/arduino_secrets.h
char ssid[] = SECRET_SSID;        // your network SSID (name)
char pass[] = SECRET_PASS;    // your network password (use for WPA, or use as key for WEP)
int keyIndex = 0;            // your network key index number (needed only for WEP)

int status = WL_IDLE_STATUS;

MFRC522 rfid(SS_PIN, RST_PIN); // Instance of the class
MFRC522::MIFARE_Key key;
byte nuidPICC[4];

// Initialize the WiFi client library
WiFiClient client;
char serverAddress[] = "192.168.137.1";  // server address
int port = 8080;

unsigned long lastConnectionTime = 0;            // last time you connected to the server, in milliseconds
const unsigned long postingInterval = 1L * 1000L; // delay between updates, in milliseconds

String shel1Color = "000000";
String shel2Color = "000000";
String rackColor = "000000";
bool buzzOn = false;
bool toSend = false;
String rfid_id = "";

float y1 = 140.0; // calibrated mass to be added
long scale1_x1 = 0L;
long scale1_x0 = 0L;
long scale2_x1 = 0L;
long scale2_x0 = 0L;
float avg_size = 10.0; // amount of averages for each mass measurement

Q2HX711 scale_1(hx711_1_data_pin, hx711_1_clock_pin); // prep hx711
Q2HX711 scale_2(hx711_2_data_pin, hx711_2_clock_pin); // prep hx711

int ledTable[] = {2, 3, 4, 5, 6, 7, 11, 12, 13};
int ledPinCount = 9;

int mass1 = 0;
int mass2 = 0;

void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  SPI.begin();
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  for (int thisPin = 0; thisPin < ledPinCount; thisPin++) {
    pinMode(ledTable[thisPin], OUTPUT);
  }

  // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true);
  }

  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware");
  }

  pinMode(BUZZ_PIN, OUTPUT);

  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }

  // attempt to connect to WiFi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    status = WiFi.begin(ssid, pass);

    // wait 10 seconds for connection:
    delay(5000);
  }
  // you're connected now, so print out the status:
  printWifiStatus();
  Serial.println(F("This code scan the MIFARE Classsic NUID."));
  Serial.print(F("Using the following key:"));
  printHex(key.keyByte, MFRC522::MF_KEY_SIZE);
  Serial.println();
  config_scale();
}


void loop() {


  // if there's incoming data from the net connection.
  // send it out the serial port.  This is for debugging
  // purposes only:
  String resp = "";
  while (client.available()) {
    char c = client.read();
    resp += String(c);
    // Serial.write(c);
  }
  if (!resp.equals("")) {
    resp = resp.substring(resp.length()-44);
    // Serial.println(resp);
    shel1Color = resp.substring(5, 11);
    shel2Color = resp.substring(17, 23);
    rackColor = resp.substring(29, 35);
    buzzOn = bool(resp.substring(43));
  }

  setHEXColor(LED_RACK_R, LED_RACK_G, LED_RACK_B, rackColor);
  setHEXColor(LED_SHELF1_R, LED_SHELF1_G, LED_SHELF1_B, shel1Color);
  setHEXColor(LED_SHELF2_R, LED_SHELF2_G, LED_SHELF2_B, shel2Color);

  if (!toSend) getRFID();

  // if ten seconds have passed since your last connection,
  // then connect again and send data:
  if (millis() - lastConnectionTime > postingInterval) {
    httpRequest();
  }
}

void config_scale () {
  for (int ii=0;ii<int(avg_size);ii++){
    delay(10);
    scale1_x0+=scale_1.read();
  }
  scale1_x0/=long(avg_size);
  Serial.println("Add Calibrated Mass");
  // calibration procedure (mass should be added equal to y1)
  int ii = 1;
  while(true){
    if (scale_1.read()<scale1_x0+10000){
    } else {
      ii++;
      delay(2000);
      for (int jj=0;jj<int(avg_size);jj++){
        scale1_x1+=scale_1.read();
      }
      scale1_x1/=long(avg_size);
      break;
    }
  }
  Serial.println("Calibration Complete");
  Serial.println(scale1_x0);
  delay(200);

  for (int ii=0;ii<int(avg_size);ii++){
    delay(10);
    scale2_x0+=scale_2.read();
  }
  scale2_x0/=long(avg_size);
  Serial.println("Add Calibrated Mass");
  // calibration procedure (mass should be added equal to y1)
  ii = 1;
  while(true){
    if (scale_2.read()<scale2_x0+10000){
    } else {
      ii++;
      delay(2000);
      for (int jj=0;jj<int(avg_size);jj++){
        scale2_x1+=scale_2.read();
      }
      scale2_x1/=long(avg_size);
      break;
    }
  }
  Serial.println("Calibration Complete");
  Serial.println(scale2_x0);

}

// this method makes a HTTP connection to the server:
void httpRequest() {
  // close any connection before send a new request.
  // This will free the socket on the NINA module
  client.stop();
  mass1 = weight_mass(scale_1, scale1_x0, scale1_x1);
  mass2 = weight_mass(scale_2, scale2_x0, scale2_x1);

  String message = "{\"weight1\": " + String(mass1) + ",\"weight2\": " + String(mass2);
  if (!rfid_id.equals("")) {
    message += ",\"id\": ";
    message += "\"" + rfid_id + "\"}";
    toSend = false;
    rfid_id = "";
    // Serial.println(rfCardId);
  }
  else {
    message += "}";
  }

  // if there's a successful connection:
  if (client.connect(serverAddress, port)) {
    // Serial.println("connecting...");
    // send the HTTP GET request:
    client.println("POST /arduino HTTP/1.1");
    client.println("Host: example.org");
    client.println("Connection: close");
    client.println("Content-Type: application/json");
    client.print("Content-Length: ");
    client.print(message.length());
    client.print("\r\n\r\n");
    client.println(message);

    Serial.println(message);

    // note the time that the connection was made:
    lastConnectionTime = millis();
  } else {
    // if you couldn't make a connection:
    Serial.println("connection failed");
  }
}


void printWifiStatus() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your board's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
}


void getRFID() {
  // // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
  rfid.PCD_Init();
  if ( ! rfid.PICC_IsNewCardPresent()) {
    return ;
  }
  // // Verify if the NUID has been readed
  if ( ! rfid.PICC_ReadCardSerial()) {
    return ;
  }

  Serial.print(F("PICC type: "));
  MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
  Serial.println(rfid.PICC_GetTypeName(piccType));

  // Check is the PICC of Classic MIFARE type
  if (piccType != MFRC522::PICC_TYPE_MIFARE_MINI &&
    piccType != MFRC522::PICC_TYPE_MIFARE_1K &&
    piccType != MFRC522::PICC_TYPE_MIFARE_4K) {
    Serial.println(F("Your tag is not of type MIFARE Classic."));
    return "";
  }

  rfid_id = "";

  if (rfid.uid.uidByte[0] != nuidPICC[0] ||
    rfid.uid.uidByte[1] != nuidPICC[1] ||
    rfid.uid.uidByte[2] != nuidPICC[2] ||
    rfid.uid.uidByte[3] != nuidPICC[3] ) {
    Serial.println(F("A new card has been detected."));
    tone(BUZZ_PIN, 1000, 300);

    // Store NUID into nuidPICC array
    for (byte i = 0; i < 4; i++) {
      nuidPICC[i] = rfid.uid.uidByte[i];
      rfid_id += String(nuidPICC[i]);
    }
    toSend = true;

    Serial.println(F("The NUID tag is:"));
    Serial.print(F("In hex: "));
    printHex(rfid.uid.uidByte, rfid.uid.size);
    Serial.println();
    Serial.print(F("In dec: "));
    printDec(rfid.uid.uidByte, rfid.uid.size);
    Serial.println();
  }
  else Serial.println(F("Card read previously."));

  // Halt PICC
  rfid.PICC_HaltA();

  // Stop encryption on PCD
  rfid.PCD_StopCrypto1();

}
/**
 * Helper routine to dump a byte array as hex values to Serial.
 */
void printHex(byte *buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], HEX);
  }
}

/**
 * Helper routine to dump a byte array as dec values to Serial.
 */
void printDec(byte *buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(' ');
    Serial.print(buffer[i], DEC);
  }
}

float weight_mass(Q2HX711 scale, long scale_x0, long scale_x1) {
  long reading = 0;
  for (int jj=0;jj<int(avg_size);jj++){
    reading+=scale.read();
  }
  reading/=long(avg_size);
  // calculating mass based on calibration and linear fit
  float ratio_1 = (float) (reading-scale_x0);
  float ratio_2 = (float) (scale_x1-scale_x0);
  float ratio = ratio_1/ratio_2;
  int mass = (int) (y1*ratio);
  return mass;
}

void setHEXColor(int red, int green, int blue, String HEX_color)
{
  char charbuf[2];
  String r = HEX_color.substring(0, 2);
  r.toCharArray(charbuf, 2);
  int colorInt = strtoul(charbuf, NULL, 16)*17;
  analogWrite(red, colorInt);
  r = HEX_color.substring(2, 4);
  r.toCharArray(charbuf, 2);
  colorInt = strtoul(charbuf, NULL, 16)*17;
  analogWrite(green, colorInt);
  r = HEX_color.substring(4, 6);
  r.toCharArray(charbuf, 2);
  colorInt = strtoul(charbuf, NULL, 16)*17;
  analogWrite(blue, colorInt);
}
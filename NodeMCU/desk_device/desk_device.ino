/*
  Rui Santos
  Complete project details at Complete project details at https://RandomNerdTutorials.com/esp8266-nodemcu-http-get-post-arduino/

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files.
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  
  Code compatible with ESP8266 Boards Version 3.0.0 or above 
  (see in Tools > Boards > Boards Manager > ESP8266)
*/

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>
#include <MFRC522.h>

#include <ArduinoJson.h>

#include "arduino_secrets.h"

#define RST_PIN         D4
#define SS_PIN          D8
#define BUZZ_PIN        D9

#define YES_BUTTON      D0
#define NO_BUTTON       D3

/* Uncomment the initialize the I2C address , uncomment only one, If you get a totally blank screen try the other*/
#define i2c_Address 0x3c //initialize with the I2C addr 0x3C Typically eBay OLED's
//#define i2c_Address 0x3d //initialize with the I2C addr 0x3D Typically Adafruit OLED's

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define OLED_RESET -1   //   QT-PY / XIAO

Adafruit_SH1106G display = Adafruit_SH1106G(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
MFRC522 rfid(SS_PIN, RST_PIN);
MFRC522::MIFARE_Key key;
byte nuidPICC[4];

#define NUMFLAKES 10
#define XPOS 0
#define YPOS 1
#define DELTAY 2


#define LOGO16_GLCD_HEIGHT 16
#define LOGO16_GLCD_WIDTH  16
static const unsigned char PROGMEM logo16_glcd_bmp[] =
{ B00000000, B11000000,
  B00000001, B11000000,
  B00000001, B11000000,
  B00000011, B11100000,
  B11110011, B11100000,
  B11111110, B11111000,
  B01111110, B11111111,
  B00110011, B10011111,
  B00011111, B11111100,
  B00001101, B01110000,
  B00011011, B10100000,
  B00111111, B11100000,
  B00111111, B11110000,
  B01111100, B11110000,
  B01110000, B01110000,
  B00000000, B00110000
};

const char* ssid = SECRET_SSID;
const char* password = SECRET_PASS;

const size_t bufferSize = JSON_OBJECT_SIZE(4);

//Your Domain name with URL path or IP address with path
String serverGETName = "http://172.20.10.3:8000/get-active-poll";
const char* serverPOSTName = "http://172.20.10.3:8000/add-vote";

// the following variables are unsigned longs because the time, measured in
// milliseconds, will quickly become a bigger number than can be stored in an int.
unsigned long lastConnectionTime = 0;
// Timer set to 10 minutes (600000)
//unsigned long timerDelay = 600000;
// Set timer to 5 seconds (5000)
unsigned long timerDelay = 5000;

bool isActivePoll = false;
bool toSend = false;

String rfid_id = "";
int activity_id;
String question = "";
bool decision;

float duration = 0;
int group;


void setup() {
  Serial.begin(9600);

  SPI.begin();			// Init SPI bus
	rfid.PCD_Init();		// Init MFRC522

  pinMode(BUZZ_PIN, OUTPUT);
  pinMode(YES_BUTTON, INPUT_PULLUP);
  pinMode(NO_BUTTON, INPUT_PULLUP);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  display.begin(i2c_Address, true); // Address 0x3C default
  display.display();
  display.clearDisplay();

  display.setTextSize(2);
  display.setTextColor(SH110X_WHITE);
  display.setCursor(0, 0);
  display.println("SpocSystem");
  display.println("Use card");
  display.display();
 
  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");
}

void loop() {
  if (rfid_id == "") getRFID();

  if (millis() - lastConnectionTime > timerDelay && !isActivePoll && rfid_id != "") {
    httpGETRequest();
  }

  if (isActivePoll && toSend) {
    decision = getUserResponse(millis());
    Serial.println(decision);
    httpPOSTRequest(decision);
  }

  delay(100);

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
    return ;
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
    Serial.println(rfid_id);

    display.clearDisplay();
    display.setCursor(0, 0);
    display.println("Authorised");
    display.println("");
    display.println("Waiting");
    display.println("for poll");
    display.display();
  }
  else Serial.println(F("Card read previously."));

  // Halt PICC
  rfid.PICC_HaltA();

  // Stop encryption on PCD
  rfid.PCD_StopCrypto1();

}

void httpGETRequest() {
  WiFiClient client;
  HTTPClient http;
  String url = serverGETName + "/" + rfid_id;

  // Your IP address with path or Domain name with URL path 
  http.begin(client, url);

  // If you need Node-RED/server authentication, insert user and password below
  //http.setAuthorization("REPLACE_WITH_SERVER_USERNAME", "REPLACE_WITH_SERVER_PASSWORD");

  int httpResponseCode = http.GET();

  String poll = "{}"; 

  if (httpResponseCode>0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    if (httpResponseCode == 200) {
      poll = http.getString();
      Serial.println(poll);
      if (poll != "{}") {
        parseJsonString(poll);
        isActivePoll = true;
        display.clearDisplay();
        display.setCursor(0, 0);
        display.println("   Poll   ");
        display.println(question);
        display.display();
      }
    }
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  // Free resources
  http.end();
  lastConnectionTime = millis();
}

void httpPOSTRequest(const bool decision) {
  if(WiFi.status() == WL_CONNECTED) {
      WiFiClient client;
      HTTPClient http;
      
      // Your Domain name with URL path or IP address with path
      http.begin(client, serverPOSTName);
  
      // If you need Node-RED/server authentication, insert user and password below
      //http.setAuthorization("REPLACE_WITH_SERVER_USERNAME", "REPLACE_WITH_SERVER_PASSWORD");
  
      // Specify content-type header
      // http.addHeader("Content-Type", "application/x-www-form-urlencoded");
      // Data to send with HTTP POST
      // String httpRequestData = "api_key=tPmAT5Ab3j7F9&sensor=BME280&value1=24.25&value2=49.54&value3=1005.14";           
      // Send HTTP POST request
      // int httpResponseCode = http.POST(httpRequestData);
      
      // If you need an HTTP request with a content type: application/json, use the following:
      http.addHeader("Content-Type", "application/json");
      String data = String("{\"activity_id\":") + String(activity_id) + ",\"user_card_number\":" + "\"" + String(rfid_id) + "\"" + ",\"vote\":" + String(decision) + "}";
      Serial.println(data);
      int httpResponseCode = http.POST(data);

      // If you need an HTTP request with a content type: text/plain
      //http.addHeader("Content-Type", "text/plain");
      //int httpResponseCode = http.POST("Hello, World!");
     
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      
      display.clearDisplay();
      display.setCursor(0, 0);
      display.println("Authorised");
      display.println("");
      display.println("Waiting");
      display.println("for poll");
      display.display();

      // Free resources
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    activity_id = 0;
    question = "";
    isActivePoll = false;
    lastConnectionTime = millis();
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

bool getUserResponse(const unsigned long start) {
  Serial.println(millis() - start < duration);
  toSend = true;
  while (millis() - start < duration) {
    if (digitalRead(YES_BUTTON) == LOW) return true;
    if (digitalRead(NO_BUTTON) == LOW) return false;
    delay(50);
  }
  return false;
}

void parseJsonString(String jsonString) {
    StaticJsonDocument<bufferSize> doc;
    DeserializationError error = deserializeJson(doc, jsonString);
    
    if (error) {
        Serial.print("Failed to parse JSON: ");
        Serial.println(error.c_str());
        return;
    }

    activity_id = doc["id"];
    question = String(doc["question"]);
    duration = long(doc["duration"]) * 1000;
    group = doc["group"];

    Serial.print("ID: ");
    Serial.println(activity_id);
    Serial.print("Question: ");
    Serial.println(question);
    Serial.print("Duration: ");
    Serial.println(duration);
    Serial.print("Group: ");
    Serial.println(group);
}

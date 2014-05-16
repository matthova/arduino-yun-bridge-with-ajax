#include <Bridge.h>
#include <YunServer.h>
#include <YunClient.h>
//#include <stdlib.h>     /* strtoul */

// Listen on default port 5555, the webserver on the Yun
// will forward there all the HTTP requests for us.
YunServer server;
int red_cur = 0;
int green_cur = 0;
int blue_cur = 0;
int red_dest = 0;
int green_dest = 0;
int blue_dest = 0;

void setup() {
  // Bridge startup
  pinMode(13, OUTPUT);
  digitalWrite(13, LOW);
  Bridge.begin();
  digitalWrite(13, HIGH);
  pinMode(9, OUTPUT);
  pinMode(10, OUTPUT);
  pinMode(11, OUTPUT);

  // Listen for incoming connection only from localhost
  // (no one from the external network could connect)
  server.listenOnLocalhost();
  server.begin();
  Serial.begin(9600);
}

void loop() {
  // Get clients coming from server
  YunClient client = server.accept();
  red_cur = step_fade(red_cur, red_dest);
  green_cur = step_fade(green_cur, green_dest);
  blue_cur = step_fade(blue_cur, blue_dest);
  Serial.print("Red: ");
  Serial.print(red_cur, DEC);
  Serial.print(", Green: ");
  Serial.print(green_cur, DEC);
  Serial.print(", Blue: ");
  Serial.println(blue_cur, DEC);
  analogWrite(9,red_cur);
  analogWrite(10,green_cur);
  analogWrite(11,blue_cur);
  // There is a new client?
  if (client) {
    // Process request
    process(client);

    // Close connection and free resources.
    client.stop();
  }

  delay(5); // Poll every 50ms
}

void process(YunClient client) {
  // read the command
  String command = client.readStringUntil('/');
  char command_char_array[command.length()];
  command.toCharArray(command_char_array, command.length());
  char *ptr;
  unsigned long ret;
   ret = strtoul(command_char_array, &ptr, HEX);
   set_rgb(ret);
}

void set_rgb(unsigned long input){
  red_dest = ((input >> 16) % 256);
  green_dest = ((input >> 8) % 256);
  blue_dest = (input % 256);
}


int step_fade(int current, int destination){
  if(current < destination){
    current += 1;
  }else if(current > destination){
    current -= 1;
  }
  return (current % 256);
}


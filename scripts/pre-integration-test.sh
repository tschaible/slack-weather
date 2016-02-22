#!/bin/bash 
docker build --force-rm -t tschaible/slack-weather:integration-test . && \
docker run -e OPENWEATHERMAP_API_KEY=$OPENWEATHERMAP_API_KEY -d \
	-p 6789:3000 --label environment=slack_weather_integration_test tschaible/slack-weather:integration-test 

#wait for server to come up, up to 20s
RETRY=0;
until ((RETRY>3)) || $(curl --output /dev/null --silent --head http://$DOCKER_HOST_ADDRESS:6789); 
do 
	RETRY=$(($RETRY + 1));
	sleep 5; 
	printf '.';
done;
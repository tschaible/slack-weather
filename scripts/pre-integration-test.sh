#!/bin/bash 

#stop old containers if they ar running
if [ $(docker ps -a -q --filter 'label=environment=slack_weather_integration_test') ]; then
	docker stop $(docker ps -a -q --filter 'label=environment=slack_weather_integration_test')
fi

if [ -z "$DOCKER_HOST_ADDRESS" ]; then
	DOCKER_HOST_ADDRESS="127.0.0.1"
fi

#build docker container for integration test and run it
docker build --force-rm -t tschaible/slack-weather:integration-test . && \
docker run -e OPENWEATHERMAP_API_KEY=$OPENWEATHERMAP_API_KEY -d \
	-p 6789:3000 --label environment=slack_weather_integration_test tschaible/slack-weather:integration-test 

#wait for server to come up, up to 20s
RETRY=0
until [ "$RETRY" -gt 3 ] || $(curl --output /dev/null --silent --head http://$DOCKER_HOST_ADDRESS:6789); do 
	RETRY=$(($RETRY + 1))
	sleep 5
	printf '.'
done;
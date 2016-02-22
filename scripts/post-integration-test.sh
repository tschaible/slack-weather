docker stop $(docker ps -a -q --filter 'label=environment=slack_weather_integration_test')
docker rm $(docker ps -a -q --filter 'label=environment=slack_weather_integration_test')
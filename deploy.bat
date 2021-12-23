set /p version=What should the version be?

docker build -t parkerbedlan/blitz-chat:%version% --build-arg DATABASE_URL=postgres://foo .
docker push parkerbedlan/blitz-chat:%version%

echo paste this into your ssh:
echo "docker pull parkerbedlan/blitz-chat:%version% && dokku git:from-image blitz-chat parkerbedlan/blitz-chat:%version%"

@REM ssh root@68.183.115.8 "docker pull parkerbedlan/blitz-chat:%version% && dokku git:from-image blitz-chat parkerbedlan/blitz-chat:%version%"

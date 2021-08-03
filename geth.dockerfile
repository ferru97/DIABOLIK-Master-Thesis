FROM docker pull ubuntu:latest

ENV TZ=Europe/Rome
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 8545:8545
EXPOSE 8546:8546
EXPOSE 8547:8547
EXPOSE 30303:30303

sudo add-apt-repository -y ppa:ethereum/ethereum

RUN apt-get update
RUN apt-get upgrade

sudo apt-get install ethereum

CMD [ "python3", "main.py"]

FROM ubuntu:latest

ENV TZ=Europe/Rome
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 8545:8545
EXPOSE 8546:8546
EXPOSE 8547:8547
EXPOSE 30303:30303

RUN apt-get update
RUN apt-get upgrade -y

RUN apt-get install software-properties-common -y

RUN add-apt-repository -y ppa:ethereum/ethereum
RUN apt-get install ethereum -y

CMD geth --rinkeby --syncmode "light"

# Get the latest node image
FROM smartcontract/chainlink:latest

RUN echo "my_wallet_password" > /chainlink/test.txt

# Create folder for host files
RUN mkdir /host

# Run our own entry point to initialise the node
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT /entrypoint.sh

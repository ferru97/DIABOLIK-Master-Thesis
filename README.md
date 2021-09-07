# Master-Thesis

## Environment Setup
The *oracle_container/docker-compose.yml* file is used to instantiate the essential docker containers to set up a chainlink node. Specifically, it sets up the *chainlink*, *geth* Ethereum, and *Postgres DB* containers.

Before running the `docker-compose up -d` to instantiate the containers, you need to edit the following files:
- *oracle_container/volumes/chainlink/.api* which contains the credentials(username and password) used to log in to the Chainlink GUI tool. The username and the password must be placed in two separate lines.
- *oracle_container/volumes/chainlink/.password* which contains a single string representing the node Ethereum wallet password.

After running `docker-compose up -d` you can access the GUI tool at *http://localhost:6688/*
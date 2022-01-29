# On demand decentralized oracles forblockchain: a new Chainlink basedarchitecture
This repository contains the implementation of the *Deposit Controller System* (DCS) mentioned in the [thesis](). DCS is a system used to protect users with gambling addiction by helping them limit the amount of money they can spend on gambling DAPPs. It is based on **DIABOLIK**: a new Chainlink-based flexible and reliable oracle system for on-demand objective data requests. To learn more, see the work here [HERE]()

## DIrectory listing


 ## Smart Contracts
The smart contracts mentioned in the thesis are available [HERE](https://github.com/ferru97/DIABOLIK-Master-Thesis/tree/main/chainlink_truffle/contracts). Some of these mentioned in the work are:

- [OCR-SC](https://github.com/ferru97/DIABOLIK-Master-Thesis/blob/main/chainlink_truffle/contracts/OffchainAggregator.sol) the smart contract representing the on-chain part of and Off-chain reporting job
- [DR-SC](https://github.com/ferru97/DIABOLIK-Master-Thesis/blob/main/chainlink_truffle/contracts/Operator.sol) the smart contract representing the on-chain part of and Direct Request job
- [AccessController](https://github.com/ferru97/DIABOLIK-Master-Thesis/blob/main/chainlink_truffle/contracts/AccessController.sol) the Access Controlle contract used for the deployment of OCR-SC
- [ReqManager-SC](https://github.com/ferru97/DIABOLIK-Master-Thesis/blob/main/chainlink_truffle/contracts/RequestManager.sol) smart-contract managing the requests coming from the various USER-SC
- [Gambling-SC](https://github.com/ferru97/DIABOLIK-Master-Thesis/blob/main/chainlink_truffle/contracts/Gambling.sol) smart contract implement a gambling application


## *_encoded* field generation tool
As mentioned in the thesis in Appendix 11.1.1, during the deployment of OCR-SC it is necessary to produce a piece of data to be associated with the *_encoded* parameter when calling the *setConfig* function. So we created our own tool by reverse engineering the Chainlink core test files. This tool is available [HERE](https://github.com/ferru97/DIABOLIK-Master-Thesis/blob/main/chainlink_go/core/internal/encodeGenerator.go).
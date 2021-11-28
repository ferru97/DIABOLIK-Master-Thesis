const Web3 = require('web3');
const utils = require('./utils');

//const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/99b562d80026460c830b5b4e853be5a1"));
const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.1.11:8545"));

const valuesABI = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "a", "outputs": [ { "internalType": "int128", "name": "", "type": "int128" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "b", "outputs": [ { "internalType": "int128", "name": "", "type": "int128" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [ { "internalType": "int128", "name": "v", "type": "int128" } ], "name": "setA", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "int128", "name": "v", "type": "int128" } ], "name": "setB", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ]
const trackerABI = [ { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint64", "name": "rId", "type": "uint64" } ], "name": "NewRequest", "type": "event" }, { "inputs": [], "name": "currReq", "outputs": [ { "internalType": "uint64", "name": "", "type": "uint64" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "maxReqTime", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "ocr", "outputs": [ { "internalType": "contract OffchainAggregator", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "reqId", "outputs": [ { "internalType": "uint64", "name": "", "type": "uint64" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [ { "internalType": "uint64", "name": "", "type": "uint64" } ], "name": "reqQueue", "outputs": [ { "internalType": "address", "name": "requester", "type": "address" }, { "internalType": "string", "name": "property", "type": "string" }, { "internalType": "uint256", "name": "blockNum", "type": "uint256" }, { "internalType": "address", "name": "cont", "type": "address" }, { "internalType": "int128", "name": "result", "type": "int128" }, { "internalType": "uint256", "name": "startTime", "type": "uint256" }, { "internalType": "uint256", "name": "endTime", "type": "uint256" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [ { "internalType": "string", "name": "property", "type": "string" }, { "internalType": "uint256", "name": "blockNum", "type": "uint256" }, { "internalType": "address", "name": "cont", "type": "address" } ], "name": "checkValue", "outputs": [ { "internalType": "uint64", "name": "", "type": "uint64" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "checkNewRound", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint64", "name": "id", "type": "uint64" }, { "internalType": "int128", "name": "data", "type": "int128" } ], "name": "oraclesResult", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint64", "name": "id", "type": "uint64" } ], "name": "checkResult", "outputs": [ { "internalType": "int128", "name": "", "type": "int128" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [ { "internalType": "uint64", "name": "id", "type": "uint64" } ], "name": "checkIfFinished", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [ { "internalType": "address", "name": "addr", "type": "address" } ], "name": "setOCR", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "time", "type": "uint256" } ], "name": "setMaxReqTime", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getCurrReqBlock", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "getCurrReqProperty", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "getCurrReqContract", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "ququeSize", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function", "constant": true } ]


async function getValue(trackerAddr, res){
    try{
        console.log(trackerAddr)
        const trackerContract = await new web3.eth.Contract(trackerABI, trackerAddr)
        const property = await trackerContract.methods.getCurrReqProperty.call().call()
        const at = await trackerContract.methods.getCurrReqBlock.call().call()
        if(at==0)
            at=-1
        const valuesAddress = await trackerContract.methods.getCurrReqContract.call().call()
        const valuesContract = await new web3.eth.Contract(valuesABI, valuesAddress)

        var reqId = await trackerContract.methods.currReq.call().call()
        console.log("\nReqID: ", reqId)
        
        if(at<0)
            at = "latest"
        val = await valuesContract.methods[property].call(block_identifier=at).call(block_identifier=at)
        
        //var val = await valuesContract.methods[property].call().call()
        console.log("Value: ", val)

        var res_str = (BigInt(reqId)*(BigInt(2)**BigInt(128)))+BigInt(val)
        console.log("Out val: ", res_str.toString())
        res.status(200).send(res_str.toString());
    }catch(error){
        console.log(error)
        res.status(200).send("X"); 
    }
    
}

async function setValue(property, res, num){
    const addr = await web3.eth.getAccounts()
    try{
        if(property=="a")
            await valuesContract.methods.setA(num).send({from: addr[0]})
        else
            await valuesContract.methods.setB(num).send({from: addr[0]})
        res.status(200).send('Value set');
    }catch(err){
        res.status(200).send(err);
    }
}


module.exports = {
    setValue: setValue,
    getValue: getValue 
 }

//var res_str = (BigInt(2)*(BigInt(2)**BigInt(128)))+BigInt("25")
//console.log("Out val: ", res_str.toString())

 //BigInt(5000).toString(2)
const express = require('express');
const keccak256 = require('keccak256')
var hexToBinary = require('hex-to-binary');
const bodyParser = require('body-parser');
const cors = require('cors');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');
const bc = require('./bc');

const config = {
    name: 'sample-express-app',
    port: 3000,
    host: '0.0.0.0',
};

const app = express();
const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.json());
app.use(cors());
app.use(ExpressAPILogMiddleware(logger, { request: false }));

let oraclesValues = new Map(); //<rid,Map<oid,value>>
let gambling_sc_list = ["0x838aCD0f3Fbf6C5F4d994A6870a2a28afaC63F98", "0x7E836AF68696ACe5509dC3B218081befcD6114B4"];


function saveOracleData(oid, rid, value){
    if(oraclesValues[rid]==undefined)
        oraclesValues[rid] = new Map()

    var round_data = oraclesValues[rid]
    round_data[oid] = value
    console.log("Value saved for oracle ", oid)
}



app.get('/getDataHash', (req, res) => {
    req_manager = req.query.reqmanager
    oid = req.query.oid
    fraudolent = req.query.fraudolent

    if(fraudolent=="y"){
        val = Math.floor(Math.random() * 100)
        res.status(200).send(val.toString());
        return
    }

    if(req_manager==undefined || oid==undefined){
        res.status(404).send('Error 1: incorrect parameters!');
        return
    }

    bc.getDataHash(req_manager, res, saveOracleData, oid, gambling_sc_list)
});


app.post('/getSavedData', (req, res)=>{

    /*var hash = keccak256("5").toString('hex')
    var bn = BigInt('0x' + hash.substring(0,32));
    if(bn==req.body.hash){
        console.log("Oracele "+req.body.oid)
        console.log("RID "+req.body.rid)
        res.status(200).send("5");
    }
    else 
        console.log("Error aaaaa")
    return*/

    hash = req.body.hash
    oid = req.body.oid
    rid = req.body.rid
    if(oid==undefined || rid==undefined || hash==undefined){
        res.status(404).send('Error 4: incorrect parameters');
        return
    }
    if((oraclesValues[rid])[oid]==undefined){
        res.status(404).send('Error 5: value not set');
        return
    }
    val = (oraclesValues[rid])[oid].toString();
    var val_hash = keccak256(val).toString('hex')
    var bn = BigInt('0x' + val_hash.substring(0,32));
    if(bn.toString() == hash)
        res.status(200).send(val);
    else
        res.status(404).send();

})


app.post('/set-gambling-sc-list', (req, res)=>{
    if(req.body.sc_list != undefined){
        gambling_sc_list = req.body.sc_list
        res.status(200).send("ok")
    }else{
        res.status(200).send("Error: gambling smart contracts list not provided")
    }
})

app.get('/get-gambling-sc-list', (req, res)=>{
    res.status(200).send(gambling_sc_list.toString())
})




app.listen(config.port, config.host, (e)=> {
    if(e) {
        throw new Error('Internal Server Error');
    }
    logger.info(`${config.name} running on ${config.host}:${config.port}`);
});

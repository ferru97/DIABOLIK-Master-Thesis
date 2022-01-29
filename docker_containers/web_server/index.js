const express = require('express');
const keccak256 = require('keccak256')
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

let oraclesSavedData = new Map(); //<rid,Map<oid,value>>




function saveOracleData(oid, rid, value){
    if(oraclesSavedData[rid]==undefined)
        oraclesSavedData[rid] = new Map()

    var round_data = oraclesSavedData[rid]
    round_data[oid] = value
    console.log("Value saved for oracle ", oid)
}



app.get('/getDataHash', (req, res) => {
    req_manager = req.query.reqmanager
    oid = req.query.oid
    depositlimitation_sc = req.query.depositlimitation
    fraudolent = req.query.fraudolent

    if(fraudolent=="y"){
        val = Math.floor(Math.random() * 100)
        res.status(200).send(val.toString());
        return
    }

    if(req_manager==undefined || oid==undefined || depositlimitation_sc==undefined){
        res.status(404).send('Error 1: incorrect parameters!');
        return
    }

    bc.getDataHash(req_manager, res, saveOracleData, oid, depositlimitation_sc)
});


app.post('/getSavedData', (req, res)=>{

    hash = req.body.hash
    oid = req.body.oid
    rid = req.body.rid
    if(oid==undefined || rid==undefined || hash==undefined){
        res.status(404).send('Error 4: incorrect parameters');
        return
    }
    if((oraclesSavedData[rid])[oid]==undefined){
        res.status(404).send('Error 5: value not set');
        return
    }
    val = (oraclesSavedData[rid])[oid].toString();
    var val_hash = keccak256(val).toString('hex')
    var bn = BigInt('0x' + val_hash.substring(0,32));
    if(bn.toString() == hash)
        res.status(200).send(val);
    else
        res.status(404).send();

})


app.get('/centralizedTest', (req, res)=>{
    res.status(200).send("10");
})




app.listen(config.port, config.host, (e)=> {
    if(e) {
        throw new Error('Internal Server Error');
    }
    logger.info(`${config.name} running on ${config.host}:${config.port}`);
});

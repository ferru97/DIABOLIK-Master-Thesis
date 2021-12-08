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


function saveOracleData(oid, rid, value){
    if(oraclesValues[rid]==undefined)
        oraclesValues[rid] = new Map()

    var round_data = oraclesValues[rid]
    round_data[oid] = value
    console.log("Value saved for oracle ", oid)
}


app.get('/', (req, res) => {
	var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
	
	if(ip == "10.5.0.7")
		res.status(200).send('10');
	else
    	res.status(200).send('15');
});


app.post('/echo', (req, res) => {	
    var v = keccak256(req.body.value).toString('hex')
    //var start = BigInt('0x' + v.substring(0,128))
    //var end = BigInt('0x' + v.substring(128,256))
    //var hash_xor = start ^ end; 
	res.status(200).send(v.substring(0,32));
});

app.get('/test', (req, res) => {	
    var hash = keccak256("5").toString('hex')
    var bn = BigInt('0x' + hash.substring(0,32));
	res.status(200).send(bn.toString());
});



app.get('/get', (req, res) => {
    tracker = req.query.tracker
    oid = req.query.oid
    fraudolent = req.query.fraudolent

    if(fraudolent=="y"){
        val = Math.floor(Math.random() * 100)
        res.status(200).send(val.toString());
        return
    }

    if(tracker==undefined || oid==undefined){
        res.status(200).send('Error 1: incorrect parameters!');
        return
    }

    bc.getValue(tracker, res, saveOracleData, oid)
});


app.get('/set', (req, res) => {
	property = req.query.property
    value = req.query.val
    if(property==undefined || value==undefined)
        res.status(200).send('Error 2: incorrect parameters');
    else
        bc.setValue(property, res, value)
});


app.post('/saveValue', (req, res)=>{
    oid = req.body.oid
    rid = req.body.rid
    value = req.body.value
    if(oid==undefined || rid==undefined || value==undefined){
        res.status(404).send('Error 3: incorrect parameters');
        return
    }

    if(oraclesValues[rid]==undefined)
        oraclesValues[rid] = new Map()

    (oraclesValues[rid])[oid] = value
    res.status(200).send('1');
})


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



app.listen(config.port, config.host, (e)=> {
    if(e) {
        throw new Error('Internal Server Error');
    }
    logger.info(`${config.name} running on ${config.host}:${config.port}`);
});

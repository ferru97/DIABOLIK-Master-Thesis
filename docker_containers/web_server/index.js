const express = require('express');
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




app.get('/', (req, res) => {
	var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
	
	if(ip == "10.5.0.7")
		res.status(200).send('10');
	else
    	res.status(200).send('15');
});

app.get('/get', (req, res) => {
    tracker = req.query.tracker
    fraudolent = req.query.fraudolent
    if(fraudolent=="y"){
        val = Math.floor(Math.random() * 100)
        res.status(200).send(val.toString());
        return
    }

    if(tracker==undefined){
        res.status(200).send('Error: incorrect parameters');
        return
    }

    bc.getValue(tracker, res)
});


app.get('/set', (req, res) => {
	property = req.query.property
    value = req.query.val
    if(property==undefined || value==undefined)
        res.status(200).send('Error: incorrect parameters');
    else
        bc.setValue(property, res, value)
});





app.listen(config.port, config.host, (e)=> {
    if(e) {
        throw new Error('Internal Server Error');
    }
    logger.info(`${config.name} running on ${config.host}:${config.port}`);
});

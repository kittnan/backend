import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());



import monitoringFactory from './src/modules/monitoring-factory/monitoring-factory.js'
app.use('/monitoringfactory', monitoringFactory);

const port = 4014;
const server = app.listen(port, () => {
    console.log('Listening on port ' + server.address().port);
});
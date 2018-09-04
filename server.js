const express = require('express');
const cassandra = require("cassandra-driver");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const port = process.env.PORT || 5000;

const dbConfig = {
    contactPoints: ['127.0.0.1'],
    keyspace: 'system_schema',
    //    authProvider: authProvider,
    port: 9042,
    //maxVersion: '3.4.4',
    protocolOptions: {
        port: 9042,
        maxVersion: 4,
    }
}

let ConnectToDB = (connection, resp) => {
    connection.connect(function (err, result) {
        if (err) {
            console.log("err" + err)
            resp.statusCode = 500
            resp.json({ "status": "Not Connected" })
        }
        else {
            console.log('cassandra connected');
            resp.statusCode = 200
            resp.json({ "status": "Connected" })
        }
    })
}

let connection = new cassandra.Client(dbConfig);
//ConnectToDB(connection)


app.post('/api/getRecords', (req, resp) => {
    console.log(req.body.query)
    const query = req.body.query
    let rows = []
    try {
        connection.stream(query, null, { prepare: true, autopage: true })
            .on('readable', function () {
                let row;
                while (row = this.read()) {
                    rows.push(row);
                }
            })
            .on('end', function () {
                resp.contentType('application/json')
                if (rows.length > 0) {
                    resp.statusCode = 200
                    resp.json(rows)
                }
                else {
                    resp.statusCode = 500
                    resp.statusMessage = "No Record Found"
                    resp.json(rows)
                }
                
            })
            .on('error', function (err) {
                console.log("if(err) = " + err)
                resp.statusCode = 500
                resp.statusMessage = err
                resp.json()
            })
    }
    catch (err) {
        resp.statusCode = 500
        resp.statusMessage = err
        console.log("catch(err) = " + err)
        resp.json()
    }
})


app.post('/api/execute', (req, resp) => {
    console.log(req.body)
    const select = req.body.query
    try {
        connection.execute(select, function (err, rows) {
            if (err) {
                console.log("if(err) = " + err)
                resp.statusCode = 500
                resp.statusMessage = err
                resp.json()
            }
            else {
                resp.contentType('application/json')
                resp.statusCode = 200
                resp.json(rows)

            }
        })
    }
    catch (err) {
        resp.statusCode = 500
        resp.statusMessage = err
        console.log("catch(err) = " + err)
        resp.json()
    }

})

app.post('/api/executeUpdate', (req, resp) => {
    console.log(req.body.query);
    const update = req.body.query;
    try {
        connection.execute(update, function (err, rows) {
            if (err) {
                console.log("if(err) = " + err)
                resp.statusCode = 500
                resp.statusMessage = err
                resp.json()
            }
            else {
                resp.contentType('application/json')
                resp.statusCode = 200
                resp.json(rows)

            }
        })
    }
    catch (err) {
        resp.statusCode = 500
        resp.statusMessage = err
        console.log("catch(err) = " + err)
        resp.json()
    }

})


app.post('/api/makeConnection', (req, resp) => {
    console.log(req.body);
    let newconfig = {};
    newconfig = {
        contactPoints: [req.body.connection.contactPoints],
        keyspace: req.body.connection.keyspace,
        port: req.body.connection.port,
    }
    let authProvider
    if (req.body.connection.uid !== undefined && req.body.connection.pwd !== undefined) {
        authProvider = new cassandra.auth.PlainTextAuthProvider(
            req.body.connection.uid, req.body.connection.pwd);
        newconfig = {
            ...newconfig,
            authProvider: authProvider,
        }
    }

    connection = new cassandra.Client(newconfig)
    try {
        ConnectToDB(connection, resp)
    } catch (e) {
        console.log(e)
    }
})

app.listen(port, () => console.log(`Listening on port ${port}`));
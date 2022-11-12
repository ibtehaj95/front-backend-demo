const { response } = require("express");
const express = require("express");
const Database = require("nedb");
const app = express();

app.listen(3000, ()=>{  //opens a port to listen for requests
    console.log("Server is Live at 3000");
});
app.use(express.static("./public"));
app.use(express.json({
    limit: "1kb"
}));

const db = new Database("sites.db");
db.loadDatabase();

app.get("/api", (req, resp) => {
    db.find({}, (err, data) => {
        if(err){
            console.log(err);
            response.end();
            return;
        }
        resp.json(data);
        // console.log(data);
    });
});

app.post("/api", (req, resp) =>{
    // console.log(req.body);
    resp.json({
        status: "success",
        data: req.body
    });
    db.insert(req.body);
});
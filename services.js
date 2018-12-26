const mysql = require('mysql');
const express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.options('*', cors());

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Instantiate the services module object
var services = {};


services.init = function(){

    routes();

    //Server Connection
    app.listen('3000', () => {
        console.log('Server started on port 3000');
    });

};



//Defining routes
var routes = function(){
        
    // Create connection
        const db = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'root',
            database : 'DB_Name'
        });

    // Connect
        db.connect((err) => {
            if(err){
                throw err;
            }
            console.log('MySql Connected...');
        });

    //routes    
    app.get('/',(req,res)=>{

        res.send("You are the home index");

    }) ;   

    //test routes
    app.get('/users', (req, res) => {
        let sql = `SELECT * FROM users`;
        let query = db.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result);
            res.send(JSON.stringify(result));
        });

    });

    

    //register user 

    app.post('/register',(req,res)=>{

        let post = {email:req.body.email,name:req.body.name,office_id:req.body.office_id,password:req.body.password};
        let sql = `SELECT COUNT(id) as id FROM users WHERE email = '${req.body.email}'`;
        let query = db.query(sql, (err, result) => {
            if(err)throw err;

            var id;
            result.forEach(element => {
                id = element.id;
            });

            if(id>0){
                    var data = {
                                    
                        code : 'Failed' ,
                        data:'User Already Exists'   
                    };
                console.log(result);
                res.send(JSON.stringify(data));

            }else{
                        let sql = `INSERT INTO users  SET ?`;
                        let query = db.query(sql, post, (err, result) => {
                        if(err) {
                            //throw err;
                            var data = {
                                
                                code : 'failed'    
                            };
                        console.log(result);
                        res.send(JSON.stringify(data));
                        }else{


                            var data = {
                                
                                code : 'success'    
                            };
                        console.log(result);
                        res.send(JSON.stringify(data));
                    
                    }
                    });   
            }
            
        });
    });

    //login user 

    app.post('/login',(req,res)=>{

        let post = {email:req.body.email,password:req.body.password};
        let sql = `SELECT  id FROM  users WHERE email = '${req.body.email}' AND password = '${req.body.password}' LIMIT 1`;
        let query = db.query(sql, (err, result) => {
            if(err){

                throw err;

            } 
            
            else{

            console.log(result);
            var id;
            result.forEach(element => {
                id = element.id;
            });

            if(id!=null){
                var data = {
                    id : id,
                    code : 'success',    
                };
            }else{
                var data = {                   
                    code : 'fail'    
                };
            }
            res.send(JSON.stringify(data));
            }
            
        }); 

    });
}

//exporting the module
module.exports = services;

const {Sequelize, DataTypes} = require('sequelize');
//only we import the Sequelize and the DataTypes from the sequelize package
//where the Sequelize is the class and the DataTypes is the method from the package
// in line 9-15 intiliazing the sequelize is the older and not regonized method
//follow MVC model  we need to create a config folder,stores all configuration and import in the index.js file
//lets follow the MVC model ,firslty create a config folder and create a file name dbconfig.js
//after creating the dbconfig.js file we need to import the file in the index.js file
const databaseConfig=require('../config/dbconfig.js');//we import all the data from the dbconfig.js file to the varaible dbConfig and now it the object that stores all the inforamtion about the configuration
const makeBlogTable = require('./blogmodel.js');
const makeRegisterTable = require('./registerTable.js');
// const sequelize= new Sequelize("sudip","root","",{
//     //Donnot be confused the sequelize is the varalbe name.It also the convention to use the sequelize as the variable name
//     host:'localhost',
//     port:3306,//by default the port is 3306
//     dialect:'mysql',
//     //dialect is the type of the database you are using
// });
const sequelize= new Sequelize(databaseConfig.DB,databaseConfig.USER,databaseConfig.PASSWORD,{
    host:databaseConfig.HOST,
    port:databaseConfig.PORT,
    dialect:databaseConfig.dialect,
    // pool:{//explained in the day 7 daily notes
    //     max:databaseConfig.pool.max,//we use two dot operator ( first to acess the keys from the dbConfig object and inside the key access (e,g pool) there is again and object ) and from that pool object to access the key again a dot operator is used.
    //     min:databaseConfig.pool.min,
    //     acquire:databaseConfig.pool.acquire,
    //     idle:databaseConfig.pool.idle
    // }
});
//now we have to check the connection
//first the username and the password is to be checked
sequelize.authenticate()//here auto the username and the password is passed
//the authenticate is the method of the sequelize class to check the connection
.then(()=>{//true if the connection is established
    console.log('Connection has been established successfully.');
})
.catch(err=>{//false if the connection is not established
    console.error('Unable to connect to the database:',err);
});
//db hold important properties and methods related to the Sequelize instance and models.
const db={};//we created the empty object,now we need to add the key in the object
db.Sequelize=Sequelize;
db.sequelize=sequelize;
//Connecting the file that create the table in the database the file name is :blogmodel.js
//const blogs=require('./blogModel.js')(sequelize,DataTypes);
//to make this more clear we can do it by:
db.blogs=makeBlogTable(sequelize,DataTypes);
db.registers=makeRegisterTable(sequelize,DataTypes);
//makeBlogTable is the function that is exported from the blogModel.js file
//and writing this a line was auto added :
//const makeBlogTable = require('./blogModel.js');
//this solve the problem
db.sequelize.sync({force:false})//the sync method is used to synchronize the model with the database
.then (()=>{
    console.log('Database is synchronized');
})
.catch(err=>{
    console.log(err);
});

//Connecting the file that create the table in the database the file name is :blogmodel.js
//const blogs=require('./blogModel.js')(sequelize,DataTypes);


//Realtionship between the tables
db.registers.hasMany(db.blogs);
db.blogs.belongsTo(db.registers);



//exporting the module
module.exports=db;//the object is exported
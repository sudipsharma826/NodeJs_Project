const e = require("connect-flash");

const makeRegisterTable=(sequelize,DataTypes)=>{
    
        const register=sequelize.define("register",{//acutally table name is tables
            username:{
                type:DataTypes.STRING,
                allowNull:false,
            },
            email:{
                type:DataTypes.STRING,
                allowNull:false,
            },
            password:{
                type:DataTypes.STRING,
                allowNull:true,
            },
            userProfile:{
                type:DataTypes.STRING,
                allowNull:false,
            },
            OauthId:{
                type:DataTypes.STRING,
                allowNull:true,
            },
            authProvider:{
                type:DataTypes.STRING,
                allowNull:true
            },
            otp:{
                type:DataTypes.STRING,
                allowNull:true,
            },
            otpGeneratedTime:{
                type:DataTypes.STRING,
                allowNull:true,
            },
            role:{
                type:DataTypes.STRING,
                enum:['admin','user'],
                defaultValue:'user',
            }
        });
        return register;
    };
module.exports=makeRegisterTable;
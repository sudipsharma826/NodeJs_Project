//Acquiring the blogs table data
const { blogs  ,registers } = require('../model/index'); // Models

//Exporting the homeController
exports.homeRender=async (req, res) => {
    const datas = await blogs.findAll({
        include:
        {
            model: registers
        }
    });// Fetch all blogs
    const success=req.flash('success');
    const error=req.flash('error'); 
    res.render('home.ejs', { blogs: datas ,success,error}); // Pass data to the template
    //console.log(datas); // Logs data when page is refreshed
};


exports.indexRender=(req, res) => {
    const data = {
        name: 'Sudip Sharma',
        age: 20,
        city: 'Pokhara'
    };
    res.render('index.ejs', { obj1: data });
};


exports.aboutRender=(req, res) => {
    res.render('about.ejs');
};


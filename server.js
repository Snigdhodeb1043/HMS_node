const express = require('express');
const app = express();
const nodeMailer = require("nodemailer");
const Register = require("./models/signup");

app.use(express.static('public'));
app.use('/css',express.static(__dirname + 'public/css'));
app.use('/js',express.static(__dirname + 'public/js'));
app.use('/images',express.static(__dirname + 'public/images'));
app.use('/images1',express.static(__dirname + 'public/images1'));
app.use('/img',express.static(__dirname + 'public/img'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.set('views','./views');
app.set('view engine','ejs');




const mongoose = require('mongoose');
const Signup = require('./models/signup');

//connect to the database
mongoose.connect('mongodb://0.0.0.0/mydb',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//acquire the connection(to check if it's successful)
const db = mongoose.connection;

//error
db.on('error', function(err) { console.log(err.message); });

//up and running then print the message
db.once('open', function() {
  
    console.log("Successfully connected to the database");

});








app.post('/',(req, res)=>{
    console.log(req.body);

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nodejsmailtester05@gmail.com',
            pass: 'Password01!'
        }
    })
    const mailOptions = {
        from: req.body.email,
        to: 'nodejsmailtester05@gmail.com',
        subject: `Message from ${req.body.email}:  ${req.body.subject}`,
        text: req.body.message
    }
    transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log(error);
            res.send('error');
        }else{
            console.log('Email sent: ' + info.response);
            res.send('success');
        }
    })

})

app.get('',(req,res)=>{
    res.render('index');
})
app.get('/index',(req,res)=>{
    res.render('index');
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('index');
})

app.get('/search',(req,res)=>{
    res.render('search');
})
app.get('/login',(req,res)=>{
    res.render('login');
})

//login check

app.post('/log_in', async(req,res)=>{
    try{

        const email = req.body.email;
        const password = req.body.password;

        const userEmail = await Signup.findOne({email:email});
        if(userEmail.password === password){
            res.status(201).render('index');
        }
        else{
            res.send("Incorrect Password");
        }

    }catch(err){
        res.status(400).send("Invalid login");
    }
})

const jwt = require('jsonwebtoken');


const auth = async(req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
        console.log(verifyUser);

        const user = await Signup.findOne({_id:verifyUser._id})
        console.log(user.name);
        next();

        req.token = token;
        req.user = user;

    }catch(err){
        res.status(401).send(err);
    }
}

app.get('/logout',auth,async(req,res)=>{
    try{
        console.log("Logout");
    }catch(err){
        res.status(500).send(err);
    }
})



app.get('/signup',(req,res)=>{
    res.render('signup');
})

app.post('/sign_up',async (req,res)=>{
    try{
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        
        if(password === confirmPassword){

            const signupUser = new Signup({
                name: req.body.name,
                username: req.body.username,
                phone: req.body.phone,
                email: req.body.email,
                gender: req.body.gender,
                password: password,
                confirmPassword: confirmPassword
            })

            const signedup = await signupUser.save();
            res.status(201).render('index');

        }else{
            res.send("Password incorrect");
        }

    } catch(err){
        res.status(400).send(err);
    }
    

    // return res.redirect('index')

})

app.get('/res',(req,res)=>{
    res.render('res');
})
app.get('/menu',(req,res)=>{
    res.render('menu');
})
app.get('/store',(req,res)=>{
    res.render('store');
})
app.get('/table',(req,res)=>{
    res.render('table');
})
app.get('/contact',(req,res)=>{
    res.render('contact');

})
app.get('/book',(req,res)=>{
    res.render('book');

})
app.get('/services',(req,res)=>{
    res.render('services');

})

app.get('/feedback',(req,res)=>{
    res.render('feedback');
})

app.get('/payment',(req,res)=>{
    res.render('payment');
})



app.listen(3000,() =>{
    console.log("listening Port 3000");
})
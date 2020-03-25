const express       = require('express');
const app           = express();
const hbs           = require('hbs');
const path          = require('path');
const mongoose      = require('mongoose');
// const favicon       = require('serve-favicon');
const User          = require('./models/user');
const Outfit        = require('./models/outfit');
const Item          = require('./models/item');
const bodyParser    = require('body-parser');
// const cookieParser  = require('cookie-parser');
const multer        = require('multer');
var upload          = multer({ dest: 'public/' });
const session       = require("express-session");
const MongoStore    = require("connect-mongo")(session);

// Handlebars, Statics, body parser
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
debugger
// Partials
hbs.registerPartials(__dirname + '/views/partials');

// Helpers, Locals
hbs.registerHelper('isEqual', (value1, value2)=> {
  if (value1 == value2) {
    console.log("isEqual")
    return true ;
  } else { 
    console.log(value1)
    console.log(value2)
    return false
  }
    
})



// Database connection
mongoose
  .connect('mongodb+srv://overlord:OVERLORD@main-efpuk.azure.mongodb.net/DressUp?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(x =>
    console.log(`Connected to Mongo Database name: "${x.connections[0].name}"`)
  )
  .catch(err => console.error('Error connecting to mongo', err));



 app.use(
   session({
     secret: 'basic-auth-secret',
     saveUninitialized: false,
     resave: false,
     cookie: { maxAge: 1200000 },
     store: new MongoStore({
       mongooseConnection: mongoose.connection,
       ttl: 24 * 60 * 60,
     }),
   })
 );


// Middleware Setup
app.use('/user/dashboard', protect);
app.use('/outfit', protect);
app.use('/item', protect);

// Routes
app.use('/', require('./routes/index'))
app.use('/user', require('./routes/user'));
app.use('/outfit', require('./routes/outfit'));
app.use('/item', require('./routes/item'));



// Function defenitions
//middleware definition
function protect (req,res,next){ 
  debugger
  if (req.session.currentUser) next()
  else { res.redirect('/user/login', {
    errorMessage: "Login Required!"
    }); 
  }
}

// Listener
app.listen(3002, () => {
  console.log('Webserver is listening on port 3002');
});

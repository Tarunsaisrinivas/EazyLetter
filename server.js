import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import session from 'express-session';
import bcrypt from 'bcrypt';
import ConnectMongoDBSession from 'connect-mongodb-session';
import jwt from 'jsonwebtoken';
import env from 'dotenv'; 
env.config();



const app = express();
const mongoURL = process.env.mongoURL;
const client = new MongoClient(mongoURL, { useUnifiedTopology: true });

let db;
let adminCollection;
let studentCollection;
const store = new ConnectMongoDBSession(session)(
  { uri:mongoURL,
    collection:'mysessions'}
    )
    
    async function connectToDatabase() {
      try {
        await client.connect();
        db = client.db('EazyLetter');
        adminCollection = db.collection('Admin');
        studentCollection=db.collection('Student');
        console.log('Connected to the database');
      } catch (error) {
        console.error('Error connecting to the database:', error);
      }
    }
    
    connectToDatabase();
    

app.use(cors({
  origin: ["http://localhost:5173","https://eazyletter.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(
  session({
    secret:'Secret-key',
    resave: false,
    saveUninitialized: false,
    store:store
  })
);

app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'))

   const verifyUser = (req, res, next) => {
    const token = req.session.token; 
    if(!token) {
        return res.json("The token is missing")
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) {
                return res.json("The token is wrong")
            } else {
                req.isadmin=decoded.isadmin;
                if(req.isadmin)
                {
                  req.staffId = decoded.staffId;
                }
                else{
                  req.studentId = decoded.studentId;
                }
                next()
            }
        })
    }
}


app.get('/',verifyUser, async(req, res) => {
 
  let data;
  if(req.isadmin){
    const filter = { staffId:req.staffId };
    //const projection = { LetterDetails: 0 };
    data = await adminCollection.findOne(filter);
}
  else{
    const filter = { studentId: req.studentId };

    const projection = { LetterDetails: 0 };
    data = await studentCollection.findOne(filter,{projection});
  }
  return res.json(data);
})


app.post('/adminregister', async (req, res) => {
  try {
    const { firstname,lastname, password,cpassword, email, contact, staffId,staff, department,image } = req.body;
    const existingUser = await adminCollection.findOne({ staffId });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    if(password==cpassword)
    {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      firstname,
      lastname,
      password,
      email,
      contact,
      staffId,
      staff,
      department,
      image,
      isadmin:true
    };

    await adminCollection.insertOne(newUser);
  }
  else{
    return res.status(409).json({ error: 'Password Not Matched' });
  }
    
    res.status(201).json({ message: 'Account Creation successful' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/adminlogin', async (req, res) => {
  try {
    const { staffId, password } = req.body;
    const user = await adminCollection.findOne({ staffId });
    if (!user) {
       return res.status(401).json({ error: 'Invalid credentials' });
    }
    bcrypt.compare(password, user.password, (err, response) => {
      if(response) {
        
        const token = jwt.sign({staffId: user.staffId, isadmin:user.isadmin},
          "jwt-secret-key", {expiresIn: '1d'}) 
          req.session.token = token; 
          req.session.isAuth = true;
          return res.json("Success")
      } else {
          return res.json("Password is incorrect");
      }
  })
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/getadmininfo', async (req, res) => {
  const { staffId,department } = req.body;
  let user;
  try {
    if(staffId==='Hod'){
      const staff=staffId;
       user = await adminCollection.findOne({ $and: [{ staff }, { department }] }, {
        projection: {
          firstname: 1,
          lastname: 1,
          department: 1,
          contact: 1,
          email: 1,
          _id: 0,
        }
      });
      }
    else if(staffId==='principal'){
      const staff=staffId;
      user = await adminCollection.findOne({ staff }, {
       projection: {
         firstname: 1,
         lastname:1,
         contact: 1,
         email: 1, 
         _id: 0, 
       }
     });
    }
    else{
      user = await adminCollection.findOne({ staffId }, {
        projection: {
          firstname: 1,
          lastname:1,
          department: 1,
          contact: 1,
          email: 1, 
          _id: 0, 
        }
      }); 
    }
    res.json(user); 
  } catch (err) {
    console.error('Error retrieving full names:', err);
    res.status(500).json({ error: 'An error occurred while retrieving data' });
  }
});

app.post('/getadmin', async (req, res) => {
  try {
    const query = { staffId: { $nin: ["CSE513", "srkr"] } };
    const docs = await adminCollection.find(query, { projection: { firstname: 1, lastname: 1, staffId:1, _id: 0 } }).toArray();
    const admindetails = docs.map((doc) => ({
      fullname: `${doc.firstname} ${doc.lastname}`,
      staffid: doc.staffId,
    }));
    res.json(admindetails); 
  } catch (err) {
    console.error('Error retrieving full names:', err);
    res.status(500).json({ error: 'An error occurred while retrieving data' });
  }
});



app.post('/studentregister', async (req, res) => {
  try {
    const { firstname,lastname, password ,cpassword,email,studentId,department,contact,year } = req.body;

    const user = await studentCollection.findOne({ studentId });
    if (user) {
      return res.status(409).json({ error: 'User already exists' });
    }
    if(password==cpassword)
    {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      firstname,
      lastname,
      password,
      email,
      studentId,
      department,
      contact,
      year,
      isadmin:false
    };

    await studentCollection.insertOne(newUser);
    const token = jwt.sign({ studentId: studentId,isadmin:false},
      "jwt-secret-key", {expiresIn: '1d'})      
     req.session.isAuth = true;
     req.session.token = token;

    res.status(201).json({ message: 'Account Creation successful' });
  }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/studentlogin', async (req, res) => {
  try {
    const { studentId, password } = req.body;
    const user = await studentCollection.findOne({ studentId });
    if (!user) {
       return res.status(401).json({ error: 'Invalid credentials' });
    }
    bcrypt.compare(password, user.password, (err, response) => {
      if(response) {
           const token = jwt.sign({ studentId: user.studentId, isadmin:user.isadmin},
               "jwt-secret-key", {expiresIn: '1d'})      
          req.session.isAuth = true;
          req.session.token = token;
          return res.json("Success");
      } else {
          return res.json("Password is incorrect");
      }
  })
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});



app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.sendStatus(500);
    } else {
      res.clearCookie('connect.sid'); 
      res.redirect('/');
    }
  });
});

app.post('/submitletter', async (req, res) => {
  try {
    const {details,userdetails,adminInfo} = req.body;
    const letterDetailsObject = { details,userdetails, adminInfo, };
    const update = { $push: { LetterDetails: letterDetailsObject } };
    const fors={studentId:userdetails.studentId};
    let fora;
    if(adminInfo.staffId==='Hod'){
      fora={staff:adminInfo.staffId,department:adminInfo.department};
    }
    else{
      fora={staffId:adminInfo.staffId,department:adminInfo.department};
    }
    const result1 = await studentCollection.updateOne(fors, update);
    const result2 = await adminCollection.updateOne(fora, update);
    if (result1.modifiedCount === 1 && result2.modifiedCount === 1 ) {
      res.status(201).json({ message:'LetterDetails added successfully.' });
    } else {
      res.status(201).json({ message:'No document matched the filter criteria.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

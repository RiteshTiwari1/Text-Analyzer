const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const exp = require('constants');
const app = express();
const port = process.env.PORT || 3000;
const path=require('path');
const cors=require('cors');

let fileIDToSearch='';


require('dotenv').config();
app.use(cors());

const db_link=process.env.DB_LINK;

mongoose.connect(db_link, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(function(db) {
    console.log("db connected");
})
.catch(function(err) {
    console.error("Error connecting to MongoDB:", err);
});


// Create a schema for text data
const textSchema = new mongoose.Schema({
  filename: {
    type:String,
    required:true
  },
  fileID: {
    type:String,
    required:true
  },
  wordFrequency: {
    type:Object,
    required:true
  },
  topOccurringWords:{
    type:Array,
    required:true
  },
  topCoOccurringWords:{
    type:Array,
    required:true
  }
});


const Text = mongoose.model('Text', textSchema);


// // Set up multer for file uploads

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});


// const filter = function (req, file, cb) {
//   // Check file size (max 5MB)
//   const maxSize = 5 * 1024 * 1024; // 5MB

  

//   const fileSizeInBytes = req.file.buffer.length;

//   if (fileSizeInBytes > maxSize) {
//     cb(new Error('File size exceeds 5MB limit'), false);
//   } else if (file.mimetype !== 'text/plain') {
//     cb(new Error('Please upload a .txt file'), false);
//   } else {
//     cb(null, true);
//   }
// };








// const upload = multer({ 
//   storage : multerStorage,
//   fileFilter:filter,
  
// });

const upload = multer({ storage:multerStorage, limits: { fileSize: 1000000 * 5 } });


app.use(express.json());


// C:\Users\DCT\Desktop\TextAnalyzer\Frontend\multer.html
// app.get('/', (req, res) => {
//   const filePath = path.join(__dirname,'..', 'Frontend','multer.html');

//   console.log(filePath);
  
//   res.sendFile(filePath, (err) => {
//     if (err) {
//       console.error(err);
//       res.status(404).send('File not found');
//     }
//   });
// });



app.post('/uploadFile', upload.single('file'), (req, res, next) => {
  const uploadedFile = req.file;
  if (uploadedFile.size > 5 * 1024 * 1024) {
    console.log("hello");
    return res.status(400).send('File size exceeds the maximum allowed (5MB).');
  }
  
  console.log('File upload route reached');
  next(); // Continue to the route handler
}, uploadTextFile);



async function uploadTextFile(req, res) {
  console.log('File uploaded successfully');

  try{
  const { file } = req;
  // console.log(file);
  const text = fs.readFileSync(file.path, 'utf-8');
    const words = text.split(/\s+/);
    const wordFrequency = {};

    words.forEach((word) => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });

    const sortedWords = Object.keys(wordFrequency).sort((a, b) => wordFrequency[b] - wordFrequency[a]);

    // Get the top 5 mostly occurring words
    // console.log(sortedWords);
    const topOccurringWords = sortedWords.slice(0, 5);

    const topCoOccurringWords=calculateCoOccurringWords(words);

    // console.log(topOccurringWords+" ------------- "+topCoOccurringWords);
    // Save the text data to MongoDB
    
    fileIDToSearch=file.filename;
    const newText = new Text({
      filename: file.originalname,
      fileID:file.filename,
      wordFrequency,
      topOccurringWords,
      topCoOccurringWords
    });

    await newText.save();
    // const filePath = path.join(__dirname,'..','Frontend', 'analysis.html');
    // res.status(200).sendFile(filePath);

    res.json({filename: file.originalname,
      fileID:file.filename,
      wordFrequency:wordFrequency,
      topOccurringWords:topOccurringWords,
      topCoOccurringWords:topCoOccurringWords,
      })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}



app.get('/getAnalysisData', async (req, res) => {
  try {
    // Fetch the data from MongoDB (replace with your MongoDB retrieval code)
    const analysisData = await Text.findOne({fileID:fileIDToSearch});

    
    res.json(analysisData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});


function calculateCoOccurringWords(words) {
    const coOccurrenceCount = {};

    // Set the window size (e.g., 2 for bigrams)
    const windowSize = 2;

    // Loop through the words to create word pairs
    for (let i = 0; i < words.length - windowSize + 1; i++) {
        const wordPair = words[i]+" "+words[i+1];

        if (coOccurrenceCount[wordPair]) {
            coOccurrenceCount[wordPair]++;
        } else {
            coOccurrenceCount[wordPair] = 1;
        }
    }

    // Sort word pairs by co-occurrence frequency
    // console.log(coOccurrenceCount);
    const sortedCoOccurrence = Object.keys(coOccurrenceCount).sort((a, b) => coOccurrenceCount[b] - coOccurrenceCount[a]);

    // Get the top 5 mostly co-occurring word pairs
    const topCoOccurringWords = sortedCoOccurrence.slice(0, 5);

    return topCoOccurringWords;
}




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

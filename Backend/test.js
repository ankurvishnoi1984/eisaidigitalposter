
// for delete
app.delete("/delete/:id", (req,res)=>{
    
    const id = req.params.id;
    const imgQuery = 'select imgurl from doctordata where id = ?'
    const deleteQuery = "delete from doctordata where id=?"
    try {
        db.query(imgQuery,[id],(err,rows)=>{
            if(err){
                console.log(err)
            }
            else{
              if(rows.length===0){
                res.status(404).json({ message: "Doctor not found"});
              }
              else{
                const imgName = rows[0].imgurl;
                db.query(deleteQuery, [id], (deleteErr, deleteResult) => {
                  if (deleteErr) {
                      res.status(500).json({
                      errorCode: "0",
                      errorDetail: deleteErr.message,
                      responseData: {},
                      status: "ERROR",
                      details: "An internal server error occurred",
                      getMessageInfo: "An internal server error occurred"
                    });
                  } else {
                    fs.unlink(`./uploads/${imgName}`, (unlinkErr) => {
                      if (unlinkErr) {
                        res.json({unlinkErr});
                      }
                    });
                    res.status(200).json({ message: "Doctor Deleted Successfully"});
                  }
                });
              }
               
            }
        })
    } catch (error) {
       res.send(error) 
    }
})


app.patch("/update/:id", upload.single('image'),(req, res) => {
    const id = req.params.id;
    //console.log(req.body)
  
    const {name, birthdate,speciality,qualification,mclcode,pimage } = req.body;
    
    const currentDate = new Date().toISOString().slice(0, 23).replace('T', ' ');
   
    let filename;
    if (req.file) {
        // Use let instead of var
        filename = req.file.filename;
        fs.unlink(`./uploads/${pimage}`, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting image: ', unlinkErr);
          }
        });
    }
    // Build the update object dynamically based on the provided fields
    const updateData = {};
    if (filename) {
      updateData.imgurl = filename;
    }
    if (name) {
      updateData.name = name;
    }
    if (birthdate) {
      updateData.dateofbirth = birthdate;
    }
    if (speciality) {
      updateData.speciliaty = speciality;
    }
    if (qualification) {
      updateData.qualification = qualification;
    }
    if (mclcode) {
      updateData.mclcode = mclcode;
    }
    if(currentDate){
      updateData.modified_at = currentDate
    }
  
    db.query("UPDATE doctordata SET ? WHERE id = ?", [updateData, id], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: err });
      } else {
        res.send(rows);
      }
    });
  });


  const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,"./uploads"))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  const upload1 = multer({ storage: storage1 })


  app.post('/uploadPoster',upload1.single('image'), (req, res) => {
    console.log(req.body);
    const {empId} = req.body;
    const {filename} = req.file 
     const query = 'INSERT INTO emp_poster (emp_poid,postername) VALUES (?,?)';
     db.query(query, [empId,filename], (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Failed to Upload Poster' });
        return;
      }
      res.status(200).send({ message: 'Poster added successfully'});
      console.log(results)
    });
  });
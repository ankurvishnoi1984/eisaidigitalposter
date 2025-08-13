const express = require("express")
//const mysql = require("mysql");
const mysql = require('mysql2')
const cors = require('cors')
const bodyParser = require('body-parser');
const app = express();
const dotenv = require("dotenv");
const multer = require('multer');
const path = require("path");
const fs = require("fs");
const logger = require("./utils/logger");

const csv = require('csv-parser');
const nodemailer = require("nodemailer");
// Increase payload size limit
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json()) 
app.use(cors())

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

const uploadsfile = path.join(__dirname, "./uploads");
app.use("/uploads",express.static(uploadsfile));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,"./uploads"))
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now()+ Math.random().toString();
    cb(null, uniquePrefix+file.originalname)
  }
})

const upload = multer({ storage: storage })




const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,"./uploads"))
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now()+ Math.random().toString();
    cb(null, file.originalname)
  }
})

const upload1 = multer({ storage: storage1 })

dotenv.config();
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE

})
// get all doctor 
app.get("/doc-data", (req, res) => {

    const query = "select * from doctordata where status = 'Y'";
    db.query(query, (err, rows) => {
      if (err) {
        res.send(err);
      } else {
        res.send( rows ); 
      }
    });
  });


//   app.post('/copy-doctors', async (req, res) => {
//     const { fromSubCatId, toSubCatId } = req.body;

//     if (!fromSubCatId || !toSubCatId) {
//         return res.status(400).send('fromCatId and toCatId are required');
//     }

//     const connection = await db.getConnection();
//     try {
//         await connection.beginTransaction();

//         // Get the data from the original category
//         const [doctors] = await connection.query('SELECT fk_emp_id,cat_id,subcat_id, name, imgurl, city, qualification,mobile,hospital FROM doctordata WHERE subcat_id = ?', [fromSubCatId]);

//         if (doctors.length === 0) {
//             await connection.rollback();
//             return res.status(404).send('No doctors found for the given fromSubCatId');
//         }

//         // Insert the data into the new category
//         for (const doctor of doctors) {
//             await connection.query('INSERT INTO doctordata (fk_emp_id, cat_id, subcat_id,name, imgurl, city, qualification,mobile,hospital) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [doctor.fk_emp_id, doctor.cat_id, toSubCatId, doctor.name, doctor.imgurl, doctor.city, doctor.qualification, doctor.mobile, doctor.hospital]);
//         }

//         await connection.commit();
//         res.status(200).send('Data copied successfully');
//     } catch (error) {
//         await connection.rollback();
//         console.error(error);
//         res.status(500).send('An error occurred while copying the data');
//     } finally {
//         connection.release();
//     }
// });


// app.post('/copy-doctors', async (req, res) => {
//   const { fromSubCatId, toSubCatId } = req.body;

//   if (!fromSubCatId || !toSubCatId) {
//       return res.status(400).send('fromCatId and toCatId are required');
//   }

//   const query  = 'SELECT fk_emp_id,cat_id,subcat_id, name, imgurl, city, qualification,mobile,hospital FROM doctordata WHERE subcat_id = ?'

//   try {
       
//       db.query(query,[fromSubCatId],async(error,result)=>{
//         if(error){
//           res.status(500).json({
//             errorCode: "INTERNAL_SERVER_ERROR",
//             errorDetail: err,
//             responseData: {},
//             status: "ERROR",
//             details: "An internal server error occurred",
//             getMessageInfo: "An internal server error occurred"
//           });
//         }
//         else{
//           const insertQuery = 'INSERT INTO doctordata (fk_emp_id, cat_id, subcat_id,name, imgurl, city, qualification,mobile,hospital) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
//           if(result.length>0){
//             for(const doctor of result){
//               db.query(insertQuery, [doctor.fk_emp_id, doctor.cat_id, toSubCatId, doctor.name, doctor.imgurl, doctor.city, doctor.qualification, doctor.mobile, doctor.hospital], (insertErr, insertResult) => {
//                 if (insertErr) {
//                   // Handle the insertion error
//                   res.status(500).json({
//                     errorCode: "INTERNAL_SERVER_ERROR",
//                     errorDetail: insertErr,
//                     responseData: {},
//                     status: "ERROR",
//                     details: "An internal server error occurred while inserting/updating the poster path",
//                     getMessageInfo: "An internal server error occurred"
//                   });
//                 } else {
//                   console.log("console running");
//                  // res.status(200).json({ poster,message: "Poster Added Successfully",errorCode: "1" });
//                 }
//               });
//             }
//           }
//         }
//       })
      

    
//   } catch (error) {
     
//       console.error(error);
//       res.status(500).send('An error occurred while copying the data');
//   } 
// });

//working code
// app.post('/copy-doctors', (req, res) => {
//   const { fromSubCatId, toSubCatId } = req.body;

//   if (!fromSubCatId || !toSubCatId) {
//     return res.status(400).send('fromSubCatId and toSubCatId are required');
//   }

//   const selectQuery = 'SELECT fk_emp_id, cat_id, subcat_id, name, imgurl, city, therapy, qualification, mobile, hospital FROM doctordata WHERE subcat_id = ?';
//   const insertQuery = 'INSERT INTO doctordata (fk_emp_id, cat_id, subcat_id, name, imgurl, city, therapy, qualification, mobile, hospital) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

//   db.getConnection((err, connection) => {
//     if (err) {
//       return res.status(500).send('Failed to get database connection');
//     }

//     connection.beginTransaction((err) => {
//       if (err) {
//         connection.release();
//         return res.status(500).send('Failed to start transaction');
//       }

//       connection.query(selectQuery, [fromSubCatId], (selectErr, results) => {
//         if (selectErr) {
//           return connection.rollback(() => {
//             connection.release();
//             res.status(500).send('Error fetching data');
//           });
//         }

//         if (results.length === 0) {
//           return connection.rollback(() => {
//             connection.release();
//             res.status(404).send('No doctors found for the given SubCatId');
//           });
//         }

//         let insertPromises = results.map((doctor) => {
//           return new Promise((resolve, reject) => {
//             connection.query(insertQuery, [
//               doctor.fk_emp_id,
//               doctor.cat_id,
//               toSubCatId,
//               doctor.name,
//               doctor.imgurl,
//               doctor.city,
//               doctor.therapy,
//               doctor.qualification,
//               doctor.mobile,
//               doctor.hospital
//             ], (insertErr) => {
//               if (insertErr) {
//                 return reject(insertErr);
//               }
//               resolve();
//             });
//           });
//         });

//         Promise.all(insertPromises)
//           .then(() => {
//             connection.commit((commitErr) => {
//               if (commitErr) {
//                 return connection.rollback(() => {
//                   connection.release();
//                   res.status(500).send('Failed to commit transaction');
//                 });
//               }

//               connection.release();
//               res.status(200).send({message:'Data copied successfully',errorCode :1});
//             });
//           })
//           .catch((insertErr) => {
//             connection.rollback(() => {
//               connection.release();
//               res.status(500).send('Error inserting data');
//             });
//           });
//       });
//     });
//   });
// });

app.post('/copy-doctors', (req, res) => {
  const { fromSubCatId, toSubCatId,catId } = req.body;
  console.log("inside copy  doctor")
  if (!fromSubCatId || !toSubCatId) {
    return res.status(400).send('fromSubCatId and toSubCatId are required');
  }

  const selectQuery = 'SELECT fk_emp_id, cat_id, subcat_id, name, imgurl, city, therapy, qualification, mobile, hospital FROM doctordata WHERE subcat_id = ? and status = "Y"';
  const checkQuery = 'SELECT COUNT(*) as count FROM doctordata WHERE subcat_id = ? AND name = ? AND status = "Y"';
  const insertQuery = 'INSERT INTO doctordata (fk_emp_id, cat_id, subcat_id, name, imgurl, city, therapy, qualification, mobile, hospital) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  db.getConnection((err, connection) => {
    if (err) {
      return res.status(500).send('Failed to get database connection');
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).send('Failed to start transaction');
      }

      connection.query(selectQuery, [fromSubCatId], (selectErr, results) => {
        if (selectErr) {
          return connection.rollback(() => {
            connection.release();
            res.status(500).send('Error fetching data');
          });
        }

        if (results.length === 0) {
          return connection.rollback(() => {
            connection.release();
            res.status(404).send('No doctors found for the given SubCatId');
          });
        }

        let insertPromises = results.map((doctor) => {
          return new Promise((resolve, reject) => {
            connection.query(checkQuery, [toSubCatId, doctor.name], (checkErr, checkResults) => {
              if (checkErr) {
                return reject(checkErr);
              }

              if (checkResults[0].count > 0) {
                // Doctor with the same name already exists in toSubCatId, skip insertion
                resolve();
              } else {
                // Insert the doctor into toSubCatId
                connection.query(insertQuery, [
                  doctor.fk_emp_id,
                  catId,
                  toSubCatId,
                  doctor.name,
                  doctor.imgurl,
                  doctor.city,
                  doctor.therapy,
                  doctor.qualification,
                  doctor.mobile,
                  doctor.hospital
                ], (insertErr) => {
                  if (insertErr) {
                    return reject(insertErr);
                  }
                  resolve();
                });
              }
            });
          });
        });

        Promise.all(insertPromises)
          .then(() => {
            connection.commit((commitErr) => {
              if (commitErr) {
                return connection.rollback(() => {
                  connection.release();
                  res.status(500).send('Failed to commit transaction');
                });
              }

              connection.release();
              res.status(200).send({message:'Data copied successfully',errorCode :1});
            });
          })
          .catch((err) => {
            connection.rollback(() => {
              connection.release();
              res.status(500).send('Error inserting data');
            });
          });
      });
    });
  });
});



// app.post('/copy-doctors', (req, res) => {
//   const { fromSubCatId, toSubCatId } = req.body;

//   if (!fromSubCatId || !toSubCatId) {
//     return res.status(400).send('fromSubCatId and toSubCatId are required');
//   }

//   const selectQuery = 'SELECT fk_emp_id, cat_id, subcat_id, name, imgurl, city, qualification, mobile, hospital FROM doctordata WHERE subcat_id = ?';
//   const insertQuery = 'INSERT INTO doctordata (fk_emp_id, cat_id, subcat_id, name, imgurl, city, qualification, mobile, hospital) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

//   db.getConnection((err, connection) => {
//     if (err) {
//       return res.status(500).send('Failed to get database connection');
//     }

//     const handleError = (error, message, status = 500) => {
//       if (error) {
//         console.error(error);
//       }
//       if (connection) {
//         connection.rollback(() => {
//           connection.release();
//           res.status(status).send(message);
//         });
//       } else {
//         res.status(status).send(message);
//       }
//     };

//     connection.beginTransaction((err) => {
//       if (err) {
//         return handleError(err, 'Failed to start transaction');
//       }

//       connection.query(selectQuery, [fromSubCatId], (selectErr, results) => {
//         if (selectErr) {
//           return handleError(selectErr, 'Error fetching data');
//         }

//         if (results.length === 0) {
//           return handleError(null, 'No doctors found for the given SubCatId', 404);
//         }

//         let insertPromises = results.map((doctor) => {
//           return new Promise((resolve, reject) => {
//             connection.query(insertQuery, [
//               doctor.fk_emp_id,
//               doctor.cat_id,
//               toSubCatId,
//               doctor.name,
//               doctor.imgurl,
//               doctor.city,
//               doctor.qualification,
//               doctor.mobile,
//               doctor.hospital
//             ], (insertErr) => {
//               if (insertErr) {
//                 return reject(insertErr);
//               }
//               resolve();
//             });
//           });
//         });

//         Promise.all(insertPromises)
//           .then(() => {
//             connection.commit((commitErr) => {
//               if (commitErr) {
//                 return handleError(commitErr, 'Failed to commit transaction');
//               }

//               connection.release();
//               res.status(200).send({ message: 'Data copied successfully', errorCode: 1 });
//             });
//           })
//           .catch((insertErr) => {
//             handleError(insertErr, 'Error inserting data');
//           });
//       });
//     });
//   });
// });

 
 // add doctor 
 app.post('/add-doctor',upload.single('image'), (req, res) => {
    const {empId, catId, subCatId, name, qualification,city,mobile,hospitalName,therapy } = req.body;
    const {filename} = req.file 
    const query = 'INSERT INTO doctordata (fk_emp_id,cat_id,subcat_id,imgurl,name,qualification,city,mobile,hospital,therapy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [empId,catId,subCatId,filename,name,qualification,city,mobile,hospitalName,therapy], (error, results) => {
      if (error) {
        console.error('Error saving image data: ', error);
        res.status(500).json({ error: 'Failed to add doctor data' });
        logger.error("error in add-doctor api", error.message);
        return;
      }
      const doctorId = results.insertId;
      res.status(200).json({ message: 'doctor added successfully',doctorId });
      logger.info(`doctor added successfully with empid ${empId}, doctorId ${doctorId}`)
      //console.log(results)
    });
  });
   




  // select singal doctor 

  app.get("/getdoctor/:id", (req,res)=>{
    const id = req.params.id;
    const selectQuery = "select * from doctordata where id=?"
    try {
        db.query(selectQuery,[id],(err,rows)=>{
            if(err){
                console.log(err)
            }
            else{
                res.send(rows)
            }
        })
    } catch (error) {
       res.send(error) 
    }
})


// get emp with id 
app.get("/getemp/:id", (req,res)=>{
  const id = req.params.id;
  const selectQuery = "select * from empmm where EmpCode=? and status='Y'"
  try {
      db.query(selectQuery,[id],(err,rows)=>{
          if(err){
              console.log(err)
          }
          else{
              res.send(rows)
          }
      })
  } catch (error) {
     res.send(error) 
  }
})


// select all doctor with respect to employee id 


app.post("/getdoctoremp", (req,res)=>{
  const {empId,catId,subCatId} = req.body;
  const selectQuery = "select * from doctordata where fk_emp_id = ? and cat_id = ? and subcat_id = ? and status = 'Y' ORDER BY name ASC"
  //const selectQuery = "select doctordata.name from doctordata inner join  employeedata on doctordata.fk_emp_id=?"
  try {
      db.query(selectQuery,[empId,catId,subCatId],(err,rows)=>{
          if(err){
              console.log(err)
          }
          else{
              res.send(rows)
          }
      })
  } catch (error) {
     res.send(error) 
  }
})

app.post("/getDoctorList", (req,res)=>{
  const {empId,catId,subCatId} = req.body;
  const selectQuery = "select * from doctordata where fk_emp_id = ? AND status = 'Y'"
  //const selectQuery = "select doctordata.name from doctordata inner join  employeedata on doctordata.fk_emp_id=?"
  try {
      db.query(selectQuery,[empId],(err,rows)=>{
          if(err){
              console.log(err)
          }
          else{
              res.send(rows)
          }
      })
  } catch (error) {
     res.send(error) 
  }
})


 



// delete doctor by id

//   app.delete("/delete/:id", (req,res)=>{
    
//     const id = req.params.id;
//     const imgQuery = 'select imgurl from doctordata where id = ?'
//     const deleteQuery = "delete from doctordata where id=?"
//     try {
//         db.query(imgQuery,[id],(err,rows)=>{
//             if(err){
//                 console.log(err)

//             }
//             else{
//               if(rows.length===0){
//                 res.status(404).json({ message: "Doctor not found"});
//               }
//               else{
//                 const imgName = rows[0].imgurl;
//                 db.query(deleteQuery, [id], (deleteErr, deleteResult) => {
//                   if (deleteErr) {
//                       res.status(500).json({
//                       errorCode: "0",
//                       errorDetail: deleteErr.message,
//                       responseData: {},
//                       status: "ERROR",
//                       details: "An internal server error occurred",
//                       getMessageInfo: "An internal server error occurred"
//                     });
//                   } else {
//                     fs.unlink(`./uploads/${imgName}`, (unlinkErr) => {
//                       if (unlinkErr) {
//                         res.json({unlinkErr});
//                       }
//                     });
//                     res.status(200).json({ message: "Doctor Deleted Successfully"});
//                   }
//                 });
//               }
               
//             }
//         })
//     } catch (error) {
//        res.send(error) 
//     }
// })

app.delete("/delete/:id", (req,res)=>{
    
      const id = req.params.id;
      const deleteQuery =  "update doctordata set status = 'N' where id=?"
      
        try {
          db.query(deleteQuery,[id],(err,rows)=>{
            if(err){
              res.send(err)
              logger.error("error in delete doctor", err.message);
            }
            else{
              if(rows.length===0){
               res.status(404).json({ message: "Doctor not found"});
               } 
               else{
                res.status(200).json({ message: "Doctor Deleted Successfully"})
                logger.info(`Doctor Deleted Successfully with docId ${id}`);
               }
            }
        })  
        } catch (error) {
          res.send(error)
        }
  })



//final update

  app.patch("/update/:id", upload.single('image'),(req, res) => {
    const id = req.params.id;
    //console.log(req.body)
  
    const {name, qualification,city,pimage,mobile,hospitalName,therapy} = req.body;
    
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
    // if (birthdate) {
    //   updateData.dateofbirth = birthdate;
    // }
    // if (speciality) {
    //   updateData.speciliaty = speciality;
    // }
    if (qualification) {
      updateData.qualification = qualification;
    }
    if (city) {
      updateData.city = city;
    }
    if(currentDate){
      updateData.modified_at = currentDate
    }
    if (mobile) {
      updateData.mobile = mobile;
    }
    if (hospitalName) {
      updateData.hospital = hospitalName;
    }
    if (therapy) {
      updateData.therapy = therapy;
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
  
  app.post("/getAllEmpDocExcel1",(req,res)=>{
    const {subCatId} = req.body;
    let query;
    if(subCatId){
       query = `
      SELECT
      empmm.EmpCode, empmm.EmployeeName, empmm.Designation, empmm.HQ,
      doctordata.name, doctordata.mobile, doctordata.hospital,doctordata.therapy,
      doctordata.city, doctordata.qualification,doctordata.created_at
      FROM doctordata
      LEFT JOIN empmm ON doctordata.fk_emp_id = empmm.EmpCode
      where doctordata.subcat_id = ? and empmm.status = 'Y' and doctordata.status = 'Y' ;
      `;
    }
    else{ query = `
      SELECT
      empmm.EmpCode, empmm.EmployeeName, empmm.Designation, empmm.HQ,
      doctordata.name, doctordata.mobile, doctordata.hospital,doctordata.therapy,
      doctordata.city, doctordata.qualification,doctordata.created_at
      FROM doctordata
      LEFT JOIN empmm ON doctordata.fk_emp_id = empmm.EmpCode
      where empmm.status = 'Y' and doctordata.status = 'Y' ;
      `;
    }
  db.query(query,[subCatId],(err,result)=>{
    if(err){
      res.send(err)
    }
    else{
      res.send(result)
    }
  })
  }) 

//   // get all employee
   
//   app.get("/getAllEmp",(req,res)=>{
    
//     const query = 'select * from  empmm';
//     db.query(query,(err,result)=>{
//       if(err){
//         res.send(err)
//       }
//       else{
//         res.send(result)
//       }
//     })
//   })
  
//  // get employee with pagination

//   app.get("/getemp",async(req,res)=>{

//     try {
//          const {page,limit} = req.query;
         
        
//          const offset = (page-1)*limit;

//          const query = 'select * from empmm limit ? offset ?'
//          db.query(query,[+limit,+offset],(err,result)=>{
//              if(err){
//               res.send(err)
//              }
//              else{
//               res.send(result)
//              }
//          })
         
//     } catch (error) {
//       console.log(error)
//     }
//   })
  

  // get doctor with pagination

  app.get("/getDoc",async(req,res)=>{

    try {
         const {page,limit} = req.query;
         
        
         const offset = (page-1)*limit;

         const query = 'select * from doctordata limit ? offset ?'
         db.query(query,[+limit,+offset],(err,result)=>{
             if(err){
              res.send(err)
             }
             else{
              res.send(result)
             }
         })
         
    } catch (error) {
      console.log(error)
    }
  })

  // download csv file 

  // app.get('/export-csv', (req, res) => {
  //   const tableName = 'empmm';
  //   const columnsToExport = ['EmpCode', 'EmployeeName', 'Designation', 'HQ'];
  
  //   db.query(`SELECT ${columnsToExport.join(',')} FROM ${tableName}`, (err, rows) => {
  //     if (err) {
  //       console.error('Error fetching data:', err);
  //       return res.status(500).json({ error: 'An error occurred while fetching data.' });
  //     }
  
  //     //const csvData = rows.map(row => columnsToExport.map(col => row[col]).join(','));

  //     const csvData = rows.map(row => {
  //       // Enclose city field in double quotes to handle commas
  //       const HQ = `"${row['HQ']}"`;
  //       return [row['EmpCode'], row['EmployeeName'], row['Designation'],HQ].join(',');
  //     });
  //     const csvContent = [columnsToExport.join(','), ...csvData].join('\n');
  
  //     fs.writeFile(`${tableName}_export.csv`, csvContent, err => {
  //       if (err) {
  //         console.error('Error saving CSV file:', err);
  //         return res.status(500).json({ error: 'An error occurred while saving CSV file.' });
  //       }
  
  //       res.download(`${tableName}_export.csv`, err => {
  //         if (err) {
  //           console.error('Error sending CSV file:', err);
  //         } else {
  //           console.log('CSV file sent successfully');
  //         }
  //       });
  //     });
  //   });
  // });

  // doctor csv 
  // app.get('/exportdoc-csv', (req, res) => {
  //   const tableName = 'doctordata';
  //   const columnsToExport = ['DoctorName', 'Date of Birth', 'Speciality', 'Qualification','MCL code','CreatedAt','ModiFiedAt'];

  
  // const query = 'SELECT doctordata.name, doctordata.dateofbirth, doctordata.speciliaty, doctordata.qualification, doctordata.mclcode,doctordata.created_at,doctordata.modified_at FROM doctordata'

  
  //   db.query(query, (err, rows) => {
  //     if (err) {
  //       console.error('Error fetching data:', err);
  //       return res.status(500).json({ error: 'An error occurred while fetching data.' });
  //     }
  
  //     const csvData = rows.map(row => {
        
  //       //const dateOfBirth = row['dateofbirth'].toISOString().split('T')[0]; // Format date
  //       return [row['name'], row['dateofbirth'], row['speciliaty'], row['mclcode'], row['qualification'],row['created_at'],row['modified_at']].join(',');
  //     });
  
  //     const csvContent = [columnsToExport.join(','), ...csvData].join('\n');
  
  //     fs.writeFile(`${tableName}_export.csv`, csvContent, err => {
  //       if (err) {
  //         console.error('Error saving CSV file:', err);
  //         return res.status(500).json({ error: 'An error occurred while saving CSV file.' });
  //       }
  
  //       res.download(`${tableName}_export.csv`, err => {
  //         if (err) {
  //           console.error('Error sending CSV file:', err);
  //         } else {
  //           console.log('CSV file sent successfully');
  //         }
  //       });
  //     });
  //   });
  // });

  // login employee
  app.post("/login",(req,res)=>{
    
    //console.log(req.body)
    const {empId,password} = req.body;
    const query = 'select * from empmm where EmpCode=? and status="Y"';

    db.query(query,[empId],(err,result)=>{
        if(err){
          //console.log("first",err)
          res.status(500).json({error:err})
        }
        else if(result.length===0){
         // console.log("second",result)
          res.status(401).json({message:"Invalid Email or Password"})
        }
        else{
          const user = result[0];
         // console.log("here",user)
          if(password===user.Password){
            res.json({message:"Login successful",empID:user.EmpCode,isPasswordReset:user.isPasswordReset})
          }
          else{
            res.status(401).json({message:"Invalid Email or Password"})
          }
        }
    })


  })

  // select all categeroy 

  app.get("/getCategory", (req, res) => {

    const query = "select catid,name from category where status = 'Y'";
    db.query(query, (err, rows) => {
      if (err) {
        res.send(err);
      } else {
        res.send( rows ); 
      }
    });
  });


  // select all subcategeroy 

  app.post("/getSubCategory", (req, res) => {
     const {catId} = req.body;
    const query = "select subcat_id,cat_id,name,date,isPoster from subcategory where cat_id = ? and status = 'Y'";
    db.query(query,[catId], (err, rows) => {
      if (err) {
        res.send(err);
      } else {
        res.send( rows ); 
      }
    });
  });

  

  app.post("/getCategoryBySubCatId", (req, res) => {
    const {catId,subCatId} = req.body;
   const query = "select subcat_id,cat_id,name from subcategory where subcat_id != ? and showSubCat = 'Y'";
   db.query(query,[subCatId], (err, rows) => {
     if (err) {
       res.send(err);
     } else {
       res.send( rows ); 
     }
   });
 });

   // get image name
   app.get("/getpostername/:id", (req, res) => {
    let id = req.params.id;
    
    const query = `
      SELECT cat_poster.postername 
      FROM category 
      INNER JOIN cat_poster ON category.catid = cat_poster.catid
      WHERE category.catid = ?
    `;
  
    db.query(query, [id], (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else {
       
        res.status(200).json(rows);
      }
    });
  });
  
  // heirerkey logic

  app.get("/getAllZM", (req,res)=>{
  

    const query = "select * from empmm where Role = 'ZM' and status='Y'"
    db.query(query,(error,result)=>{
      if(error){
        res.status(500).send(error)
      }
      else{
        res.status(200).json(result);
      }
    })
  })

  app.get("/getZonal/:id", (req,res)=>{
    const id = req.params.id;

    const query = 'select * from empmm where reporting =? and status="Y"'
    db.query(query,[id],(error,result)=>{
      if(error){
        res.status(500).send(error)
      }
      else{
        res.status(200).json(result);
      }
    })
  })

  app.get("/getRegional/:id", (req,res)=>{
    const id = req.params.id;

    const query = 'select * from empmm where reporting =? and status="Y"'
    db.query(query,[id],(error,result)=>{
      if(error){
        res.status(500).send(error)
      }
      else{
        res.status(200).json(result);
      }
    })
  })
  
  app.get("/getBusiness/:id", (req,res)=>{
    const id = req.params.id;

    const query = 'select * from empmm where reporting =? and status="Y"'
    db.query(query,[id],(error,result)=>{
      if(error){
        res.status(500).send(error)
      }
      else{
        res.status(200).json(result);
      }
    })
  })

  // app.get("/getExcel/:id", (req,res)=>{
  //   const id = req.params.id;

  //   const query = 'select * from empmm where reporting =?'
  //   db.query(query,[id],(error,result)=>{
  //     if(error){
  //       res.status(500).send(error)
  //     }
  //     else{
  //       console.log(result)
  //       const selectedColumnsData = result.map(item => {
  //         return {
  //           columnName1: item.EmpCode, // Replace with your actual column names
  //           columnName2: item.EmployeeName,
  //           columnName3: item.Designation,
  //           columnName4: item.HQ,

  //           // ... add more columns as needed
  //         };
  //       });
        
  //       console.log(selectedColumnsData)
  //       // Convert selected columns data to Excel format
  //       const xls = json2xls(selectedColumnsData);
    
  //       // Set response headers for Excel download
  //       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  //       res.setHeader('Content-Disposition', `attachment; filename=business_data_${id}.xlsx`);
    
  //       // Send the Excel data as response
  //       //res.send(xls);
        
  //     }
  //   })
  // })


  /////////////////////////////////////////////////////////////////////imp
  // app.get('/getExcel/:id', (req, res) => {
  //   const id = req.params.id;
  //   const tableName = 'empmm';
  //   const columnsToExport = ['EmpCode', 'EmployeeName', 'Designation', 'HQ'];
  //   let query;
  
  //   if (id=="1") {
  //     query = `SELECT ${columnsToExport.join(',')} FROM ${tableName}`;
  //   } else {
  //     query = `SELECT ${columnsToExport.join(',')} FROM ${tableName} WHERE reporting = ?`;
  //   }
  //   db.query(query, [id], (err, rows) => {
  //     if (err) {
  //       console.error('Error fetching data:', err);
  //       return res.status(500).json({ error: 'An error occurred while fetching data.' });
  //     }
  
  //     //const csvData = rows.map(row => columnsToExport.map(col => row[col]).join(','));

  //     const csvData = rows.map(row => {
  //       // Enclose city field in double quotes to handle commas
  //       const HQ = `"${row['HQ']}"`;
  //       return [row['EmpCode'], row['EmployeeName'], row['Designation'],HQ].join(',');
  //     });
  //     const csvContent = [columnsToExport.join(','), ...csvData].join('\n');
  
  //     fs.writeFile(`${tableName}_export.csv`, csvContent, err => {
  //       if (err) {
  //         console.error('Error saving CSV file:', err);
  //         return res.status(500).json({ error: 'An error occurred while saving CSV file.' });
  //       }
  
  //       res.download(`${tableName}_export.csv`, err => {
  //         if (err) {
  //           console.error('Error sending CSV file:', err);
  //         } else {
  //           console.log('CSV file sent successfully');
  //         }
  //       });
  //     });
  //   });
  // });

  // app.get('/getExcel/:id', (req, res) => {
  //   const id = req.params.id;
  //   const tableName = 'empmm';
  //   const columnsToExport = ['EmpCode', 'EmployeeName', 'Designation', 'HQ', 'DoctorCount'];
  //   let query;
  
  //   if (id=="1") {
  //     query = `SELECT
  //     empmm.EmpCode,
  //     empmm.EmployeeName,
  //     empmm.Designation,
  //     empmm.HQ,
  //     IFNULL(COUNT(doctordata.fk_emp_id), 0) AS doctorCount
  // FROM
  //     empmm
  // LEFT JOIN
  //     doctordata
  // ON
  //     empmm.EmpCode = doctordata.fk_emp_id
  // GROUP BY
  //     empmm.EmpCode,
  //     empmm.EmployeeName,
  //     empmm.Designation,
  //     empmm.HQ;
  // `;
  //   } else {
  //     query = `SELECT
  //     empmm.EmpCode,
  //     empmm.EmployeeName,
  //     empmm.Designation,
  //     empmm.HQ,
  //     IFNULL(COUNT(doctordata.fk_emp_id), 0) AS doctorCount
  // FROM
  //     empmm
  // LEFT JOIN
  //     doctordata
  // ON
  //     empmm.EmpCode = doctordata.fk_emp_id
  //     WHERE empmm.Reporting = ?
  // GROUP BY
  //     empmm.EmpCode,
  //     empmm.EmployeeName,
  //     empmm.Designation,
  //     empmm.HQ  `;
  //   }
  //   db.query(query, [id], (err, rows) => {
  //     if (err) {
  //       console.error('Error fetching data:', err);
  //       return res.status(500).json({ error: 'An error occurred while fetching data.' });
  //     }
  
  //     //const csvData = rows.map(row => columnsToExport.map(col => row[col]).join(','));

  //     const csvData = rows.map(row => {
  //       console.log(row)
  //       // Enclose city field in double quotes to handle commas
  //       const HQ = `"${row['HQ']}"`;
  //       return [row['EmpCode'], row['EmployeeName'], row['Designation'],HQ,row['doctorCount']].join(',');
  //     });
  //     const csvContent = [columnsToExport.join(','), ...csvData].join('\n');
  
  //     fs.writeFile(`${tableName}_export.csv`, csvContent, err => {
  //       if (err) {
  //         console.error('Error saving CSV file:', err);
  //         return res.status(500).json({ error: 'An error occurred while saving CSV file.' });
  //       }
  
  //       res.download(`${tableName}_export.csv`, err => {
  //         if (err) {
  //           console.error('Error sending CSV file:', err);
  //         } else {
  //           console.log('CSV file sent successfully');
  //         }
  //       });
  //     });
  //   });
  // });

  // app.get('/getExcel/:id', (req, res) => {
  //   const id = req.params.id;
  //   const tableName = 'empmm';
  //   const columnsToExport = ['EmpCode', 'EmployeeName', 'Designation', 'HQ'];
  //   const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  //   const limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not provided
  
  //   // Calculate the offset based on page and limit
  //   const offset = (page - 1) * limit;
  
  //   let query;
  
  //   if (id == "1") {
  //     query = `SELECT ${columnsToExport.join(',')} FROM ${tableName} LIMIT ${limit} OFFSET ${offset}`;
  //   } else {
  //     query = `SELECT ${columnsToExport.join(',')} FROM ${tableName} WHERE reporting = ? LIMIT ${limit} OFFSET ${offset}`;
  //   }
  
  //   db.query(query, [id], (err, rows) => {
  //     if (err) {
  //       console.error('Error fetching data:', err);
  //       return res.status(500).json({ error: 'An error occurred while fetching data.' });
  //     }
  
  //     const csvData = rows.map(row => {
  //       const HQ = `"${row['HQ']}"`;
  //       return [row['EmpCode'], row['EmployeeName'], row['Designation'], HQ].join(',');
  //     });
  //     const csvContent = [columnsToExport.join(','), ...csvData].join('\n');
  
  //     fs.writeFile(`${tableName}_export.csv`, csvContent, err => {
  //       if (err) {
  //         console.error('Error saving CSV file:', err);
  //         return res.status(500).json({ error: 'An error occurred while saving CSV file.' });
  //       }
  
  //       res.download(`${tableName}_export.csv`, err => {
  //         if (err) {
  //           console.error('Error sending CSV file:', err);
  //         } else {
  //           console.log('CSV file sent successfully');
  //         }
  //       });
  //     });
  
  //     // Get the doctor count for the specific employee
  //     let doctorCountQuery = `SELECT COUNT(*) AS doctorCount FROM doctordata WHERE fk_doc_id = ?`;
  //     db.query(doctorCountQuery, [id], (err, countRows) => {
  //       if (err) {
  //         console.error('Error fetching doctor count:', err);
  //         return res.status(500).json({ error: 'An error occurred while fetching doctor count.' });
  //       }
  
  //       const doctorCount = countRows[0].doctorCount;
  
  //       const paginatedData = rows.map(row => {
  //         const HQ = `"${row['HQ']}"`;
  //         return { empcode: row['EmpCode'], name: row['EmployeeName'], desi: row['Designation'], hq: HQ };
  //       });
  
  //       // Include doctor count in the response
  //       res.json({ doccount: doctorCount, data: paginatedData });
  //     });
  //   });
  // });
  // app.get('/getExcel/:id', (req, res) => {
  //   const id = req.params.id;
  //   const tableName = 'empmm';
  //   const columnsToExport = ['EmpCode', 'EmployeeName', 'Designation', 'HQ'];
  //   const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  //   const limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not provided
  
  //   // Calculate the offset based on page and limit
  //   const offset = (page - 1) * limit;
  
  //   let query;
  
  //   if (id == "1") {
  //     query = `SELECT ${columnsToExport.join(',')} FROM ${tableName} LIMIT ${limit} OFFSET ${offset}`;
  //   } else {
  //     query = `SELECT ${columnsToExport.join(',')} FROM ${tableName} WHERE reporting = ? LIMIT ${limit} OFFSET ${offset}`;
  //   }
  
  //   db.query(query, [id], (err, rows) => {
  //     if (err) {
  //       console.error('Error fetching data:', err);
  //       return res.status(500).json({ error: 'An error occurred while fetching data.' });
  //     }
      
      

  //     const csvData = rows.map(row => {
  //       // Enclose city field in double quotes to handle commas
  //       const HQ = `"${row['HQ']}"`;
  //       return [row['EmpCode'], row['EmployeeName'], row['Designation'],HQ].join(',');
  //     });
  //     const csvContent = [columnsToExport.join(','), ...csvData].join('\n');
  
  //     fs.writeFile(`${tableName}_export.csv`, csvContent, err => {
  //       if (err) {
  //         console.error('Error saving CSV file:', err);
  //         return res.status(500).json({ error: 'An error occurred while saving CSV file.' });
  //       }
  
  //       res.download(`${tableName}_export.csv`, err => {
  //         if (err) {
  //           console.error('Error sending CSV file:', err);
  //         } else {
  //           console.log('CSV file sent successfully');
  //         }
  //       });

  //     });
  //     // Get the doctor count for each employee
  //     const doctorCountQueries = rows.map(row => `SELECT COUNT(*) AS doctorCount FROM doctordata WHERE fk_emp_id = ${row['EmpCode']}`);
  //     Promise.all(doctorCountQueries.map(q => executeQuery(q)))
  //       .then(countResults => {
  //         const paginatedData = rows.map((row, index) => {
  //           const HQ = `${row['HQ']}`;
  //           const doctorCount = countResults[index][0].doctorCount;
  //           return { empcode: row['EmpCode'], name: row['EmployeeName'], desi: row['Designation'], hq: HQ, doccount: doctorCount };
  //         });
  
  //         res.json(paginatedData);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching doctor counts:', error);
  //         return res.status(500).json({ error: 'An error occurred while fetching doctor counts.' });
  //       });
  //   });
  // });
  // app.get('/getExcel/:id', async (req, res) => {
  //   const id = req.params.id;
  //   const tableName = 'empmm';
  //   const columnsToExport = ['EmpCode', 'EmployeeName', 'Designation', 'HQ'];
  //   const page = parseInt(req.query.page) || 1;
  //   const limit = parseInt(req.query.limit) || 10;
  //   const offset = (page - 1) * limit;
  
  //   let query;
  
  //   if (id == "1") {
  //     query = `SELECT ${columnsToExport.join(',')} FROM ${tableName} LIMIT ${limit} OFFSET ${offset}`;
  //   } else {
  //     query = `SELECT ${columnsToExport.join(',')} FROM ${tableName} WHERE reporting = ? LIMIT ${limit} OFFSET ${offset}`;
  //   }
  
  //   try {
  //     const rows = await executeQuery(query, [id]);
  
  //     const csvData = rows.map(row => {
  //       const HQ = `"${row['HQ']}"`;
  //       return [row['EmpCode'], row['EmployeeName'], row['Designation'], HQ].join(',');
  //     });
  //     const csvContent = [columnsToExport.join(','), ...csvData].join('\n');
  
  //     await new Promise((resolve, reject) => {
  //       fs.writeFile(`${tableName}_export.csv`, csvContent, err => {
  //         if (err) {
  //           console.error('Error saving CSV file:', err);
  //           reject(err);
  //         } else {
  //           console.log('CSV file saved successfully');
  //           resolve();
  //         }
  //       });
  //     });
  
  //     // Send the CSV download response
  //     res.download(`${tableName}_export.csv`, `${tableName}_export.csv`, err => {
  //       if (err) {
  //         console.error('Error sending CSV file:', err);
  //       } else {
  //         console.log('CSV file sent successfully');
  //       }
  //     });
  
  //     // Get the doctor count for each employee and send the JSON response
  //     const doctorCountQueries = rows.map(row => `SELECT COUNT(*) AS doctorCount FROM doctordata WHERE fk_emp_id = ${row['EmpCode']}`);
  //     const countResults = await Promise.all(doctorCountQueries.map(q => executeQuery(q)));
  
  //     const paginatedData = rows.map((row, index) => {
  //       const HQ = `${row['HQ']}`;
  //       const doctorCount = countResults[index][0].doctorCount;
  //       return { empcode: row['EmpCode'], name: row['EmployeeName'], desi: row['Designation'], hq: HQ, doccount: doctorCount };
  //     });
  
  //     res.json(paginatedData);
  //   } catch (error) {
  //     console.error('Error:', error);
  //     res.status(500).json({ error: 'An error occurred.' });
  //   }
  // });
  
  // Function to execute a query and return a Promise
  // function executeQuery(query, params) {
  //   return new Promise((resolve, reject) => {
  //     db.query(query, params, (err, result) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(result);
  //       }
  //     });
  //   });
  // }
  
  // get excel with doctor details 


  // app.get('/getEmpDoctor/:id', async (req, res) => {
  //   const id = req.params.id;
  //   const tableName = 'empmm';'
  
  //   const columnsToExport = ['EmpCode', 'EmployeeName', 'Designation', 'HQ'];
  //   const page = parseInt(req.query.page) || 1;
  //   const limit = parseInt(req.query.limit) || 10;
  //   const offset = (page - 1) * limit;
  
  //   let query;
  
  //   if (id == "1") {
  //     query = `SELECT ${columnsToExport.join(',')} FROM ${tableName} LIMIT ${limit} OFFSET ${offset}`;
  //   } else {
  //     query = `SELECT ${columnsToExport.join(',')} FROM ${tableName} WHERE reporting = ? LIMIT ${limit} OFFSET ${offset}`;
  //   }
  
  //   try {
  //     const rows = await new Promise((resolve, reject) => {
  //       db.query(query, [id], (err, result) => {
  //         if (err) {
  //           reject(err);
  //         } else {
  //           resolve(result);
  //         }
  //       });
  //     });
  
  //     // Get the doctor count for each employee
  //     const doctorCountQueries = rows.map(row => `SELECT COUNT(*) AS doctorCount FROM doctordata WHERE fk_emp_id = ${row['EmpCode']}`);
  //     const countResults = await Promise.all(doctorCountQueries.map(q => {
  //       return new Promise((resolve, reject) => {
  //         db.query(q, (err, result) => {
  //           if (err) {
  //             reject(err);
  //           } else {
  //             resolve(result);
  //           }
  //         });
  //       });
  //     }));
  
  //     const paginatedData = rows.map((row, index) => {
  //       const HQ = `${row['HQ']}`;
  //       const doctorCount = countResults[index][0].doctorCount;
  //       return { empcode: row['EmpCode'], name: row['EmployeeName'], desi: row['Designation'], hq: HQ, doccount: doctorCount };
  //     });
  
  //     res.json(paginatedData);
  //   } catch (error) {
  //     console.error('Error:', error);
  //     res.status(500).json({ error: 'An error occurred.' });
  //   }
  // });

  // app.get('/getEmpDoctor/:id', async (req, res) => {
  //   const id = req.params.id;
  //   const tableName = 'empmm';
  //   const columnsToExport = ['EmpCode', 'EmployeeName', 'Designation', 'HQ'];
  //   const page = parseInt(req.query.page) || 1;
  //   const limit = parseInt(req.query.limit) || 10;
  //   const offset = (page - 1) * limit;
  
  //   let totalResults = 0; // To store the total result count
  
  //   let query;
    
  //   if (id == "1") {
  //     query = `SELECT ${columnsToExport.join(',')} FROM ${tableName} LIMIT ${limit} OFFSET ${offset}`;
  //   } else {
  //     query = `SELECT ${columnsToExport.join(',')} FROM ${tableName} WHERE reporting = ? LIMIT ${limit} OFFSET ${offset}`;
  //   }
  
  //   const totalQuery = id == "1" 
  //     ? `SELECT COUNT(*) AS totalCount FROM ${tableName}` 
  //     : `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE reporting = ?`; // Query to get total count
    
  //   try {
  //     // Execute the query to get the total count
  //     const totalCountResult = await new Promise((resolve, reject) => {
  //       db.query(totalQuery, id == "1" ? [] : [id], (err, result) => {
  //         if (err) {
  //           reject(err);
  //         } else {
  //           resolve(result);
  //         }
  //       });
  //     });
  
  //     // Extract the total count from the result
  //     totalResults = totalCountResult[0].totalCount;
  
  //     // Execute the main query to fetch paginated data
  //     const rows = await new Promise((resolve, reject) => {
  //       db.query(query, [id], (err, result) => {
  //         if (err) {
  //           reject(err);
  //         } else {
  //           resolve(result);
  //         }
  //       });
  //     });
  
  //     const doctorCountQueries = rows.map(row => `SELECT COUNT(*) AS doctorCount FROM doctordata WHERE fk_emp_id = ${row['EmpCode']}`);
  //     const countResults = await Promise.all(doctorCountQueries.map(q => {
  //       return new Promise((resolve, reject) => {
  //         db.query(q, (err, result) => {
  //           if (err) {
  //             reject(err);
  //           } else {
  //             resolve(result);
  //           }
  //         });
  //       });
  //     }));

  //     const paginatedData = rows.map((row, index) => {
  //       const HQ = `${row['HQ']}`;
  //       const doctorCount = countResults[index][0].doctorCount;
  //       return { empcode: row['EmpCode'], name: row['EmployeeName'], desi: row['Designation'], hq: HQ, doccount: doctorCount };
  //     });
  
  //     const responseData = {
  //       totalResults: totalResults,
  //       paginatedData: paginatedData
  //     };
  
  //     res.json(responseData);
  //   } catch (error) {
  //     console.error('Error:', error);
  //     res.status(500).json({ error: 'An error occurred.' });
  //   }
  // });

  // app.get('/getEmpDoctor/:id', async (req, res) => {
  //   const id = req.params.id;
  //   const searchName = req.query.searchName || ''; // Get search query from query parameters
  //   const tableName = 'empmm';
  //   const columnsToExport = ['EmpCode', 'EmployeeName', 'Designation', 'HQ'];
  //   const page = parseInt(req.query.page) || 1;
  //   const limit = parseInt(req.query.limit) || 10;
  //   const offset = (page - 1) * limit;
  
  //   let totalResults = 0;
    
  //   let query;
  //   let queryParams = [id];
    
  //   if (id == "1") {
  //     query = `SELECT ${columnsToExport.join(',')} FROM ${tableName}`;
  //   } else {
  //     query = `SELECT ${columnsToExport.join(',')} FROM ${tableName} WHERE reporting = ?`;
  //   }
    
  //   // Add search functionality
  //   if (searchName) {
  //     query += ` AND EmployeeName LIKE ?`; // Correct placement of the AND keyword
  //     queryParams.push(`%${searchName}%`);
  //   }
    
  //   query += ` LIMIT ${limit} OFFSET ${offset}`;
    
    
  //   const totalQuery = id == "1" 
  //     ? `SELECT COUNT(*) AS totalCount FROM ${tableName}` 
  //     : `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE reporting = ?`;
  
  //   try {
  //     const totalCountResult = await new Promise((resolve, reject) => {
  //       db.query(totalQuery, id == "1" ? [] : [id], (err, result) => {
  //         if (err) {
  //           reject(err);
  //         } else {
  //           resolve(result);
  //         }
  //       });
  //     });
  
  //     totalResults = totalCountResult[0].totalCount;
  
  //     const rows = await new Promise((resolve, reject) => {
  //       db.query(query, queryParams, (err, result) => {
  //         if (err) {
  //           reject(err);
  //         } else {
  //           resolve(result);
  //         }
  //       });
  //     });
  
  //     const doctorCountQueries = rows.map(row => `SELECT COUNT(*) AS doctorCount FROM doctordata WHERE fk_emp_id = ${row['EmpCode']}`);
  //     const countResults = await Promise.all(doctorCountQueries.map(q => {
  //       return new Promise((resolve, reject) => {
  //         db.query(q, (err, result) => {
  //           if (err) {
  //             reject(err);
  //           } else {
  //             resolve(result);
  //           }
  //         });
  //       });
  //     }));
  
  //     const paginatedData = rows.map((row, index) => {
  //       const HQ = `${row['HQ']}`;
  //       const doctorCount = countResults[index][0].doctorCount;
  //       return { empcode: row['EmpCode'], name: row['EmployeeName'], desi: row['Designation'], hq: HQ, doccount: doctorCount };
  //     });
  
  //     const responseData = {
  //       totalResults: totalResults,
  //       paginatedData: paginatedData
  //     };
  
  //     res.json(responseData);
  //   } catch (error) {
  //     console.error('Error:', error);
  //     res.status(500).json({ error: 'An error occurred.' });
  //   }
  // });

  //working code with search and pagination 
  // app.get('/getEmpDoctor/:id', async (req, res) => {
  //   const id = req.params.id;
  //   const searchName = req.query.searchName || ''; // Get search query from query parameters
  //   const tableName = 'empmm';
  //   const columnsToExport = ['EmpCode', 'EmployeeName', 'Designation', 'HQ'];
  //   const page = parseInt(req.query.page) || 1;
  //   const limit = parseInt(req.query.limit) || 10;
  //   const offset = (page - 1) * limit;
  
  //   let totalResults = 0;
    
  //   let query;
  //   let queryParams = [];
    
  //   if (id === "1") {
  //     query = `SELECT ${columnsToExport.join(',')} FROM ${tableName}`;
  //   } else {
  //     query = `SELECT ${columnsToExport.join(',')} FROM ${tableName} WHERE reporting = ?`;
  //     queryParams.push(id);
    
  //   }
    
  //   if (searchName) {
  //     query += ` AND EmployeeName LIKE '%${searchName}%'`;
  //     queryParams.push(`%${searchName}%`);
  //   }
  //   query += ` LIMIT ${limit} OFFSET ${offset}`;
    
  //   console.log("Generated SQL Query:", query);
    
  //   //const totalQuery = id === "1" 
  //    // ? `SELECT COUNT(*) AS totalCount FROM ${tableName}`
  //    // :`SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE reporting = ?${searchName ? ` AND EmployeeName LIKE '%${searchName}%'` : ''}`; 
  //     //: `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE reporting = ?`;

  //     const totalQuery = id === "1" 
  // ? `SELECT COUNT(*) AS totalCount FROM ${tableName}${searchName ? ` WHERE EmployeeName LIKE '%${searchName}%'` : ''}` 
  // : `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE reporting = ?${searchName ? ` AND EmployeeName LIKE '%${searchName}%'` : ''}`;
  
  //   try {
  //     const totalCountResult = await new Promise((resolve, reject) => {
  //       db.query(totalQuery, queryParams, (err, result) => {
  //         if (err) {
  //           reject(err);
  //         } else {
  //           resolve(result);
  //         }
  //       });
  //     });
  
  //     totalResults = totalCountResult[0].totalCount;
  
  //     const rows = await new Promise((resolve, reject) => {
  //       db.query(query, queryParams, (err, result) => {
  //         if (err) {
  //           reject(err);
  //         } else {
  //           resolve(result);
  //         }
  //       });
  //     });
  
  //     const doctorCountQueries = rows.map(row => `SELECT COUNT(*) AS doctorCount FROM doctordata WHERE fk_emp_id = ${row['EmpCode']}`);
  //     const countResults = await Promise.all(doctorCountQueries.map(q => {
  //       return new Promise((resolve, reject) => {
  //         db.query(q, (err, result) => {
  //           if (err) {
  //             reject(err);
  //           } else {
  //             resolve(result);
  //           }
  //         });
  //       });
  //     }));
  
  //     const paginatedData = rows.map((row, index) => {
  //       const HQ = `${row['HQ']}`;
  //       const doctorCount = countResults[index][0].doctorCount;
  //       return { empcode: row['EmpCode'], name: row['EmployeeName'], desi: row['Designation'], hq: HQ, doccount: doctorCount };
  //     });
  
  //     const responseData = {
  //       totalResults: totalResults,
  //       paginatedData: paginatedData
  //     };
  
  //     res.json(responseData);
  //   } catch (error) {
  //     console.error('Error:', error);
  //     res.status(500).json({ error: 'An error occurred.' });
  //   }
  // });
  
  
  



  // app.get('/getExcelDoc/:id', (req, res) => {
  //   const id = req.params.id;
  //   const tableName = 'empmm';
  //   const columnsToExport = [
  //     'EmpCode', 'EmployeeName', 'Designation', 'HQ',
  //     'DoctorName', 'DoctorDOB', 'Speciliaty', 'MCLCode', 'Qualification','Created_at','Modified_at'
  //   ];
  
  //   let query = `
  //     SELECT
  //       empmm.EmpCode, empmm.EmployeeName, empmm.Designation, empmm.HQ,
  //       doctordata.name, doctordata.dateofbirth, doctordata.speciliaty,
  //       doctordata.mclcode, doctordata.qualification,doctordata.created_at,doctordata.modified_at
  //     FROM empmm
  //     INNER JOIN doctordata ON empmm.EmpCode = doctordata.fk_emp_id
  //     WHERE empmm.EmpCode = ?;
  //   `;
  
  //   db.query(query, [id], (err, rows) => {
  //     if (err) {
  //       console.error('Error fetching data:', err);
  //       return res.status(500).json({ error: 'An error occurred while fetching data.' });
  //     }
  
  //     const csvData = rows.map(row => {
  //       const HQ = `"${row['HQ']}"`;
  //       //const dateOfBirth = row['dateofbirth'].toISOString().split('T')[0]; // Format date
  //       return [row['EmpCode'], row['EmployeeName'], row['Designation'], HQ, row['name'], row['dateofbirth'], row['speciliaty'], row['mclcode'], row['qualification'],row['created_at'], row['modified_at']].join(',');
  //     });
  
  //     const csvContent = [columnsToExport.join(','), ...csvData].join('\n');
  
  //     fs.writeFile(`${tableName}_export.csv`, csvContent, err => {
  //       if (err) {
  //         console.error('Error saving CSV file:', err);
  //         return res.status(500).json({ error: 'An error occurred while saving CSV file.' });
  //       }
  
  //       res.download(`${tableName}_export.csv`, err => {
  //         if (err) {
  //           console.error('Error sending CSV file:', err);
  //         } else {
  //           console.log('CSV file sent successfully');
  //         }
  //       });
  //     });
  //   });
  // });
  

  // add poster with respect to employee 

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
      //console.log(results)
    });
  });
  
  // for poster zip download 

  app.get("/getPoster", (req, res) => {
    const query = 'SELECT empmm.EmployeeName,empmm.EmpCode, emp_poster.postername FROM empmm INNER JOIN emp_poster ON empmm.EmpCode = emp_poster.emp_poid';
    
    db.query(query, (error, result) => {
      if (error) {
        res.status(500).send(error);
      } else {
        const poslength = result.length
        const transformedResult = result.reduce((acc, entry) => {
          const employee = acc.find(item => item.name === entry.EmployeeName);
          if (!employee) {
            acc.push({
              name: entry.EmployeeName,
              code: entry.EmpCode,
              posters: [{ posterUrl: entry.postername }],
            });
          } else {
            employee.posters.push({ posterUrl: entry.postername });
          }
          return acc;
        }, []);
        res.status(200).send({transformedResult,poslength});
      }
    });
  });


  // employee with doctor data

  app.get("/getEmpDoc", (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const offset = (page - 1) * limit;
  
    const query = `SELECT empmm.EmployeeName, empmm.EmpCode, empmm.HQ, empmm.Designation, doctordata.name as docName
                   FROM empmm LEFT JOIN doctordata ON empmm.EmpCode = doctordata.fk_emp_id 
                   WHERE empmm.status = 'Y'
                   LIMIT ${limit} OFFSET ${offset}`;
    
    db.query(query, (error, result) => {
      if (error) {
        res.status(500).send(error);
      } else {
        const transformedResult = result.reduce((acc, entry) => {
          const existingEmployee = acc.find(item => item.code === entry.EmpCode);
    
          if (!existingEmployee) {
            acc.push({
              code: entry.EmpCode,
              name: entry.EmployeeName,
              hq: entry.HQ,
              designation: entry.Designation,
              doctors: entry.docName
                ? [
                    {
                      name: entry.docName,
                    },
                  ]
                : [],
            });
          } else if (entry.docName) {
            existingEmployee.doctors.push({
              name: entry.docName,
            });
          }
    
          return acc;
        }, []);
    
        res.status(200).send(transformedResult);
      }
    });
  });


  // app.post('/upload', upload.single('file'), (req, res) => {
  //   const filePath = req.file.path;
  //   const results = [];
  
  //   fs.createReadStream(filePath)
  //     .pipe(csv())
  //     .on('data', (data) => results.push(data))
  //     .on('end', () => {
  //       results.forEach((row) => {
  //         const sql = 'INSERT INTO doctordata SET ?';
  //         db.query(sql, row, (err, result) => {
  //           if (err) {
  //             console.error('Error inserting data:', err);
  //             return res.status(500).json({ error: 'Failed to insert data', errorCode:0 });
  //           }
  //         });
  //       });

      
  //       fs.unlinkSync(filePath); // delete the file after processing
  //       res.status(200).json({ message: 'File uploaded and data inserted successfully!', errorCode:1 });
  //     });
  // });
  
  app.post('/upload', upload.single('file'), async (req, res) => {
    try {
      const filePath = req.file.path;
      const results = [];
  
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            for (const row of results) {
              const sql = 'INSERT INTO doctordata SET ?';
              await new Promise((resolve, reject) => {
                db.query(sql, row, (err, result) => {
                  if (err) {
                    console.error('Error inserting data:', err);
                    if (err.code === 'ER_BAD_FIELD_ERROR') {
                      fs.unlinkSync(filePath);
                      return reject(new Error(`Unknown column error: ${err.message}`));
                    }
                    return reject(new Error(`Failed to insert data: ${err.message}`));
                  }
                  resolve(result);
                });
              });
            }
  
            fs.unlinkSync(filePath); // delete the file after processing
            res.status(200).json({ message: 'File uploaded and data inserted successfully!', errorCode: 1 });
          } catch (err) {
            console.error('Error during CSV processing:', err);
            res.status(500).json({ error: err.message, errorCode: 0 });
          }
        })
        .on('error', (err) => {
          console.error('Error reading CSV file:', err);
          res.status(500).json({ error: 'Failed to read CSV file', errorCode: 0 });
        });
    } catch (err) {
      console.error('Error during file upload:', err);
      res.status(500).json({ error: 'File upload failed', errorCode: 0 });
    }
  });


  /// for dashboard api

   // get all employee
   
   app.get("/getAllEmpWithPagination",(req,res)=>{
    
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.limit) || 20; // Default to 10 records per page if not provided
  
    // Calculate the offset
    const offset = (page - 1) * pageSize;
  
    // Update the query to include LIMIT and OFFSET
    const query = `
      SELECT
        empmm.EmpCode,
        empmm.EmployeeName,
        empmm.Designation,
        empmm.HQ,
        empmm.Region,
        empmm.State,
        empmm.Zone,
        IFNULL(COUNT(doctordata.fk_emp_id), 0) AS doctorCount
      FROM
        empmm
      LEFT JOIN
        doctordata
      ON
        empmm.EmpCode = doctordata.fk_emp_id
        WHERE empmm.status = 'Y'
      GROUP BY
        empmm.EmpCode,
        empmm.EmployeeName,
        empmm.Designation,
        empmm.HQ,
        empmm.Region,
        empmm.State,
        empmm.Zone
      LIMIT ?
      OFFSET ?;
    `;
    db.query(query,[pageSize, offset],(err,result)=>{
      if(err){
        res.send(err)
      }
      else{
        res.send(result)
      }
    })
  })

  app.get("/getAllEmp/:id",(req,res)=>{
    const search = req.query.search || '';
    const id = req.params.id
     
    if(id !=="1"){
      query = `SELECT
      empmm.EmpCode,
      empmm.EmployeeName,
      empmm.Designation,
      empmm.HQ,
      empmm.Region,
      empmm.State,
      empmm.Zone,
      IFNULL(COUNT(doctordata.fk_emp_id), 0) AS doctorCount
  FROM
      empmm
     
  LEFT JOIN
      doctordata
  ON
      empmm.EmpCode = doctordata.fk_emp_id
       WHERE
        empmm.Reporting = ? 
        AND empmm.status = 'Y'
        AND (empmm.EmployeeName LIKE ? OR empmm.HQ LIKE ?)
  GROUP BY
      empmm.EmpCode,
      empmm.EmployeeName,
      empmm.Designation,
      empmm.HQ,
      empmm.Region,
      empmm.State,
      empmm.Zone;
  `;
  }
  else{
    query = `SELECT
    empmm.EmpCode,
    empmm.EmployeeName,
    empmm.Designation,
    empmm.HQ,
    empmm.Region,
    empmm.State,
    empmm.Zone,
    IFNULL(COUNT(doctordata.fk_emp_id), 0) AS doctorCount
FROM
    empmm
   
LEFT JOIN
    doctordata
ON
    empmm.EmpCode = doctordata.fk_emp_id
     WHERE
     empmm.status = 'Y'  AND 
     (empmm.EmployeeName LIKE ? OR empmm.HQ LIKE ?)
      
GROUP BY
    empmm.EmpCode,
    empmm.EmployeeName,
    empmm.Designation,
    empmm.HQ,
    empmm.Region,
    empmm.State,
    empmm.Zone;
`;
  }
  const queryParams = id !== "1" ? [id, `%${search}%`, `%${search}%`] : [`%${search}%`, `%${search}%`];
    db.query(query,queryParams,(err,result)=>{
      if(err){
        res.send(err)
      }
      else{
        res.send(result)
      }
    })
  }) 



  
 // get employee with pagination

//  app.get("/getAllEmpReport/:id", (req, res) => {
//   // Get pagination parameters from the query string
//   const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
//   const pageSize = parseInt(req.query.limit) || 20; // Default to 10 records per page if not provided

//   // Calculate the offset
//   const offset = (page - 1) * pageSize;

//   // Update the query to include LIMIT and OFFSET
//   const query = `
//     SELECT
//       empmm.EmpCode,
//       empmm.EmployeeName,
//       empmm.Designation,
//       empmm.HQ,
//       empmm.Region,
//       empmm.State,
//       empmm.Zone,
//       IFNULL(COUNT(doctordata.fk_emp_id), 0) AS doctorCount
//     FROM
//       empmm
//     LEFT JOIN
//       doctordata
//     ON
//       empmm.EmpCode = doctordata.fk_emp_id
//     GROUP BY
//       empmm.EmpCode,
//       empmm.EmployeeName,
//       empmm.Designation,
//       empmm.HQ,
//       empmm.Region,
//       empmm.State,
//       empmm.Zone
//     LIMIT ?
//     OFFSET ?;
//   `;

//   db.query(query, [pageSize, offset], (err, result) => {
//     if (err) {
//       res.send(err);
//     } else {
//       // Get the total count of records without pagination
//       const countQuery = `
//         SELECT COUNT(DISTINCT empmm.EmpCode) AS totalRecords
//         FROM empmm
//       `;
      
//       db.query(countQuery, (countErr, countResult) => {
//         if (countErr) {
//           res.send(countErr);
//         } else {
//           const totalRecords = countResult[0].totalRecords;
//           res.send({
//             page,
//             pageSize,
//             totalRecords,
//             totalPages: Math.ceil(totalRecords / pageSize),
//             data: result
//           });
//         }
//       });
//     }
//   });
// });

// app.get("/getAllEmpReport/:id", (req, res) => {
//   // Get pagination parameters from the query string
//   const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
//   const pageSize = parseInt(req.query.limit) || 20; // Default to 20 records per page if not provided
//   const search = req.query.search || ''; // Get the search term from query string, default to empty string
//   const id = req.params.id
//   // Calculate the offset
//   const offset = (page - 1) * pageSize;

//   // Update the query to include LIMIT, OFFSET, and search functionality

//   let query;
//    if(id !== "1"){
//     console.log("inside if",id)
//     query = `
//     SELECT
//       empmm.EmpCode,
//       empmm.EmployeeName,
//       empmm.Designation,
//       empmm.HQ,
//       empmm.Region,
//       empmm.State,
//       empmm.Zone,
//       IFNULL(COUNT(doctordata.fk_emp_id), 0) AS doctorCount
//     FROM
//       empmm
//     LEFT JOIN
//       doctordata
//     ON
//       empmm.EmpCode = doctordata.fk_emp_id
//     WHERE
//       empmm.Reporting = ${id}
//       and empmm.EmployeeName LIKE ?
//     GROUP BY
//       empmm.EmpCode,
//       empmm.EmployeeName,
//       empmm.Designation,
//       empmm.HQ,
//       empmm.Region,
//       empmm.State,
//       empmm.Zone
//     LIMIT ?
//     OFFSET ?;
//   `;
//    }else{
//     query = `
//     SELECT
//       empmm.EmpCode,
//       empmm.EmployeeName,
//       empmm.Designation,
//       empmm.HQ,
//       empmm.Region,
//       empmm.State,
//       empmm.Zone,
//       IFNULL(COUNT(doctordata.fk_emp_id), 0) AS doctorCount
//     FROM
//       empmm
//     LEFT JOIN
//       doctordata
//     ON
//       empmm.EmpCode = doctordata.fk_emp_id
//     WHERE
//       empmm.EmployeeName LIKE ?
//     GROUP BY
//       empmm.EmpCode,
//       empmm.EmployeeName,
//       empmm.Designation,
//       empmm.HQ,
//       empmm.Region,
//       empmm.State,
//       empmm.Zone
//     LIMIT ?
//     OFFSET ?;
//   `;
//    }

//   db.query(query, [`%${search}%`, pageSize, offset], (err, result) => {
//     if (err) {
//       res.send(err);
//     } else {
//       // Get the total count of records without pagination, including search functionality
//       const countQuery = `
//         SELECT COUNT(DISTINCT empmm.EmpCode) AS totalRecords
//         FROM empmm
//         WHERE empmm.EmployeeName LIKE ?;
//       `;
      
//       db.query(countQuery, [`%${search}%`], (countErr, countResult) => {
//         if (countErr) {
//           res.send(countErr);
//         } else {
//           const totalRecords = countResult[0].totalRecords;
//           res.send({
//             page,
//             pageSize,
//             totalRecords,
//             totalPages: Math.ceil(totalRecords / pageSize),
//             data: result
//           });
//         }
//       });
//     }
//   });
// });

// app.get("/getAllEmpReport/:id", (req, res) => {
//   // Get the id parameter from the route
//   const id = req.params.id;

//   // Get pagination parameters from the query string
//   const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
//   const pageSize = parseInt(req.query.limit) || 20; // Default to 20 records per page if not provided
//   const search = req.query.search || ''; // Get the search term from query string, default to empty string

//   // Calculate the offset
//   const offset = (page - 1) * pageSize;

//   // Construct the query based on the id parameter
//   let query;
//   if (id !== "1") {
//     query = `
//       SELECT
//         empmm.EmpCode,
//         empmm.EmployeeName,
//         empmm.Designation,
//         empmm.HQ,
//         empmm.Region,
//         empmm.State,
//         empmm.Zone,
//         IFNULL(COUNT(doctordata.fk_emp_id), 0) AS doctorCount
//       FROM
//         empmm
//       LEFT JOIN
//         doctordata
//       ON
//         empmm.EmpCode = doctordata.fk_emp_id
//       WHERE
//         empmm.Reporting = ?
//         AND empmm.EmployeeName LIKE ?
//       GROUP BY
//         empmm.EmpCode,
//         empmm.EmployeeName,
//         empmm.Designation,
//         empmm.HQ,
//         empmm.Region,
//         empmm.State,
//         empmm.Zone
//       LIMIT ?
//       OFFSET ?;
//     `;
//   } else {
//     query = `
//       SELECT
//         empmm.EmpCode,
//         empmm.EmployeeName,
//         empmm.Designation,
//         empmm.HQ,
//         empmm.Region,
//         empmm.State,
//         empmm.Zone,
//         IFNULL(COUNT(doctordata.fk_emp_id), 0) AS doctorCount
//       FROM
//         empmm
//       LEFT JOIN
//         doctordata
//       ON
//         empmm.EmpCode = doctordata.fk_emp_id
//       WHERE
//         empmm.EmployeeName LIKE ?
//       GROUP BY
//         empmm.EmpCode,
//         empmm.EmployeeName,
//         empmm.Designation,
//         empmm.HQ,
//         empmm.Region,
//         empmm.State,
//         empmm.Zone
//       LIMIT ?
//       OFFSET ?;
//     `;
//   }

//   // Execute the query
//   db.query(query, id !== "1" ? [id, `%${search}%`, pageSize, offset] : [`%${search}%`, pageSize, offset], (err, result) => {
//     if (err) {
//       res.send(err);
//     } else {
//       // Get the total count of records without pagination, including search functionality
//       const countQuery = id !== "1" ?
//         `
//           SELECT COUNT(DISTINCT empmm.EmpCode) AS totalRecords
//           FROM empmm
//           WHERE empmm.Reporting = ?
//           AND empmm.EmployeeName LIKE ?;
//         ` :
//         `
//           SELECT COUNT(DISTINCT empmm.EmpCode) AS totalRecords
//           FROM empmm
//           WHERE empmm.EmployeeName LIKE ?;
//         `;

//       db.query(countQuery, id !== "1" ? [id, `%${search}%`] : [`%${search}%`], (countErr, countResult) => {
//         if (countErr) {
//           res.send(countErr);
//         } else {
//           const totalRecords = countResult[0].totalRecords;
//           res.send({
//             page,
//             pageSize,
//             totalRecords,
//             totalPages: Math.ceil(totalRecords / pageSize),
//             data: result
//           });
//         }
//       });
//     }
//   });
// });


 // working code
// app.get("/getAllEmpReport/:id", (req, res) => {
//   // Get the id parameter from the route
//   const id = req.params.id;

//   // Get pagination parameters from the query string
//   const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
//   const pageSize = parseInt(req.query.limit) || 20; // Default to 20 records per page if not provided
//   const search = req.query.search || ''; // Get the search term from query string, default to empty string

//   // Calculate the offset
//   const offset = (page - 1) * pageSize;

//   // Construct the query based on the id parameter
//   let query;
//   if (id !== "1") {
//     query = `
//       SELECT
//         empmm.EmpCode,
//         empmm.EmployeeName,
//         empmm.Designation,
//         empmm.HQ,
//         empmm.Region,
//         empmm.State,
//         empmm.Zone,
//         IFNULL(COUNT(doctordata.fk_emp_id), 0) AS doctorCount
//       FROM
//         empmm
//       LEFT JOIN
//         doctordata
//       ON
//         empmm.EmpCode = doctordata.fk_emp_id
//       WHERE
//         empmm.Reporting = ?
//         AND (empmm.EmployeeName LIKE ? OR empmm.HQ LIKE ?)
//       GROUP BY
//         empmm.EmpCode,
//         empmm.EmployeeName,
//         empmm.Designation,
//         empmm.HQ,
//         empmm.Region,
//         empmm.State,
//         empmm.Zone
//       LIMIT ?
//       OFFSET ?;
//     `;
//   } else {
//     query = `
//       SELECT
//         empmm.EmpCode,
//         empmm.EmployeeName,
//         empmm.Designation,
//         empmm.HQ,
//         empmm.Region,
//         empmm.State,
//         empmm.Zone,
//         IFNULL(COUNT(doctordata.fk_emp_id), 0) AS doctorCount
//       FROM
//         empmm
//       LEFT JOIN
//         doctordata
//       ON
//         empmm.EmpCode = doctordata.fk_emp_id
//       WHERE
//         empmm.EmployeeName LIKE ? OR empmm.HQ LIKE ?
//       GROUP BY
//         empmm.EmpCode,
//         empmm.EmployeeName,
//         empmm.Designation,
//         empmm.HQ,
//         empmm.Region,
//         empmm.State,
//         empmm.Zone
//       LIMIT ?
//       OFFSET ?;
//     `;
//   }

//   // Execute the query
//   const queryParams = id !== "1" ? [id, `%${search}%`, `%${search}%`, pageSize, offset] : [`%${search}%`, `%${search}%`, pageSize, offset];
//   db.query(query, queryParams, (err, result) => {
//     if (err) {
//       res.send(err);
//     } else {
//       // Get the total count of records without pagination, including search functionality
//       const countQuery = id !== "1" ?
//         `
//           SELECT COUNT(DISTINCT empmm.EmpCode) AS totalRecords
//           FROM empmm
//           WHERE empmm.Reporting = ?
//           AND (empmm.EmployeeName LIKE ? OR empmm.HQ LIKE ?);
//         ` :
//         `
//           SELECT COUNT(DISTINCT empmm.EmpCode) AS totalRecords
//           FROM empmm
//           WHERE empmm.EmployeeName LIKE ? OR empmm.HQ LIKE ?;
//         `;

//       const countQueryParams = id !== "1" ? [id, `%${search}%`, `%${search}%`] : [`%${search}%`, `%${search}%`];
//       db.query(countQuery, countQueryParams, (countErr, countResult) => {
//         if (countErr) {
//           res.send(countErr);
//         } else {
//           const totalRecords = countResult[0].totalRecords;
//           res.send({
//             page,
//             pageSize,
//             totalRecords,
//             totalPages: Math.ceil(totalRecords / pageSize),
//             data: result
//           });
//         }
//       });
//     }
//   });
// });





// app.post("/getAllEmpReport", (req, res) => {
//   // Get the id parameter from the route
//   const {id,catId,subCatId} = req.body;

//   // Get pagination parameters from the query string
//   const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
//   const pageSize = parseInt(req.query.limit) || 20; // Default to 20 records per page if not provided
//   const search = req.query.search || ''; // Get the search term from query string, default to empty string

//   // Calculate the offset
//   const offset = (page - 1) * pageSize;

//   // Construct the query based on the id parameter
//   let query;
//   if (id !== "1") {
//     if(catId && subCatId){
//       query = `
//       SELECT
//         empmm.EmpCode,
//         empmm.EmployeeName,
//         empmm.Designation,
//         empmm.HQ,
//         empmm.Region,
//         empmm.State,
//         empmm.Zone,
//         IFNULL(COUNT(doctordata.subcat_id), 0) AS doctorCount
//       FROM
//         empmm
//       LEFT JOIN
//         doctordata
//       ON
//         empmm.EmpCode = doctordata.fk_emp_id
//       WHERE
//         empmm.Reporting = ?
//         AND (empmm.EmployeeName LIKE ? OR empmm.HQ LIKE ?)
//       GROUP BY
//         empmm.EmpCode,
//         empmm.EmployeeName,
//         empmm.Designation,
//         empmm.HQ,
//         empmm.Region,
//         empmm.State,
//         empmm.Zone
//       LIMIT ?
//       OFFSET ?;
//     `;
//     }
//     else if(catId){
//       query = `
//       SELECT
//         empmm.EmpCode,
//         empmm.EmployeeName,
//         empmm.Designation,
//         empmm.HQ,
//         empmm.Region,
//         empmm.State,
//         empmm.Zone,
//         IFNULL(COUNT(doctordata.cat_id), 0) AS doctorCount
//       FROM
//         empmm
//       LEFT JOIN
//         doctordata
//       ON
//         empmm.EmpCode = doctordata.fk_emp_id
//       WHERE
//         empmm.Reporting = ?
//         AND (empmm.EmployeeName LIKE ? OR empmm.HQ LIKE ?)
//       GROUP BY
//         empmm.EmpCode,
//         empmm.EmployeeName,
//         empmm.Designation,
//         empmm.HQ,
//         empmm.Region,
//         empmm.State,
//         empmm.Zone
//       LIMIT ?
//       OFFSET ?;
//     `;
//     }
//     else{
//       query = `
//       SELECT
//         empmm.EmpCode,
//         empmm.EmployeeName,
//         empmm.Designation,
//         empmm.HQ,
//         empmm.Region,
//         empmm.State,
//         empmm.Zone,
//         IFNULL(COUNT(doctordata.fk_emp_id), 0) AS doctorCount
//       FROM
//         empmm
//       LEFT JOIN
//         doctordata
//       ON
//         empmm.EmpCode = doctordata.fk_emp_id
//       WHERE
//         empmm.Reporting = ?
//         AND (empmm.EmployeeName LIKE ? OR empmm.HQ LIKE ?)
//       GROUP BY
//         empmm.EmpCode,
//         empmm.EmployeeName,
//         empmm.Designation,
//         empmm.HQ,
//         empmm.Region,
//         empmm.State,
//         empmm.Zone
//       LIMIT ?
//       OFFSET ?;
//     `;
//     }
    
//   } else {

//    if(catId && subCatId){

//     query = `
//       SELECT
//         empmm.EmpCode,
//         empmm.EmployeeName,
//         empmm.Designation,
//         empmm.HQ,
//         empmm.Region,
//         empmm.State,
//         empmm.Zone,
//         IFNULL(COUNT(doctordata.subcat_id), 0) AS doctorCount
//       FROM
//         empmm
//       LEFT JOIN
//         doctordata
//       ON
//         empmm.EmpCode = doctordata.fk_emp_id
//       WHERE
//         empmm.EmployeeName LIKE ? OR empmm.HQ LIKE ?
//       GROUP BY
//         empmm.EmpCode,
//         empmm.EmployeeName,
//         empmm.Designation,
//         empmm.HQ,
//         empmm.Region,
//         empmm.State,
//         empmm.Zone
//       LIMIT ?
//       OFFSET ?;
//     `;
//    }
//    else if(catId){

//     query = `
//       SELECT
//         empmm.EmpCode,
//         empmm.EmployeeName,
//         empmm.Designation,
//         empmm.HQ,
//         empmm.Region,
//         empmm.State,
//         empmm.Zone,
//         IFNULL(COUNT(doctordata.cat_id), 0) AS doctorCount
//       FROM
//         empmm
//       LEFT JOIN
//         doctordata
//       ON
//         empmm.EmpCode = doctordata.fk_emp_id
//       WHERE
//         empmm.EmployeeName LIKE ? OR empmm.HQ LIKE ?
//       GROUP BY
//         empmm.EmpCode,
//         empmm.EmployeeName,
//         empmm.Designation,
//         empmm.HQ,
//         empmm.Region,
//         empmm.State,
//         empmm.Zone
//       LIMIT ?
//       OFFSET ?;
//     `;
//    }
//    else{

//     query = `
//       SELECT
//         empmm.EmpCode,
//         empmm.EmployeeName,
//         empmm.Designation,
//         empmm.HQ,
//         empmm.Region,
//         empmm.State,
//         empmm.Zone,
//         IFNULL(COUNT(doctordata.fk_emp_id), 0) AS doctorCount
//       FROM
//         empmm
//       LEFT JOIN
//         doctordata
//       ON
//         empmm.EmpCode = doctordata.fk_emp_id
//       WHERE
//         empmm.EmployeeName LIKE ? OR empmm.HQ LIKE ?
//       GROUP BY
//         empmm.EmpCode,
//         empmm.EmployeeName,
//         empmm.Designation,
//         empmm.HQ,
//         empmm.Region,
//         empmm.State,
//         empmm.Zone
//       LIMIT ?
//       OFFSET ?;
//     `;
//    }

//   }

//   // Execute the query
//   const queryParams = id !== "1" ? [id, `%${search}%`, `%${search}%`, pageSize, offset] : [`%${search}%`, `%${search}%`, pageSize, offset];
//   db.query(query, queryParams, (err, result) => {
//     if (err) {
//       res.send(err);
//     } else {
//       // Get the total count of records without pagination, including search functionality
//       const countQuery = id !== "1" ?
//         `
//           SELECT COUNT(DISTINCT empmm.EmpCode) AS totalRecords
//           FROM empmm
//           WHERE empmm.Reporting = ?
//           AND (empmm.EmployeeName LIKE ? OR empmm.HQ LIKE ?);
//         ` :
//         `
//           SELECT COUNT(DISTINCT empmm.EmpCode) AS totalRecords
//           FROM empmm
//           WHERE empmm.EmployeeName LIKE ? OR empmm.HQ LIKE ?;
//         `;

//       const countQueryParams = id !== "1" ? [id, `%${search}%`, `%${search}%`] : [`%${search}%`, `%${search}%`];
//       db.query(countQuery, countQueryParams, (countErr, countResult) => {
//         if (countErr) {
//           res.send(countErr);
//         } else {
//           const totalRecords = countResult[0].totalRecords;
//           res.send({
//             page,
//             pageSize,
//             totalRecords,
//             totalPages: Math.ceil(totalRecords / pageSize),
//             data: result
//           });
//         }
//       });
//     }
//   });
// });

app.post("/getAllEmpReport", (req, res) => {
  // Get the id parameter from the route
  const {id,catId,subCatId} = req.body;

  
  const search = req.query.search || ''; // Get the search term from query string, default to empty string

  let queryParams = [];
  // Construct the query based on the id parameter
  let query;
  if (id !== "1") {
    if(catId && subCatId){
      query = `
      SELECT
        empmm.EmpCode,
        empmm.EmployeeName,
        empmm.Designation,
        empmm.HQ,
        empmm.Region,
        empmm.State,
        empmm.Zone,
       SUM(CASE WHEN doctordata.subcat_id = ? THEN 1 ELSE 0 END) AS doctorCount
      FROM
        empmm
      LEFT JOIN
        doctordata
      ON
        empmm.EmpCode = doctordata.fk_emp_id
      WHERE
        empmm.Reporting = ?
        AND  empmm.status = 'Y'  AND (empmm.EmployeeName LIKE ? OR empmm.HQ LIKE ?)
      GROUP BY
        empmm.EmpCode,
        empmm.EmployeeName,
        empmm.Designation,
        empmm.HQ,
        empmm.Region,
        empmm.State,
        empmm.Zone
    `;
    queryParams = [subCatId,id,`%${search}%`, `%${search}%`];
    }
    else if(catId){
      query = `
      SELECT
        empmm.EmpCode,
        empmm.EmployeeName,
        empmm.Designation,
        empmm.HQ,
        empmm.Region,
        empmm.State,
        empmm.Zone,
        SUM(CASE WHEN doctordata.cat_id = ? THEN 1 ELSE 0 END) AS doctorCount
      FROM
        empmm
      LEFT JOIN
        doctordata
      ON
        empmm.EmpCode = doctordata.fk_emp_id
      WHERE
        empmm.Reporting = ?
        AND  empmm.status = 'Y'  AND  (empmm.EmployeeName LIKE ? OR empmm.HQ LIKE ?)
      GROUP BY
        empmm.EmpCode,
        empmm.EmployeeName,
        empmm.Designation,
        empmm.HQ,
        empmm.Region,
        empmm.State,
        empmm.Zone
    `;
    queryParams = [catId,id,`%${search}%`, `%${search}%`];
    }
    else{
      query = `
      SELECT
        empmm.EmpCode,
        empmm.EmployeeName,
        empmm.Designation,
        empmm.HQ,
        empmm.Region,
        empmm.State,
        empmm.Zone,
        IFNULL(COUNT(doctordata.fk_emp_id), 0) AS doctorCount
      FROM
        empmm
      LEFT JOIN
        doctordata
      ON
        empmm.EmpCode = doctordata.fk_emp_id
      WHERE
        empmm.Reporting = ?
        AND  empmm.status = 'Y'  AND (empmm.EmployeeName LIKE ? OR empmm.HQ LIKE ?)
      GROUP BY
        empmm.EmpCode,
        empmm.EmployeeName,
        empmm.Designation,
        empmm.HQ,
        empmm.Region,
        empmm.State,
        empmm.Zone
    `;
    queryParams = [id,`%${search}%`, `%${search}%`];
    }
    
  } 
  else {

   if(catId && subCatId){
console.log("inside subcat")
    query = `
      SELECT
        empmm.EmpCode,
        empmm.EmployeeName,
        empmm.Designation,
        empmm.HQ,
        empmm.Region,
        empmm.State,
        empmm.Zone,
        SUM(CASE WHEN doctordata.subcat_id = ? THEN 1 ELSE 0 END) AS doctorCount
      FROM
        empmm
      LEFT JOIN
        doctordata
      ON
        empmm.EmpCode = doctordata.fk_emp_id
      WHERE
      empmm.status = 'Y'  AND 
        (empmm.EmployeeName LIKE ? OR empmm.HQ LIKE ?)
      GROUP BY
        empmm.EmpCode,
        empmm.EmployeeName,
        empmm.Designation,
        empmm.HQ,
        empmm.Region,
        empmm.State,
        empmm.Zone
    `;
    queryParams = [subCatId,`%${search}%`, `%${search}%`];
   }
   else if(catId){

    query = `
      SELECT
        empmm.EmpCode,
        empmm.EmployeeName,
        empmm.Designation,
        empmm.HQ,
        empmm.Region,
        empmm.State,
        empmm.Zone,
        SUM(CASE WHEN doctordata.cat_id = ? THEN 1 ELSE 0 END) AS doctorCount
      FROM
        empmm
      LEFT JOIN
        doctordata
      ON
        empmm.EmpCode = doctordata.fk_emp_id
      WHERE
      empmm.status = 'Y'  AND 
        (empmm.EmployeeName LIKE ? OR empmm.HQ LIKE ?)
      GROUP BY
        empmm.EmpCode,
        empmm.EmployeeName,
        empmm.Designation,
        empmm.HQ,
        empmm.Region,
        empmm.State,
        empmm.Zone
    `;
    queryParams = [catId,`%${search}%`, `%${search}%`];
   }
   else{

    query = `
      SELECT
        empmm.EmpCode,
        empmm.EmployeeName,
        empmm.Designation,
        empmm.HQ,
        empmm.Region,
        empmm.State,
        empmm.Zone,
        IFNULL(COUNT(doctordata.fk_emp_id), 0) AS doctorCount
      FROM
        empmm
      LEFT JOIN
        doctordata
      ON
        empmm.EmpCode = doctordata.fk_emp_id
      WHERE
      empmm.status = 'Y'  AND 
        (empmm.EmployeeName LIKE ? OR empmm.HQ LIKE ?)
      GROUP BY
        empmm.EmpCode,
        empmm.EmployeeName,
        empmm.Designation,
        empmm.HQ,
        empmm.Region,
        empmm.State,
        empmm.Zone
    `;

    queryParams = [`%${search}%`, `%${search}%`];
   }

  }

  // Execute the query
  // const queryParams = id !== "1" ? [id, `%${search}%`, `%${search}%`] : [`%${search}%`, `%${search}%`];
  db.query(query, queryParams, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});





app.post("/getAllEmpDocExcel",(req,res)=>{
  const {empcode,catId,subCatId} = req.body;
  
let queryParams = [];
let query;
  if(subCatId){
    query = `
    SELECT
      empmm.EmpCode, empmm.EmployeeName, empmm.Designation, empmm.HQ,
      doctordata.name, doctordata.mobile, doctordata.hospital,doctordata.therapy,
      doctordata.city, doctordata.qualification,doctordata.created_at
    FROM doctordata
    LEFT JOIN empmm ON doctordata.fk_emp_id = empmm.EmpCode
    WHERE doctordata.fk_emp_id = ? and doctordata.subcat_id = ?
     and doctordata.status = 'Y' and empmm.status = 'Y';
    `;

    queryParams = [empcode,subCatId]
  }
  else if(catId){
    query = `
    SELECT
      empmm.EmpCode, empmm.EmployeeName, empmm.Designation, empmm.HQ,
      doctordata.name, doctordata.mobile, doctordata.hospital,doctordata.therapy,
      doctordata.city, doctordata.qualification,doctordata.created_at
    FROM doctordata
    LEFT JOIN empmm ON doctordata.fk_emp_id = empmm.EmpCode
    WHERE doctordata.fk_emp_id = ? and doctordata.cat_id = ? 
    and doctordata.status = 'Y' and empmm.status = 'Y';
    `;
    queryParams = [empcode,catId]
  }
  else{

    query = `
   SELECT
     empmm.EmpCode, empmm.EmployeeName, empmm.Designation, empmm.HQ,
     doctordata.name, doctordata.mobile, doctordata.hospital,doctordata.therapy,
     doctordata.city, doctordata.qualification,doctordata.created_at
   FROM doctordata
   LEFT JOIN empmm ON doctordata.fk_emp_id = empmm.EmpCode
   WHERE doctordata.fk_emp_id = ? and doctordata.status = 'Y' and empmm.status = 'Y';
   `;
   queryParams = [empcode]
  }
db.query(query,queryParams,(err,result)=>{
  if(err){
    res.send(err)
  }
  else{
    res.send(result)
  }
})
}) 

// get employee count 

app.get("/getEmpCount", (req, res) => {

  const query = "select Count(*) as empCount from empmm where status='Y'";
  db.query(query, (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.send( rows ); 
    }
  });
});

// for password activity

app.post('/reset-password', (req, res) => {
  const { empId, oldPassword, newPassword } = req.body;

  if (!empId || !oldPassword || !newPassword) {
    return res.status(400).send('All fields are required.');
  }

  // Check if the employee exists with the given empid and oldPassword
  const checkQuery = 'SELECT * FROM empmm WHERE EmpCode = ? AND Password = ? AND status="Y"';
  db.query(checkQuery, [empId, oldPassword], (err, results) => {
    if (err) {
      logger.error(`Error in reset password ${err.message}`)
      return res.status(500).send({errorCode:2, message:'Error checking the employee.'});
    }

    if (results.length === 0) {
      return res.status(404).send({errorCode:2, message:'Old password is incorrect.'});
    }
     const isPasswordReset = 'N'
    // Update the password
    const updateQuery = 'UPDATE empmm SET Password = ?, isPasswordReset = ? WHERE EmpCode = ?';
    db.query(updateQuery, [newPassword, isPasswordReset, empId], (err, results) => {
      if (err) {
        logger.error(`Error in reset password ${err.message}`)
        return res.status(500).send('Error updating the password.');
      }

      res.send({errorCode:1,message:'Password updated successfully.'});
    });
  });
});


app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  const checkQuery = 'SELECT * FROM empmm WHERE Email = ? AND status="Y"';
  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      logger.error(`Error in forgot password ${err.message}`)
      return res.status(500).send({errorCode:2, message:'Error checking the employee with email.'});
    }

    if (results.length === 0) {
      return res.status(404).send({errorCode:2, message:'Email id not found.'});
    }
    else{
      console.log(results)
      const toEmail = results[0].Email;
      const empId = results[0].EmpCode;
      //const pass = results[0].Password;
      const pass = generateRandomNumber();
      const isPasswordReset = 'Y'
      const updateQuery = 'update empmm set Password = ?, isPasswordReset = ? where EmpCode = ?'
      db.query(updateQuery, [pass,isPasswordReset, empId], (err, updateResults) => {
        if (err) {
          logger.error(`Error updating password ${err.message}`);
          return res.status(500).send({ errorCode: 2, message: 'Error updating the password.' });
        }
        console.log(updateResults)
      try {

        const transporter = nodemailer.createTransport({
          service: "gmail",
          // host: "smtp.gmail.com",
          // port: 587,
          // secure: false,
          auth: {
            //  user: "dhananjaydhoke33@gmail.com",
            //  pass: "qetkjtijntaeatdt",
             user: "customercare1@netcastservice.com",
             pass: 'scbkboodjqwannhx'
            
          },
        });

        const mailOptions = {
          from: 'customercare1@netcastservice.com',
          to: toEmail,
          subject: 'Your Password Reset Request',
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #555;">Password Reset Request</h2>
              <p>Dear User,</p>
              <p>We have received a request to reset your password. Please find your new password below:</p>
              <p style="font-size: 1.2em; font-weight: bold; color: #007BFF;">${pass}</p>
              <p>If you did not request this, please contact our support team immediately.</p>
              <br>
              <p>Best regards,</p>
              <p><strong>Netcast Services</strong></p>
              <p>Email: customercare1@netcastservice.com</p>
              <br>
              <p style="font-size: 0.9em; color: #888;">Please do not reply to this email. This inbox is not monitored.</p>
            </div>
          `,
        };
    
        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            console.error("Error sending email:", error);
            res
              .status(500)
              .json({ message: "Failed to send email", errorCode: 2 });
          } else {
            res.status(200).json({errorCode : 1, message :"Email sent successfully"});
            
          }
        });
        
      } catch (error) {
      console.error("Error in sending email:", error);
      res.status(500).json({ message: "Failed to send email", errorCode: 2 });
      }
    });
    }
  });
});

function generateRandomNumber(min = 10000, max = 99999) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



const PORT = process.env.PORT || 8043
app.listen(PORT,()=>{
    console.log(`listining on port ${PORT} `)
})
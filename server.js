const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dbsmschool'
});


db.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log('MySQL connected...');
    
  }
});


app.post("/api/student/add", (req, res) => {
  let details ={
      stname: req.body.stname,
      course: req.body.course,
      fee: req.body.fee
  };
  let sql = "INSERT INTO student SET ?";
  db.query(sql, details, (error) => {
      if (error) {
          res.send({ status: false, message: "Student creation failed" });
      } else {
          res.send({ status: true, message: "Student created successfully" });
      }
  });
});


app.get("/api/student/view", (req, res) => {
    var sql = "SELECT * FROM student"; 
    db.query(sql, function (error, result) {
        if (error) {
            console.log("Error connecting to DB:", error);
            res.send({ status: false, message: "Error connecting to DB" });
        } else {
            res.send({ status: true, data: result }); 
        }
    });
});


app.get("/api/student/:id", (req, res) => {
    var studentId = req.params.id;
    var sql = `SELECT * FROM student WHERE id = ${studentId}`;
    db.query(sql, function (error, result) {
        if (error) {
            console.log("Error connecting to DB:", error);
            res.status(500).send({ status: false, message: "Error connecting to DB" });
        } else {
            if (result.length === 0) {
                res.status(404).send({ status: false, message: "Student not found" });
            } else {
                res.send({ status: true, data: result[0] });
            }
        }
    });
});


app.put("/api/student/update/:id", (req, res) => {
    var studentId = req.params.id;
    var updatedDetails = {
        stname: req.body.stname,
        course: req.body.course,
        fee: req.body.fee
    };
    var sql = `UPDATE student SET ? WHERE id = ${studentId}`;
    db.query(sql, updatedDetails, (error, result) => {
        if (error) {
            console.log("Error updating student record:", error);
            res.status(500).send({ status: false, message: "Error updating student record" });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).send({ status: false, message: "Student not found" });
            } else {
                res.send({ status: true, message: "Student record updated successfully" });
            }
        }
    });
});


app.delete("/api/student/delete/:id", (req, res) => {
    let studentId = req.params.id;
    let sql = `DELETE FROM student WHERE id = ${studentId}`;
    db.query(sql, (error, result) => {
        if (error) {
            console.log("Error deleting student record:", error);
            res.status(500).send({ status: false, message: "Error deleting student record" });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).send({ status: false, message: "Student not found" });
            } else {
                res.send({ status: true, message: "Student record deleted successfully" });
            }
        }
    });
});



const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

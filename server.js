
/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
*  No part of this assignment has been copied manually or electronically from any other source
*  (including 3rd party web sites) or distributed to other students.
*
*  Name: Jagat Pareshbhai Patel Student ID: 118557248 Date: 25-03-2025
*
*  Online (Vercel) Link: https://webprogrammingassignment5-web700.onrender.com
********************************************************************************/

const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// Middleware to set active route
app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split("/")[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

// Routes
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo");
});

app.get("/students/add", (req, res) => {
    res.render("addStudent");
});

app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body).then(() => {
        res.redirect("/students");
    }).catch(err => {
        res.status(500).send("Unable to Add Student");
    });
});

app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course).then((data) => {
            res.render("students", { students: data });
        }).catch(() => {
            res.render("students", { message: "no results" });
        });
    } else {
        collegeData.getAllStudents().then((data) => {
            res.render("students", { students: data });
        }).catch(() => {
            res.render("students", { message: "no results" });
        });
    }
});

app.get("/student/:studentNum", (req, res) => {
    collegeData.getStudentByNum(req.params.studentNum).then((data) => {
        if (data) {
            res.render("student", { student: data });
        } else {
            res.status(404).send("Student Not Found");
        }
    }).catch(() => {
        res.status(500).send("Error retrieving student");
    });
});

app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body).then(() => {
        res.redirect("/students");
    }).catch(err => {
        res.status(500).send("Unable to Update Student");
    });
});

app.get("/courses", (req, res) => {
    collegeData.getCourses().then((data) => {
        res.render("courses", { courses: data });
    }).catch(() => {
        res.render("courses", { message: "no results" });
    });
});

app.get("/course/:id", (req, res) => {
    collegeData.getCourseById(req.params.id).then((data) => {
        res.render("course", { course: data });
    }).catch(() => {
        res.status(404).send("Course Not Found");
    });
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

collegeData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log("Server running on port " + HTTP_PORT);
    });
}).catch(err => {
    console.log("Failed to start server: " + err);
});

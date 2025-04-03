require('dotenv').config();
const Sequelize = require("sequelize");

// Create Sequelize instance using Neon credentials from .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    },
    query: { raw: true }
  }
);

// Define Student model
const Student = sequelize.define("Student", {
  studentNum: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressProvince: Sequelize.STRING,
  TA: Sequelize.BOOLEAN,
  status: Sequelize.STRING
});

// Define Course model
const Course = sequelize.define("Course", {
  courseId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  courseCode: Sequelize.STRING,
  courseDescription: Sequelize.STRING
});

// Relationships
Course.hasMany(Student, { foreignKey: "course" });

/* -------------------------
   EXPORT FUNCTIONS BELOW
--------------------------*/

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    sequelize.sync()
      .then(() => resolve())
      .catch(err => {
        console.error("Sequelize Sync Error:", err);
        reject("unable to sync the database");
      });
  });
};

module.exports.getAllStudents = function () {
  return new Promise((resolve, reject) => {
    Student.findAll()
      .then(data => resolve(data))
      .catch(() => reject("no results returned"));
  });
};

module.exports.getStudentsByCourse = function (course) {
  return new Promise((resolve, reject) => {
    Student.findAll({ where: { course: course } })
      .then(data => resolve(data))
      .catch(() => reject("no results returned"));
  });
};

module.exports.getStudentByNum = function (num) {
  return new Promise((resolve, reject) => {
    Student.findAll({ where: { studentNum: num } })
      .then(data => resolve(data[0]))
      .catch(() => reject("no results returned"));
  });
};

module.exports.getCourses = function () {
  return new Promise((resolve, reject) => {
    Course.findAll()
      .then(data => resolve(data))
      .catch(() => reject("no results returned"));
  });
};

module.exports.getCourseById = function (id) {
  return new Promise((resolve, reject) => {
    Course.findAll({ where: { courseId: id } })
      .then(data => resolve(data[0]))
      .catch(() => reject("no results returned"));
  });
};

module.exports.addStudent = function (studentData) {
  studentData.TA = studentData.TA ? true : false;
  for (let prop in studentData) {
    if (studentData[prop] === "") studentData[prop] = null;
  }
  return new Promise((resolve, reject) => {
    Student.create(studentData)
      .then(() => resolve())
      .catch(() => reject("unable to create student"));
  });
};

module.exports.updateStudent = function (studentData) {
  studentData.TA = studentData.TA ? true : false;
  for (let prop in studentData) {
    if (studentData[prop] === "") studentData[prop] = null;
  }
  return new Promise((resolve, reject) => {
    Student.update(studentData, { where: { studentNum: studentData.studentNum } })
      .then(() => resolve())
      .catch(() => reject("unable to update student"));
  });
};

module.exports.deleteStudentByNum = function (studentNum) {
  return new Promise((resolve, reject) => {
    Student.destroy({ where: { studentNum: studentNum } })
      .then(() => resolve())
      .catch(() => reject("unable to delete student"));
  });
};

module.exports.addCourse = function (courseData) {
  for (let prop in courseData) {
    if (courseData[prop] === "") courseData[prop] = null;
  }
  return new Promise((resolve, reject) => {
    Course.create(courseData)
      .then(() => resolve())
      .catch(() => reject("unable to create course"));
  });
};

module.exports.updateCourse = function (courseData) {
  for (let prop in courseData) {
    if (courseData[prop] === "") courseData[prop] = null;
  }
  return new Promise((resolve, reject) => {
    Course.update(courseData, { where: { courseId: courseData.courseId } })
      .then(() => resolve())
      .catch(() => reject("unable to update course"));
  });
};

module.exports.deleteCourseById = function (id) {
  return new Promise((resolve, reject) => {
    Course.destroy({ where: { courseId: id } })
      .then(() => resolve())
      .catch(() => reject("unable to delete course"));
  });
};

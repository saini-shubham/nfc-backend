const express = require("express");
require("./db/mongoose");
const Tag = require("./models/tag");
//const User = require("./models/user");
const TagReport = require("./models/tagReport");
//const hiJob = require('../src/schedules/hi')
//const populate = require("../src/schedules/populateReportGeneration");
const userRouter = require('./routes/userRotes')
const tagRouter = require('./routes/tagRoutes')

var bcrypt = require("bcryptjs");
const config = require("./config");
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(userRouter)
app.use(tagRouter)




app.listen(port, () => {
  console.log("Server is up on port " + port);
});

const express = require("express");
const Tag = require("../models/tag");
const TagReport = require("../models/tagReport");
const router = new express.Router();
const jwt = require("jsonwebtoken");
const config = require("../config");
//const verifyToken = require('../utils')
//register a tag
router.post("/tagRegister", verifyToken, async (req, res) => {
  // Access the userId and role from the decoded token
  const { userId, userType } = req.user;
  console.log(userId, userType);
  const tagDetails = new Tag(req.body);

  if (
    userType === "tagger" ||
    userType === "admin" ||
    userType === "superAdmin"
  ) {
    try {
      //console.log(tagDetails.userId, req.body.userType);
      const tagFound = await Tag.findOne({ tagId: tagDetails.tagId });
      //debugger
      if (tagFound) {
        return res.status(200).json({
          message: "Already Registerd",
        });
      }
      await tagDetails.save();
      res.status(200).json({
        message: "Registerd Success",
      });
    } catch (err) {
      res.status(400).send(err);
    }
  } else return res.status(403).send("Not Authorized to register tag");
});

//get a tag by id and mark it scan
// router.put("/tagRegister/:tagId", (req, res) => {
//   const { tagId } = req.params; // Find the tag by tagId
//   Tag.findOneAndUpdate({ tagId }, { scanned: true }, { new: true })
//     .then((tag) => {
//       if (!tag) {
//         return res.status(404).json({ message: "Tag not found" });
//       }

//       res.status(200).json(tag);
//     })
//     .catch((error) => {
//       console.error("Error finding/updating student:", error);
//       res.status(500).json({
//         message: "An error occurred while finding/updating the tag",
//       });
//     });
// });

// POST request to mark a tag scnned and store the details in "tagReports" collection
router.post("/tags/:id", verifyToken, async (req, res) => {
  const { userId, userType } = req.user;
  if (
    userType === "scanner" ||
    userType === "admin" ||
    userType === "superAdmin"
  ) {
    const { scanned, userId, userType } = req.body;
    try {
      // let { token } = req.headers;
      // token = jwt.verify(token, config.secret);
      //try to populate TagReport once a day from Tag

      const tagReportData = new TagReport({});
      const tag = await Tag.findOne({ tagId: req.params.id });
      console.log(tag, req.params.id);
      if (!tag) {
        res.status(404).json({ error: "Tag not found" });
        return;
      }

      const isTaggedScanned = await TagReport.findOne({
        tagId: req.params.id,
        date: new Date().toLocaleDateString(),
        scanned: true,
      });
      if (isTaggedScanned !== null) {
        return res.status(200).json({
          message: "Already Scanned Today",
        });
      }

      await TagReport.findOneAndUpdate(
        { tagId: req.params.id, date: new Date().toLocaleDateString() },
        //{ scanned: scanned, scannerId: userId }
        { scanned: scanned,  userId }
      );
      res.status(200).json({
        message: "Scanned Successfully",
      });

      // if (
      //   isTagScanned !== null &&
      //   isTagScanned.scanned &&
      //   isTagScanned.date === new Date().toLocaleDateString()
      //   //isTagScanned.date.toString() === '14/5/2023'
      // )
      //   return res.status(200).json({ message: "Already Scanend" });
      // var today = new Date();
      // const presentDate = new Date().toLocaleDateString();
      // const presentTime = today.getHours() + ":" + today.getMinutes();
      // const report = {
      //   //studentId: tag.id,
      //   scannerId: userId,
      //   tagId: tag.tagId,
      //   name: tag.name,
      //   houseNo: tag.houseNo,
      //   locality: tag.locality,
      //   city: tag.city,
      //   scanned: scanned,
      //   date: presentDate,
      //   time: presentTime,
      // };
      // const tagReportCollection = new TagReport(report);
      // await tagReportCollection.save();
      // res.json(report);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(403).send("Unauthorised");
  }
});

// Define the route to get all tags by city name
router.get("/tags/byCity", verifyToken, (req, res) => {
  const { userId, userType } = req.user;
  if (userType === "admin" || userType === "superAdmin") {
    const { city } = req.query; // Find all tags matching the provided city name
    console.log(city, typeof city);
    Tag.find({ city })
      .then((tags) => {
        let { token } = req.headers;
        token = jwt.verify(token, config.secret);
        if (tags.length === 0) {
          return res
            .status(404)
            .json({ message: "No tags found for the given city" });
        }

        // const totalTags =Object.values(tags).filter((tag)=>tag.city ===city)
        // const scannedTags =Object.values(tags).filter((tag)=>tag.city ===city && tag.scanned === true && tag.date === new Date())
        // console.log(scannedCount.length)
        res.status(200).json(tags);
      })
      .catch((error) => {
        console.error("Error finding tags:", error);
        res
          .status(500)
          //.json({ message: "An error occurred while finding the tags" });
          .json(error);
      });
  } else {
    return res.status(403).send("Unauthorised");
  }
});

//for visitor: to get the count of tag in the given city
//router.get("/students/:city/present/count", (req, res) => {
router.post("/tags/count/:city", verifyToken, (req, res) => {
  const { userId, userType } = req.user;
  if (
    userType === "visitor" ||
    userType === "admin" ||
    userType === "superAdmin"
  ) {
    const cityName = req.params.city;
    const date = req.body;
    console.log(cityName, date.date);
    async function getDocumentCount(collectionName) {
      const count = await collectionName.countDocuments();
      return count;
    }

    getDocumentCount(Tag).then((count) => {
      const totalTags = count;
      TagReport.find({ city: cityName }) //find tags in the given city
        .then((tags) => {
          // let { token } = req.headers;
          // token = jwt.verify(token, config.secret);
          if (tags.length === 0) {
            return res
              .status(404)
              .json({ message: "No tags found for the given city" });
          }
          ///const totalTags = Object.values(tags).filter((tag)=>tag.city ===cityName)
          //const scannedTags = Object.values(tags).filter((tag)=>tag.city ===cityName)
          const scannedTags = Object.values(tags).filter(
            (tag) => tag.city === cityName && tag.date === date.date.toString()
          ).length;

          const notScanned = totalTags - scannedTags;
          res.status(200).json({ totalTags, scannedTags, notScanned });
        })
        .catch((error) => {
          console.error("Error finding tags:", error);
          res
            .status(500)
            //.json({ message: "An error occurred while finding the tags" });
            .json(error);
        });
    });
  } else {
    return res.status(403).send("Unauthorised");
  }
});

//to find totla tags
// const totalTags = Tag.find({ city:cityName }).then((tags) => {
//   // let { token } = req.headers;
//   // token = jwt.verify(token, config.secret);
//   if (tags.length === 0) {
//     return res
//       .status(404)
//       .json({ message: "No tags found for the given city" });
//   }
//  Object.values(tags).filter((tag)=>tag.city ===city).length
// })
// console.log(totalTags)
// TagReport.find({ city: cityName})
//   .then((tags) => {
//     // let { token } = req.headers;
//     // token = jwt.verify(token, config.secret);
//     if (tags.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No tags found for the given city" });
//     }
//     ///const totalTags = Object.values(tags).filter((tag)=>tag.city ===cityName)
//     //const scannedTags = Object.values(tags).filter((tag)=>tag.city ===cityName)
//     const totalTags = Object.values(tags).filter(
//       (tag) => tag.city === cityName && tag.date ===date.date.toString()).length;
//     res.status(200).json(totalTags);
//   })
//   .catch((error) => {
//     console.error("Error finding tags:", error);
//     res
//       .status(500)
//       //.json({ message: "An error occurred while finding the tags" });
//       .json(error);
//   });

//for ADMIN : get status of tags by city on the given date
router.post("/tagDetailsByCity", verifyToken, async (req, res) => {
  const { userId, userType } = req.user;
  const { date, city } = req.body;
  if (userType === "admin" || userType === "superAdmin") {
    const tagsByCity = await TagReport.find({ city });
    console.log(tagsByCity.length === 0);
    if (tagsByCity.length === 0) {
      return res
        .status(404)
        .json({ message: "No tags found for the given city" });
    }
    const tagsByCityAndDate = await TagReport.find({ date });
    if (tagsByCityAndDate.length === 0) {
      return res
        .status(404)
        .json({ message: "No tags found for the given date" });
    }
    res.status(200).json(tagsByCityAndDate);
  } else {
    return res.status(403).send("Unauthorised");
  }
});

// Token verification middleware
function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Failed to authenticate token" });
    } // Add the decoded token payload to the request object
    req.user = decoded;
    next();
  });
}

module.exports = router;

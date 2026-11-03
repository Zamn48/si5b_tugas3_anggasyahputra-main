
const express = require("express");
const router = express.Router();

const cityController = require("../controllers/cityController");
const cekApiKey = require("../middlewares/cekApiKey");

// GET - tidak membutuhkan API Key
router.get("/", cityController.getAllCities);

// POST - membutuhkan API Key
router.post("/", cekApiKey, cityController.createCity);

module.exports = router;

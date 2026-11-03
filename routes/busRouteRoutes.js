const express = require("express");
const router = express.Router();

const busRouteController = require("../controllers/busRouteController");
const cekApiKey = require("../middlewares/cekApiKey");

// GET - tidak membutuhkan API Key
router.get("/", busRouteController.getAllRoutes);
router.get("/:id", busRouteController.getRouteById);

// POST - membutuhkan API Key
router.post("/", cekApiKey, busRouteController.createRoute);

// PUT - membutuhkan API Key
router.put("/:id", cekApiKey, busRouteController.updateRoute);

// DELETE - membutuhkan API Key
router.delete("/:id", cekApiKey, busRouteController.deleteRoute);

module.exports = router;
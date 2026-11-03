
const City = require("../models/cityModel");

// GET /cities
async function getAllCities(req, res, next) {
    try {
        const cities = await City.find().sort({ nama: 1 });

        res.json({
            status: "success",
            total: cities.length,
            data: cities
        });
    } catch (error) {
        next(error);
    }
}

// POST /cities
async function createCity(req, res, next) {
    try {
        const { nama, provinsi } = req.body;

        if (!nama || !provinsi) {
            return res.status(400).json({
                status: "error",
                message: "Nama dan provinsi wajib diisi"
            });
        }

        const city = await City.create({
            nama,
            provinsi
        });

        res.status(201).json({
            status: "success",
            message: "Kota berhasil ditambahkan",
            data: city
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllCities,
    createCity
};

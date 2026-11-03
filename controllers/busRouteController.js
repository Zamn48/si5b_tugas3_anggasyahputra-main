
const mongoose = require("mongoose");
const BusRoute = require("../models/busRouteModel");
const City = require("../models/cityModel");

// GET /bus-routes
async function getAllRoutes(req, res, next) {
    try {
        const {
            kota,
            kotaId,
            minTarif,
            maxTarif,
            q,
            page = 1,
            limit = 10,
            sort = "createdAt",
            order = "desc",
            fields
        } = req.query;

        // FILTERING
        const filter = {};

        if (kotaId) {
            if (!mongoose.Types.ObjectId.isValid(kotaId)) {
                return res.status(400).json({
                    status: "error",
                    message: "Format kotaId tidak valid"
                });
            }

            filter.kota = kotaId;
        } else if (kota) {
            const city = await City.findOne({
                nama: { $regex: kota, $options: "i" }
            });

            if (!city) {
                return res.json({
                    status: "success",
                    total: 0,
                    page: Number(page),
                    totalPages: 0,
                    data: []
                });
            }

            filter.kota = city._id;
        }

        if (minTarif !== undefined || maxTarif !== undefined) {
            filter.tarif = {};

            if (minTarif !== undefined) {
                filter.tarif.$gte = Number(minTarif);
            }

            if (maxTarif !== undefined) {
                filter.tarif.$lte = Number(maxTarif);
            }

            if (
                Object.values(filter.tarif).some(
                    value => !Number.isFinite(value)
                )
            ) {
                return res.status(400).json({
                    status: "error",
                    message: "Filter tarif harus berupa angka"
                });
            }
        }

        if (q) {
            filter.$or = [
                { kodeRute: { $regex: q, $options: "i" } },
                { asal: { $regex: q, $options: "i" } },
                { tujuan: { $regex: q, $options: "i" } }
            ];
        }

        // PAGINATION
        const currentPage = Math.max(1, parseInt(page) || 1);
        const perPage = Math.min(
            100,
            Math.max(1, parseInt(limit) || 10)
        );

        const skip = (currentPage - 1) * perPage;

        // SORTING
        const allowedSort = [
            "kodeRute",
            "asal",
            "tujuan",
            "tarif",
            "createdAt"
        ];

        if (!allowedSort.includes(sort)) {
            return res.status(400).json({
                status: "error",
                message: "Kolom sorting tidak valid"
            });
        }

        const sortOrder = order.toLowerCase() === "asc" ? 1 : -1;
        const sortOption = { [sort]: sortOrder };

        // PROJECTION
        const allowedFields = [
            "kodeRute",
            "asal",
            "tujuan",
            "kota",
            "tarif",
            "halte",
            "createdAt",
            "updatedAt"
        ];

        let projection = {};

        if (fields) {
            const selectedFields = fields.split(",").map(field => field.trim());

            const invalidFields = selectedFields.filter(
                field => !allowedFields.includes(field)
            );

            if (invalidFields.length > 0) {
                return res.status(400).json({
                    status: "error",
                    message: "Kolom projection tidak valid",
                    invalidFields
                });
            }

            selectedFields.forEach(field => {
                projection[field] = 1;
            });
        }

        // QUERY DATABASE
        let query = BusRoute.find(filter);

        if (fields) {
            query = query.select(projection);
        }

        const selectedFields = fields
            ? fields.split(",").map(field => field.trim())
            : [];

        if (!fields || selectedFields.includes("kota")) {
            query = query.populate("kota", "nama provinsi");
        }

        const [routes, total] = await Promise.all([
            query
                .sort(sortOption)
                .skip(skip)
                .limit(perPage),
            BusRoute.countDocuments(filter)
        ]);

        res.json({
            status: "success",
            total,
            page: currentPage,
            limit: perPage,
            totalPages: Math.ceil(total / perPage),
            data: routes
        });

    } catch (error) {
        next(error);
    }
}

// GET /bus-routes/:id
async function getRouteById(req, res, next) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                status: "error",
                message: "ID rute tidak valid"
            });
        }

        const route = await BusRoute.findById(req.params.id)
            .populate("kota", "nama provinsi");

        if (!route) {
            return res.status(404).json({
                status: "error",
                message: "Rute bus tidak ditemukan",
                data: null
            });
        }

        res.json({
            status: "success",
            data: route
        });

    } catch (error) {
        next(error);
    }
}

// POST /bus-routes
async function createRoute(req, res, next) {
    try {
        const {
            kodeRute,
            asal,
            tujuan,
            kotaId,
            tarif,
            halte
        } = req.body;

        if (
            !kodeRute ||
            !asal ||
            !tujuan ||
            !kotaId ||
            tarif === undefined
        ) {
            return res.status(400).json({
                status: "error",
                message: "kodeRute, asal, tujuan, kotaId, dan tarif wajib diisi"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(kotaId)) {
            return res.status(400).json({
                status: "error",
                message: "kotaId tidak valid"
            });
        }

        const city = await City.findById(kotaId);

        if (!city) {
            return res.status(404).json({
                status: "error",
                message: "Data kota tidak ditemukan"
            });
        }

        const newRoute = await BusRoute.create({
            kodeRute,
            asal,
            tujuan,
            kota: kotaId,
            tarif,
            halte: halte || []
        });

        const result = await BusRoute.findById(newRoute._id)
            .populate("kota", "nama provinsi");

        res.status(201).json({
            status: "success",
            message: "Rute bus berhasil ditambahkan",
            data: result
        });

    } catch (error) {
        next(error);
    }
}

// PUT /bus-routes/:id
async function updateRoute(req, res, next) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                status: "error",
                message: "ID rute tidak valid"
            });
        }

        const {
            kodeRute,
            asal,
            tujuan,
            kotaId,
            tarif,
            halte
        } = req.body;

        if (
            !kodeRute ||
            !asal ||
            !tujuan ||
            !kotaId ||
            tarif === undefined
        ) {
            return res.status(400).json({
                status: "error",
                message: "kodeRute, asal, tujuan, kotaId, dan tarif wajib diisi"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(kotaId)) {
            return res.status(400).json({
                status: "error",
                message: "kotaId tidak valid"
            });
        }

        const city = await City.findById(kotaId);

        if (!city) {
            return res.status(404).json({
                status: "error",
                message: "Data kota tidak ditemukan"
            });
        }

        const updatedRoute = await BusRoute.findByIdAndUpdate(
            req.params.id,
            {
                kodeRute,
                asal,
                tujuan,
                kota: kotaId,
                tarif,
                halte: halte || []
            },
            {
                new: true,
                runValidators: true
            }
        ).populate("kota", "nama provinsi");

        if (!updatedRoute) {
            return res.status(404).json({
                status: "error",
                message: "Rute bus tidak ditemukan"
            });
        }

        res.json({
            status: "success",
            message: "Rute bus berhasil diperbarui",
            data: updatedRoute
        });

    } catch (error) {
        next(error);
    }
}

// DELETE /bus-routes/:id
async function deleteRoute(req, res, next) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                status: "error",
                message: "ID rute tidak valid"
            });
        }

        const deletedRoute = await BusRoute.findByIdAndDelete(
            req.params.id
        );

        if (!deletedRoute) {
            return res.status(404).json({
                status: "error",
                message: "Rute bus tidak ditemukan"
            });
        }

        res.json({
            status: "success",
            message: "Rute bus berhasil dihapus",
            data: null
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllRoutes,
    getRouteById,
    createRoute,
    updateRoute,
    deleteRoute
};

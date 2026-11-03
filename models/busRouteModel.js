
const mongoose = require("mongoose");

// EMBEDDING: Schema halte disimpan di dalam dokumen rute
const halteSchema = new mongoose.Schema(
    {
        nama: {
            type: String,
            required: true,
            trim: true
        },
        lokasi: {
            type: String,
            required: true,
            trim: true
        },
        urutan: {
            type: Number,
            required: true,
            min: 1
        }
    },
    {
        _id: true
    }
);

// Schema utama rute bus
const busRouteSchema = new mongoose.Schema(
    {
        kodeRute: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        asal: {
            type: String,
            required: true,
            trim: true
        },
        tujuan: {
            type: String,
            required: true,
            trim: true
        },

        // REFERENCING: Menghubungkan rute dengan koleksi City
        kota: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "City",
            required: true
        },

        tarif: {
            type: Number,
            required: true,
            min: 0
        },

        // EMBEDDING: Data halte berada langsung dalam dokumen rute
        halte: {
            type: [halteSchema],
            default: []
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("BusRoute", busRouteSchema);

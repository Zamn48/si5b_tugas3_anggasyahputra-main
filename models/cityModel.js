
const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
    {
        nama: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        provinsi: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("City", citySchema);

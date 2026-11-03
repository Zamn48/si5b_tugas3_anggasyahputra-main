
const mongoose = require("mongoose");

async function connectDB() {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error("MONGODB_URI belum dikonfigurasi");
        }

        await mongoose.connect(mongoURI);

        console.log("MongoDB berhasil terhubung!");
    } catch (error) {
        console.error("Koneksi MongoDB gagal:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;

function errorHandler(err, req, res, next) {
    console.error(err);

    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            status: "error",
            message: "Format JSON tidak valid",
            data: null
        });
    }

    res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan pada server",
        data: null
    });
}

function notFound(req, res) {
    res.status(404).json({
        status: "error",
        message: "Endpoint tidak ditemukan",
        data: null
    });
}

module.exports = {
    errorHandler,
    notFound
};
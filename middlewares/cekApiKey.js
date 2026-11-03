function cekApiKey(req, res, next) {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({
            status: "error",
            message: "API Key tidak valid atau tidak diberikan",
            data: null
        });
    }

    next();
}

module.exports = cekApiKey;
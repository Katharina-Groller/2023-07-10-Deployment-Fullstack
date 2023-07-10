const express = require("express");
const mongoose = require("mongoose");
const { upload } = require("../middleware/upload");
const { fileSchema } = require("../model/file.schema");
const router = express.Router();

const File = mongoose.model("File", fileSchema);

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Express" });
});

router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const { originalname, path } = req.file;
        // Dateipfad in der Datenbank speichern
        const file = new File({ name: originalname, path });
        await file.save();

        res.status(200).json({ message: "Datei erfolgreich hochgeladen" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Fehler beim Hochladen der Datei",
        });
    }
});

module.exports = router;

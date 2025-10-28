const mongoose = require("mongoose")

const FileSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    files: {
        type: Object,
        required: true,
    },
});
const Filemodel = mongoose.model("Files", FileSchema)

module.exports = Filemodel

const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const voiceCtrl = require('./voice.ctrl');


var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'src/uploads/')
    },
    filename: function (req, file, callback) {
        var date = new Date();
        var extension = path.extname(file.originalname);
        var basename = path.basename(file.originalname, extension)
        callback(null, basename + extension);
    }
})
var upload = multer({
    storage: storage
})

router.get('/', voiceCtrl.showList);

router.get('/:id', voiceCtrl.showInfo);

router.post('/', upload.single('voicefile'), voiceCtrl.create)

// 즐겨찾기 등록
router.put('/:id/star', voiceCtrl.bookmark);

// 즐겨찾기 해제
router.delete('/:id/star', voiceCtrl.undoBookmark);


module.exports = router;
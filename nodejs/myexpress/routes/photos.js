var express = require('express');
var router = express.Router();
const Photo = require('../models/Photo');
const fs = require('fs');
const path = require('path');
/* GET photos listing. */
router.get('/', function(req, res, next) {
    Photo.find({}, (err, photos)=>{
        if (err) {
            return next(err);
        }
        res.render('photos/index', {title: 'photos', photos: photos});
    });
});

router.get('/upload', (req, res, next)=>{
    res.render('photos/upload', {title: '上传'});
});

router.post('/upload', submit(path.join(__dirname, '../public/photos')));
function submit(dir) {
    return (req, res, next)=>{
        console.log(req.body);
        var img = req.files.photo.image;
        var name = req.body.photo.name || img.name;
        var path = path.join(dir, img.name);

        fs.rename(img.path, path, function(err){
        if (err) return next(err);

        Photo.create({
            name: name,
            path: img.name
        }, function(err) {
            if (err) return next(err);
            res.redirect('/photos');
        });
        });
    }
}

module.exports = router;
const FileHound = require('filehound');
const cv = require('opencv');

const eachFileProcessor = (eachFile) => {
  eachFile.forEach((oneFile) => {
    console.log('Processing', oneFile);
    const tail = oneFile.split('/')[3].split('.')[0];
    cv.readImage(oneFile, function (err, im) {
      im.convertGrayscale();
      im.gaussianBlur([3, 3]);
      im.canny(100, 200);
      im.save('/pfs/out/' + tail + '.png');
    });
  });
};

const files = FileHound.create().paths('/pfs/images').ext('jpg').find();

files.then((forEachFile) => {
  eachFileProcessor(forEachFile);
});

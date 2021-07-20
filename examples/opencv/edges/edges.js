const FileHound = require('filehound');
const cv = require('opencv');

// makeEdges reads an image from /pfs/images and outputs the result of running
// edge detection on that image to /pfs/out. Note that /pfs/images and
// /pfs/out are special directories that Pachyderm injects into the container.

const makeEdges = (eachFile) => {
  eachFile.forEach((oneFile) => {
    console.log('Processing', oneFile);
    
    // Collect the filename, without the extension
    const tail = oneFile.split('/')[3].split('.')[0];

    // Read an img file and convert it into its edge detected equivalent
    cv.readImage(oneFile, function (err, im) {
      im.convertGrayscale();
      im.gaussianBlur([3, 3]);
      im.canny(100, 200);
      im.save('/pfs/out/' + tail + '.png');
    });
  });
};

// Collect all the files that end with .jpg in the /pfs/images folder to be 
// processed in the edges function

const files = FileHound.create().paths('/pfs/images').ext('jpg').find();

files.then((forEachFile) => {
  makeEdges(forEachFile);
});

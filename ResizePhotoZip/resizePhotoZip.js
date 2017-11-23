//
// Copyright 2016-2017, Richard J. Moore all rights reserved
//
// formatGoogleDocHtmlFuncs.js
//
// Collection of functions used to convert a Google Docs save as HTML zip file for use on the
// themnmoores.net website
//
// Notes:
//    jszip.min.js must be loaded by the HTML page code
//    FileSaver.js must be loaded by the HTML page code

// *********************************************************************************************************
// Global data for async reading of zip files
// *********************************************************************************************************

var currentFileNumber;
var fileNames;
var zipArchiveToReadFrom;
var currentImage;
var theResizeCanvas;
var resizeTargetWidth = 800;
var resizeTargetHeight = 600;


// *********************************************************************************************************
// Handle some events
// *********************************************************************************************************

function uploadFailed(evt) {
    alert("There was an upload error: " + evt);
}

function uploadCanceled(evt) {
    alert("Operation canceled by the user or the browser dropped the connection.");
}


// *********************************************************************************************************
//   Start the process of up loading a zip file into local array buffer.
//   Uses standard Javascript FileReader to read the file, which will call ReadOfArchiveFileCompleted
//   below to open and process the zip file.
// *********************************************************************************************************

function StartImagesZipResize() {

  if (!XMLHttpRequest) {
      alert("XMLHttpRequest not supported!!!!");
      return;
  }
  var files = document.getElementById('zipFile').files;
  if (files.length === 0) {
      alert("No files to upload!!!!");
      return;
  }
  var file = files[0];
  imageUploaded = 0;
  document.getElementById('currentFileProcessing').innerHTML = "Processing File: " + file.name;

  currentFileNumber = 0;
  fileNames = undefined;
  zipArchiveToReadFrom = undefined;


  var reader = new FileReader();
  reader.onloadend = ReadOfArchiveFileCompleted;
  reader.readAsArrayBuffer(file);

}


// *********************************************************************************************************
// The read of the zip file is complete so get the names of the files in the zip archive, and start the
// async processing of the file.
// *********************************************************************************************************


function ReadOfArchiveFileCompleted(evt)
{
  var resizeTargetWidth = 800;
  var resizeTargetHeight = 600;

  theResizeCanvas = document.getElementById("themnmooresResizeCanvas");
  theResizeCanvas.width = resizeTargetWidth;
  theResizeCanvas.height = resizeTargetHeight;
  
  var imagesZipFile = new JSZip();

  imagesZipFile.loadAsync(evt.target.result)
  .then(function success(zip)
  {
    console.log('Read zip file');

    zipArchiveToReadFrom = zip;
    
    fileNames = zip.file(/./);
    
    // Kick off the async chain of callbacks for processing an image
    startProcessingFile(fileNames[0].name);

  });
}
      

// *******************************************************************************************************************************
// ****** Here is a collection of functions to do the processing of each file in the zip archive in an ascyn manner         ******
// ****** Relies on the globle varaibles at the top of this file being set up appropriately (which is done by the           ******
// ****** ReadOfArchiveFileCompleted callback). The last function in the chain looks to see if we are done and if not       ******
// ****** fires the chain off again to resize the next image. If we are done it writes the new zip archive.                 ******
// *******************************************************************************************************************************
       
       
function startProcessingFile(name)
{
  // Read the file from the zip archive
  theFile = zipArchiveToReadFrom.file(name);
  theFile.async('blob')
  .then(function success(content)
  {
    // Resize the image file into a canvas
    currentImage = new Image();
    content.type = 'image/jpeg';
    currentImage.src = URL.createObjectURL(content);
    currentImage.onload = resizeImage;
    
  },
  function error(e){
    document.getElementById('archiveFileContents').innerHTML = '<br><br><b>ERROR reading zip file: </b>:' + e;
    console.log('ERROR reading zip file:' + e);
  });
        
  
}


function resizeImage()
{
  ctx = theResizeCanvas.getContext("2d");

  // Figure out how to fit the image to the desired size restrictions
  scaleFactorX = resizeTargetWidth / currentImage.width;
  scaleFactorY = resizeTargetHeight / currentImage.height;
  width = resizeTargetWidth;
  height = resizeTargetHeight;
  if (scaleFactorX < scaleFactorY)      // Means the x dimension gets scaled more
  {
    height = currentImage.height * scaleFactorX;
  }
  else                                  // Means the y dimension gets scaled more
  {
    width = currentImage.width * scaleFactorY;
    
  }
  
  theResizeCanvas.width = width;
  theResizeCanvas.height = height;
  
  
  ctx.drawImage(currentImage, 0, 0, width, height);
  
  // Now create a jpeg image from canvas
  //var canvasJpegDataURL = theResizeCanvas.toDataURL('image/jpeg', 0.85);
  var canvasJpegBlob = theResizeCanvas.toBlob(jpegBlobCallback,'image/jpeg', 0.85);
  

}

function jpegBlobCallback(blobObj)
{
  // Replace the modified jpeg into the zip file (overwritting the existing one)
  zipArchiveToReadFrom.file(fileNames[currentFileNumber].name,blobObj);
    
  nextImage();
  
  
}

function nextImage()
{
  currentFileNumber++;
  if (currentFileNumber < fileNames.length)
  {
      // Kick off the async chain of callbacks for processing an image
    startProcessingFile(fileNames[currentFileNumber].name);
  }
  else
  {
    // Create new zip file from modified files
    zipArchiveToReadFrom.generateAsync({type:"blob"})
    .then(function success(zippedFile) {
      saveAs(zippedFile, "resizedImages.zip");
    },
    function error(e) {
      document.getElementById('archiveFileContents').innerHTML = '<br><br><b>ERROR creating new zip file: </b>:' + e;
      console.log('ERROR creating zip file:' + e);
    });

  }

}




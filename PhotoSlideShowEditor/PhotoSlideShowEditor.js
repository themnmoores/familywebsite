//
// Copyright 2017, Richard J. Moore all rights reserved
//
// PhotoSlideShowEditor.js
//
// Collection of common functions for doing a photo slide show editor
//
// The HTML page must set up the callbacks to start either a new slide show or editing an existing one
//

// *************************************************************************************************************
// Some globals setup by the create or edit slide show functions, which must be called first!!!
// *************************************************************************************************************

var PhotoSlideShowEditorVars = {
  // Used by async calls for creating photo gallery
  currentImageNum:0,
  currentImage:undefined, // Image Object
  photoGalleryElementWidth:160,
  photoGalleryElementHeight:120,
  photoGalleryInterSpace:40,
  photoGalleryHorizontalImages:5,
  photoGalleryCanvases:[],          // We hold the canvases here to all use to quickly move them or enable/disable display
  photoGalleryTopOffset:180,
  photoGalleryLeftOffset:80,
  photoGalleryDiv:undefined,        // The Div containing the photo Gallery
  
  // Used when in slide show mode
  currentImageNumberInSlideShow:0,
  
  // This is the photo slide show information that gets written to a JSON string
  photoSlideShow:{displayWindow: {width: 800,height: 600,title: "New Slide Show"},images:[]},
  
  // The HTML sets up a <div> for us to use in drawing a photo gallery
  divForPhotoGallery:undefined
};


//


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
//   Start the process of creating a new photo slide show.
//   Uses standard Javascript FileReader to read the file, which will call ReadOfArchiveFileCompleted
//   below to open and process the zip file.
// *********************************************************************************************************


function CreateNewPhotoSlideShow()
{
  // Get the jpeg files the user selected
  var jpegFiles = document.getElementById('createSlideShow').files;
  if (jpegFiles.length === 0) {
      alert("No files selected for photo slide show!!!!");
      return;
  }
  
  // First turn off the create and edit buttons
  var createButton = document.getElementById('createSlideShowButton');
  createButton.style.display='none';
  var editButton = document.getElementById('editSlideShowButton');
  editButton.style.display='none';
  
  
  
  // Put up the default information about slide show
  var titleText = document.getElementById('slideShowTitle');
  titleText.style.display='initial';
  var titleInput = document.getElementById('slideShowTitleInput');
  titleInput.style.display='initial';
  titleInput.value=PhotoSlideShowEditorVars.photoSlideShow.displayWindow.title;
  var widthText = document.getElementById('slideShowWidth');
  widthText.style.display='initial';
  var widthInput = document.getElementById('slideShowWidthInput');
  widthInput.style.display='initial';
  widthInput.value=PhotoSlideShowEditorVars.photoSlideShow.displayWindow.width;
  var heightText = document.getElementById('slideShowHeight');
  heightText.style.display='initial';
  var heightInput = document.getElementById('slideShowHeightInput');
  heightInput.style.display='initial';
  heightInput.value=PhotoSlideShowEditorVars.photoSlideShow.displayWindow.height;
  
  PhotoSlideShowEditorVars.photoGalleryDiv = document.getElementById('photoGalleryDiv');
  
  // Populate the slide show information with the files selected and set the caption to an empty string

  var fileListText = document.getElementById('tempForFileNames');
  var filesListHTML = '';
  for (imageFileNum = 0 ; imageFileNum < jpegFiles.length ; imageFileNum++)
  {
    PhotoSlideShowEditorVars.photoSlideShow.images.push({src:jpegFiles[imageFileNum].name, caption:''});
  }

  // Start the async process of drawing a photo gallery
  // PhotoSlideShowEditorVars.currentImage = new Image();
  // PhotoSlideShowEditorVars.currentImage.onload = addImageToGallery;
  // PhotoSlideShowEditorVars.currentImage.src = URL.createObjectURL(jpegFiles[0]);
  var theImage = new Image();
  theImage.onload = addImageToGallery;
  theImage.src = URL.createObjectURL(jpegFiles[0]);

}


function addImageToGallery(evt)
{
  var topY = PhotoSlideShowEditorVars.photoGalleryDiv.offsetTop + Math.floor(PhotoSlideShowEditorVars.currentImageNum / PhotoSlideShowEditorVars.photoGalleryHorizontalImages) *
                  (PhotoSlideShowEditorVars.photoGalleryElementHeight + PhotoSlideShowEditorVars.photoGalleryInterSpace);
  var leftX = PhotoSlideShowEditorVars.photoGalleryLeftOffset + (PhotoSlideShowEditorVars.currentImageNum % PhotoSlideShowEditorVars.photoGalleryHorizontalImages) *
                  (PhotoSlideShowEditorVars.photoGalleryElementWidth + PhotoSlideShowEditorVars.photoGalleryInterSpace);
  
  var theCanvas = document.createElement('canvas');
  theCanvas.width = PhotoSlideShowEditorVars.photoGalleryElementWidth;
  theCanvas.height = PhotoSlideShowEditorVars.photoGalleryElementHeight;
  theCanvas.style.position = "absolute";
  theCanvas.style.border = "1px solid";
  theCanvas.style.top = topY.toString() + 'px';
  theCanvas.style.left = leftX.toString() + 'px';
  theCanvas.id = PhotoSlideShowEditorVars.photoSlideShow.images[PhotoSlideShowEditorVars.currentImageNum].src;
  
  document.body.appendChild(theCanvas);
  
  ctx = theCanvas.getContext("2d");
  ctx.clearRect(0, 0, theCanvas.width, theCanvas.height);
  // Figure out how to display
  var x = 0;
  var y = 0;
  var width = ctx.canvas.width;
  var height = ctx.canvas.height;
  
  // Figure out how to fit the image into canvas
  //scaleFactorX = width / PhotoSlideShowEditorVars.currentImage.width;
  //scaleFactorY = height / PhotoSlideShowEditorVars.currentImage.height;
  scaleFactorX = width / evt.target.width;
  scaleFactorY = height / evt.target.height;
  if (scaleFactorX < scaleFactorY)      // Means the x dimension gets scaled more
  {
    //y = (height - (PhotoSlideShowEditorVars.currentImage.height * scaleFactorX)) / 2.0; // So we center the image vertically
    //height = PhotoSlideShowEditorVars.currentImage.height * scaleFactorX;
    y = (height - (evt.target.height * scaleFactorX)) / 2.0; // So we center the image vertically
    height = evt.target.height * scaleFactorX;
  }
  else                                  // Means the y dimension gets scaled more
  {
    //x = (width - (PhotoSlideShowEditorVars.currentImage.width * scaleFactorY)) / 2.0; // So we center the image horizontally
    //width = PhotoSlideShowEditorVars.currentImage.width * scaleFactorY;
    x = (width - (evt.target.width * scaleFactorY)) / 2.0; // So we center the image horizontally
    width = evt.target.width * scaleFactorY;
    
  }
  
  //ctx.drawImage(PhotoSlideShowEditorVars.currentImage, x, y, width, height);
  ctx.drawImage(evt.target, x, y, width, height);

  // Set it up to call outselves again for the next image if needed
  
  var jpegFiles = document.getElementById('createSlideShow').files;
  if ((PhotoSlideShowEditorVars.currentImageNum + 1) < PhotoSlideShowEditorVars.photoSlideShow.images.length )
  {
    PhotoSlideShowEditorVars.currentImageNum++;
    // PhotoSlideShowEditorVars.currentImage = new Image();
    // PhotoSlideShowEditorVars.currentImage.onload = addImageToGallery;
    // PhotoSlideShowEditorVars.currentImage.src = URL.createObjectURL(jpegFiles[PhotoSlideShowEditorVars.currentImageNum]);
    var theImage = new Image();
    theImage.onload = addImageToGallery;
    theImage.src = URL.createObjectURL(jpegFiles[PhotoSlideShowEditorVars.currentImageNum]);
  }
  
}









// *********************************************************************************************************
//  Base64 encode / decode
//  http://www.webtoolkit.info/
//
//  Modified to make it more efficient (I think RJM)
// *********************************************************************************************************

var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        var actualBytes = new Uint8Array(input);
        var threes = input.byteLength / 3;
        threes = threes * 3;
        while (i < threes) {
            chr1 = actualBytes[i++];
            chr2 = actualBytes[i++];
            chr3 = actualBytes[i++];

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            output = output +
			    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }
        var leftovers = input.byteLength % 3;
        if (leftovers === 0) return output;

        enc3 = 64;
        enc4 = 64;
        enc1 = actualBytes[i] >> 2;
        enc2 = ((actualBytes[i++] & 3) << 4);
        if (leftovers == 2) {
            enc2 = enc2 | (actualBytes[i] >> 4);
            enc3 = ((actualBytes[i] & 15) << 2);
        }
        output = output +
			    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        return output;
    }

}


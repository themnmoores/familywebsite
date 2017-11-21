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
  //currentImageNum:0,
  currentImage:undefined, // Image Object
  photoGalleryElementWidth:160,
  photoGalleryElementHeight:120,
  photoGalleryInterSpace:40,
  photoGalleryHorizontalImages:6,
  photoGalleryCanvases:[],          // We hold the canvases here to all use to quickly move them or enable/disable display
  photoGalleryDiv:undefined,        // The Div containing the photo Gallery
  
  // Used when in slide show mode
  currentImageNumberInSlideShow:0,
  
  // This is the photo slide show information that gets written to a JSON string
  photoSlideShow:{displayWindow: {width: 800,height: 600,title: "New Slide Show"},images:[]},
  
  // The HTML sets up a <div> for us to use in drawing a photo gallery
  divForPhotoGallery:undefined,
  
  // Images selected by the user used by create and add functionality
  imageFilesSelectedByUser:undefined,
  currentImageSelectedByUser:0,
  imageFilesLoaded:0
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
  PhotoSlideShowEditorVars.imageFilesSelectedByUser = document.getElementById('createSlideShow').files;
  if (PhotoSlideShowEditorVars.imageFilesSelectedByUser.length === 0) {
      alert("No files selected for photo slide show!!!!");
      return;
  }
  
  // First turn off the create and edit buttons and on the save and addd buttons for UI
  turnOffCreateAndEditButtons()  ;
  turnOnAddAndSaveButtons();
  
  // Display the default information about slide show
  displaySlideShowInforation(PhotoSlideShowEditorVars.photoSlideShow.displayWindow.title,
          PhotoSlideShowEditorVars.photoSlideShow.displayWindow.width, PhotoSlideShowEditorVars.photoSlideShow.displayWindow.height);

  PhotoSlideShowEditorVars.photoGalleryDiv = document.getElementById('photoGalleryDiv');
  
  // Start the async process of adding images to a photo gallery
  var theImage = new Image();
  theImage.onload = addImageToEndOfGallery;
  theImage.src = URL.createObjectURL(PhotoSlideShowEditorVars.imageFilesSelectedByUser[PhotoSlideShowEditorVars.currentImageSelectedByUser]);

}


function addImageToEndOfGallery(evt)
{
  var topY = PhotoSlideShowEditorVars.photoGalleryDiv.offsetTop + Math.floor(PhotoSlideShowEditorVars.photoSlideShow.images.length / PhotoSlideShowEditorVars.photoGalleryHorizontalImages) *
                  (PhotoSlideShowEditorVars.photoGalleryElementHeight + PhotoSlideShowEditorVars.photoGalleryInterSpace);
  var leftX = PhotoSlideShowEditorVars.photoGalleryDiv.offsetLeft + (PhotoSlideShowEditorVars.photoSlideShow.images.length % PhotoSlideShowEditorVars.photoGalleryHorizontalImages) *
                  (PhotoSlideShowEditorVars.photoGalleryElementWidth + PhotoSlideShowEditorVars.photoGalleryInterSpace);

  var theCanvas = document.createElement('canvas');
  theCanvas.width = PhotoSlideShowEditorVars.photoGalleryElementWidth;
  theCanvas.height = PhotoSlideShowEditorVars.photoGalleryElementHeight;
  theCanvas.style.position = "absolute";
  theCanvas.style.border = "1px solid";
  theCanvas.style.top = topY.toString() + 'px';
  theCanvas.style.left = leftX.toString() + 'px';
  theCanvas.id = PhotoSlideShowEditorVars.imageFilesSelectedByUser[PhotoSlideShowEditorVars.currentImageSelectedByUser].name;

  document.body.appendChild(theCanvas);
  PhotoSlideShowEditorVars.photoSlideShow.images.push({src:PhotoSlideShowEditorVars.imageFilesSelectedByUser[PhotoSlideShowEditorVars.currentImageSelectedByUser].name, caption:'', htmlCanvas:theCanvas});
  
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
  
  if ((PhotoSlideShowEditorVars.currentImageSelectedByUser + 1) < PhotoSlideShowEditorVars.imageFilesSelectedByUser.length )
  {
    PhotoSlideShowEditorVars.currentImageSelectedByUser++;
    var theImage = new Image();
    theImage.onload = addImageToEndOfGallery;
    theImage.src = URL.createObjectURL(PhotoSlideShowEditorVars.imageFilesSelectedByUser[PhotoSlideShowEditorVars.currentImageSelectedByUser]);
  }
  
}

// *********************************************************************************************************
//  Add a photo or photos to the end of the slide show, a callback
// *********************************************************************************************************

function addPhotosToSlideShow()
{
  // Get the jpeg files the user selected
  PhotoSlideShowEditorVars.imageFilesSelectedByUser = document.getElementById('addPhotosToSlideShow').files;
  if (PhotoSlideShowEditorVars.imageFilesSelectedByUser.length === 0) {
      alert("No files selected for photo slide show!!!!");
      return;
  }
  
  // Start the async process of adding images to a photo gallery
  PhotoSlideShowEditorVars.currentImageSelectedByUser = 0;
  var theImage = new Image();
  theImage.onload = addImageToEndOfGallery;
  theImage.src = URL.createObjectURL(PhotoSlideShowEditorVars.imageFilesSelectedByUser[PhotoSlideShowEditorVars.currentImageSelectedByUser]);
  
}

// *********************************************************************************************************
//  Turn off the display of the create and edit slide show buttons
// *********************************************************************************************************

function turnOffCreateAndEditButtons()
{
  var createButton = document.getElementById('createSlideShowButton');
  createButton.style.display='none';
  var editButton = document.getElementById('editSlideShowButton');
  editButton.style.display='none';
}



// *********************************************************************************************************
//  Turn on the display of the add photo and save slide show buttons
// *********************************************************************************************************

function turnOnAddAndSaveButtons()
{
  var addPhotoButton = document.getElementById('addPhotoButton');
  addPhotoButton.style.display='initial';
  var saveSlideShowButton = document.getElementById('saveSlideShowButton');
  saveSlideShowButton.style.display='initial';
}


// *********************************************************************************************************
//  Display the generic information about a slide show
// *********************************************************************************************************


function displaySlideShowInforation(title, width, height)
{
  var titleText = document.getElementById('slideShowTitle');
  titleText.style.display='initial';
  var titleInput = document.getElementById('slideShowTitleInput');
  titleInput.style.display='initial';
  titleInput.value=title;
  var widthText = document.getElementById('slideShowWidth');
  widthText.style.display='initial';
  var widthInput = document.getElementById('slideShowWidthInput');
  widthInput.style.display='initial';
  widthInput.value=width.toString();
  var heightText = document.getElementById('slideShowHeight');
  heightText.style.display='initial';
  var heightInput = document.getElementById('slideShowHeightInput');
  heightInput.style.display='initial';
  heightInput.value=height.toString();
  
}


//
// Copyright 2017,2020, Richard J. Moore all rights reserved
//
// PhotoSlideShowEditor.js
//
// Collection of common functions for doing a photo slide show editor
//
// The HTML page must set up the callbacks to start either a new slide show or editing an existing one
//
// History
//    Sept 9, 2020    Implemented delete photo button on thumbnail display grid
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
  //photoGalleryCanvases:[],          // We hold the canvases here to allow use to be able to quickly move them or enable/disable display
  photoGalleryDiv:undefined,        // The Div containing the photo Gallery
  

  // Used when in caption editing (slide show) mode
  currentImageNumberInSlideShow:0,
  currentGalleryScrollPosition:0,
  
  // This is the photo slide show information that gets written to a JSON string
  photoSlideShow:{displayWindow: {width: 1200,height: 900,title: "New Slide Show"},images:[]},
  
  // The HTML sets up a <div> for us to use in drawing a photo gallery
  divForPhotoGallery:undefined,
  
  // Images selected by the user used by create and add functionality
  imageFilesSelectedByUser:undefined,
  currentImageSelectedByUser:0,
  imageFilesLoaded:0,

  // Used for moving photos in gallery
  currentlySelectedCanvas:undefined,
  
  // Used for caption editing mode (single photo slide show)
  currentCaptionEditingImage:0,
  
  // Used for loading stuff from a zip archive for slide show edit
  zipArchiveToReadFrom:undefined
  
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
  displaySlideShowInformation(PhotoSlideShowEditorVars.photoSlideShow.displayWindow.title,
          PhotoSlideShowEditorVars.photoSlideShow.displayWindow.width, PhotoSlideShowEditorVars.photoSlideShow.displayWindow.height);

  PhotoSlideShowEditorVars.photoGalleryDiv = document.getElementById('photoGalleryDiv');
  
  // Start the async process of adding images to a photo gallery
  var theImage = new Image();
  theImage.onload = addImageToEndOfGallery;
  theImage.src = URL.createObjectURL(PhotoSlideShowEditorVars.imageFilesSelectedByUser[PhotoSlideShowEditorVars.currentImageSelectedByUser]);

}



// *********************************************************************************************************
//  A callback to add the loaded Image to the end of our current gallery
//
// *********************************************************************************************************


function addImageToEndOfGallery(evt)
{
  var topY = calculateTopY(PhotoSlideShowEditorVars.photoSlideShow.images.length);
  var leftX = calculateLeftX(PhotoSlideShowEditorVars.photoSlideShow.images.length);

  var theCanvas = document.createElement('canvas');
  theCanvas.width = PhotoSlideShowEditorVars.photoGalleryElementWidth;
  theCanvas.height = PhotoSlideShowEditorVars.photoGalleryElementHeight;
  theCanvas.style.position = "absolute";
  theCanvas.style.border = "1px solid black";
  theCanvas.style.top = topY.toString() + 'px';
  theCanvas.style.left = leftX.toString() + 'px';
  theCanvas.onclick = function(evt) { photoGalleryElementMouseClick(evt) };
  theCanvas.ondblclick = function(evt) { editPhotoCaptionEvent(evt) };
  theCanvas.id = PhotoSlideShowEditorVars.imageFilesSelectedByUser[PhotoSlideShowEditorVars.currentImageSelectedByUser].name;

  document.body.appendChild(theCanvas);
  
  // ****  Push an image to the end of the photo slide show array of images
          /*caption:'Caption ' + (PhotoSlideShowEditorVars.photoSlideShow.images.length + 1).toString(),*/
  PhotoSlideShowEditorVars.photoSlideShow.images.push({src:PhotoSlideShowEditorVars.imageFilesSelectedByUser[PhotoSlideShowEditorVars.currentImageSelectedByUser].name,
        caption:"",
        htmlCanvas:theCanvas,
        imageObj:evt.target,
        imageFileBlob:PhotoSlideShowEditorVars.imageFilesSelectedByUser[PhotoSlideShowEditorVars.currentImageSelectedByUser]
  });
  
  displayImageInCanvas (theCanvas,  evt.target);
  
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
//  Functions to calculate the top left hand corner position of a canvas based on the gallery sizing
//  and the index number of the image in the gallery (starting at 0)
// *********************************************************************************************************

function calculateTopY (imageIndex)
{
  return PhotoSlideShowEditorVars.photoGalleryDiv.offsetTop + Math.floor(imageIndex / PhotoSlideShowEditorVars.photoGalleryHorizontalImages) *
                  (PhotoSlideShowEditorVars.photoGalleryElementHeight + PhotoSlideShowEditorVars.photoGalleryInterSpace);
}

function calculateLeftX (imageIndex)
{
  return PhotoSlideShowEditorVars.photoGalleryDiv.offsetLeft + (imageIndex % PhotoSlideShowEditorVars.photoGalleryHorizontalImages) *
                  (PhotoSlideShowEditorVars.photoGalleryElementWidth + PhotoSlideShowEditorVars.photoGalleryInterSpace)
}



// *********************************************************************************************************
//  Display a loaded image (Image class) in the specified canvas
// *********************************************************************************************************

function displayImageInCanvas(theCanvas, loadedImage)
{
  ctx = theCanvas.getContext("2d");
  ctx.clearRect(0, 0, theCanvas.width, theCanvas.height);
  // Figure out how to display
  var x = 0;
  var y = 0;
  var width = ctx.canvas.width;
  var height = ctx.canvas.height;
  
  // Figure out how to fit the image into canvas
  scaleFactorX = width / loadedImage.width;
  scaleFactorY = height / loadedImage.height;
  if (scaleFactorX < scaleFactorY)      // Means the x dimension gets scaled more
  {
    y = (height - (loadedImage.height * scaleFactorX)) / 2.0; // So we center the image vertically
    height = loadedImage.height * scaleFactorX;
  }
  else                                  // Means the y dimension gets scaled more
  {
    x = (width - (loadedImage.width * scaleFactorY)) / 2.0; // So we center the image horizontally
    width = loadedImage.width * scaleFactorY;
    
  }
  
  ctx.drawImage(loadedImage, x, y, width, height);
  
  

  
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


function displaySlideShowInformation(title, width, height)
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



// *********************************************************************************************************
//  Save the file (photos and json javascript file) in a zip archive
//
//   Note: Uses jszip.min.js for zip archive creation
//      Uses FileSaver.js to download the archive
// *********************************************************************************************************

function saveSlideShow()
{
  // Add all the jpeg file to the archive
  var zipArchive = new JSZip();
  for (image = 0 ; image < PhotoSlideShowEditorVars.photoSlideShow.images.length ; image++)
  {
    zipArchive.file(PhotoSlideShowEditorVars.photoSlideShow.images[image].src, PhotoSlideShowEditorVars.photoSlideShow.images[image].imageFileBlob);
  }
  
  // Create the javascript file photofilelist.js that has the JSON string photoFileListJSONString in it that
  // has all the information concerning the photo slide show. Need to create a new one that does not have
  // the html canvas and jpeg blob info
  var trimmedPhotoSlideShow = {displayWindow: PhotoSlideShowEditorVars.photoSlideShow.displayWindow,images:[]};
  trimmedPhotoSlideShow.displayWindow.title = document.getElementById('slideShowTitleInput').value;
  trimmedPhotoSlideShow.displayWindow.width = document.getElementById('slideShowWidthInput').value;
  trimmedPhotoSlideShow.displayWindow.height = document.getElementById('slideShowHeightInput').value;
  
  for (image = 0 ; image < PhotoSlideShowEditorVars.photoSlideShow.images.length ; image++)
  {
    trimmedPhotoSlideShow.images.push({src: PhotoSlideShowEditorVars.photoSlideShow.images[image].src,
            caption: PhotoSlideShowEditorVars.photoSlideShow.images[image].caption});
  }
  var jsonStringForSlideShow = JSON.stringify(trimmedPhotoSlideShow);
  //jsonStringForSlideShow = jsonStringForSlideShow.replace('\'', '\\\'')
  jsonStringForSlideShow = jsonStringForSlideShow.replace(/'/g, '\\\'');
  jsonStringForSlideShow = 'var photoFileListJSONString = \'' + jsonStringForSlideShow + '\'';
  zipArchive.file('photofilelist.js', jsonStringForSlideShow);

  // Save archive to generic photoSlideShow.zip in downloads
  zipArchive.generateAsync({type:"blob"})
  .then(function success(zippedFile) {
    // Save to file
    saveAs(zippedFile, 'photoSlideShow.zip');
  },
  function error(e) {
    alert('ERROR creating new zip file: ' + e);
  });
  
  
}






// *********************************************************************************************************
//  Event handler for a mouse click event on a photo gallery canvas (photo thumbnail)
//
//  If this is the first mouse on a canvas photo we make the border red and simply log which canvas was
//  selected
//
//  If a canvas has been already selected one of two things happens
//
//  If it is the same canvas that is already selected we make the border black and clear the canvas log
//
//  If it is another canvas we go about moving the previously selected canvas to the clicked canvas's
//  location and slide things down or up depending on if we are moving the previously selected canvas
//  up the list or down the list. The images array is modified to reflect the movement and the affected
//  canvases have their x/y location changed. The canvas log is cleared and the previously seleced canvas
//  has it's border set to black
// *********************************************************************************************************

function photoGalleryElementMouseClick (evt)
{
  if (!PhotoSlideShowEditorVars.currentlySelectedCanvas)
  {
    PhotoSlideShowEditorVars.currentlySelectedCanvas = document.getElementById(evt.currentTarget.id);
    PhotoSlideShowEditorVars.currentlySelectedCanvas.style.border = "3px solid red";
    displayDeleteSelectedPhotoButton();
  }
  else
  {
    if (PhotoSlideShowEditorVars.currentlySelectedCanvas.id != evt.currentTarget.id)
    {
      // Put the previously selected photo ahead of the currently selected canvas
      
      // First find the index of the canvases we are working with
      currentlySelectedCanvasIndex = findCurrentIndexOfCanvas(evt.currentTarget.id);
      firstSelectedCanvasIndex = findCurrentIndexOfCanvas(PhotoSlideShowEditorVars.currentlySelectedCanvas.id);
      
      // We are moving an photo up the list to replace the currently selected photo
      if (currentlySelectedCanvasIndex < firstSelectedCanvasIndex)
      {
        // First resuffle the images in the images array
        var imageBeingMovedImageEntry = PhotoSlideShowEditorVars.photoSlideShow.images[firstSelectedCanvasIndex];
        for (image = currentlySelectedCanvasIndex ; image <= firstSelectedCanvasIndex ; image++)
        {
          var nextImageToBeMovedImageEntry = PhotoSlideShowEditorVars.photoSlideShow.images[image];
          PhotoSlideShowEditorVars.photoSlideShow.images[image] = imageBeingMovedImageEntry;
          imageBeingMovedImageEntry = nextImageToBeMovedImageEntry;
        }


        // Next reset the canvas positions based on current index in array
        for (image = currentlySelectedCanvasIndex ; image <= firstSelectedCanvasIndex ; image++)
        {
          PhotoSlideShowEditorVars.photoSlideShow.images[image].htmlCanvas.style.top = calculateTopY(image).toString() + 'px';
          PhotoSlideShowEditorVars.photoSlideShow.images[image].htmlCanvas.style.left = calculateLeftX(image).toString() + 'px';
        }
      }
      
      // We are moving an photo down the list to replace the currently selected photo
      if (currentlySelectedCanvasIndex > firstSelectedCanvasIndex)
      {
        // First resuffle the images in the images array
        var imageBeingMovedImageEntry = PhotoSlideShowEditorVars.photoSlideShow.images[firstSelectedCanvasIndex];
        for (image = currentlySelectedCanvasIndex ; image >= firstSelectedCanvasIndex ; image--)
        {
          var nextImageToBeMovedImageEntry = PhotoSlideShowEditorVars.photoSlideShow.images[image];
          PhotoSlideShowEditorVars.photoSlideShow.images[image] = imageBeingMovedImageEntry;
          imageBeingMovedImageEntry = nextImageToBeMovedImageEntry;
        }


        // Next reset the canvas positions based on current index in array
        for (image = currentlySelectedCanvasIndex ; image >= firstSelectedCanvasIndex ; image--)
        {
          PhotoSlideShowEditorVars.photoSlideShow.images[image].htmlCanvas.style.top = calculateTopY(image).toString() + 'px';
          PhotoSlideShowEditorVars.photoSlideShow.images[image].htmlCanvas.style.left = calculateLeftX(image).toString() + 'px';
        }
      }
    }
    PhotoSlideShowEditorVars.currentlySelectedCanvas.style.border = "1px solid black";
    PhotoSlideShowEditorVars.currentlySelectedCanvas = undefined;
    disableDeleteSelectedPhotoButton();
  }
}



// *********************************************************************************************************
//  Code associated for deleting a selected photo in gallery view
// *********************************************************************************************************

function deleteSelectedPhoto()
{
  // Hide current thumbnail on canvas
  PhotoSlideShowEditorVars.currentlySelectedCanvas.style.border = "1px solid black";
  selectedCanvasIndex = findCurrentIndexOfCanvas(PhotoSlideShowEditorVars.currentlySelectedCanvas.id);
  PhotoSlideShowEditorVars.photoSlideShow.images[selectedCanvasIndex].htmlCanvas.hidden = true;
  
  PhotoSlideShowEditorVars.photoSlideShow.images.splice(selectedCanvasIndex, 1);

  // Next reset the canvas positions to cover up deleted image
  for (image = selectedCanvasIndex ; image < PhotoSlideShowEditorVars.photoSlideShow.images.length ; image++)
  {
    PhotoSlideShowEditorVars.photoSlideShow.images[image].htmlCanvas.style.top = calculateTopY(image).toString() + 'px';
    PhotoSlideShowEditorVars.photoSlideShow.images[image].htmlCanvas.style.left = calculateLeftX(image).toString() + 'px';
  }
  
    PhotoSlideShowEditorVars.currentlySelectedCanvas = undefined;
    disableDeleteSelectedPhotoButton();

}

function displayDeleteSelectedPhotoButton()
{
  var deleteSelectedPhotoButton = document.getElementById('deleteSelectedPhotoButton');
  deleteSelectedPhotoButton.style.display='initial';
}

function disableDeleteSelectedPhotoButton()
{
  var deleteSelectedPhotoButton = document.getElementById('deleteSelectedPhotoButton');
  deleteSelectedPhotoButton.style.display='none';
}

// *********************************************************************************************************
//  A double click event occured on a photo gallery canvas (photo) so we go into captoin edit mode where one
//  photo at a time is displayed (like a slide show) and allow the user to edit the captions.
// *********************************************************************************************************

function editPhotoCaptionEvent (evt)
{
  showOrHideCaptionEditingModeElements('initial');
  disableDeleteSelectedPhotoButton();
  PhotoSlideShowEditorVars.currentCaptionEditingImage = findCurrentIndexOfCanvas(evt.currentTarget.id);
  displayCaptionInCaptionEditingMode();
  
  displayImageInCaptionEditingMode();
  
  PhotoSlideShowEditorVars.currentGalleryScrollPosition = window.scrollY;
  window.scrollTo(0, 0);
}

function displayCaptionInCaptionEditingMode()
{
  var photoCaption = document.getElementById('photoCaption');
  photoCaption.value = PhotoSlideShowEditorVars.photoSlideShow.images[PhotoSlideShowEditorVars.currentCaptionEditingImage].caption;
}

function displayImageInCaptionEditingMode()
{
  var photoSlideShowCanvas = document.getElementById('photoSlideShowCanvas');
  displayImageInCanvas (photoSlideShowCanvas, PhotoSlideShowEditorVars.photoSlideShow.images[PhotoSlideShowEditorVars.currentCaptionEditingImage].imageObj);
}

function leftArrowPressedInCaptionEditingMode()
{
  saveCaptionText();
  if (PhotoSlideShowEditorVars.currentCaptionEditingImage === 0)
  {
    PhotoSlideShowEditorVars.currentCaptionEditingImage = PhotoSlideShowEditorVars.photoSlideShow.images.length-1;
  }
  else
  {
    PhotoSlideShowEditorVars.currentCaptionEditingImage--;
  }
  displayCaptionInCaptionEditingMode();
  displayImageInCaptionEditingMode();
}

function rightArrowPressedInCaptionEditingMode()
{
  saveCaptionText();
  if (PhotoSlideShowEditorVars.currentCaptionEditingImage == PhotoSlideShowEditorVars.photoSlideShow.images.length-1)
  {
    PhotoSlideShowEditorVars.currentCaptionEditingImage = 0;
  }
  else
  {
    PhotoSlideShowEditorVars.currentCaptionEditingImage++;
  }
  
  displayCaptionInCaptionEditingMode();
  displayImageInCaptionEditingMode();
}

// *********************************************************************************************************
//  User canceled out of caption editing mode, so hide associated elements
// *********************************************************************************************************

function cancelDuringCaptionEditPressed()
{
  showOrHideCaptionEditingModeElements('none');
  window.scrollTo(0, PhotoSlideShowEditorVars.currentGalleryScrollPosition);
  
   
}



// *********************************************************************************************************
//  User used "Ok" button to finish caption editing mode, so hide associated elements, and update
//  caption for currently displayed photo
// *********************************************************************************************************

function okDuringCaptionEditPressed()
{
  saveCaptionText();
  cancelDuringCaptionEditPressed();
}

function saveCaptionText()
{
  var photoCaption = document.getElementById('photoCaption');
  PhotoSlideShowEditorVars.photoSlideShow.images[PhotoSlideShowEditorVars.currentCaptionEditingImage].caption = photoCaption.value;
}


// *********************************************************************************************************
//  Function to set the display mode of the caption editing elements
//  displayMode = 'initial' to enable and 'none' to disable
// *********************************************************************************************************

function showOrHideCaptionEditingModeElements(displayMode)
{
  var photoSlideShowBackgroundDiv = document.getElementById('photoSlideShowBackground');
  photoSlideShowBackgroundDiv.style.display=displayMode;
  var photoSlideShowCanvas = document.getElementById('photoSlideShowCanvas');
  photoSlideShowCanvas.style.display=displayMode;
  var leftArrow = document.getElementById('leftArrow');
  leftArrow.style.display=displayMode;
  var rightArrow = document.getElementById('rightArrow');
  rightArrow.style.display=displayMode;
  var photoCaption = document.getElementById('photoCaption');
  photoCaption.style.display=displayMode;
  var cancelPhotoCaptionEdit = document.getElementById('cancelPhotoCaptionEdit');
  cancelPhotoCaptionEdit.style.display=displayMode;
  var okPhotoCaptionEdit = document.getElementById('okPhotoCaptionEdit');
  okPhotoCaptionEdit.style.display=displayMode;
  // var deletePhotoCaptionEdit = document.getElementById('deletePhotoCaptionEdit');
  // deletePhotoCaptionEdit.style.display=displayMode;

}




// *********************************************************************************************************
//  Delete a photo from the image array
// *********************************************************************************************************

function deletePhotoDuringCaptionEditPressed()
{
  
  
}


// *********************************************************************************************************
//  Find the index of the canvas in the photo gallery array that matches the id string passed
//    Return -1 if there is not a match
// *********************************************************************************************************

function findCurrentIndexOfCanvas(canvasId)
{
  for (image = 0 ; image < PhotoSlideShowEditorVars.photoSlideShow.images.length ; image++)
  {
    if (PhotoSlideShowEditorVars.photoSlideShow.images[image].src == canvasId)
    {
      return image;
    }
  }
  return -1;
}



// *********************************************************************************************************
//  Callback for the edit slide show button input. Loads the slide show json information and the photos
//  into a gallery for editing
// *********************************************************************************************************


function EditPhotoSlideShow()
{
  // First turn off the create and edit buttons and on the save and addd buttons for UI
  turnOffCreateAndEditButtons()  ;
  turnOnAddAndSaveButtons();
  PhotoSlideShowEditorVars.photoGalleryDiv = document.getElementById('photoGalleryDiv');

  var files = document.getElementById('editSlideShow').files;
  if (files.length === 0) {
      alert("No file to upload!!!!");
      return;
  }
  var file = files[0];

  var reader = new FileReader();
  reader.onloadend = ReadOfArchiveFileCompleted;
  reader.readAsArrayBuffer(file);
  
}


// *********************************************************************************************************
// The read of the zip file is complete so get the names of the files in the zip archive, and start the
// async processing loading the jpeg files into the photo.
// *********************************************************************************************************


function ReadOfArchiveFileCompleted(evt)
{

  var photoSlideZipFile = new JSZip();

  photoSlideZipFile.loadAsync(evt.target.result)
  .then(function success(zip)
  {
    console.log('Read zip file');

    PhotoSlideShowEditorVars.zipArchiveToReadFrom = zip;
    
    // Get the json information for the slide show
    zip.file('photofilelist.js').async("string")
    .then(function success(content)
    {
      // convert to photo slide show json
      jsonForPhotoSlideShow = content.replace('var photoFileListJSONString = \'{', '{');
      jsonForPhotoSlideShow = jsonForPhotoSlideShow.replace('}]}\'','}]}');
      jsonForPhotoSlideShow = jsonForPhotoSlideShow.replace(/\\\'/g, '\'');
      PhotoSlideShowEditorVars.photoSlideShow = JSON.parse(jsonForPhotoSlideShow);
      
      displaySlideShowInformation(PhotoSlideShowEditorVars.photoSlideShow.displayWindow.title,
          PhotoSlideShowEditorVars.photoSlideShow.displayWindow.width, PhotoSlideShowEditorVars.photoSlideShow.displayWindow.height);
          
      // Add htmlCanvas, imageObj and imageFileBlob to each entry in images array
      for (image = 0 ; image < PhotoSlideShowEditorVars.photoSlideShow.images.length ; image++)
      {
        PhotoSlideShowEditorVars.photoSlideShow.images[image].htmlCanvas = undefined;
        PhotoSlideShowEditorVars.photoSlideShow.images[image].imageObj = undefined;
        PhotoSlideShowEditorVars.photoSlideShow.images[image].imageFileBlob = undefined;
      }
      
      // Load up the image files as blobs
      PhotoSlideShowEditorVars.currentImageSelectedByUser = 0;
      window.setTimeout(LoadZipFileImages(), 10);
    },
    function error(e){
      alert("No photofilelist.js file in archive!!!!");
      return;
    });
  });
}


function LoadZipFileImages()
{
  PhotoSlideShowEditorVars.zipArchiveToReadFrom.file(PhotoSlideShowEditorVars.photoSlideShow.images[PhotoSlideShowEditorVars.currentImageSelectedByUser].src).async("blob")
  .then(function success(imageFileContent)
  {
    PhotoSlideShowEditorVars.photoSlideShow.images[PhotoSlideShowEditorVars.currentImageSelectedByUser].imageFileBlob = imageFileContent;
    PhotoSlideShowEditorVars.currentImageSelectedByUser++;
    if (PhotoSlideShowEditorVars.currentImageSelectedByUser < PhotoSlideShowEditorVars.photoSlideShow.images.length)
    {
      window.setTimeout(LoadZipFileImages(), 10);
    }
    else
    {
      // Start the async process of adding images to a photo gallery
      PhotoSlideShowEditorVars.currentImageSelectedByUser = 0;
      var theImage = new Image();
      theImage.onload = EditSlideShowAddImageToEndOfGallery;
      theImage.src = URL.createObjectURL(PhotoSlideShowEditorVars.photoSlideShow.images[PhotoSlideShowEditorVars.currentImageSelectedByUser].imageFileBlob);
    }
  },
  function error(e){
    alert("Missing image file" + PhotoSlideShowEditorVars.photoSlideShow.images[PhotoSlideShowEditorVars.currentImageSelectedByUser].src);
    return;
  });
  
}

function EditSlideShowAddImageToEndOfGallery(evt)
{
  var topY = calculateTopY(PhotoSlideShowEditorVars.currentImageSelectedByUser);
  var leftX = calculateLeftX(PhotoSlideShowEditorVars.currentImageSelectedByUser);

  var theCanvas = document.createElement('canvas');
  theCanvas.width = PhotoSlideShowEditorVars.photoGalleryElementWidth;
  theCanvas.height = PhotoSlideShowEditorVars.photoGalleryElementHeight;
  theCanvas.style.position = "absolute";
  theCanvas.style.border = "1px solid black";
  theCanvas.style.top = topY.toString() + 'px';
  theCanvas.style.left = leftX.toString() + 'px';
  theCanvas.onclick = function(evt) { photoGalleryElementMouseClick(evt) };
  theCanvas.ondblclick = function(evt) { editPhotoCaptionEvent(evt) };
  theCanvas.id = PhotoSlideShowEditorVars.photoSlideShow.images[PhotoSlideShowEditorVars.currentImageSelectedByUser].src;

  document.body.appendChild(theCanvas);
  
  // ****  Add canvas and image object to images array
  PhotoSlideShowEditorVars.photoSlideShow.images[PhotoSlideShowEditorVars.currentImageSelectedByUser].htmlCanvas = theCanvas;
  PhotoSlideShowEditorVars.photoSlideShow.images[PhotoSlideShowEditorVars.currentImageSelectedByUser].imageObj = evt.target;

  displayImageInCanvas (theCanvas,  evt.target);
  
  // Set it up to call outselves again for the next image if needed
  
  if ((PhotoSlideShowEditorVars.currentImageSelectedByUser + 1) < PhotoSlideShowEditorVars.photoSlideShow.images.length )
  {
    PhotoSlideShowEditorVars.currentImageSelectedByUser++;
    var theImage = new Image();
    theImage.onload = EditSlideShowAddImageToEndOfGallery;
    theImage.src = URL.createObjectURL(PhotoSlideShowEditorVars.photoSlideShow.images[PhotoSlideShowEditorVars.currentImageSelectedByUser].imageFileBlob);
  }
  
}

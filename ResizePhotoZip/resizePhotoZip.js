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



      //   // Pretty up the beginning so it is more human readable with line feeds, input any javascript files needed
      //   // also add google analytics all in the <head> tag
      //   content = '<!doctype html>\n'+ content;
      //   content = content.replace('<html><head>', '<html>\n\n<head>\n<script src="../../../formatting.js"></script>\n\n<meta name="viewport" content="width=1200">\n\n');
      //   // Get the keywords and description from the Google Doc text
      //   var keywords = '';
      //   var beginOfKeywords = content.indexOf('>keywords:');
      //   if (beginOfKeywords != -1)
      //   {
      //     keywords = content.substring(beginOfKeywords+11, content.indexOf('</span>', beginOfKeywords));
      //   }
      //   var description = '';
      //   var beginOfDescription = content.indexOf('>description:');
      //   if (beginOfDescription != -1)
      //   {
      //     description = content.substring(beginOfDescription+14, content.indexOf('</span>', beginOfDescription));
      //   }
      //   content = content.replace('</style>', '</style>\n\n<script>addGoogleAnalytics();</script>\n\n<meta name="description" content="' + description + '">\n<meta name="keywords" content="' + keywords + '">\n\n');
        
      //   // Add an onload callback to check for vertical position scrolling
      //   content = content.replace('<body', '<body style="padding:0 0 0 0;max-width:100vw" onload="setVerticalPositionToSpan()"');
        
        
      //   // Now set the background formatting, add the header and navigation link areas of the web page in the beginning of the <body>
      //   content = content.replace('<p class=', '\n\n<script>setBodyBackgroundFormatting();</script>\n<div id="headerTopBar"></div>\n<script>commonPageHeaderBarNew2("","../../../");</script>\n<script>commonNavivationButtonsNew2("../../../","");</script>\n\n<div style="text-align:center;margin-top:3vw" >\n\n<div style="width:612pt;margin-left: auto;margin-right: auto;">\n\n<p class=');
        
      //   // Adjust the positioning of the content, 72pt is 1 inch and 36pt is 1/2 inch
      //   //content = content.replace('padding:72pt 72pt 72pt 72pt', 'padding:200px 72pt 72pt 300px')
      //   //content = content.replace('padding:36pt 36pt 36pt 36pt', 'padding:200px 36pt 36pt 300px')
        
      //   // Finally add the HTMLCommentBox stuff at the end of the <body> stuff
      //   content = content.replace('</body>', '\n\n<script>addHTMLCommentBox();</script>\n\n</body>');
        
      //   // This section removed stuff google puts in for html links that causes a redirect warning
      //   while(content.indexOf('https://www.google.com/url?q=') != -1)
      //   {
      //     content = content.replace('https://www.google.com/url?q=', '');
      //   }
        
      //   while(content.indexOf('&amp;') != -1)
      //   {
      //     var beginningOfTrailerStuff = content.indexOf('&amp;');
      //     var endOfTrailerStuff = content.indexOf('"', beginningOfTrailerStuff);
      //     var stringToReplace = content.substring(beginningOfTrailerStuff, endOfTrailerStuff);
      //     content = content.replace(stringToReplace, '');
      //   }
        
      //   while (content.indexOf('?vertscrollspan%3D') != -1)
      //   {
      //     content = content.replace('?vertscrollspan%3D', '?vertscrollspan=');
      //   }
        
      //   // Replace the modified into the zip file (overwritting the existing one)
      //   zip.file(fileNames[0].name,content);
      //   zip.generateAsync({type:"blob"})
      //   .then(function success(zippedFile) {
      //     // Save to file
      //     outputFile = fileNames[0].name.replace('.html', '_new.zip')
      //     saveAs(zippedFile, outputFile);
      //   },
      //   function error(e) {
      //     document.getElementById('archiveFileContents').innerHTML = '<br><br><b>ERROR creating new zip file: </b>:' + e;
      //   });
      // },
      // function error(e){
      //   document.getElementById('archiveFileContents').innerHTML = '<br><br><b>ERROR reading HTML file ' + fileNames[0].name +' from zip: </b>:' + e;
      // });
	    
	    
//     },
//     function error(e)
//     {
//       document.getElementById('archiveFileContents').innerHTML = '<br><br><b>ERROR reading zip file: </b>:' + e;
//     });

// }

// *********************************************************************************************************
// The read of the zip file is complete so get the html file in the zip and transform it, then write it
// back into the zip file and save (download)
// *********************************************************************************************************


function ReadOfArchiveFileCompletedJsZip(evt)
{

    var htmlZipFile = new JSZip();

    htmlZipFile.loadAsync(evt.target.result)
    .then(function success(zip) {
      console.log('Read zip file');
  	  var filesStr = "HTML Files (should only be one):<br><br> ";
      var fileNames = zip.file(/.html/);
  	  for (var file = 0 ; file < fileNames.length ; file++)
	    {
		    filesStr += fileNames[file].name + "<br>";
	    }
      document.getElementById('archiveFileContents').innerHTML = filesStr;
	    
	    if (fileNames.length != 1)
	    {
	      filesStr += "<br><b>Invalid Google Docs Save As HTML ZIP arcive!!!!</b>"
        document.getElementById('archiveFileContents').innerHTML = filesStr;
        return;
	    }
	    
      zip.file(fileNames[0].name).async('string', function (meta) {console.log("Generating the content, we are at " + meta.percent.toFixed(2) + " %");})
      .then(function success(content){

        // *******************************************************************************************************************************
        // ****** Here is where we reformat the html file Google Docs outputs, if you want to play with stuff this is where to do it *****
        // *******************************************************************************************************************************
        
        // Pretty up the beginning so it is more human readable with line feeds, input any javascript files needed
        // also add google analytics all in the <head> tag
        content = '<!doctype html>\n'+ content;
        content = content.replace('<html><head>', '<html>\n\n<head>\n<script src="../../../formatting.js"></script>\n\n');
        // Get the keywords and description from the Google Doc text
        var keywords = '';
        var beginOfKeywords = content.indexOf('>keywords:');
        if (beginOfKeywords != -1)
        {
          keywords = content.substring(beginOfKeywords+11, content.indexOf('</span>', beginOfKeywords));
        }
        var description = '';
        var beginOfDescription = content.indexOf('>description:');
        if (beginOfDescription != -1)
        {
          description = content.substring(beginOfDescription+14, content.indexOf('</span>', beginOfDescription));
        }
        content = content.replace('</style>', '</style>\n\n<script>addGoogleAnalytics();</script>\n\n<meta name="description" content="' + description + '">\n<meta name="keywords" content="' + keywords + '">\n\n');
        
        // Add an onload callback to check for vertical position scrolling
        content = content.replace('<body', '<body onload="setVerticalPositionToSpan()"');
        
        
        // Now set the background formatting, add the header and navigation link areas of the web page in the beginning of the <body>
        content = content.replace('<p class=', '\n\n<script>setBodyBackgroundFormatting();</script>\n<div id="headerTopBar"></div>\n<script>commonPageHeaderBar("","../../../");</script>\n<script>commonNavivationButtons("../../../","");</script>\n\n<p class=');
        
        // Adjust the positioning of the content, 72pt is 1 inch and 36pt is 1/2 inch
        content = content.replace('padding:72pt 72pt 72pt 72pt', 'padding:200px 72pt 72pt 300px')
        content = content.replace('padding:36pt 36pt 36pt 36pt', 'padding:200px 36pt 36pt 300px')
        
        // Finally add the HTMLCommentBox stuff at the end of the <body> stuff
        content = content.replace('</body>', '\n\n<script>addHTMLCommentBox();</script>\n\n</body>');
        
        // This section removed stuff google puts in for html links that causes a redirect warning
        while(content.indexOf('https://www.google.com/url?q=') != -1)
        {
          content = content.replace('https://www.google.com/url?q=', '');
        }
        
        while(content.indexOf('&amp;') != -1)
        {
          var beginningOfTrailerStuff = content.indexOf('&amp;');
          var endOfTrailerStuff = content.indexOf('"', beginningOfTrailerStuff);
          var stringToReplace = content.substring(beginningOfTrailerStuff, endOfTrailerStuff);
          content = content.replace(stringToReplace, '');
        }
        
        while (content.indexOf('?vertscrollspan%3D') != -1)
        {
          content = content.replace('?vertscrollspan%3D', '?vertscrollspan=');
        }
        
        // Replace the modified into the zip file (overwritting the existing one)
        zip.file(fileNames[0].name,content);
        zip.generateAsync({type:"blob"})
        .then(function success(zippedFile) {
          // Save to file
          outputFile = fileNames[0].name.replace('.html', '_new.zip')
          saveAs(zippedFile, outputFile);
        },
        function error(e) {
          document.getElementById('archiveFileContents').innerHTML = '<br><br><b>ERROR creating new zip file: </b>:' + e;
        });
      },
      function error(e){
        document.getElementById('archiveFileContents').innerHTML = '<br><br><b>ERROR reading HTML file ' + fileNames[0].name +' from zip: </b>:' + e;
      });
	    
	    
    },
    function error(e)
    {
      document.getElementById('archiveFileContents').innerHTML = '<br><br><b>ERROR reading zip file: </b>:' + e;
    });

}

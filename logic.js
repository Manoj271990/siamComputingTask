//gloablVariables
var createDynamicImageDiv, createFigureImage, pageCount=0, jsonDataArray=[];

window.onload=function(){
    
    ajax_get('https://api.unsplash.com/photos/?client_id=7sJ04_uYW3y-Yg85QThOBs5QkBMY41MxW1KQdy6EMxc', function(data) {
    loadDynamicImage(data);
    setTimeout(function(){waitForImages()},1000);
   });

   
}

var closeModal=function(){
    document.getElementById("modal-overlay").style.display="none";
}

var loadDynamicImage=function(jsonData){
    jsonDataArray=jsonData;
    jsonData.map(function(value,ind){
        createFigureImage=document.createElement("div")
        createFigureImage.id="parent-image_"+ind;
        createFigureImage.className="parent-image-items image_"+ind;


        createDynamicImageDiv=document.createElement("img"); 
        createDynamicImageDiv.id="image_"+ind;
        createDynamicImageDiv.className="image-items image_"+ind;

        createDynamicImageDiv.setAttribute("src",value.urls["raw"]);
        document.getElementById("main-container").appendChild(createFigureImage);
        document.getElementById("parent-image_"+ind).appendChild(createDynamicImageDiv);
        createDynamicImageDiv.addEventListener("click",function(event){
            openModal(event);
        })

    })
}

var openModal=function(currentImage){
    document.getElementById("modal-overlay").style.display="inline-block";
    document.querySelector("body").style.overflow="hidden";
    var getID=currentImage.target.id;
     var splitId=getID.split("_");
     pageCount=parseInt(splitId[1]);
     if(pageCount==0){
        document.querySelector(".prev").classList.add('disabled');
     }
     else if(pageCount==document.getElementsByClassName('parent-image-items').length-1){
        document.querySelector(".next").classList.add('disabled');
     }
     else{
        document.querySelector(".prev").classList.remove('disabled');
        document.querySelector(".next").classList.remove('disabled');
     }
     document.getElementById("modal-image").setAttribute("src",currentImage.target.getAttribute("src"));
}

function ajax_get(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //console.log('responseText:' + xmlhttp.responseText);
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch(err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data);
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

 function resizeMasonryItem(item){

    var grid = document.getElementById('main-container'),
    rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap')),
    rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    var ImageElement=item.getAttribute("id").split("_");
    var rowSpan = Math.ceil((document.getElementById("image_"+ImageElement[1]).getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
    item.style.gridRowEnd = 'span '+rowSpan;
    document.getElementById("image_"+ImageElement[1]).style.height = rowSpan * 10 + "px";
  }
 
  function resizeAllMasonryItems(){
    // Get all item class objects in one list
    var allItems = document.getElementsByClassName('parent-image-items');

    for(var i=0;i>allItems.length;i++){
        var item = document.getElementById('parent-image_'+i);
        resizeMasonryItem(item);
    }
  }

  
  function waitForImages() {
    var allItems = document.getElementsByClassName('parent-image-items');
    console.log(allItems.length);
    for(var i=0;i<allItems.length;i++){
        var item = document.getElementById('parent-image_'+i);
        resizeMasonryItem(item);
    }
  }
  

  var masonryEvents = ['load', 'resize'];
    masonryEvents.forEach( function(event) {
    window.addEventListener(event, resizeAllMasonryItems);
  } );
  

var prevNextLoadImage=function(getNavigation){
    console.log(document.getElementsByClassName('parent-image-items').length-1);
 
    if(getNavigation=="prev"){
        pageCount--;
        if(pageCount==0){
            pageCount=0;
            document.querySelector(".prev").classList.add('disabled');
        }else{
            
            document.querySelector(".prev").classList.remove('disabled');
            document.querySelector(".next").classList.remove('disabled');
        }
    }
    else {
        pageCount++;
        if(pageCount==document.getElementsByClassName('parent-image-items').length-1){
            pageCount=document.getElementsByClassName('parent-image-items').length-1;
            document.querySelector(".next").classList.add('disabled')
            
        }else{           
            document.querySelector(".prev").classList.remove('disabled');
            document.querySelector(".next").classList.remove('disabled');
            console.log(pageCount);
        }
    }

    document.getElementById("modal-image").setAttribute("src",document.getElementById("image_"+pageCount).getAttribute("src"));
}
  

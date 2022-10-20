//gloablVariables
var createDynamicImageDiv, createFigureImage,createbottomPanel,createbottomPanelSub, pageCount=0, jsonDataArray=[];

window.onload=function(){

    ajax_get('https://api.unsplash.com/photos/?client_id=7sJ04_uYW3y-Yg85QThOBs5QkBMY41MxW1KQdy6EMxc', function(data) {
    
    loadDynamicImage(data);


    }); 


}

var closeModal=function(){
    document.getElementById("modal-overlay").style.display="none";
    document.querySelector("body").style.overflowY="auto";
}

var loadDynamicImage=function(jsonData){
    jsonDataArray=jsonData;
    jsonData.map(function(value,ind){
        //create Image Parent Element
        createFigureImage=document.createElement("div")
        createFigureImage.id="parent-image_"+ind;
        createFigureImage.className="parent-image-items image_"+ind;
        createFigureImage.setAttribute("data-likes",value.likes);
        createFigureImage.setAttribute("data-user",value.user.username);
        createFigureImage.setAttribute("data-publishDate",value.created_at);
        createFigureImage.setAttribute("data-updatedDate",value.updated_at);
        //create Image  Element using create Element
        createDynamicImageDiv=document.createElement("img"); 
        createDynamicImageDiv.id="image_"+ind;
        createDynamicImageDiv.className="image-items image_"+ind;
        createDynamicImageDiv.setAttribute("src",value.urls["raw"]);


        document.getElementById("main-container").appendChild(createFigureImage);
        document.getElementById("parent-image_"+ind).appendChild(createDynamicImageDiv);  

        //create bottom panel sub division using innerHTML
        for(var i=0;i<3;i++){
            var innerCreatebottomPanel=document.createElement("div");
            innerCreatebottomPanel.className="bottom-panel-sub butn-"+i;
            innerCreatebottomPanel.innerHTML="<div class='sub_"+i+"'></div>"
            document.getElementById("parent-image_"+ind).appendChild(innerCreatebottomPanel);         
        }

        createDynamicImageDiv.addEventListener("click",function(event){
            openModal(event);
        });
        createDynamicImageDiv.addEventListener("mouseenter",function(event){
           onmouseEnter(event);
          
        });
        createDynamicImageDiv.addEventListener("mouseleave",function(event){
            onmouseLeave(event);
         });
        
        setTimeout(function(){   
            totaltilesGrid();
            showContainer();           
        },1800);
    })
}

var onmouseLeave=function(getCurrentTiles){
    var elems = getCurrentTiles.target.parentElement.id;
    var siblingsElement=document.getElementById(elems).querySelectorAll(".bottom-panel-sub");
    var index = 0, length = siblingsElement.length;
    for ( ; index < length; index++) {
        document.getElementById(elems).querySelector(".butn-"+index).style.transition = "opacity 0.5s linear 0s";
        document.getElementById(elems).querySelector(".butn-"+index).style.opacity = 0;
    }
}

var onmouseEnter=function(getCurrentTiles){
    var elems = getCurrentTiles.target.parentElement.id;
    var siblingsElement=document.getElementById(elems).querySelectorAll(".bottom-panel-sub");
    var index = 0, length = siblingsElement.length;
    for ( ; index < length; index++) {
        document.getElementById(elems).querySelector(".butn-"+index).style.transition = "opacity 0.5s linear 0s";
        document.getElementById(elems).querySelector(".butn-"+index).style.opacity = 1;
    }
}
var showContainer=function(){
    setTimeout(function(){
        document.querySelector(".container").style.opacity="1";
        document.querySelector("body").style.overflowY="auto";
        document.querySelector(".globalLoader").style.display="none";
    },4000);
    
}
var openModal=function(currentImage){
    document.getElementById("modal-overlay").style.display="inline-block";
    document.querySelector("body").style.overflowY="hidden";
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
     document.getElementById("view-list").innerText=document.getElementById("parent-image_"+pageCount).getAttribute("data-likes");
     document.getElementById("download-list").innerText=document.getElementById("parent-image_"+pageCount).getAttribute("data-likes");
     document.getElementById("user-name").innerText=document.getElementById("parent-image_"+pageCount).getAttribute("data-user");
     document.getElementById("published-on").innerText="Published On "+new Date(document.getElementById("parent-image_"+pageCount).getAttribute("data-publishDate"));
     document.getElementById("updated-on").innerText="Updated On "+new Date(document.getElementById("parent-image_"+pageCount).getAttribute("data-updatedDate"));
     document.getElementById("logo-id").style.backgroundImage="url("+currentImage.target.getAttribute("src")+")";
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

 function resizeImageGrid(item){

    var grid = document.getElementById('main-container'),
    rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap')),
    rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    var ImageElement=item.getAttribute("id").split("_");
    var rowSpan = Math.ceil((document.getElementById("image_"+ImageElement[1]).getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
    item.style.gridRowEnd = 'span '+rowSpan;
    document.getElementById("image_"+ImageElement[1]).style.height = rowSpan * 10 + "px";
  }
  
  var totaltilesGrid=function() {
    var allItems = document.getElementsByClassName('parent-image-items');
    console.log(allItems.length);
    for(var i=0;i<allItems.length;i++){
        var item = document.getElementById('parent-image_'+i);
        resizeImageGrid(item);
    }
  }
  
  window.onresize=function(){
    //totaltilesGrid();
  }

var prevNextLoadImage=function(getNavigation){
 
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
    document.getElementById("view-list").innerText=document.getElementById("parent-image_"+pageCount).getAttribute("data-likes");
    document.getElementById("user-name").innerText=document.getElementById("parent-image_"+pageCount).getAttribute("data-user");
    document.getElementById("published-on").innerText="Published On "+new Date(document.getElementById("parent-image_"+pageCount).getAttribute("data-publishDate"));
    document.getElementById("updated-on").innerText="Updated On "+new Date(document.getElementById("parent-image_"+pageCount).getAttribute("data-updatedDate")); 
    document.getElementById("logo-id").style.backgroundImage="url("+document.getElementById("image_"+pageCount).getAttribute("src")+")";
}

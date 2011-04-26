function CustomMarker(latlng, map, value){
  this.latlng_ = latlng;
  this.map_ = map;
  this.value_ = value;
  this.offsetVertical_ = -15;
  this.offsetHorizontal_ = -15;
  this.height_ = 30;
  this.width_ = 30;
  this.position = latlng;
  this.div_ = null;
  this.setMap(map);
}

CustomMarker.prototype = new google.maps.OverlayView();

CustomMarker.prototype.onAdd = function(){

  var div = document.createElement('div');
  div.style.height = "30px";
  div.style.width = "30px";
  div.style.position = "absolute";

  //Create the container div
  var containerDiv = document.createElement('div');
  containerDiv.className="markerContainer";

  //Create the line-border div
  var inner = document.createElement('div');
  inner.className ="markerInnerCircle";

  //Create the label inside the marker
  var lbl = document.createElement('p');
  lbl.appendChild(document.createTextNode(this.value_));
  lbl.className = "markerLbl";

  //append the HTML elements
  inner.appendChild(lbl)
  containerDiv.appendChild(inner);
  div.appendChild(containerDiv)

  //Set the overlay's div_ property to this div
  this.div_ = div;

  this.setValue(this.value_,false);

  // We add an overlay to a map via one of the map's panes.
  // We'll add this overlay to the overlayImage pane.
  var panes = this.getPanes();
  panes.overlayLayer.appendChild(div);  

}

CustomMarker.prototype.draw = function() {

  // Creates the element if it doesn't exist already.
  //this.createElement();
  if (!this.div_){
    this.createElement()
  };

  // Calculate the DIV coordinates of two opposite corners of our bounds to
  // get the size and position of our Bar
  var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
  if (!pixPosition) return;

  // Now position our DIV based on the DIV coordinates of our bounds
  this.div_.style.width = this.width_ + "px";
  this.div_.style.left = (pixPosition.x + this.offsetHorizontal_) + "px";
  this.div_.style.height = this.height_ + "px";
  this.div_.style.top = (pixPosition.y + this.offsetVertical_) + "px";

  this.div_.style.display = 'block';
};

CustomMarker.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
  this.div_ = null;
}

CustomMarker.prototype.setValue = function(value, animate) {
  
  var sizeMultiplier = 3;
  var containerSize = parseInt(value.substr(1))* sizeMultiplier;
  var innerSize = (parseInt(value.substr(1))*sizeMultiplier) - 8;
  var marginN = (this.height_ - containerSize) / 2;

  (containerSize <= 30 && this.height_ >= 30) ? op = 0 : op = 1 ;
  (animate) ? time = 250 : time= 0;

  if(value.substr(0,1) == "+"){
    $(this.div_).find('p').css("color","#FF9900");
    $(this.div_).find('.markerInnerCircle').css("border","1px solid #FF9900");
  }else{
    $(this.div_).find('p').css("color","#999999");
    $(this.div_).find('.markerInnerCircle').css("border","1px solid #999999");
  }

  this.width_ = this.height_ = containerSize;
  this.value_ = value;

  $(this.div_).find('p').text(this.value_);
  $(this.div_).find('p').animate({ 
      lineHeight: innerSize.toString() +"px",
      opacity: op
  }, time,'easeOutCubic');

  $(this.div_).find('.markerContainer').animate({ 
      width: containerSize.toString()+"px",
      height: containerSize.toString()+"px",
      marginTop: '+='+marginN.toString(),
      marginLeft: '+='+marginN.toString()
    }, time,'easeOutCubic');
  $(this.div_).find('.markerInnerCircle').animate({ 
      width: innerSize.toString()+"px",
      height: innerSize.toString()+"px"
    }, time,'easeOutCubic');
  
}

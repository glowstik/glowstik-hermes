mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbW1hcmV6IiwiYSI6ImNrOW9mbGU4NjAwMzgzc3JrNjQwbGhibDkifQ.7vEaAFpTHeARk8-Mzvm7Rw';


function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
  return el
}

var pitchBody = document.querySelector('.body-2');
var cursorDiv = setAttributes(document.createElement("div"), {"class":"cursor"});
pitchBody.appendChild(cursorDiv)
var cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', function(e){
  var x = e.clientX;
  var y = e.clientY;
  cursor.style.left = x + "px";
  cursor.style.top = y + "px";
});

document.addEventListener('mousedown', function(){
  cursor.classList.add('click')
});

document.addEventListener('mouseup', function(){
  cursor.classList.remove('click')
});

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/adammarez/ckgv43wr22dra19memucup1y8',
  center: [-122.406100, 37.802457],
  zoom: 18.1,
  pitch: 68,
  bearing: 23.13,
  container: 'map',
  antialias: true,
  interactive: false
});

var size = 300;
var pulsingDot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),
    onAdd: function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
    },
    render: function () {
        var duration = 2000;
        var t = (performance.now() % duration) / duration;

        var radius = (size / 10) * 0.3;
        var outerRadius = (size / 1.75) * 0.7 * t + radius;
        var context = this.context;
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(this.width / 2,this.height / 2,outerRadius,0,Math.PI * 2
        );
        context.fillStyle = 'rgba(237, 34, 144,' + (1 - t) + ')';
        context.fill();
        context.beginPath();
        context.arc(this.width / 2,this.height / 2,radius,0,Math.PI * 2);
        context.fillStyle = 'rgba(237, 34, 144, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = .5 + 2 * (1 - t);
        context.fill();
        context.stroke();
        this.data = context.getImageData(0,0,this.width,this.height).data;
        map.triggerRepaint();
        return true;
    }
};

var chapters = {
  'start': {
    duration: 2000,
    center: [-122.406107, 37.802457],
    zoom: 18.1,
    pitch: 68,
    bearing: 23.13,
  },
  'end': {
    duration: 5000,
    center: [-122.426147, 37.780551],
    zoom: 12.51,
    pitch: 0,
    bearing: 0,
  }
}

var geojsonfeatureCollection = {
  type: 'FeatureCollection',
  features: [{
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
           -122.406040,
          37.802559
        ]
      },
      "properties": {
        "name": "I am here!"
        }
    },
  
  	{
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -122.4133719,
          37.7466436
        ]
      },
      "properties": {
        "name": "Marlena Restaurant"
        }
    },
    
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -122.4031668,
          37.7702531
        ]
      },
      "properties": {
        "name": "Saffron 685"
        }
    },
    
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -122.4348101,
          37.7623385
        ]
      },
      "properties": {
        "name": "Cafe de Casa"
        }
    },
    
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -122.4646831,
          37.7642408
        ]
      },
      "properties": {
        "name": "Crepevine Restaurants"
        }
    },
    
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -122.4366865,
          37.8006102
        ]
      },
      "properties": {
        "name": "Pacific Catch"
        }
    }]
};

function setUpLavadot(svgElement) {
  setAttributes(svgElement, {"version":"1.1", "class": "svg-bubbles", "xmlns":"http://www.w3.org/2000/svg", "xmlns:xlink":"http://www.w3.org/1999/xlink", "x":"0px", "y":"0px", "width":"150px", "height":"150px", "viewBox":"0 0 150 150"})
  let defsEl = document.createElementNS("http://www.w3.org/2000/svg", "defs")
  let filterEl = setAttributes(document.createElementNS("http://www.w3.org/2000/svg", "filter"), {"id": "goo"})
  let feGaussianBlurEl = setAttributes(document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur"), {"in":"SourceGraphic", "result":"blur", "stdDeviation":"5"})
  let feColorMatrixEl = setAttributes(document.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix"), {"in":"blur", "mode":"matrix", "values":"1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 31 -12","result":"goo"})
  filterEl.appendChild(feGaussianBlurEl)
  filterEl.appendChild(feColorMatrixEl)
  defsEl.appendChild(filterEl)
  let gEl = setAttributes(document.createElementNS("http://www.w3.org/2000/svg", "g"), {"class":"gLava", "style":"opacity: 0.7","filter":"url(#goo)"})
  for(var i = 0; i < 10; i++){
    let cxRand = ((Math.floor(Math.random() * 9) * 10) + 30);
    let cyRand = ((Math.floor(Math.random() * 9) * 10) + 30);
    let rRand = (Math.floor(Math.random() * 20) + 5)
    let childOfG = setAttributes(document.createElementNS("http://www.w3.org/2000/svg", "circle"), {"class":"blob-1", "fill":"#ed2290", "cx":cxRand, "cy":cyRand, "r":rRand})
    gEl.appendChild(childOfG);
  }
  svgElement.appendChild(defsEl)
  svgElement.appendChild(gEl)
}
var lavadotsInvisible;
var mapInvisible;
map.on('load', function () {
  TweenMax.set("#map",{autoAlpha:0});
  mapInvisible = true;
  map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
  map.addSource('points', {
      'type': 'geojson',
      'data': geojsonfeatureCollection
  });
  map.addLayer({
      'id': 'points',
      'type': 'symbol',
      'source': 'points',
      'layout': {
          'icon-image': 'pulsing-dot'
      }
  });
  map.addLayer({
  	'id': '3d-buildings',
  	'source': 'composite',
    'source-layer': 'building',
    'filter': ['==', 'extrude', 'true'],
    'type': 'fill-extrusion',
    'minzoom': 15,
    'paint': {
      'fill-extrusion-color': '#aaa',
      'fill-extrusion-height': ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "height"]],
      'fill-extrusion-base': ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "min_height"]],
      'fill-extrusion-opacity': .6
    }
  });
  
  geojsonfeatureCollection.features.forEach(function (marker) {
    var svgEl = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    setUpLavadot(svgEl)
    new mapboxgl.Marker({element: svgEl})
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);
  });
  startLavadotAnimation()
  TweenMax.set(".gLava",{autoAlpha:0});
  lavadotsInvisible = true;
});

function startLavadotAnimation() {
      _boubles = document.querySelectorAll('.blob-1'),
      _maxX = 150, 
      _maxY = 150; 
  
	function _NextBounce (bouble) {
		var r = bouble.getAttribute('r'),
				radiusV = random(8, 32),
				minX = radiusV,
				minY = radiusV,
				maxX = _maxX - radiusV, 
        maxY = _maxY - radiusV,
				randX = random(minX, maxX), 
        randY = random(minY, maxY);
		TweenMax.to(bouble, random(5, 20), { 
			attr: {
				cx:randX,
				cy:randY,
				r: radiusV,
			},
			ease: "sine.inOut",
			onComplete: function () {
				_NextBounce(bouble);
			} 
		});
	}

	function random(min, max) {
		if (max == null) {
			max = min;
			min = 0;
		}
		return Math.floor(Math.random() * (max - min) + Number(min));
	}
    console.log(_boubles.length)
	for (var i = 0; i < _boubles.length; i++) {
		_NextBounce(_boubles[i]);
	}
};

var activeChapterName = 'start';
function setActiveChapter(chapterName) {
    if (chapterName === activeChapterName) return;
    map.flyTo(chapters[chapterName]);
    activeChapterName = chapterName;
}

window.onscroll = function() {
  if (document.getElementById('map').getBoundingClientRect().top < (window.innerHeight * .2)) {
    	//
	if(mapInvisible){
		TweenMax.fromTo("#map", 1, {autoAlpha:0}, {autoAlpha:1});
		mapInvisible = false;
	}
  }
  else{
  	if(!mapInvisible){
		TweenMax.fromTo("#map", 1, {autoAlpha:1}, {autoAlpha:0});
		mapInvisible = true;
	}
  }
	
	
  if (activeChapterName == 'start' && document.getElementById('betweenProbAndSol').getBoundingClientRect().top < (window.innerHeight * .5)) {
    	setActiveChapter('end');
  }
  else if (activeChapterName == 'end' && document.getElementById('betweenProbAndSol').getBoundingClientRect().top >= (window.innerHeight * .5)){
  	setActiveChapter('start');
  }
	
	
  if (document.getElementById('solutionSection').getBoundingClientRect().top < (window.innerHeight * .3)){
    map.setLayoutProperty('points', 'visibility', 'none');
	  if(lavadotsInvisible){
			TweenMax.fromTo(".gLava", 2, {autoAlpha:0}, {autoAlpha:0.7});
			lavadotsInvisible = false
		}
  }
  else{
    map.setLayoutProperty('points', 'visibility', 'visible');
	  if(!lavadotsInvisible){
    	  	TweenMax.fromTo(".gLava", 2, {autoAlpha:0.7}, {autoAlpha:0});
		lavadotsInvisible = true
  	  }
  }
};

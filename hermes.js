// Copyright 2023 Glowstik Inc. All rights reserved.
console.log('localDev v0.0.1')
mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbW1hcmV6IiwiYSI6ImNrOW9mbGU4NjAwMzgzc3JrNjQwbGhibDkifQ.7vEaAFpTHeARk8-Mzvm7Rw';
const mapLavadotControllers = []
let slideOneLavadotController

function mapLavadotControllersAction() {
	return {
		play: () => {
			for (const mapLavadotController of mapLavadotControllers) {
				mapLavadotController.play()
			}
		},
		pause: () => {
			for (const mapLavadotController of mapLavadotControllers) {
				mapLavadotController.pause()
			}
		},
		toggle: () => {
			for (const mapLavadotController of mapLavadotControllers) {
				mapLavadotController.toggle()
			}
		}
	}
}

function setAttributes(el, attrs) {
	for (var key in attrs) {
		el.setAttribute(key, attrs[key]);
	}
	return el
}

var pitchBody = document.querySelector('.body-2');

var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/adammarez/cl7z3geb8000z14ry8o8okctt',
	center: [-122.406095, 37.802457],
	zoom: 18.1,
	pitch: 68,
	bearing: 23.13,
	container: 'map',
	antialias: true,
	interactive: false
});

var barChartInvisible = true;

var size = 300;
var pulsingDot = {
	width: size,
	height: size,
	data: new Uint8Array(size * size * 4),
	onAdd: function () {
		var canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;
		this.context = canvas.getContext('2d', { willReadFrequently: true });
	},
	render: function () {
		var duration = 2000;
		var t = (performance.now() % duration) / duration;

		var radius = (size / 10) * 0.3;
		var outerRadius = (size / 1.75) * 0.7 * t + radius;
		var context = this.context;
		context.clearRect(0, 0, this.width, this.height);
		context.beginPath();
		context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2
		);
		context.fillStyle = 'rgba(237, 34, 144,' + (1 - t) + ')';
		context.fill();
		context.beginPath();
		context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
		context.fillStyle = 'rgba(237, 34, 144, 1)';
		context.strokeStyle = 'white';
		context.lineWidth = .5 + 2 * (1 - t);
		context.fill();
		context.stroke();
		this.data = context.getImageData(0, 0, this.width, this.height).data;
		map.triggerRepaint();
		return true;
	}
};

var chapters = {
	'start': {
		duration: 2000,
		center: [-122.406101, 37.802457],
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

function setUpLavadot(parentElement, blobClass, size, color, opacity, gClassNameOverride, baubleMinOverride, baubleMaxOverride) {
	let baubleMin = 8;
	let baubleMax = 30;
	if (baubleMinOverride && baubleMaxOverride) {
		baubleMin = baubleMinOverride;
		baubleMax = baubleMaxOverride;
	}
	let gClassName = gClassNameOverride
	if (!gClassName) {
		gClassName = 'gLava'
	}
	const svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	setAttributes(svgElement, { "version": "1.1", "class": "svg-bubbles", "xmlns": "http://www.w3.org/2000/svg", "xmlns:xlink": "http://www.w3.org/1999/xlink", "x": "0px", "y": "0px", "width": size + "px", "height": size + "px", "viewBox": "0 0 " + size + " " + size })
	let defsEl = document.createElementNS("http://www.w3.org/2000/svg", "defs")
	let filterEl = setAttributes(document.createElementNS("http://www.w3.org/2000/svg", "filter"), { "id": "goo" })
	let feGaussianBlurEl = setAttributes(document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur"), { "in": "SourceGraphic", "result": "blur", "stdDeviation": "5" })
	let feColorMatrixEl = setAttributes(document.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix"), { "in": "blur", "mode": "matrix", "values": "1 0 0 0 0	0 1 0 0 0	0 0 1 0 0	0 0 0 31 -12", "result": "goo" })
	filterEl.appendChild(feGaussianBlurEl)
	filterEl.appendChild(feColorMatrixEl)
	defsEl.appendChild(filterEl)
	let gEl = setAttributes(document.createElementNS("http://www.w3.org/2000/svg", "g"), { "class": gClassName, "style": ("opacity: " + opacity), "filter": "url(#goo)" })
	for (var i = 0; i < 10; i++) {
		let rRand = (Math.floor(Math.random() * (baubleMax - baubleMin)) + baubleMin)
		let cxRand = (Math.random() * (parseInt(size, 10) - (2 * rRand))) + rRand
		let cyRand = (Math.random() * (parseInt(size, 10) - (2 * rRand))) + rRand
		let childOfG = setAttributes(document.createElementNS("http://www.w3.org/2000/svg", "circle"), { "class": blobClass, "fill": color, "cx": cxRand, "cy": cyRand, "r": rRand })
		gEl.appendChild(childOfG);
	}
	svgElement.appendChild(defsEl)
	svgElement.appendChild(gEl)
	const controller = setupLavadotAnimation(gEl.children, parseInt(size, 10), baubleMin, baubleMax)
	if (parentElement) {
		parentElement.appendChild(svgElement)
		return { controller }
	}
	else {
		return { lavadot: svgElement, controller }
	}
}
function setupLavadotAnimation(boubles, size, baubleMin, baubleMax) {
	// var boubles = document.querySelectorAll('.' + className)
	let animationRunning = false

	function _NextBounce(bouble) {
		if (animationRunning === false) {
			return
		}
		var r = bouble.getAttribute('r')
		var radiusV = random(baubleMin, baubleMax)
		var minX = radiusV + 1
		var minY = radiusV + 1
		var maxX = size - radiusV - 1
		var maxY = size - radiusV - 1
		var randX = random(minX, maxX)
		var randY = random(minY, maxY)
		TweenMax.to(bouble, random(5, 20), {
			attr: {
				cx: randX,
				cy: randY,
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

	function pauseLavadotAnimation() {
		if (!animationRunning) {
			return
		}
		animationRunning = false
	}

	function playLavadotAnimation() {
		if (animationRunning) {
			return
		}
		animationRunning = true
		for (const bouble of boubles) {
			_NextBounce(bouble);
		}
	}

	function toggleLavadotAnimation() {
		if (animationRunning) {
			pauseLavadotAnimation()
		}
		else {
			playLavadotAnimation()
		}
		return animationRunning
	}

	return {
		toggle: toggleLavadotAnimation,
		pause: pauseLavadotAnimation,
		play: playLavadotAnimation
	}
};
var lavadotsInvisible;
var mapInvisible;

slideOneLavadotController = setUpLavadot(document.getElementById('lavaDiv2'), "blob-3", "270", "#ed2290", 1, 'gLava2', 12, 45).controller;
slideOneLavadotController.play();

map.on('load', function () {
	TweenMax.set("#map", { autoAlpha: 1 });
	//	 mapInvisible = false;
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

	mapLavadotControllers.push(setUpLavadot(document.getElementById('lavaDiv'), "blob-2", "98", "#ed2290", 0.7).controller);
	geojsonfeatureCollection.features.forEach(function (marker) {
		const mapLavadot = setUpLavadot(null, "blob-1", "150", "#ed2290", 0.7)
		mapLavadotControllers.push(mapLavadot.controller)
		new mapboxgl.Marker({ element: mapLavadot.lavadot })
			.setLngLat(marker.geometry.coordinates)
			.addTo(map);
	});
	TweenMax.set(".gLava", { autoAlpha: 0 });
	lavadotsInvisible = true;
});

var activeChapterName = 'start';
function setActiveChapter(chapterName) {
	if (chapterName === activeChapterName) return;
	map.flyTo(chapters[chapterName]);
	activeChapterName = chapterName;
}

var canv = document.createElement("canvas")
canv.setAttribute("id", "barChart")
canv.setAttribute("width", "100%")
canv.setAttribute("height", "100%")
document.getElementById("barChartContainer").appendChild(canv)
var barChart = new Chart(document.getElementById("barChart").getContext("2d", { willReadFrequently: true }), {
	type: 'bar',
	data: {
		labels: ['1974', '1978', '1983', '1988', '1990', '1992', '1993', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'],
		datasets: [
			{
				label: "Privacy laws created",
				backgroundColor: '#ed2290',
				data: [1, 1, 1, 2, 1, 3, 1, 1, 3, 2, 4, 3, 3, 7, 3, 7, 4, 2, 9, 4, 7, 12, 9, 8, 7, 6, 35, 8, 16, 19, 9],
				borderRadius: 50,
			}
		]
	},
	options: {
		animation: {
			duration: 760,
			easing: 'easeOutBounce',
			delay: 500
		},
		plugins: {
			legend: { display: false },
		},
		scales: {
			y: {
				suggestedMin: 0,
				suggestedMax: 35
			}
		},
		responsive: true,
		maintainAspectRatio: false,
		title: {
			display: true,
			text: 'Data Protection and Privacy Legislation Worldwide'
		},
		clip: false
	}
});

clearAnimation()
function triggerAnimation() {
	barChart.setDatasetVisibility(0, true)
	barChart.reset()
	barChart.update()
}
function clearAnimation() {
	barChart.setDatasetVisibility(0, false)
	barChart.update()
}

document.getElementById('deckWrapper').addEventListener('scroll', () => {

	if (activeChapterName == 'start' && document.getElementById('problemSlide').getBoundingClientRect().top < (window.innerHeight * .1)) {
		console.log("setActiveChapter('end')");
		setActiveChapter('end');
	}
	else if (activeChapterName == 'end' && document.getElementById('problemSlide').getBoundingClientRect().top >= (window.innerHeight * .1)) {
		console.log("setActiveChapter('start')");
		setActiveChapter('start');
	}

	if (document.getElementById('problemSlide').getBoundingClientRect().top < (window.innerHeight * .3)) {
		if (slideOneLavadotController) {
			slideOneLavadotController.pause()
		}
	}
	else {
		if (slideOneLavadotController) {
			slideOneLavadotController.play()
		}
	}
	if (document.getElementById('solutionSection').getBoundingClientRect().top < (window.innerHeight * .3)) {
		if (map.getLayer('points')) {
			map.setLayoutProperty('points', 'visibility', 'none');
		}
		if (lavadotsInvisible) {
			mapLavadotControllersAction().play()
			TweenMax.fromTo(".gLava", 2, { autoAlpha: 0 }, { autoAlpha: 0.7 });
			lavadotsInvisible = false
		}
	}
	else {
		if (map.getLayer('points')) {
			map.setLayoutProperty('points', 'visibility', 'visible');
		}
		if (!lavadotsInvisible) {
			mapLavadotControllersAction().pause()
			TweenMax.fromTo(".gLava", 2, { autoAlpha: 0.7 }, { autoAlpha: 0 });
			lavadotsInvisible = true
		}
	}

	if (barChartInvisible && document.getElementById('marketVal').getBoundingClientRect().top < (window.innerHeight * .3)) {
		triggerAnimation();
		barChartInvisible = !barChartInvisible
	}
	else if (!barChartInvisible && document.getElementById('marketVal').getBoundingClientRect().top >= (window.innerHeight * .3)) {
		clearAnimation();
		barChartInvisible = !barChartInvisible
	}
})

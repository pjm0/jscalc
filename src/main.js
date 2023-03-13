
"use strict";
// const f = ()=>{
// 	console.log("Hi from callback fn");
// }
const cos = Math.cos;
const sin = Math.sin;
const abs = Math.abs;
const atan2 = Math.atan2;
const floor = Math.floor;
const round = Math.round;
const PI = Math.PI;

const initCanvasSize = () => {
	const canvasSizeInput = document.createElement("input");
	canvasSizeInput.setAttribute("type", "number");
	canvasSizeInput.setAttribute("value", "400");
	document.body.appendChild(canvasSizeInput);

	return canvasSizeInput;
}

const initCanvas = ()=>{
	const canvas = document.createElement("canvas");
	canvas.setAttribute("style","border:1px solid black")
	document.body.appendChild(canvas);
	return canvas;
}
const initViewport = (size)=>{
	const canvas = initCanvas();
	const viewport = new Viewport();
	viewport.setCanvas(canvas);
	viewport.resize(size, size);
	return viewport;
}
const initMainViewport = ()=>{
	return initViewport(400);
}
const initPreviewViewport = ()=>{
	return initViewport(200);
}
const initBtn = (text)=>{
	const submitBtn = document.createElement("button");
	submitBtn.innerHTML	= text;
	//parent.appendChild(submitBtn);
	return submitBtn;
}
const fnInput = document.createElement("textarea");
const initFnInput = ()=>{
	fnInput.setAttribute("placeholder", "(x,y)=>[1,x,y]")
	let fn = localStorage.getItem("function");
	if (fn === null) {
		fn = `(x, y) => {
	x -= 0.5;
	x *= 20;
	y -= 0.5;
	y *= 20;
	let r,g,b;
	r = (x**2+y**2)**0.5;
	r = (1+cos(r*2*PI))/2;
	g = 6*atan2(y,x)/(2*PI);
	g -= floor(g);
	b = 1-0.5*g;
	return [r,g,b];
}`;
		localStorage.setItem("function", fn);
	} 
	fnInput.innerHTML = fn;
	document.body.appendChild(fnInput);
	return fnInput;
}
const initDataURLField = ()=>{
	const URLfield = document.createElement("div");

	//URLfield.innerHTML = localStorage.getItem("function");//;
	document.body.appendChild(URLfield);
	return URLfield;
}
const initFnEntry = (fnText)=>{
	const entry = document.createElement("div");
	const reloadBtn = initBtn("Reload");
	const deleteBtn = initBtn("Delete");
	const viewport = initPreviewViewport();
	const codeText = document.createElement("div");
	codeText.setAttribute("class", "codetext");
	codeText.innerText=fnText;
	entry.appendChild(viewport.canvas);		try {
		viewport.plotFunctionRGB(eval(fnText));
		//viewport.plotFunctionRGB(eval(fnText));
	} catch (e) {
		console.log(e);
	}
	entry.appendChild(reloadBtn);
	entry.appendChild(deleteBtn);
	entry.appendChild(codeText);
	entry.setAttribute("class","fnList");
	deleteBtn.onclick = (e) => {
		// Delete this node from the parent node
	}
	reloadBtn.onclick = (e) => {
		// Update localstorage "function"
		localStorage.setItem("function", fnText);
		fnInput.value = fnText;	
		fnInput.oninput();
		console.log(fnInput.innerText, "!!?!");
	}
	return entry;
}
const initFnList = ()=>{
	//let fns = ["((x,y)=>[1,0,1])","((x,y)=>[1,1,0])","((x,y)=>[0,1,1])"];//localStorage.getItem("fns");
	//localStorage.getItem("fns");//
	//localStorage.setItem("fns", JSON.stringify(fns.map(btoa)));
	let fns;
	const container = document.createElement("div");
	try {
		fns = JSON.parse(localStorage.getItem("fns")).map(atob);
	} catch (e) {
		return container;
	}

	for (let i=0; i<fns.length; i++) {
		container.appendChild(initFnEntry(fns[i]));
	}
	localStorage.setItem("fns", JSON.stringify(fns.map(btoa)));
	container.setAttribute("class", "fnList");
	return container;
}


const main = ()=>{

	//const fns = ["((x,y)=>[1,0,1]),((x,y)=>[1,1,0])","((x,y)=>[0,1,1])"].map(btoa);//localStorage.getItem("fns");
	//localStorage.setItem("fns", JSON.stringify(fns));
// if (fns === null) {
	// 	fns = []
	// }
	//initFnList(fns);
	const mainViewport = initMainViewport();
	const canvasSizeInput = initCanvasSize();
	const fnList = initFnList();
	const previewViewport = initPreviewViewport();
	const renderBtn = initBtn("Render", document.body);
	document.body.appendChild(renderBtn);
	const saveBtn = initBtn("Save", document.body);
	document.body.appendChild(saveBtn);
	const clearBtn = initBtn("Clear all", document.body);
	document.body.appendChild(clearBtn);
	const fnInput = initFnInput();
	const urlField = initDataURLField();
	const element = document.body;
	element.setAttribute("style","border:1px solid black");
	document.body.appendChild(fnList);
	
	renderBtn.onclick = ((e) => {
		localStorage.setItem("function", fnInput.value);
		mainViewport.plotFunctionRGB(eval(fnInput.value));
	});
	canvasSizeInput.oninput = ((e)=>{mainViewport.resize(e.target.valueAsNumber,e.target.valueAsNumber)})
	saveBtn.onclick = ((e) => {
		//
		const json = localStorage.getItem("fns");

		let fns;
		if (json === null) {
			fns = new Set();
		} else {
			fns = new Set(JSON.parse(localStorage.getItem("fns")).map(atob));
		}
		if (!fns.has(fnInput.value)) {
			fns.add(fnInput.value);
			localStorage.setItem("fns", JSON.stringify(Array.from(fns).map(btoa)));
			const entry = initFnEntry(fnInput.value);
			fnList.appendChild(entry);
		}
	});
	clearBtn.onclick = ((e) => {
		//
		localStorage.clear();
		document.body.innerHTML = ""
		return main();
	});

	fnInput.oninput = (() => {
		localStorage.setItem("function", fnInput.value);
		try {
			previewViewport.plotFunctionRGB(eval(fnInput.value));
		} catch (e) {
			console.log(e);
		}
	});

	fnInput.oninput();
};
window.onload=main;
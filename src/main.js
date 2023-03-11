
"use strict";
// const f = ()=>{
// 	console.log("Hi from callback fn");
// }
const cos = Math.cos;
const sin = Math.sin;
const abs = Math.abs;
const floor = Math.floor;
const round = Math.round;
const PI = Math.PI;

const initCanvasSize = () => {
	const canvasSizeInput = document.createElement("input");
	canvasSizeInput.setAttribute("type", "number");
	canvasSizeInput.setAttribute("value", "512");
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
	return initViewport(600);
}
const initPreviewViewport = ()=>{
	return initViewport(300);
}
const initBtn = (text)=>{
	const submitBtn = document.createElement("button");
	submitBtn.innerHTML	= text;
	document.body.appendChild(submitBtn);
	return submitBtn;
}

const initFnInput = ()=>{
	const fnInput = document.createElement("textarea");
	fnInput.setAttribute("placeholder", "(x,y)=>[1,x,y]")
	fnInput.innerHTML = localStorage.getItem("function");//;
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
console.log(fnText);
	const entry = document.createElement("div");
	const viewport = initPreviewViewport();
	const codeText = document.createElement("div");
	codeText.setAttribute("class", "codetext");
	codeText.innerText=fnText;
	console.log("fntext\n",fnText)
	console.log("codetext\n", codeText.innerText);
	entry.appendChild(viewport.canvas);		try {
		viewport.plotFunctionRGB(eval(fnText));
		//viewport.plotFunctionRGB(eval(fnText));
	} catch (e) {
		console.log(e);
	}
	entry.appendChild(codeText);
	entry.setAttribute("class","fnList");
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
		console.log(fns);
		console.log(i);
		console.log(fns[i], "!!!!!!!!!!");
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
	const submitBtn = initBtn("Render");
	const saveBtn = initBtn("Save");
	const clearBtn = initBtn("Clear all");
	const fnInput = initFnInput();
	const urlField = initDataURLField();
	const element = document.body;
	element.setAttribute("style","border:1px solid black");
	document.body.appendChild(fnList);
	
	submitBtn.onclick = ((e) => {
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
			//fns.add("(x,y)=>[1,x,y]");
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
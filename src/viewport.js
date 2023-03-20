function floatColorToHex(colorRGB) {
    let colorHex = (0xFF000000 +
        Math.floor(colorRGB[2] * 255) * 0x00010000 +
        Math.floor(colorRGB[1] * 255) * 0x00000100 +
        Math.floor(colorRGB[0] * 255));
    return colorHex
}

function dotProduct(v1, v2) {
    return (v1[0] * v2[0] +
        v1[1] * v2[1] +
        v1[2] * v2[2]);
}

function trueAverage(colors) {
    let result = [0, 0, 0];
    let maxValue = 0;
    if (colors.length > 0) {
        for (let component = 0; component<3; component++) {
            for (let colorIndex = 0; colorIndex<colors.length; colorIndex++) {
                result[component] += colors[colorIndex][component];
            }
            // result[component] = Math.min(1, result[component]);
            maxValue = Math.max(maxValue, result[component]);
        }
            //result[component]=Math.min(result[component],1);
        for (let component = 0; component<3; component++) {
            //result[component] = Math.min(1,1.2*result[component]/maxValue);
            result[component] /= colors.length;
        }
    }
    return result;
}

class Viewport {
    constructor() {
        const DEFAULT_FRAMES = 100
        this.nFrames = DEFAULT_FRAMES
        this.downloadEnabled = false;
        // this.canvas = canvas;  //document.querySelector("canvas");

    }
    setNFrames(n){
        this.nFrames = n;
    }
    setCanvas(canvas){
        this.canvas = canvas;  //document.querySelector("canvas");
        this.context = this.canvas.getContext("2d");
        this.initBuffer();}
        initBuffer() {
            this.img = this.context.createImageData(this.canvas.width, this.canvas.height);
            this.buffer = new Uint32Array(this.img.data.buffer);
        }

        drawPixel(x, y, color) {
            this.buffer[x + y * this.width] = color;
        }

        plotFunctionRGB(f, samples=0, fuzz=0) {
            ;
            const k = 50;
            this.resize();
            this.initBuffer();
            clearInterval(this.interval);
            this.t=0
            this.i=0
            const nFrames = (f.length>2 && this.canvas.getAttribute("class") == "mainViewport")?this.nFrames:1;
            const g = () => {
                this.drawDeadline = new Date().getTime()+0.95*k;
                for (; this.t<nFrames&&new Date().getTime()<this.drawDeadline;) {
                    for (; this.i<this.canvas.width&&new Date().getTime()<this.drawDeadline; this.i++) {
                        let i = this.i;
                        for (let j=0; j<this.canvas.height; j++) {
                            const color = f(i/this.canvas.width, j/this.height, this.t);
                            this.drawPixel(i, j, floatColorToHex(color));
                        }
                    }
                    if (this.i>=this.canvas.width) {
                        console.log(this.t)
                        this.updateCanvas();
                        if (this.downloadEnabled) {
                        const a = document.createElement("a");
                        a.setAttribute("textcontent", `${this.t}.png`);
                        a.setAttribute("href", this.canvas.toDataURL());
                        const idNumber = this.t.toString().padStart(3, "0");
                        a.setAttribute("download", `s1_frame${idNumber}.png`);
                        //const div = document.createElement("div");
                        //div.appendChild(a);
                        a.click();
                    }

                        //document.body.appendChild(a);
                        this.t++;
                        this.i=0
                        // this.setCanvas(document.createElement("canvas"));
                        // this.canvas.setAttribute("id", this.t);
                        // this.resize();
                        // document.body.appendChild(this.canvas);
                    }
                    if (new Date().getTime()>=this.drawDeadline) {
                        return;
                    }
                }
                // if (this.i>=this.canvas.width) {
                this.updateCanvas();
                // }
                if (this.t>=nFrames) {
                    this.t = 0;//
                    this.i=0;
                    clearInterval(this.interval);
                    this.updateCanvas();
                    this.downloadEnabled = false;
                }
                
            }
            this.interval = setInterval(g,k);

        }

        plotFunction(f) {
            for (let i=0; i<this.width; i++) {
                for (let j=0; j<this.height; j++) {
                    let color = f(i/this.width, j/this.height);
                    this.drawPixel(i, j, color);
                }
            }
            this.updateCanvas();
        }

        updateCanvas() {
            this.context.putImageData(this.img, 0, 0);
        }

        reqResize(width, height) {
            this.width = width;
            this.height = height;
        }
        resize() {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.initBuffer();
        }

        // get width() {
        //     return this.width;
        // }

        // get height() {
        //     return this.height;
        // }
        // set width(width) {
        //     this._width = width;
        // }

        // set height(height) {
        //     this._height = height;
        // }

        get midX() {
            return this.canvas.width / 2;
        }

        get midY() {
            return this.canvas.height / 2;
        }
    }
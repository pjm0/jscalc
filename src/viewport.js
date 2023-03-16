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
        // this.canvas = canvas;  //document.querySelector("canvas");

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

        plotFunctionRGB(f, samples=10, fuzz=1) {
            this.i=0;
            const k = 500;
            this.resize();
            this.initBuffer();
            clearInterval(this.interval);
            const g = () => {
                this.drawDeadline = new Date().getTime()+0.95*k;
                for (; this.i<this.canvas.width&&new Date().getTime()<this.drawDeadline; this.i++) {
                    let i = this.i;
                    for (let j=0; j<this.canvas.height; j++) {

                        let color;
                        if (samples<2) {
                            color = f(i/this.canvas.width, j/this.height);
                        } else {
                            let colors = [];
                            for (let n=0;n<1;n++) {
                                let x = (i + fuzz*(Math.random()-0.5))/this.canvas.width;
                                let y = (j + fuzz*(Math.random()-0.5))/this.canvas.height;
                                colors.push(f(x, y));
                            }
                            color = trueAverage(colors);
                        }
                        this.drawPixel(i, j, floatColorToHex(color));
                    }
                }
                this.updateCanvas();
                if (this.i>=this.canvas.width) {
                    clearInterval(this.interval);
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

/**
* Nutze diese Datei für benutzerdefinierte Funktionen und Blöcke.
* Weitere Informationen unter https://makecode.microbit.org/blocks/custom
*/
let strip: neopixel.Strip;

class Sun{
    sunPositionHead: number;
    sunPositionHeadBefore: number;
    numberOfLEDs: number;
    sunSize: number;

    NUMBER_OF_LEDS_ONE_STRIP: number;
    NUMBER_OF_PARALLEL_STRIPS: number;
    
    constructor(pin: DigitalPin, sunPositionHead: number, sunSize: number){
        this.sunPositionHead = sunPositionHead;
        this.sunPositionHeadBefore = sunPositionHead;
        this.sunSize = sunSize;
        this.NUMBER_OF_LEDS_ONE_STRIP = 10;
        this.NUMBER_OF_PARALLEL_STRIPS = 3;
        this.numberOfLEDs = this.NUMBER_OF_LEDS_ONE_STRIP * this.NUMBER_OF_PARALLEL_STRIPS;
    }

    private incrementSunPositionHead(): void{
        this.sunPositionHeadBefore = this.sunPositionHead;
        if (this.sunPositionHead < (this.NUMBER_OF_LEDS_ONE_STRIP + this.sunSize - 1)) {
            this.sunPositionHead = this.sunPositionHead + 1;
        } else {
            this.sunPositionHead = 0;
        }
    }

    private decrementSunPositionHead(): void {
        this.sunPositionHeadBefore = this.sunPositionHead;
        if (this.sunPositionHead < 0) {
            this.sunPositionHead = this.NUMBER_OF_LEDS_ONE_STRIP - 1;
        } else {
            this.sunPositionHead = this.sunPositionHead -1;
        }
    }

    private setLED(index: number): void {
        strip.setPixelColor(index, NeoPixelColors.White);
    }

    private clearLED(index: number): void {
        strip.setPixelColor(index, NeoPixelColors.Black);
    }

    private isInRange(indexLED: number, stripeNumber: number): boolean{
        let rangeOK: boolean;
        rangeOK = true;

        if (indexLED >= this.NUMBER_OF_LEDS_ONE_STRIP * (stripeNumber + 1)) {
            rangeOK = false;
        }

        if (indexLED < this.NUMBER_OF_LEDS_ONE_STRIP * stripeNumber) {
            rangeOK = false;
        }
        return rangeOK;
    }

    private setLEDDevidedStripe(indexLED: number, stripeNumber: number){
        indexLED = this.getIndexOfParallelLED(indexLED,stripeNumber);
        if(this.isInRange(indexLED,stripeNumber)){
            this.setLED(indexLED);
        }
    }

    private clearLEDDevidedStripe(indexLED: number, stripeNumber: number) {
        indexLED = this.getIndexOfParallelLED(indexLED, stripeNumber);
        if (this.isInRange(indexLED, stripeNumber)) {
            this.clearLED(indexLED);
        }
    }

    moveSun(){
        for (let stripeNumber = 0; stripeNumber < this.NUMBER_OF_PARALLEL_STRIPS; stripeNumber++){
            for(let sunPixels = 0; sunPixels < this.sunSize; sunPixels ++){
                let px: number;
                let pxBefore: number;
                px = this.sunPositionHead - sunPixels;
                pxBefore = this.sunPositionHeadBefore - sunPixels;                        
                this.clearLEDDevidedStripe(pxBefore, stripeNumber);
                this.setLEDDevidedStripe(px,stripeNumber);
            }
        }
        this.incrementSunPositionHead();  
    }

    private isOdd(n: number): boolean {
        return Math.abs(n % 2) == 1;
    }

    getIndexOfParallelLED(indexLED: number, stripeNumber: number): number {
        let indexOfParallelLED;
        if(this.isOdd(stripeNumber)){
            //ungerade 1 3 5
            indexOfParallelLED = ((stripeNumber + 1) * this.NUMBER_OF_LEDS_ONE_STRIP-1) - indexLED;
        }else{
            //gerade 0 2 4
            indexOfParallelLED = stripeNumber * this.NUMBER_OF_LEDS_ONE_STRIP + indexLED;
        }      
        return indexOfParallelLED;
    }
}

enum whereIsEast {
    //% block="left"
    Left,
    //% block="right"
    Right
}

/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon="\uf185"
namespace sonnenbogen {
   
    let mysun: Sun;
    
    /**
     * initializes the LED- stripe
     * @param pin Pin
     */
    //% block
    export function init(pin: DigitalPin, sunSize: number): void {
        mysun = new Sun(pin,0,sunSize);
        strip = neopixel.create(pin, mysun.numberOfLEDs, NeoPixelMode.RGB);
        strip.show();
    }

    /**
     * 
     * @param value describe value here, eg: 5
     */
    //% block
    export function moveSun(): void{
        mysun.moveSun();
        strip.show();
    }
}

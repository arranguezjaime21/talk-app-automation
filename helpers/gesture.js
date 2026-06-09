export class Gestures {
    constructor(driver) { 
        this.driver = driver;
    }

    async swipeUp() { 
        const {width, height} = await this.driver.getWindowRect();

        await this.driver.execute('mobile:dragGesture', {
            startX: Math.floor(width / 2),
            startY: Math.floor(height * 0.8),
            endX: Math.floor(width /2),
            endY: Math.floor(height * 0.2),
            speed: 1200, 
        });
    }

    async swipeDown() {
        const {width, height} = await this.driver.getWindowRect();

        const X = Math.floor(width /2);

        await this.driver.execute('mobile:dragGesture', {
            startX: X, 
            startY: Math.floor(height * 0.2),
            endX: X, 
            endY: Math.floor(height * 0.8),
            speed: 1200
        });
    }
}
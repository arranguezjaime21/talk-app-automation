export class Gestures { 
    constructor(driver) { 
        this.driver = driver;
    }

    async swipeUp() { 
        const {width, height} = await this.driver.getWindowRect();
        const centerX = Math.floor(width / 2);
        
        await this.driver.execute('mobile:dragGesture', {
            startX: centerX, 
            startY: Math.floor(height * 0.8),
            endX: centerX, 
            endY: Math.floor(height * 0.2),
            speed: 1200
        });
    }

    async swipeDown() { 
        const { width, height } = await this.driver.getWindowRect();
        const centerX = Math.floor(width / 2);

        await this.driver.execute('mobile:dragGesture', {
            startX: centerX, 
            startY: Math.floor(height * 0.2),
            endX: centerX, 
            endY: Math.floor(height * 0.8),
            speed: 1200
        });
    }

    async swipeDownInsideElement(selector) { 
        const element = await this.driver.$(selector);
        const { x, y, width, height } = await element.getRect();

        const centerX = Math.floor(x + width / 2);
        const startY = Math.floor( y + height * 0.2);
        const endY = Math.floor(y + height * 0.8);

        await this.driver.execute('mobile:dragGesture', { 
            startX: centerX, 
            startY, 
            endX: centerX, 
            endY,
            speed: 500
        });
    }

    async swipeUpInsideElement(selector) { 
        const element = await this.driver.$(selector);
        const { x, y, width, height } = await element.getRect();

        const centerX = Math.floor(x + width / 2);
        const startY = Math.floor(y + height * 0.8);
        const endY = Math.floor(y + height * 0.2);
        
        await this.driver.execute('mobile:dragGesture', {
            startX: centerX, 
            startY, 
            endX: centerX, 
            endY,
            speed: 500
        });
    }

    async pullToRefresh() {
        const { width, height } = await this.driver.getWindowRect();
        const centerX = Math.floor(width / 2);

        await this.driver.execute('mobile:dragGesture', { 
            startX: centerX,
            startY: Math.floor(height * 0.25),
            endX: centerX, 
            endY: Math.floor(height * 0.75),
            speed: 1000
        });
    }

    async swipeToBack() { 
        const { width , height } = await this.driver.getWindowRect();
        const centerY = Math.floor(height / 2);

        await this.driver.execute('mobile:dragGesture', {
            startX: Math.floor(width * 0.10),
            startY: centerY,
            endX: Math.floor(width / 2),
            endY: centerY, 
            speed: 800
        });
    } 

    async swipeToMoveLeft() {
        const { width , height } = await this.driver.getWindowRect();
        const centerY = Math.floor(height / 2);

        await this.driver.execute('mobile:dragGesture', {
            startX: Math.floor(width * 0.85),
            startY: centerY, 
            endX: Math.floor(width * 0.15),
            endY: centerY, 
            speed: 800
        });
    }

    async swipeToMoveRight() {
        const { width, height } = await this.driver.getWindowRect();
        const centerY = Math.floor(height / 2);

        await this.driver.execute('mobile:dragGesture', {
            startX: Math.floor(width * 0.15),
            startY: centerY,
            endX: Math.floor(width * 0.85),
            endY: centerY, 
            speed: 800
        });
    }
}
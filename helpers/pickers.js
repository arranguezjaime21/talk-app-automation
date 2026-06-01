export class Pickers {
    constructor(driver) { 
        this.driver = driver;
        this.pickerEl = 'id=android:id/numberpicker_input';
    }

    async selectByText(selector, targetText, maxScrolls = 50) { 
        const picker = await this.driver.$(selector);
        
        let attempts = 0;
        let lastItem = "";
        let currentDirection = 'down';
        let isFlipped = false;

        while(attempts < maxScrolls) { 
            const input = await picker.$(this.pickerEl);
            const currentInput = (await input.getText() || await input.getAttribute("text") || "").trim();

            if(currentInput === targetText) { 
                return;
            }

            if(currentInput === lastItem) { 
                
                if(!isFlipped) { 
                    console.log(`reach last item and target text: ${targetText} still not found, scrolling up...`);

                    currentDirection = 'up';
                    isFlipped = true;
                    lastItem = "";
                    attempts = 0;
                    continue;
                } else { 
                    throw new Error(`text: ${targetText} not found or does not exists in the list`);
                }
            }

            lastItem = currentInput;

            await this.driver.execute('mobile:scrollGesture', { 
                elementId: picker.elementId, 
                direction: currentDirection, 
                percent: 0.5, 
                speed: 800, 
            });

            await this.driver.pause(400);
            attempts++;
        }

        throw new Error(`timeout: text: ${targetText} not found after ${maxScrolls} times attempts`);
    }

    async selectByNumber(selector, targetNumber, maxScrolls = 50) { 
        const target = Number(targetNumber);
        const picker = await this.driver.$(selector);

        let attempts = 0;
        let lastValue = null;

        while(attempts < maxScrolls) { 
            const input = await picker.$(this.pickerEl);
            const raw = (await input.getText() || await input.getAttribute("text") || "").trim();
            const value = parseInt(raw.replace(/\D/g, ''), 10);

            if(value === target) { 
                return;
            }

            if(value === lastValue) { 
                throw new Error(`number: ${target} not found or does not exists in the list`);
            }

            const direction = value < target ? 'down' : 'up';

            lastValue = value;

            await this.driver.execute('mobile:scrollGesture', {
                elementId: picker.elementId,
                direction: direction, 
                percent: 0.5, 
                speed: 800,
            });

            await this.driver.pause(400);
            attempts++;
        }
        throw new Error(`timeout: number: ${target} not found after ${maxScrolls} times of attempts`);
    }

}
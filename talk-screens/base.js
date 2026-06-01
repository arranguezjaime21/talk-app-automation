export class BasePage { 
    constructor(driver) { 
        this.driver = driver;
        this.defaultTimeout = 5000;
    }

    async waitAndFind(selector, timeout = this.defaultTimeout) { 
        const el = await this.driver.$(selector);
        await el.waitForDisplayed({ timeout });
        return el;
    }

    async waitAndFindAll(selector, timeout = this.defaultTimeout) { 
        let elements = [];

        await this.driver.waitUntil(async() => {
            elements = await this.driver.$$(selector);
            return elements.length > 0;
        }, {
            timeout, 
            timeoutMsg: `element not found in the list ${selector}`,
        });

        if(elements.length > 0) { 
            await elements[0].waitForDisplayed({ timeout });
        }

        return elements;
    }

    async safeFindAll(selector, timeout = this.defaultTimeout) { 
        try {
            return await this.waitAndFindAll(selector, timeout);
        } catch {
            return [];
        }
    }

    async elementExists(selector, timeout = this.defaultTimeout) { 
        try {
            const el = await this.driver.$(selector);
            await el.waitForDisplayed({ timeout });
            return true;
        } catch {
            return false;
        }
    }

    async waitAndGetText(selector, timeout = this.defaultTimeout) { 
        const el = await this.waitAndFind(selector, timeout);
        const text = await el.getAttribute("text") || await el.getText() || "";
        return text.trim();
    }

    async waitAndClick(selector, timeout = this.defaultTimeout) { 
        const el = await this.waitAndFind(selector, timeout);
        await el.waitForEnabled({timeout});
        await el.click();
    }

    async setValue(selector, value, timeout = this.defaultTimeout) { 
        const el = await this.waitAndFind(selector, timeout);
        await el.clearValue();
        await el.setValue(value);
    }

    async toggleState(selector, timeout = this.defaultTimeout) { 
        const el = await this.waitAndFind(selector, timeout);
        const state = await el.getAttribute("checked");
        return (state === true || state === "true");
    }

    async toggleOffIfOn(selector, timeout = this.defaultTimeout) { 
        const isChecked = await this.toggleState(selector, timeout);

        if(isChecked) { 
            const el = await this.waitAndFind(selector, timeout); 
            await el.click();
            return true;
        }
        return false;
    }

    async toggleOnIfOff(selector, timeout = this.defaultTimeout) { 
        const isChecked = await this.toggleState(selector, timeout);

        if(!isChecked) {
            const el = await this.waitAndFind(selector, timeout);
            await el.click();
            return true;
        }
        return false;
    }
}
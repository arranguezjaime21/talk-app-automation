import { remote } from "webdriverio";
import { emulatorCapsReset } from "../helpers/capabilities.js";

export const mochaHooks = { 
    async beforeAll() {
        this.timeout(12000);

        global.driver = await remote({
            path: "/",
            port: 4723, 
            hostname: "127.0.0.1",
            logLevel: "error",
            capabilities: emulatorCapsReset,
        });
    },

    async afterAll() {
        if(global.driver) { 
            await global.driver.deleteSession();
        }
    }
}

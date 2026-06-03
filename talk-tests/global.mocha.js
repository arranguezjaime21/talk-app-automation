import { remote } from "webdriverio";
import { emulatorCaps } from "../helpers/capabilities.js";
import { TemplateSettings } from "../talk-screens/mypage/templatesettings.main.js";

export const mochaHooks = { 
    async beforeAll() {
        this.timeout(12000);

        global.driver = await remote({
            path: "/",
            port: 4723,
            hostname: "127.0.0.1",
            logLevel: "error",
            capabilities: emulatorCaps
        });

        global.templateSettings = new TemplateSettings(global.driver);
    },

    async afterAll() {
        if(global.driver) { 
            await global.driver.deleteSession();
        }
    }
}
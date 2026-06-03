import { FakeData } from "../../helpers/faker.js";

describe("Template Settings", function() {
    this.timeout(120000);

    it("Create Template", async function () {
        await templateSettings.navMyPageTemplate();
        await templateSettings.createTemplate({ 
            content: FakeData.randomSentence(),
            templateType: "text",
        })
    });
})
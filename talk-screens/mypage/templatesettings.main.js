import { CameraHelper } from "../../helpers/camera.js";
import { MyPageSelectors, TemplateSelectors } from "../../talk-selectors/selectors.js";
import { BasePage } from "../base.js";

export class TemplateSettings extends BasePage { 
    constructor(driver) {
        super(driver);

        this.selectors = {
            ...MyPageSelectors, 
            ...TemplateSelectors
        };

        this.cameraHelpers = new CameraHelper (
            this.driver,
            this.waitAndClick.bind(this),
            this.waitAndFind.bind(this),
            this.waitAndFindAll.bind(this),
            this.elementExists.bind(this)
        );

    }

    async navMyPageTemplate() {
        await this.waitAndClick(this.selectors.myPageNav);
        await this.waitAndClick(this.selectors.myPageTemplateSettings);
    }

    async templateFiller({ description, mediaType }) { 
        if(!description?.trim()) { 
            throw new Error("Template description must not empty");
        }

        await this.setValue(this.selectors.templateDescription, description);

        if(mediaType) { 
            await mediaType(this.selectors);
        }

        await this.elementExists(this.selectors.iconThumbImage, 5000);
    }

    async createTemplate({ content, templateType = "text" }) {
        await this.waitAndClick(this.selectors.createTemplate);

        if(!content?.trim()) { 
            throw new Error("Template content must not empty");
        }

        const template = {
            text: async() => {
                await this.setValue(this.selectors.templateDescription, content);
            },
            camera: async() => {
                await this.templateFiller({ 
                    description: content,
                    mediaType: this.cameraHelpers.templateCameraCapture.bind(this.cameraHelpers),
                });
            },
            gallery: async() => {
                await this.templateFiller({ 
                    description: content, 
                    mediaType: this.cameraHelpers.templateGallerySelection.bind(this.cameraHelpers),
                });
            },
        };

        const action = template[templateType];
        if(!action) { 
            throw new Error(`Invalid inputted template type: ${templateType}, 
                Valid Inputs: ${Object.keys(template).join(", ")}`);
        }

        await action();

        const createdTemplateDesc = await this.waitAndGetText(this.selectors.templateDescription);
        await this.saveAndVerifyTemplate(createdTemplateDesc);
    }

    async saveAndVerifyTemplate(expectedText) { 
        if(!expectedText?.trim()) { 
            throw new Error("Template expected description must not empty");
        }
        await this.waitAndClick(this.selectors.saveTemplate);

        if(await this.elementExists(this.selectors.successModal, 5000)) { 
            await this.waitAndClick(this.selectors.confirmBtn);
        }

        await this.elementExists(this.selectors.templateList, 5000);

        const templateList = await this.safeFindAll(this.selectors.templateList, 5000);
        if(templateList.length === 0) { 
            throw new Error("No template is displayed in the template list");
        }

        const recentTemplate = templateList[1];

        const targetEl = await recentTemplate.$(this.selectors.postedText);

        try {
            await targetEl.waitForDisplayed({ timeout: 5000 });
        } catch  {
            throw new Error("Recent template failed to load description");
        }

        const recentTemplateDesc = await targetEl.getText() || await targetEl.getAttribute("text");

        if(recentTemplateDesc.trim() !== expectedText.trim()) { 
            throw new Error(`Template display mismatch: 
                Actual: ${recentTemplateDesc}, 
                Expected: ${expectedText}`);
        }
    }
}
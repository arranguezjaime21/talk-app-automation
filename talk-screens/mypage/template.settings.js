import { CameraHelper } from "../../helpers/camera";
import { MyPageSelectors, TemplateSelectors } from "../../talk-selectors/selectors";
import { BasePage } from "../base.js";

export class TemplateSettings extends BasePage { 
    constructor(driver) {
        super(driver);

        this.selectors = {
            ...MyPageSelectors, 
            ...TemplateSelectors
        };

        this.cameraHelpers = new CameraHelper(
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

    async templateFiller({ description, mediaAction }) { 
        if(!description?.trim()) { 
            throw new Error("Template description must not empty");
        }

        await this.setValue(this.selectors.templateDescription, description);

        if(mediaAction) { 
            await mediaAction(this.selectors);
        }

        await this.elementExists(this.selectors.iconThumbImage, 5000);
    }

    async createTemplate({ content, templateType = "test" }) { 
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
                    mediaAction: this.cameraHelpers.templateCameraCapture.bind(this.cameraHelpers),
                });
            },
            gallery: async() => {
                await this.templateFiller({ 
                    description: content, 
                    mediaAction: this.cameraHelpers.templateGallerySelection.bind(this.cameraHelpers),
                });
            }
        };

        const action = template[templateType];

        if(!action) { 
            throw new Error(`Incorrect inputted template type:
                Inputted Template Type: ${templateType}, 
                Valid Template Type: ${Object.keys(template).join(", ")}`);
        }

        await action();

        const templateDesc = await this.waitAndGetText(this.selectors.templateDescription);
        await this.saveAndVerifyTemplate(templateDesc);
    }

    async saveAndVerifyTemplate(expectedtext) { 
        if(!expectedtext?.trim()) {
            throw new Error("Template description must not empty");
        }

        await this.waitAndClick(this.selectors.saveTemplate);

        if(await this.elementExists(this.selectors.successModal, 3000)) { 
            await this.waitAndClick(this.selectors.confirmBtn);
        }

        await this.elementExists(this.selectors.templateList, 5000);

        const templates = await this.safeFindAll(this.selectors.templateList, 5000);
        if(!templates.length === 0) { 
            throw new Error("No template found in the list , save template does not exists");
        }

        const recentTemplate = templates[0];
        const targetEl = await recentTemplate.$(this.selectors.postedText);
        if(!(await targetEl.isExisting)) { 
            throw new Error("Recent template has no description");
        }

        const recentTemplateDesc = await targetEl.getText();
        
    }
}
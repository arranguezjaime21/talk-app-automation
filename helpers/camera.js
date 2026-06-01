export class CameraHelper { 
    constructor(driver, waitAndClick, waitAndFind, waitAndFindAll, elementExists) { 
        this.driver = driver;
        this.waitAndClick = waitAndClick;
        this.waitAndFind = waitAndFind;
        this.waitAndFindAll = waitAndFindAll;
        this.elementExists = elementExists;
    }

    async templateCameraCapture(selector) { 
        const steps = [
            selector.btnIDCam,
            selector.btnCamera, 
            selector.btnCapture,
            selector.btnConfirm, 
            selector.btnUpload
        ];

        for(const step of steps) { 
            if(step) { 
                await this.waitAndClick(step);
            } else { 
                console.warn("element does not exists");
            }
        }
    }

    async templateGallerySelection(selector) { 
        await this.waitAndClick(selector.btnIDCam);
        await this.waitAndClick(selector.btnGallery);

        const galleryPermission = await this.elementExists(selector.libraryDialog);
        if(galleryPermission) { 
            console.log("Allowing app permission for device gallery...");

            await this.waitAndClick(selector.allowLibrary);
            await this.driver.pause(2000);

            const needToTrigger = await this.elementExists(selector.btnGallery, 2000);
            if(needToTrigger) { 
                await this.waitAndClick(selector.btnIDCam);
                await this.waitAndClick(selector.btnGallery);
            }
        }

        await this.waitAndClick(selector.deviceFile);
        const picture = await this.waitAndFindAll(selector.galleryItems, 5000);

        if(picture.length > 0) { 
            const randomIndex = Math.floor(Math.random() * picture.length);
            console.log(`Images are displayed, selecting random index: ${randomIndex}`);

            await picture[randomIndex].click();
        } else {
            throw new Error(`No image found or displayed in selected gallery folder ${selector.galleryItems}`);
        }

        await this.waitAndClick(selector.btnUpload);
    }
}

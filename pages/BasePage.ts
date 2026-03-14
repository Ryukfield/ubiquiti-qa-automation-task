import path from "node:path";
import type { Locator, Page, TestInfo } from "@playwright/test";

export abstract class BasePage {
    protected abstract readonly pageUrlPattern: RegExp;

    readonly acceptCookiesBtn: Locator;
    readonly regionContinueBtn: Locator;

    constructor(protected page: Page) {
        this.acceptCookiesBtn = page.getByRole("button", { name: /accept|agree/i });
        this.regionContinueBtn = page.getByRole("button", { name: /Continue to Europe Store/i });
    }

    async navigate(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async waitForPageToLoad(): Promise<void> {
        await this.page.waitForURL(this.pageUrlPattern);
    }

    async handlePopups(): Promise<void> {
        /*
        TODO
        Accept / Reject Regional Store setting
        */
        // if (await this.regionContinueBtn.isVisible()) {
        //    await this.regionContinueBtn.click();
        // }

        if (await this.acceptCookiesBtn.isVisible()) {
            await this.acceptCookiesBtn.click();
        }
    }

    async goBack(): Promise<void> {
        await this.page.goBack();
    }

    async takeScreenshot(fileName: string, testInfo: TestInfo): Promise<void> {
        const browserName = testInfo.project.name;
        const constructedFileName = `${browserName}-${fileName}`;
        const screenshotPath = path.join("test-results", "screenshots", constructedFileName);

        await this.page.screenshot({ path: screenshotPath, fullPage: true });
    }
}

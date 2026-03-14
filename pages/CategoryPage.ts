import type { Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CategoryPage extends BasePage {
    protected readonly pageUrlPattern = /\/category\//;

    private getAvailableProductsLocator(): Locator {
        return this.page
            .locator("main")
            .locator("a[href*='/products/']")
            .and(this.page.locator(":visible"))
            .filter({ hasNotText: "Sold Out" });
    }

    async waitForProductsToLoad(): Promise<void> {
        const productList = this.getAvailableProductsLocator();

        /*
            TODO
            Need to find proper solution for waiting for product cards to be loaded.
            REMOVE waitForTimeout.
        */
        await productList.first().waitFor({ state: "visible", timeout: 5000 });
        await this.page.waitForTimeout(2500);
    }

    async getAvailableProductsCount(): Promise<number> {
        return await this.getAvailableProductsLocator().count();
    }

    async chooseProduct(index: number): Promise<void> {
        const targetLink = this.getAvailableProductsLocator().nth(index);

        await targetLink.waitFor({ state: "visible", timeout: 5000 });
        await targetLink.click();
    }
}

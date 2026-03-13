import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductPage extends BasePage {
    protected readonly pageUrlPattern = /\/products\//;
    private readonly addToCartBtn: Locator;

    constructor(page: Page) {
        super(page);

        this.addToCartBtn = page.getByRole("button", { name: "Add to Cart", exact: true }).first();
    }

    async clickAddToCart(): Promise<void> {
        await this.addToCartBtn.waitFor({ state: "visible" });
        await this.addToCartBtn.click();
    }

    async waitForAddToCartButtonEnabled(): Promise<void> {
        let attempts = 0;
        while (!(await this.addToCartBtn.isEnabled()) && attempts < 10) {
            await this.page.waitForTimeout(500);
            attempts++;
        }

        if (attempts >= 10) throw new Error("Timeout: Failed to wait for the 'Add to Cart' button to become active.");
    }
}

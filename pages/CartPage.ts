import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
    protected readonly pageUrlPattern = /\/checkout/;

    private readonly buyNowBtn: Locator;
    private readonly cartIcon: Locator;
    private readonly viewFullCartBtn: Locator;

    readonly itemSubtotalLocator: Locator;
    readonly orderSubtotalLocator: Locator;
    readonly orderVatLocator: Locator;
    readonly orderTotalLocator: Locator;

    constructor(page: Page) {
        super(page);

        this.buyNowBtn = this.page.getByRole("button", { name: "Buy Now" });
        this.cartIcon = this.page.locator("a[href*='/cart'], button[aria-label*='cart']").first();
        this.viewFullCartBtn = this.page.getByRole("link", { name: "View Full Cart" });

        this.itemSubtotalLocator = page.locator("tbody tr td:nth-child(4)");

        this.orderSubtotalLocator = page.getByText("Subtotal", { exact: true }).locator("+ div");
        this.orderVatLocator = page.getByText("VAT", { exact: true }).locator("+ div");
        this.orderTotalLocator = page.getByText("Total", { exact: true }).locator("+ div");
    }

    /**
    * TODO
    * Control flow for cart could be changed to alternative way.
    * Alternate flow: Click Header Cart Icon -> Wait for Preview Sidebar -> Click "View Full Cart".
    */
    async clickOnCartIcon(): Promise<void> {
        await this.cartIcon.waitFor({ state: "visible" });
        await this.cartIcon.click();
    }

    async waitForCartPreviewToLoad(): Promise<void> {
        await this.viewFullCartBtn.waitFor({ state: "visible", timeout: 5000 });
    }

    async openFullCart(): Promise<void> {
        await this.viewFullCartBtn.click();
    }

    async clickBuyNow(): Promise<void> {
        await this.buyNowBtn.waitFor({ state: "visible" });
        await this.buyNowBtn.click();
    }

    async getSumOfCartItems(): Promise<number> {
        let sum = 0;

        await this.itemSubtotalLocator.first().waitFor({ state: "visible" });

        const count = await this.itemSubtotalLocator.count();
        for (let i = 0; i < count; i++) {
            const priceText = await this.itemSubtotalLocator.nth(i).innerText();
            // Ignore empty cells (in case UI Care / CyberSecure create blank structural rows)
            if (priceText.trim() !== "") {
                sum += this.parsePrice(priceText);
            }
        }
        return sum;
    }

    async getOrderSubtotal(): Promise<number> {
        const text = await this.orderSubtotalLocator.innerText();
        return this.parsePrice(text);
    }

    async getOrderVat(): Promise<number> {
        const text = await this.orderVatLocator.innerText();
        return this.parsePrice(text);
    }

    async getOrderTotal(): Promise<number> {
        const text = await this.orderTotalLocator.innerText();
        return this.parsePrice(text);
    }

    private parsePrice(priceText: string): number {
        // Removes all characters except digits, commas, and dots.
        // Converts European format (1.909,38) to standard float (1909.38)
        const cleanPrice = priceText
            .replace(/[^0-9.,]/g, '') // Remove symbols and letters
            .replace(/\./g, '')       // Remove thousands separator dot
            .replace(',', '.');       // Replace decimal comma with dot

        return parseFloat(cleanPrice);
    }
}

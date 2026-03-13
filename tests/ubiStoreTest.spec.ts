import { expect, test } from "@playwright/test";
import { CartPage } from "../pages/CartPage";
import { CategoryPage } from "../pages/CategoryPage";
import { HomePage } from "../pages/HomePage";
import { ProductPage } from "../pages/ProductPage";
import { categoriesToAdd } from "../utils/storeData";
import { storePageLink } from "../utils/testLinks";


test.describe("Ubiquiti Store E2E Test", () => {

    test.setTimeout(60_000);

    test("Add devices and verify cart total", async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const categoryPage = new CategoryPage(page);
        const productPage = new ProductPage(page);
        const cartPage = new CartPage(page);

        await homePage.navigate(storePageLink);
        await homePage.waitForPageToLoad();
        await homePage.handlePopups();

        for (const category of categoriesToAdd) {
            await homePage.goToCategory(category.name);

            await categoryPage.waitForPageToLoad();
            await categoryPage.waitForProductsToLoad();
            const availableCount = await categoryPage.getAvailableProductsCount();
            if (availableCount < category.count)
                throw new Error(`Expected at least ${category.count} available products in '${category.name}', but found only ${availableCount}.`);

            for (let i = 0; i < category.count; i++) {
                await categoryPage.chooseProduct(i);

                await productPage.waitForPageToLoad();
                await productPage.clickAddToCart();
                await page.waitForTimeout(300);
                await productPage.waitForAddToCartButtonEnabled();

                if (i < category.count - 1) {
                    await productPage.goBack();
                    await categoryPage.waitForPageToLoad();
                    await categoryPage.waitForProductsToLoad();
                }
            }
        }

        /*
        Alternative flow: Click Header Cart Icon -> Wait for Preview Sidebar -> Click "View Full Cart".
        await cartPage.clickOnCartIcon();
        await cartPage.waitForCartPreviewToLoad();
        await cartPage.openFullCart();
        */
        await cartPage.clickBuyNow();
        await cartPage.waitForPageToLoad();

        const itemsSum = await cartPage.getSumOfCartItems();
        const subtotal = await cartPage.getOrderSubtotal();
        const vat = await cartPage.getOrderVat();
        const total = await cartPage.getOrderTotal();

        expect(subtotal).toBeCloseTo(itemsSum, 2);
        expect(total).toBeCloseTo(subtotal + vat, 2);

        await cartPage.takeScreenshot("cart-summary.png", testInfo);
    });
});

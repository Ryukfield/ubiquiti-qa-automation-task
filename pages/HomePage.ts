import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
    protected readonly pageUrlPattern = /store\.ui\.com/;

    async goToCategory(categoryName: string): Promise<void> {
        const selector = `a[href*='/category/']:has(:text-is("${categoryName}"))`;
        const categoryLink = this.page.locator(selector).and(this.page.locator(":visible")).first();

        await Promise.all([
            this.page.waitForResponse((response) => 
                response.url().includes(`/category/`) && 
                response.url().includes('.json') &&
                response.status() === 200
            ),
            categoryLink.click()
        ]);
    }
}

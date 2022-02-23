At **Designhubz** we empower brands around the world to connect with shoppers in a complete immersive way.

We’re transforming the online shopping experience with next generation eCommerce interfaces using our leading AR technology that’s being adopted by some of the largest brands and retailers globally.

---

# Designhubz | Eyewear & Makeup Tryon

This project highlights the usage of the Designhubz web SDK for Eyewear & Makeup Tryons.

- Entry page [index.html](./index.html) has an `HTMLDivElement` that will contain the widget.
- In [src/eyewear.ts](./src/eyewear.ts) + [src/makeup.ts](./src/makeup.ts) we demonstrate creating a widget, loading products and using available tryon features.
- *NPM dependency* `"designhubz-widget"` is added in `package.json`.

In it's simplest form....

![designhubz-widget](./graphic.png)

## Live preview

Eyewear: https://dg0iszzfyf3bz.cloudfront.net/widget/1.2.0/index.html

Makeup: https://dg0iszzfyf3bz.cloudfront.net/widget/1.2.0/index.html?demo=makeup

---

## Running the example

1. Clone project and open terminal in root project folder
2. Install and run:
  ```bash
  npm i
  npm start
  ```

---

## Changelog

### 1.2.0

- Changes that reflects improvements to infrastructure
- Adds an adiitional "privacy" layer to your products: When developping locally, calling `Designhubz.auth(ORGANIZATION_ID)` is required to successfully use the widget.
- Changes SDK deployement path: `"designhubz-widget": "https://d2v6wmk4yqo2ys.cloudfront.net/master/designhubz-widget-1.2.0.tgz"`

### 1.1.3

- Improved error handling and QA utils
- Bug fixes

### 1.1.2

**Makeup:**
- Improved tracking quality
- Improved overall visual quality 
- Add comparison feature: compare with & without makeup product
- Bug fixes

### 1.1.1

- Unified eyewear and makeup tryon widgets to single SDK.

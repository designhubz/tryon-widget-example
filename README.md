At **Designhubz** we empower brands around the world to connect with shoppers in a complete immersive way.

We’re transforming the online shopping experience with next generation eCommerce interfaces using our leading AR technology that’s being adopted by some of the largest brands and retailers globally.

---

# Designhubz | XR VTO SDK

The widget `designhubz-widget` is a very lightweight JS/TS npm package.

It's a simple API that adds a Computer Vision based Realtime 3D Try-On experience, interacting with your digitized inventory on Designhubz' platform and providing 1 of a kind user-feature-based recommendations ([Our demo showroom uses the widget](https://eyewear.designhubz.com/)).

<br>

In it's simplest form....

![designhubz-widget](./graphic.png)


## Integration companion guide for Eyewear VTO

https://github.com/designhubz/tryon-widget-example/blob/master/EYEWEAR.md


## API Reference

https://d2v6wmk4yqo2ys.cloudfront.net/master/docs/2.2.0/modules.html

---

## Running the example

1. Clone project and open terminal in root project folder
2. Install and run:
  ```bash
  npm i
  npm start
  ```


## Adding the widget to your project
1. Refer to [./package.json](./package.json) for the latest version of `designhubz-widget` and add it as a dependencies.
2. `npm install`


## Maintenance
- We use SemVer (Minor and patch version changes are non-breaking)
- The upgrade is under your control: version bump of `designhubz-widget`, which always has an explicit version
- New releases will include bug fixes or new features to the widget
- Improvements to the 3D/Try-On experiences are *transparent changes* (You won't need to upgrade).
---

## Changelog

### 2.2.0
- Upgrade VTO configuration

### 2.1.1
- Improve SpatialXR widget

### 2.0.3
- Bug fixes

### 2.0.2
- Add SpatialXR (room-based AR) widget

### 1.3.2
- Separated dev helpers `Designhubz.auth(ORGANIZATION_ID)` & `Designhubz.setDeployment('staging')`
- Minor improvements

### 1.2.1

- Patched `Designhubz.auth(ORGANIZATION_ID, [TARGET_DEPLOYMENT='staging'])` to target staging deployment (while using staging's organization Id)

### 1.2.0

- Transparent changes that reflects improvements to infrastructure
- Additional "privacy" layer to your products: When developping locally only, calling `Designhubz.auth(ORGANIZATION_ID)` is required to successfully use the widget. When live (not localhost), this is not needed as whitelisting takes over (usage is shown in example).
- Enforcing `widget.setUserId('USER_ID');` right after instanciating the widget.
- Changes SDK deployement path (Please check package.json)

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

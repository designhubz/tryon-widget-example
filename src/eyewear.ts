import * as Designhubz from 'designhubz-widget';
import { displayError, displayLog } from './logUtils';
import {
    demo_state,
    demo_videoAuth, demo_progressHandler, demo_onUserInfoUpdate,
    demo_takeSnaphot, demo_trackingHandler, demo_fetchRecommendations,
    demo_cycleProducts, demo_switchContext, demo_stats
} from './snippets';

console.log(...displayLog('Designhubz Eyewear VTO - SDK features', Designhubz.version));

const url = new URL(location.href);
const searchParams = url.searchParams;
const isLocalDev = location.origin.includes('//localhost:') || location.origin.includes('//127.0.0.1');

/**
 * This project highlights the usage of the Designhubz web SDK for Eyewear
 *
 * Check the [companion doc](../EYEWEAR.md)
 */
export async function demo()
{
    // defaults to testing production
    if(isLocalDev)
    {
        const deployment = searchParams.get('deployment');
        console.log({deployment});
        if(deployment !== null) Designhubz.setDeployment(deployment);
    }

    // Access to your resources on localhost (not required when published on whitelisted domain)
    const orgId = searchParams.get('org');
    const productsParam = searchParams.get('products');
    if(orgId === null || productsParam === null || productsParam.length <= 1)
    {
        window.alert(`Please configure your organization id and digitized products ids:\n`
            + `Click ok to reload this demo with placeholders to fill in.`);
        searchParams.append('org', orgId ?? 'YOUR_ORG_ID');
        searchParams.append('products', productsParam ?? 'VARIATIONS_CSV');
        location.href = url.href;
        return;
    }
    
    Designhubz.auth(orgId);
    const productIDs = productsParam.split(',');

    // Create empty widget in container
    const container = document.getElementById('designhubz-widget-container') as HTMLDivElement;
    let widget = await Designhubz.createEyewearWidget(container, demo_progressHandler('Eyewear widget'),'tryon');
    console.log('widget', widget);
    displayLog('widget loaded');

    // The identifier that can pair this widget session with your collected user stats
    widget.setUserId('1234');

    // Load a product in the widget
    // Deprecated: const product = await widget.loadProduct(productIDs[0]);
    const product = await widget.loadVariation(productIDs[0], demo_progressHandler('Loading ' + productIDs[0]))
    .catch( reason => Promise.reject(displayError(`Failed loading variation`, reason)) );
    console.log('product', product);
    displayLog(`product '${product.productKey}' loaded`);
    displayLog(`product '${product.productKey}' is '${product.status}'`);

    // Widget defaults to 3D mode, this will switch to tryon
    let canTryon = true;
    try
    {
        const newContext = await widget.switchContext('tryon', demo_progressHandler('Switching to tryon'));
        console.log(`Context switched to '${newContext}'`);
    }
    catch(err: any)
    {
        canTryon = false;
        let userMessage: string;
        // err could be a stringified camera error from:
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#exceptions
        switch(err)
        {
            case 'NotAllowedError': userMessage = 'Camera access denied';
                break;
            case 'NotReadableError': userMessage = 'The VTO experience requires a camera';
                break;
            default: userMessage = 'VTO experience aborted!';
                break;
        }
        displayError(userMessage, err);
        displayLog(`Staying in 3D`);
    }

    // Common interactions with widget (./snippets.ts)
    demo_onUserInfoUpdate(widget);
    demo_takeSnaphot(widget);
    demo_trackingHandler(widget);
    demo_fetchRecommendations(widget);
    if(productIDs.length > 1) demo_cycleProducts(widget, productIDs, 5000);
    if(canTryon) demo_switchContext(widget);

     // Dispose of widget
     console.log(`   Press 'd' to dispose of the widget and resources`);
     window.addEventListener('keydown', async ke => {
         if(ke.key === 'd')
         {
             // First stop interacting with widget (this will stop demo_cycleProducts)
             demo_state.active = false;
             await widget.disposeAsync();
             demo();
         }
     });
     if(searchParams.has('profiling')) {
       const profilerCTAButton = document.createElement('button');
       profilerCTAButton.textContent = 'SUBMIT PROFILING';
       profilerCTAButton.style.cssText = `cursor:pointer;position: absolute; left: 40%; bottom: 20px; width: 20%; text-align: center; background: white;`;
       document.body.appendChild(profilerCTAButton);
       profilerCTAButton.addEventListener('click', ev => {
         const event = new KeyboardEvent('keydown', {'key': 'Escape'});
         window.dispatchEvent(event);
       });
     }
}

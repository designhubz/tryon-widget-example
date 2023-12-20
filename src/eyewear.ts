import * as Designhubz from 'designhubz-widget';
import { displayLog } from './logUtils';
import { 
    demo_state,
    demo_videoAuth, demo_progressHandler, demo_onUserInfoUpdate,
    demo_takeSnaphot, demo_trackingHandler, demo_fetchRecommendations, 
    demo_cycleProducts, demo_switchContext, demo_stats 
} from './snippets';

console.log(...displayLog('Designhubz Eyewear VTO - SDK features', Designhubz.version));

const searchParams = new URL(location.href).searchParams;
const isLocalDev = location.origin.includes('//localhost:');

/**
 * This project highlights the usage of the Designhubz web SDK for Eyewear
 * 
 * Check the [companion doc](../EYEWEAR.md)
 */
export async function demo()
{
    // Access to your resources on localhost (not required when published on whitelisted domain)
    const orgId = searchParams.get('org') ?? window.prompt('Please enter your organization Id \'org=\'');
    if(orgId !== null) Designhubz.auth(orgId);
    if(isLocalDev)
    {
        const deployment = searchParams.get('deployment');
        console.log({deployment});
        if(deployment !== null) Designhubz.setDeployment(deployment);
    }
    
    // My parameters
    const container = document.getElementById('designhubz-widget-container') as HTMLDivElement;
    let productsParam = searchParams.get('products');
    while(productsParam === null) productsParam = window.prompt('Please enter products ids \'products=\'');
    const productIDs = productsParam.split(',');

    // Create empty widget
    let widget = await Designhubz.createEyewearWidget(container, demo_progressHandler('Eyewear widget'));
    console.log('widget', widget);
    displayLog('widget loaded');

    // The identifier that can pair this widget session with your collected user stats
    widget.setUserId('1234');

    // Load a product in the widget
    const product = await widget.loadProduct(productIDs[0]);
    console.log('product', product);
    displayLog(`product '${product.productKey}' loaded`);
    displayLog(`product '${product.productKey}' is '${product.status}'`);

    // Widget defaults to 3D mode, this will switch to tryon
    try
    {
        const newContext = await widget.switchContext('tryon', demo_progressHandler('Switching to tryon'));
        console.log(`Context switched to '${newContext}'`);
    }
    catch(err: any)
    {
        // err could be a stringified camera error from:
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#exceptions
        switch(err)
        {
            case 'NotAllowedError': 
                alert('[Custom camera handler]\nCamera access denied');
                break;
            case 'NotReadableError':
                alert('[Custom camera handler]\nThe VTO experience requires a camera');
                break;
            default:
                alert(`VTO experience aborted!\n${String(err)}`);
                break;   
        }
        console.log(`Staying in 3D`);
    }
    
    // Common interactions with widget (./snippets.ts)
    demo_onUserInfoUpdate(widget);
    demo_takeSnaphot(widget);
    demo_trackingHandler(widget);
    demo_fetchRecommendations(widget);
    if(productIDs.length > 1) demo_cycleProducts(widget, productIDs, 5000);
    demo_switchContext(widget);

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
}

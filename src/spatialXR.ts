import * as Designhubz from 'designhubz-widget';
import { displayLog } from './logUtils';
import {
    demo_state,
    demo_progressHandler,
    demo_takeSnaphot,
    demo_cycleProducts
} from './snippets';
import {demoScreenAnchors} from './features/demoScreenAnchors';

console.log(...displayLog('Designhubz Spatial XR - SDK features', Designhubz.version));

const searchParams = new URL(location.href).searchParams;

export async function demo()
{
    // My parameters
    const container = document.getElementById('designhubz-widget-container') as HTMLDivElement;
    const productIDsParams = (
      searchParams.get('productIDs') ?? window.prompt('Please enter a product id')
    );
    if(productIDsParams === null)
    {
      const issue = 'Missing product param';
      alert(issue);
      throw issue;
    }
    const productIDs = productIDsParams.split(',');
    console.log(productIDs);

    // Whitelist local dev access to your resources
    const orgId = searchParams.get('orgId') ?? window.prompt('Please enter your organization Id');
    if(orgId !== null) Designhubz.auth(orgId);

    const deployment = searchParams.get('target-deployment');
    console.log({deployment});
    if(deployment !== null) Designhubz.setDeployment(deployment);

    // Create empty widget
    let widget = await Designhubz.createSpatialXRWidget(container, demo_progressHandler('SpatialXR widget'));
    console.log('widget', widget);
    displayLog('widget loaded');

    // The identifier that can pair this widget session with your collected user stats
    widget.setUserId('1234');

    // Load a product in the widget
    const product = await widget.loadProduct(productIDs[0], demo_progressHandler(productIDs[0]));
    console.log('product', product);
    displayLog(`product '${product.productKey}' loaded`);

    // Open in AR
    const arCTAButton = document.createElement('button');
    arCTAButton.textContent = 'MOVE TO YOUR SPACE';
    arCTAButton.style.cssText = `position: absolute; left: 20px; bottom: 20px; width: 30%; text-align: center; background: white;`;
    container.appendChild(arCTAButton);
    arCTAButton.addEventListener('click', ev =>
    {
        console.log('trigger AR');
        if(widget.isArEnabled()) {
          try {
            widget.triggerAr();
          } catch (err) {
            console.log('trigger AR error\n', err);
            throw err;
          }
        }
        else {
            widget.generateQRCode()
              .then( qrCodeElement =>
              {
                qrCodeElement.style.cssText = `position: absolute; width: 40vh; left: 30vw; top: 20vh; border: 8px solid black;`;
                container.appendChild(qrCodeElement);
              });
        }
    });

    // handle screen anchors (Dimensions)
    demoScreenAnchors({
      widget, 
      container,
      offset: 0.5,
      // dimensions: {width: 100, height: 200, depth: 100}
    });

    // Common interactions with widget (./snippets.ts)
    demo_takeSnaphot(widget);
    // demo_cycleProducts(widget, productIDs, 5000);

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
        else if(ke.key === '1')
        {
        	widget.toggleRequirementsDisplay();
        }
     });
}

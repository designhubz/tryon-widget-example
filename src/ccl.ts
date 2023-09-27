import * as Designhubz from 'designhubz-widget';
import {displayLog} from './logUtils';
import
{
    demo_state,
    demo_videoAuth, demo_progressHandler,
    demo_takeSnaphot, demo_cycleProducts,
    takeSnapshot
} from './snippets';

console.log(...displayLog('Designhubz CCL VTO - SDK features', Designhubz.version));

const searchParams = new URL(location.href).searchParams;
const isLocalDev = location.origin.includes('//localhost:');

/**
 * This project highlights the usage of the Designhubz web SDK for ccl
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
    let tries = 0;
    let productsParam = searchParams.get('products');
    while(productsParam === null && tries++ < 1) productsParam = window.prompt('Please enter products ids \'products=\'');
    if(productsParam === null) return window.prompt(`Demo aborted without params`);

    const productIDs = productsParam.split(',');

    // Handle camera permissions before widget creation
    await demo_videoAuth();

    // Create empty widget
    let widget = await Designhubz.createCCLWidget(container, demo_progressHandler('CCL widget'));
    console.log('widget', widget);
    displayLog('widget loaded');

    if(searchParams.has('configure'))
    {
        await widget.configure();
    }

    // The identifier that can pair this widget session with your collected user stats
    widget.setUserId('1234');

    // Load a product in the widget
    const product = await widget.loadProduct(productIDs[0]);
    console.log('product', product);
    displayLog(`product '${ product.productKey }' loaded`);
    const statusDescription = product.status === undefined ? 'has no status' : `is '${ product.status }'`;
    displayLog(`product '${ product.productKey }' ${statusDescription}`);

    // Common interactions with widget (./snippets.ts)
    demo_takeSnaphot(widget);

    // Dispose of widget
    console.log(`   Press 'd' to dispose of the widget and resources`);
    window.addEventListener('keydown', async ke =>
    {
        if(ke.key === 'd')
        {
            // First stop interacting with widget (this will stop demo_cycleProducts)
            demo_state.active = false;
            await widget.disposeAsync();
            demo();
        }
        else if(ke.key === 'c')
        {
            demo_state.active = false;
            await widget.configure();
        }
    });

    // Take Snapshot Button
    const takeSnapshotBtn = document.createElement('button');
    takeSnapshotBtn.textContent = 'Take Snapshot';
    takeSnapshotBtn.style.cssText = `
    position: absolute;
    left: calc(50% - 100px);
    bottom: 30px;
    width: 200px;
    height: 30px;
    max-width: 90%;
    text-align: center;
    background: white;
    border-radius: 30px;
    cursor: pointer;
    `;
    container.appendChild(takeSnapshotBtn);
    takeSnapshotBtn.addEventListener('click', async ev =>
    {
      await takeSnapshot(widget);
    });
}

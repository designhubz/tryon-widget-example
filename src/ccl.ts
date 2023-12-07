import * as Designhubz from 'designhubz-widget';
import {addItem, displayLog} from './logUtils';
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
    let productsParam = searchParams.get('products');
    if(productsParam === null) productsParam = window.prompt('Please enter products ids \'products=\'');
    if(productsParam === null) return window.prompt(`Demo aborted without params`);

    const productIDs = productsParam.split(',');

    // Handle camera permissions before widget creation
    // await demo_videoAuth();

    // Create empty widget
    let widget = await Designhubz.createCCLWidget(container, demo_progressHandler('CCL widget'))
        .catch( (reason: any) =>
        {
            if(reason === 'NotAllowedError') alert('Camera access denied');
            else alert(`Experience aborted!\n${String(reason)}`);
            return Promise.reject(reason);
        });

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
    const statusDescription = product.status === undefined ? 'has no status' : `is '${ product.status }'`;
    displayLog(`product '${ product.productKey }' ${statusDescription}`);

    let ambientScore = Designhubz.CCLTrackingScore.High;
    const scoreEntries: Record<string, HTMLElement> = {};
    widget.onTrackingScoreChange.Add( score =>
    {
        if(score !== ambientScore)
        {
            const description = score === Designhubz.CCLTrackingScore.High
                ? 'Conditions improved'
                : 'Poor tracking 😑🔆';

            for(const key in scoreEntries) scoreEntries[key].style.transform = 'unset';
            if(scoreEntries[description] === undefined) scoreEntries[description] = addItem(description);
            scoreEntries[description].style.transform = 'scale(1.2)';
            ambientScore = score;
        }
    });

    // Common interactions with widget (./snippets.ts)
    demo_takeSnaphot(widget);

    // Dispose of widget
    console.log(...displayLog(`   Press 'c' to configure the CCL Texture`));
    console.log(...displayLog(`   Press 't' to run VTO on test models`));
    console.log(...displayLog(`   Press 'w' to toggle low tracking quality blur`));
    console.log(...displayLog(`   Press 'd' to dispose of the widget and resources`));
    let configuring = false;
    let trackingHandler: 'auto' | 'off' = 'auto';
    window.addEventListener('keydown', async ke =>
    {
        if(ke.key === 'd')
        {
            // First stop interacting with widget (this will stop demo_cycleProducts)
            demo_state.active = false;
            await widget.disposeAsync();
            // demo();
        }
        else if(ke.key === 'c')
        {
            demo_state.active = false;
            await widget.configure( configuring = ! configuring );
        }
        else if(ke.key === 't')
        {
            demo_state.active = false;
            widget.enableVTOTests();
            displayLog('Setting up ccl "test models"');
        }
        else if(ke.key === 'w')
        {
            widget.setUITrackingWarnings( trackingHandler = trackingHandler === 'auto' ? 'off' : 'auto' );
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

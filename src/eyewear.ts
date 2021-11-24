import * as Designhubz from 'designhubz-widget';
import { 
    demo_state,
    demo_videoAuth, demo_progressHandler, demo_onUserInfoUpdate,
    demo_takeSnaphot, demo_trackingHandler, demo_fetchRecommendations, 
    demo_cycleProducts, demo_switchContext, demo_stats 
} from './snippets';

console.log('Designhubz Eyewear Tryon Demo', Designhubz.version);

export async function demo()
{ 
    // My parameters
    const container = document.getElementById('designhubz-widget-container') as HTMLDivElement;
    const productIDs = ['MP000000006870126', 'MP000000006870001'];

    // Handle camera permissions before widget creation
    await demo_videoAuth();

    // Create empty widget
    let widget = await Designhubz.createEyewearWidget(container, demo_progressHandler('Eyewear widget'));
    console.log('widget', widget);

    // The identifier that can pair this widget session with your collected user stats
    widget.setUserId('1234');

    // Load a product in the widget
    const product = await widget.loadProduct(productIDs[0]);
    console.log('product', product);

    // Widget defaults to 3D mode, this will switch to tryon
    const newContext = await widget.switchContext('tryon', demo_progressHandler('Switching to tryon'));
    console.log(`Context switched to '${newContext}'`);
    
    // Common interactions with widget (./snippets.ts)
    demo_stats(widget);
    demo_onUserInfoUpdate(widget);
    demo_takeSnaphot(widget);
    demo_trackingHandler(widget);
    demo_fetchRecommendations(widget);
    demo_cycleProducts(widget, productIDs, 5000);
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

import * as Designhubz from 'designhubz-widget';
import { 
    demo_state,
    demo_videoAuth, demo_progressHandler,
    demo_takeSnaphot, demo_fetchRecommendations, 
    demo_cycleProducts, demo_trackingHandler 
} from './snippets';

export async function demo()
{
    console.log('Designhubz Makeup Tryon (raw demo)', Designhubz.version);

    // My parameters
    const container = document.getElementById('designhubz-widget-container') as HTMLDivElement;
    // Different test products (no variation constraint)
    const productIDs = ['MP000000008737126', 'MP000000008977078', 'MP000000008827661', 'MP000000009070355'];

    // Handle camera permissions before widget creation
    await demo_videoAuth();

    //  Prepare widget: creates the view
    console.log('Designhubz.createMakeupWidget');
    let widget = await Designhubz.createMakeupWidget(container, demo_progressHandler('Makeup widget'));
    console.log('widget =', widget);

    // Set user id for analytics: prerequisite for further interaction with the widget
    widget.setUserId('1234');

    // Load a product in the widget
    const product = await widget.loadProduct(productIDs[0]);
    console.log('product', product);

    // Common interactions with widget (./snippets.ts)
    demo_takeSnaphot(widget);
    demo_trackingHandler(widget);
    demo_fetchRecommendations(widget);
    demo_cycleProducts(widget, productIDs, 5000);

    // Take a comparison snapshot
    console.log(`   Press 'alt + Enter' for a double snapshot.`);
    window.addEventListener('keydown', async ke =>
    {
        if(ke.code === 'Enter' && ke.altKey)
        {
            // Request and await double snapshot results
            const {snapshot, originalSnapshot} = await widget.takeDoubleSnapshotAsync();

            // Create a canvas that draws both snapshots
            const canvas = document.createElement('canvas');
            canvas.width = snapshot.imageData.width * 2;
            canvas.height = snapshot.imageData.height;
            const context2d = canvas.getContext('2d')!;
            context2d.putImageData(snapshot.imageData, 0, 0);
            context2d.putImageData(originalSnapshot.imageData, snapshot.imageData.width, 0);

            // Create png blob from composited canvas and open it
            const blob = await new Promise<Blob>( resolve => canvas.toBlob( blob => resolve(blob!), 'png') );
            open(URL.createObjectURL(blob), '_blank');
        }
    });

    // Compare with or without products
    let isComparing = false;
    window.addEventListener('keydown', async ke =>
    {
        if(ke.key === 'c')
        {
            isComparing = ! isComparing;

            // 0.5 will hide half the "currently loaded" product
            widget.liveCompare(isComparing ? .5 : 0);
        }
    });

    // Dispose of widget
    console.log(`   Press 'd' to dispose of the widget and resources`);
    window.addEventListener('keydown', async ke =>
    {
        // Stop any interaction with the widget before disposing
        if(ke.key === 'd') await widget.disposeAsync();
    });
}

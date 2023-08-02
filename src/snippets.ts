import * as Designhubz from 'designhubz-widget';
import { displayLog } from './logUtils';

export namespace demo_state
{
    export let active = true;
    export let userInfo: Designhubz.Eyewear.IUserInfo | undefined;
    export let userInfoDisplayed = false;
}

/**
 * This create a 'test' video element and tries to play it (permission already given)
 * If it fails, it will retry with confirmation dialog (user action required to start video)
 */
export async function demo_videoAuth()
{
    const videoElement = document.createElement('video');
    videoElement.style.position ='absolute';
    document.body.prepend(videoElement);

    const tryPlayVideo = () => (navigator as Navigator).mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'user' },
    })
    .then( stream => {
        videoElement.srcObject = stream;
        return stream;
    })
    .then( stream => {
        stream.getTracks().forEach( track => track.stop() );
        videoElement.srcObject = null;
        videoElement.remove();
    });

    return tryPlayVideo()
    .catch( err => {
        if(err instanceof DOMException)
        {
            console.log(err.toString());
            console.log('tryPlayVideo with confirmation');
            if(window.confirm('Allow video access?')) return tryPlayVideo();
        }
        else
        {
            return err;
        }
    });
}

/** Creates a simple progress handler */
export function demo_progressHandler(label: string)
{
    const progressElement = document.getElementById('progress');
    let loggedProgress = '';
    const handler: Designhubz.TProgressCallback = (progress: number) => {
        if(loggedProgress !== progress.toFixed(1))
        {
            loggedProgress = progress.toFixed(1);
            const percent = Math.round(progress * 100);
            if(progressElement !== null) progressElement.style.width = `${percent}%`;
            console.log(`${label}: ${percent}%`);
        }
    };
    return handler;
}

/** Set 'external' stats, from actions that we don't control */
export function demo_stats(widget: Designhubz.IWidget)
{
    // widget.setUserId(userId) is a prerequisite
    widget.setStat(Designhubz.Stat.Whishlisted);
    widget.setStat(Designhubz.Stat.AddedToCart);
    widget.setStat(Designhubz.Stat.SnapshotSaved);
    widget.setStat(Designhubz.Stat.SharedToSocialMedia);
}

/** Take a snapshot of what is currently displayed in widget */
export function demo_takeSnaphot(widget: Designhubz.IWidget)
{
    console.log(...displayLog(`   Press 'Enter' to take a snapshot of the viewer currently`));
    window.addEventListener('keydown', async ke => {
        if(ke.code === 'Enter')
        {
            // requet and await snapshot result
            const snapshot = await widget.takeSnapshotAsync();

            // use the snapshot with helper functions
            // const image = snapshot.createImageElement();
            // const dataURL = snapshot.getDataURL('jpeg', 80);
            const blob = await snapshot.getBlobAsync('jpeg', 80);
            open(URL.createObjectURL(blob), '_blank');
        }
    });
}

/** Fetch recommendations for the currently loaded product */
export async function demo_fetchRecommendations(widget: Designhubz.IEyewearWidget)
{
    const recommendations = await widget.fetchRecommendations(5);
    console.log('recommendations', recommendations);
    displayLog(`recommendations: ${recommendations.map( r => r.productKey ).join(', ') }`);
}

/** React to tracking events */
export function demo_trackingHandler(widget: Designhubz.ITryonwidget)
{
    const update = (status: string, text: string) => console.log(`TrackingStatus [${status}] ${text}`);
    update('none', 'Initializing Tracking');

    widget.onTrackingStatusChange.Once( status => {
        if(status === Designhubz.TrackingStatus.CameraNotFound) update(status, 'Could not find a camera.');
    });

    let faceFoundOnce = false;
    widget.onTrackingStatusChange.Add( status => {
        console.log('demo status:', status);
        switch(status)
        {
            case Designhubz.TrackingStatus.CameraNotFound:
                if(faceFoundOnce) update(status, 'Camera not found or detached');
            break;

            case Designhubz.TrackingStatus.FaceNotFound:
                update(status, faceFoundOnce ? 'Come back...' : 'Use your camera as a mirror!');
            break;

            case Designhubz.TrackingStatus.Analyzing:
                faceFoundOnce = true;
                update(status, 'Detected...');
            break;

            case Designhubz.TrackingStatus.Tracking:
                update(status, 'Tracking...');
            break;

            case Designhubz.TrackingStatus.Idle:
                update(status, 'Idle...');
            break;
        }
    });
}

export function demo_onUserInfoUpdate(widget: Designhubz.IEyewearWidget)
{
    widget.onUserInfoUpdate.Add( userInfo => {
        if(demo_state.userInfoDisplayed === false)
        {
            displayLog(`Got userInfo: ipd = ${userInfo.ipd.toFixed(2)} | eyeSize = ${userInfo.eyeSize.toFixed(2)} (${userInfo.size})`)
            demo_state.userInfoDisplayed = true;
        }
        demo_state.userInfo = userInfo;
        demo_userInfo(userInfo, widget.product);
    });
}

export function demo_userInfo(userInfo: Designhubz.Eyewear.IUserInfo, product: Designhubz.IProduct)
{
    console.log(`Got userInfo: ipd = ${userInfo.ipd.toFixed(2)} | eyeSize = ${userInfo.eyeSize.toFixed(2)} (${userInfo.size})`);

    // Accessing custom product properties as defined in CMS
    const productSize = parseFloat(product.properties['Size Code']!);

    const sizeFeedbackMap = {
        [Designhubz.Eyewear.Size.Small]: 'Small frames will fit you just right!',
        [Designhubz.Eyewear.Size.Medium]: 'Medium frames will fit you better!',
        [Designhubz.Eyewear.Size.Large]: 'Large frames will fit you best!'
    };
    const recommendation = sizeFeedbackMap[userInfo.size];
    switch(userInfo.fit(productSize))
    {
        case Designhubz.Eyewear.Fit.TooSmall:
            console.log('Those frames are too small for you.\n' + recommendation);
        break;

        case Designhubz.Eyewear.Fit.JustRight:
            console.log('Those frames fit you perfectly!');
        break;

        case Designhubz.Eyewear.Fit.TooLarge:
            console.log('Those frames are too large for you.\n' + recommendation);
        break;
    }
}

/** Switch between 3D and Tryon modes */
export function demo_switchContext(widget: Designhubz.IMultiWidget)
{
    console.log(...displayLog(`   Press 'Space' to switch between 3D & Tryon`));
    window.addEventListener('keydown', async ke => {
        if(ke.code === 'Space')
        {
            const newContext = await widget.switchContext();
            console.log('Context switched to ' + newContext);
        }
    });
}

/** Cycles through products */
export async function demo_cycleProducts(
    widget: Designhubz.ITryonwidget,
    products: string[],
    cycleNextDelayMS: number
)
{
    console.log(...displayLog(`'demo_cycleProducts' starts`));

    const showcaseAsync = () => new Promise( r => setTimeout(r, cycleNextDelayMS) );;
    await showcaseAsync();

    let i = 0;
    while(demo_state.active)
    {
        try
        {
            const index = ++i % products.length;
            const showcaseProduct = products[index];
            await widget.loadProduct(showcaseProduct);
            if(i < products.length) console.log(`demo_cycleProducts: ${index}/${products.length} > ${showcaseProduct}`);
            if(demo_state.userInfo !== undefined) demo_userInfo(demo_state.userInfo, widget.product);
            await showcaseAsync();
        }
        catch(err)
        {
            console.warn('Loading error:', err);
            // Then cycle to next product
        }
    }
}


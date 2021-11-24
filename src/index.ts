window.addEventListener('load', e => 
{
    // Read url parameter to switch product demo
    const searchParams = new URL(location.href).searchParams;
    if(searchParams.get('demo') === 'makeup') require('./makeup').demo();
    else require('./eyewear').demo();
});

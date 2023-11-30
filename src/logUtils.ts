
const logDisplay = document.getElementById('logDisplay') as HTMLDivElement;
const searchParams = new URL(location.href).searchParams;
const hideLogs = searchParams.has('devMode') && searchParams.get('devMode')==="false";

if(hideLogs) logDisplay.style.display = "none";

export function displayLog(...args: any[])
{
    const argArray: any[] = Array.from(arguments);
    const p = document.createElement('p');
    p.textContent = argArray.map( arg => typeof arg !== 'string' ? JSON.stringify(arg) : arg ).join(' ');
    logDisplay.appendChild(p);
    return argArray;
};

export function addItem(...args: any[])
{
    const argArray: any[] = Array.from(arguments);
    const p = document.createElement('p');
    p.textContent = argArray.map( arg => typeof arg !== 'string' ? JSON.stringify(arg) : arg ).join(' ');
    logDisplay.appendChild(p);
    return p;
}


const logDisplay = document.getElementById('logDisplay') as HTMLDivElement;
const searchParams = new URL(location.href).searchParams;
const hideLogs = searchParams.has('devMode') && searchParams.get('devMode')==="false";

if(hideLogs) logDisplay.style.display = "none";

export function displayError(label: string, err: any)
{
    let errStr: string;
    if(err instanceof DOMException) errStr = `${err.name}: ${err.message}`;
    else errStr = String(err);
    const div = document.createElement('div');
    div.classList.add('error')
    div.innerHTML = `${label}<br><pre style="white-space: pre-wrap;"><code>${errStr}</code></pre>`;
    logDisplay.appendChild(div);
    return err;
}

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

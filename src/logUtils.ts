
const logDisplay = document.getElementById('logDisplay') as HTMLDivElement;
export function displayLog(...args: any[])
{
    const argArray: any[] = Array.from(arguments);
    const p = document.createElement('p');
    p.textContent = argArray.map( arg => typeof arg !== 'string' ? JSON.stringify(arg) : arg ).join(' ');
    logDisplay.appendChild(p);
    return argArray;
};
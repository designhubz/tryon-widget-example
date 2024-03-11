import * as Designhubz from 'designhubz-widget';

export function demoScreenAnchors(params: {
    widget: Designhubz.ISpatialXRWidget,
    container: HTMLElement,
    offset: number,
    dimensions?: Record<string, number>,
})
{
    const { widget, container, offset, dimensions } = params;
    const controller = widget.displayScreenAnchors({
        offset,
        dimensions,
        // closestY: false,
    });

    controller.screenAnchorsUpdated.Add( update =>
    {
        drawDimensionSegment({
            id: 'width',   start: update.width.start,     end: update.width.end,
            value: dimensions?.width ?? update.width.length,
            container
        });
        drawDimensionSegment({
            id: 'height',  start: update.height.start,    end: update.height.end,
            value: dimensions?.height ?? update.height.length,
            container
        });
        drawDimensionSegment({
            id: 'depth',   start: update.depth.start,     end: update.depth.end,
            value: dimensions?.depth ?? update.depth.length,
            container
        });
    });
}

// #region dummy scaffolding

interface DimensionsDrawController
{
    // reference to svg
    // and other state management

    update(
        start: Designhubz.IScreenAnchor, end: Designhubz.IScreenAnchor,
        label: string
    ): void;
}

function drawCircle () {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
  svg.style.cssText =
    `position: absolute;
    height: 10px;
    width:10px;
    margin-top:-5px;
    margin-left:-5px;
    pointer-events: none;
`;
  svg.setAttribute('viewBox', '0 0 100 100');
  circle.setAttribute('cx', '50');
  circle.setAttribute('cy', '50');
  circle.setAttribute('r', '50');
  circle.setAttribute('fill', '#806BFF');
  svg.appendChild(circle);
  return svg;
}
function drawLine () {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.cssText =
    `position: absolute;
  left: 0px;
  top: 0px;
  height: 100%;
  width: 100%;
  pointer-events: none;
`;

  const line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
  line.setAttribute('stroke', '#806BFF');
  line.setAttribute('stroke-width', '2');
  svg.appendChild(line);
  return svg;
}
function drawLabel () {
  const labelElement = document.createElement('div');
  labelElement.style.cssText =
    `position: absolute;
  background: rgba(255, 255, 255, 0.5);
  padding: 4px;
  font-family: system-ui;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 999;
  border-radius: 8px;
  border: 2px solid #806BFF;
  background: #FFF;
`;
  return labelElement;
}

function createDrawController(container: HTMLElement)
{
    const startPointer = drawCircle();
    const endPointer = drawCircle();
    const line = drawLine();
    const labelElement = drawLabel();
    const controller: DimensionsDrawController = {
        update: (start, end, label) =>
        {
            labelElement.textContent = label;
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            labelElement.style.left = midX.toFixed() + 'px';
            labelElement.style.top = midY.toFixed() + 'px';
            startPointer.style.left = start.x + 'px';
            startPointer.style.top = start.y + 'px';
            endPointer.style.left = end.x + 'px';
            endPointer.style.top = end.y + 'px';
            line.firstElementChild!.setAttribute('x1', start.x.toString());
            line.firstElementChild!.setAttribute('y1', start.y.toString());
            line.firstElementChild!.setAttribute('x2', end.x.toString());
            line.firstElementChild!.setAttribute('y2', end.y.toString());
        },
    };
    container.appendChild(labelElement);
    container.appendChild(startPointer);
    container.appendChild(endPointer);
    container.appendChild(line);
    return controller;
}

const _controllers = new Map<string, DimensionsDrawController>();
function drawDimensionSegment(params: {
    id: string,
    start: Designhubz.IScreenAnchor, end: Designhubz.IScreenAnchor,
    value: number,
    container: HTMLElement,
})
{
    const { id, start, end, value, container } = params;

    // check or create draw state for `id`
    let controller = _controllers.get(id);
    if(controller === undefined)
    {
        _controllers.set(id, controller = createDrawController(container));
    }

    // update:
    // draw svg line from start to end
    // draw svg ellipses on start and end
    // calculate mid point = (start + end ) / 2
    // add label with `value` at mid point
    // controller.update(start, end, `${id}(${value})`);
    controller.update(start, end, `${value} cm`);
}

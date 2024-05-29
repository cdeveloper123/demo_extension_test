export const getElementsByXpath = (path: string): HTMLElement[] => {
    const snapshot = document.evaluate(
      path,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    const elements: HTMLElement[] = [];
    for (let i = 0; i < snapshot.snapshotLength; i++) {
      const element = snapshot.snapshotItem(i);
      if (element instanceof HTMLElement) {
        elements.push(element);
      }
    }
    return elements;
  };
  
  export const waitForElements = (
    xpath: string,
    callback: (elements: HTMLElement[]) => void,
    maxChecks = 50,
    intervalDuration = 500
  ) => {
    let checks = 0;
    const interval = setInterval(() => {
      const elements = getElementsByXpath(xpath);
      if (elements.length > 0 || checks >= maxChecks) {
        clearInterval(interval);
        if (elements.length > 0) {
          callback(elements);
        }
      }
      checks++;
    }, intervalDuration);
  };
  
export function loadJson(): Promise<any> {
  return new Promise((resolve, reject) => {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.className = 'hidden';
    input.onchange = async (e: any) => {
      try {
        resolve(JSON.parse(await e.target!.files[0].text()));
      } catch (e) {
        console.error(e);
        reject(e);
      }
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
}

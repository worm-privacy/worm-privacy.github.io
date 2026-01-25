export function saveJson(data: object, fileName: string) {
  const json = JSON.stringify(data, undefined, 1);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  let link = document.createElement('a');
  link.className = 'hidden';
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

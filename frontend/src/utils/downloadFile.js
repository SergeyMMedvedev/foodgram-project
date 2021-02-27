export default function downloadAsFile(data) {
  const a = document.createElement('a');
  const file = new Blob([data], { type: 'application/text' });
  a.href = URL.createObjectURL(file);
  a.download = 'example.txt';
  a.click();
}

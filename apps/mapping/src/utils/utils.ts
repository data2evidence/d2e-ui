export const saveBlobAs = (obj: Blob, filename: string) => {
  const url = URL.createObjectURL(obj);
  const link = document.createElement("a");
  link.href = url;

  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  if (link.parentNode) link.parentNode.removeChild(link);
};

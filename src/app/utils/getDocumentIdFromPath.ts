export default function getDocumentIdFromPath(reference: string): string {
  // Remove last char if it is a slash
  reference = reference.endsWith('/') ? reference.slice(0, -1) : reference;

  const indexOfLastSlash = reference.lastIndexOf('/');
  return reference.substring(indexOfLastSlash + 1);
}

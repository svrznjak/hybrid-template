export default function getParentDocument(reference: string, n: number): string {
  // Remove last char if it is a slash
  let parentRef = reference.endsWith('/') ? reference.slice(0, -1) : reference;

  for (let i = 0; i < n; i++) {
    const index = parentRef.lastIndexOf('/');
    parentRef = parentRef.substring(0, index);
  }

  return parentRef;
}

import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { reactive } from 'vue';

interface IActiveDocument {
  data: object;
  callbackId: string | undefined;
}
// IActiveDocument as associative array
interface IActiveDocumentAssociative {
  [key: string]: IActiveDocument;
}

const activeDocuments: IActiveDocumentAssociative = reactive({});

export async function useDocument(path: string) {
  if (activeDocuments[path] === undefined) activeDocuments[path] = {} as IActiveDocument;
  if (activeDocuments[path].callbackId === undefined) {
    activeDocuments[path].callbackId = await FirebaseFirestore.addDocumentSnapshotListener(
      {
        reference: path
      },
      (event: any, error: any) => {
        if (error) {
          console.error(error);
        } else {
          activeDocuments[path].data = event.snapshots.map((snap: any) => {
            return {
              id: snap.id,
              ...snap.data
            };
          });
        }
      }
    );
  }
  return activeDocuments[path];
}

export async function unsubscribeFromDocument(path: string) {
  if (activeDocuments[path] === undefined) return;
  if (activeDocuments[path].callbackId === undefined) return;
  await FirebaseFirestore.removeSnapshotListener({
    callbackId: activeDocuments[path].callbackId!
  });
  activeDocuments[path].callbackId = undefined;
}

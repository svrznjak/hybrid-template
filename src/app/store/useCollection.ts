import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { reactive } from 'vue';

interface IActiveCollection {
  data: object;
  callbackId: string | undefined;
}
// IActiveCollection as associative array
interface IActiveCollectionAssociative {
  [key: string]: IActiveCollection;
}

const activeCollections: IActiveCollectionAssociative = reactive({});

export async function useCollection(path: string) {
  if (activeCollections[path] === undefined) activeCollections[path] = {} as IActiveCollection;
  if (activeCollections[path].callbackId === undefined) {
    activeCollections[path].callbackId = await FirebaseFirestore.addCollectionSnapshotListener(
      {
        reference: path
      },
      (event: any, error: any) => {
        if (error) {
          console.error(error);
        } else {
          activeCollections[path].data = event.snapshots.map((snap: any) => {
            return {
              id: snap.id,
              ...snap.data
            };
          });
        }
      }
    );
  }
  return activeCollections[path];
}

export async function unsubscribeFromCollection(path: string) {
  if (activeCollections[path] === undefined) return;
  if (activeCollections[path].callbackId === undefined) return;
  await FirebaseFirestore.removeSnapshotListener({
    callbackId: activeCollections[path].callbackId!
  });
  activeCollections[path].callbackId = undefined;
}

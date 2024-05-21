import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { reactive } from 'vue';
import type { z } from 'zod';

export interface IActiveCollection<dataType> {
  data: dataType[];
  callbackId: string | undefined;
}
// IActiveCollection as associative array
interface IActiveCollectionAssociative {
  [key: string]: IActiveCollection<any>;
}

const activeCollections: IActiveCollectionAssociative = reactive({});

interface zodParserType {
  (data: unknown, params?: Partial<z.ParseParams>);
}

export async function useCollection<dataType>(
  path: string,
  zodParser: zodParserType
): Promise<IActiveCollection<dataType>> {
  if (activeCollections[path] === undefined)
    activeCollections[path] = {} as IActiveCollection<dataType>;
  if (activeCollections[path].callbackId === undefined) {
    activeCollections[path].callbackId = await FirebaseFirestore.addCollectionSnapshotListener(
      {
        reference: path,
        queryConstraints: [
          {
            type: 'orderBy',
            fieldPath: 'name',
            directionStr: 'asc'
          }
        ]
      },
      (event: any, error: any) => {
        if (error) {
          console.error(error);
        } else {
          activeCollections[path].data = event.snapshots.map((snap: any): dataType => {
            return zodParser({ ...snap.data, id: snap.id, path: snap.path });
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

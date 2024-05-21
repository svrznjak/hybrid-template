import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { reactive } from 'vue';
import type { z } from 'zod';

export interface IActiveDocument<dataType> {
  data: dataType;
  callbackId: string | undefined;
}
// IActiveDocument as associative array
export interface IActiveDocumentAssociative {
  [key: string]: IActiveDocument<any>;
}

const activeDocuments: IActiveDocumentAssociative = reactive({});

interface zodParserType {
  (data: unknown, params?: Partial<z.ParseParams>);
}

export async function useDocument<dataType>(
  path: string,
  zodParser: zodParserType
): Promise<IActiveDocument<dataType>> {
  if (activeDocuments[path] === undefined) activeDocuments[path] = {} as IActiveDocument<dataType>;
  if (activeDocuments[path].callbackId === undefined) {
    activeDocuments[path].callbackId = await FirebaseFirestore.addDocumentSnapshotListener(
      {
        reference: path
      },
      (event: any, error: any) => {
        if (error) {
          console.error(error);
        } else {
          const snap = event.snapshot;
          console.log(snap);
          activeDocuments[path].data = zodParser({ ...snap.data, id: snap.id, path: snap.path });
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

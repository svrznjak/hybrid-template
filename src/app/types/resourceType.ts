/**
 * ResourceType types
 */
export interface IResourceType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  typeFields: ITypeField[];
  path: string;
  resources: IResource[];
}

export interface ITypeField {
  id: string;
  name: string;
  rules: string;
  showInList: boolean;
  type: {
    input: IFieldTypes;
    options: string;
  };
}

enum IFieldTypes {
  'text',
  'textarea',
  'number',
  'date',
  'tel',
  'email',
  'select',
  'checkbox',
  'toggle'
}

/**
 * ResourceType validation
 */
import { z } from 'zod';
import { resourceSchema, type IResource } from './resource';

export const typeFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  rules: z.string(),
  showInList: z.boolean(),
  type: z.object({
    input: z.enum([
      'text',
      'textarea',
      'number',
      'date',
      'tel',
      'email',
      'select',
      'checkbox',
      'toggle'
    ]),
    options: z.string()
  })
});

export const resourceTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  isActive: z.boolean(),
  typeFields: z.array(typeFieldSchema),
  path: z.string(),
  resources: z.array(resourceSchema)
});

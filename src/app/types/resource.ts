/**
 * Resource types
 */

export interface IResource {
  id: string;
  name: string;
  isActive: boolean;
  [key: string]: any; // Index signature for dynamic properties
}

export interface IResourceAssociative {
  [resourceId: string]: IResource;
}

/**
 * Resource validation
 */

import { z } from 'zod';

export const resourceSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    isActive: z.boolean()
  })
  .catchall(z.unknown());

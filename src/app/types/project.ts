/**
 * Project types
 */

export interface IProject {
  id: string;
  name: string;
  description: string;
  fromDate: string;
  toDate: string;
  customerName: string;
  status: 'draft' | 'confirmed' | 'finished';
  selectedResources: string[];
  path: string;
}

export interface IProjectAssociative {
  [projectId: string]: IProject;
}

export interface ISelectedResource {
  resourcePath: string;
  fromDate: string;
  toDate: string;
  linkedSelectedResourcesPath: string[];
}

/**
 * Project validation
 */
import { z } from 'zod';

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  fromDate: z.string(),
  toDate: z.string(),
  customerName: z.string(),
  status: z.union([z.literal('draft'), z.literal('confirmed'), z.literal('finished')]),
  selectedResources: z.array(z.string()),
  path: z.string()
});

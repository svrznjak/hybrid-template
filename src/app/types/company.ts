/**
 * Company and related types
 */
import { projectSchema, type IProject } from './project';
import { resourceTypeSchema, type IResourceType } from './resourceType';

export interface ICompany {
  id: string;
  name: string;
  users: IUserRole;
  projects: IProject[] | undefined;
  resourceTypes: IResourceType[] | undefined;
  path: string;
}

export interface ICompanyAssociative {
  [companyId: string]: ICompany;
}

interface IUserRole {
  [userId: string]: 'admin' | 'manager' | 'employee';
}

/**
 * Company validation
 */

import { z } from 'zod';

export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  users: z.record(z.union([z.literal('admin'), z.literal('manager'), z.literal('employee')])),
  projects: z.optional(z.array(projectSchema)),
  resourceTypes: z.optional(z.array(resourceTypeSchema)),
  path: z.string()
});

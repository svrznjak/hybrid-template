export interface ICompany {
  name: string;
  employees: IEmployee[];
  projects: IProject[];
  resourceTypes: IResourceType[];
}
export interface IProject {
  name: string;
  description: string;
  startDate: number;
  endDate: number;
  customer: string;
  status: 'active' | 'completed' | 'draft';
  usedResources: IUsedResource[];
}

export interface IUsedResource {
  resourceTypeId: string;
  resourceId: string;
}

export interface IResourceType {
  id: string;
  name: string;
  description: string;
  typeFields: ITypeField[];
  resources?: [];
}

export interface ITypeField {
  id: string;
  name: string;
  type: IFieldTypes;
  rules: string;
}

enum IFieldTypes {
  'number',
  'text',
  'date',
  'boolean'
}

interface IEmployee {
  name: string;
  role: 'admin' | 'employee';
  uid: string;
}

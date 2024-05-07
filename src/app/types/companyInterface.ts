export interface ICompany {
  name: string;
  users: IUserRole;
  projects: IProject[];
  resourceTypes: IResourceType[];
  path: string;
}

export interface ICompanyAssociative {
  [companyId: string]: ICompany;
}

export interface IProject {
  name: string;
  description: string;
  fromDate: string;
  endDate: string;
  customerName: string;
  status: 'draft' | 'confirmed' | 'finished';
  selectedResource: string[];
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

interface IUserRole {
  [userId: string]: 'admin' | 'manager' | 'employee';
}

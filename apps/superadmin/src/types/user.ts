export interface UserQuery {
  myAccount: User;
}

export interface User {
  userId: string;
  name: string;
}

export interface UserWithRoles {
  userId: string | null;
  userEmail: string;
  roles: string[];
}

export interface UserWithRolesInfo extends UserWithRoles {
  system: string | null;
  tenantId: string | null;
  studyId: string | null;
}

export interface UserGroup {
  id: string;
  userId: string | null;
  email: string | null;
  b2cGroupId: string;
  role: string;
  tenantId: string | null;
  studyId: string | null;
}

export interface UserWithRolesInfoExt {
  userId: string;
  userEmail: string;
  roles: string[];
  tenantId: string;
  tenantName: string;
  system: string;
}

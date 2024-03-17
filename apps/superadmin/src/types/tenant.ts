export interface Tenant {
  id: string;
  name: string;
  system: string;
  features: TenantFeature[];
  customDbName?: string;
}

export type TenantFilterType = Tenant & { show: boolean };

export interface NewTenantInput {
  name: string;
  system: string;
}

export interface TenantFeature {
  feature: string;
}

export interface ReplaceFeaturesInput {
  tenantId: string;
  features: string[];
}

export interface UpdateTenantInput {
  id: string;
  name: string;
}

export interface TenantSystem {
  name: string;
}

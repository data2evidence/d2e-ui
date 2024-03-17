export interface ReplaceSystemFeaturesInput {
  systemName: string;
  features: string[];
}

export interface SystemFeature {
  feature: string;
  system: string;
  enabled: boolean;
}

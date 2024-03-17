import React, { FC, ReactNode } from "react";
import { useQuery } from "@apollo/client";
import { TENANT_ALL_FEATURE } from "../graphql";

interface FeatureGateProps {
  featureFlags: string[];
  tenantIds?: string[];
  children?: ReactNode;
}
export interface Feature {
  feature: string;
  tenantId: string;
}

export const hasFeaturePermission = (
  featuresFlags: string[],
  featuresData: { getAllFeatures: Feature[] } | undefined
): boolean => {
  if (featuresData) {
    const featurePermission: string[] = [];
    featuresData?.getAllFeatures.forEach((data) => {
      featurePermission.push(data.feature);
    });

    const perm = featurePermission.some((r) => featuresFlags.includes(r));
    return perm;
  }
  return false;
};

export const FeatureGate: FC<FeatureGateProps> = (props) => {
  const { featureFlags, tenantIds } = props;
  const { data: featureData } = useQuery<{ getAllFeatures: Feature[] }>(TENANT_ALL_FEATURE, {
    variables: {
      input: {
        tenantIds,
      },
    },
  });

  const displayFeature = hasFeaturePermission(featureFlags, featureData);

  if (!displayFeature) return null;
  return <>{props.children}</>;
};

export const isDev = process.env.NODE_ENV === "development";

export const getRoleChanges = (
  roles: string[],
  currentRoles: string[],
  proposedRoles: string[]
): { grantRoles: string[]; withdrawRoles: string[] } => {
  let grantRoles: string[] = [],
    withdrawRoles: string[] = [];
  for (const role of roles) {
    const isRemove = currentRoles.includes(role) && !proposedRoles.includes(role);
    const isAdd = !currentRoles.includes(role) && proposedRoles.includes(role);

    if (isAdd) {
      grantRoles = [...grantRoles, role];
    } else if (isRemove) {
      withdrawRoles = [...withdrawRoles, role];
    }
  }
  return {
    grantRoles,
    withdrawRoles,
  };
};

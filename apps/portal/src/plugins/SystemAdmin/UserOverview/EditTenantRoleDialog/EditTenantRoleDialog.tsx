import React, { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from "react";
import Divider from "@mui/material/Divider";
import { Button, Dialog, Checkbox } from "@portal/components";
import { UserWithRolesInfoExt, Feedback, CloseDialogType } from "../../../../types";
import { useUserInfo, useUserGroups } from "../../../../contexts/UserContext";
import { Roles, TENANT_ROLES, DATA_ADMIN_ROLES, ALP_ROLES } from "../../../../config";
import { getRoleChanges } from "../../../../utils";
import { api } from "../../../../axios/api";
import "./EditTenantRoleDialog.scss";
import { useTranslation } from "../../../../contexts";

interface EditTenantRoleDialogProps {
  user?: UserWithRolesInfoExt;
  dataAdminUserRoles: string[];
  alpUserRoles: string[];
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
}

const EditTenantRoleDialog: FC<EditTenantRoleDialogProps> = ({
  user,
  dataAdminUserRoles,
  alpUserRoles,
  open,
  onClose,
}) => {
  const { getText, i18nKeys } = useTranslation();
  const { user: userInfo } = useUserInfo();
  const { setUserGroups } = useUserGroups();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({});

  const [newTenantRoles, setNewTenantRoles] = useState<string[]>([]);
  const [newDataAdminRoles, setNewDataAdminRoles] = useState<string[]>([]);
  const [newAlpRoles, setNewAlpRoles] = useState<string[]>([]);

  useEffect(() => {
    setNewTenantRoles(user?.roles || []);
  }, [user]);

  useEffect(() => {
    setNewDataAdminRoles(dataAdminUserRoles || []);
  }, [dataAdminUserRoles]);

  useEffect(() => {
    setNewAlpRoles(alpUserRoles || []);
  }, [alpUserRoles]);

  const availableTenantRoles = useMemo(() => {
    return TENANT_ROLES;
  }, [TENANT_ROLES]);

  const availableDataAdminRoles = useMemo(() => {
    return DATA_ADMIN_ROLES;
  }, [DATA_ADMIN_ROLES]);

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setFeedback({});
      typeof onClose === "function" && onClose(type);
    },
    [onClose]
  );

  const saveDataAdminRoles = useCallback(
    async (user: UserWithRolesInfoExt) => {
      const changes = getRoleChanges(Object.keys(availableDataAdminRoles), dataAdminUserRoles, newDataAdminRoles);

      if (changes.grantRoles.length > 0) {
        await api.userMgmt.registerAlpDataAdminRoles(user.userId, user.system, changes.grantRoles);
      }

      if (changes.withdrawRoles.length > 0) {
        await api.userMgmt.withdrawAlpDataAdminRoles(user.userId, user.system, changes.withdrawRoles);
      }
    },
    [dataAdminUserRoles, newDataAdminRoles]
  );

  const saveAlpUserRoles = useCallback(
    async (user: UserWithRolesInfoExt) => {
      const changes = getRoleChanges(Object.keys(ALP_ROLES), alpUserRoles, newAlpRoles);

      if (changes.grantRoles.length > 0) {
        await api.userMgmt.registerAlpUserRoles(user.userId, changes.grantRoles);
      }

      if (changes.withdrawRoles.length > 0) {
        await api.userMgmt.withdrawAlpUserRoles(user.userId, changes.withdrawRoles);
      }
    },
    [alpUserRoles, newAlpRoles]
  );

  const saveTenantRoles = useCallback(
    async (user: UserWithRolesInfoExt) => {
      const { userId, tenantId, roles } = user;
      const changes = getRoleChanges(Object.keys(availableTenantRoles), roles, newTenantRoles);

      if (changes.grantRoles.length > 0) {
        await api.userMgmt.registerTenantRoles(userId, tenantId, changes.grantRoles);
      }

      if (changes.withdrawRoles.length > 0) {
        await api.userMgmt.withdrawTenantRoles(userId, tenantId, changes.withdrawRoles);
      }
    },
    [newTenantRoles]
  );

  const updateCurrentUserGroups = useCallback(
    async (requestUserId: string) => {
      if (requestUserId === userInfo.userId && userInfo.idpUserId) {
        const userGroups = await api.userMgmt.getUserGroupList(userInfo.idpUserId);
        setUserGroups(userGroups);
      }
    },
    [userInfo, setUserGroups]
  );

  const handleSave = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      await saveTenantRoles(user);
      await saveDataAdminRoles(user);
      await saveAlpUserRoles(user);
      await updateCurrentUserGroups(user.userId);

      handleClose("success");
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, saveTenantRoles, saveDataAdminRoles, saveAlpUserRoles, updateCurrentUserGroups, handleClose]);

  const handleRoleChange = useCallback((event: ChangeEvent<HTMLInputElement>, role: string) => {
    if (event.target.checked) {
      setNewTenantRoles((newTenantRoles) => [...newTenantRoles, role]);
    } else {
      setNewTenantRoles((newTenantRoles) => newTenantRoles.filter((r) => r !== role));
    }
  }, []);

  const handleDataAdminRoleChange = useCallback((event: ChangeEvent<HTMLInputElement>, role: string) => {
    if (event.target.checked) {
      setNewDataAdminRoles((newDataAdminRoles) => [...newDataAdminRoles, role]);
    } else {
      setNewDataAdminRoles((newDataAdminRoles) => newDataAdminRoles.filter((r) => r !== role));
    }
  }, []);

  const handleAlpRoleChange = useCallback((event: ChangeEvent<HTMLInputElement>, role: string) => {
    if (event.target.checked) {
      setNewAlpRoles((newAlpRoles) => [...newAlpRoles, role]);
    } else {
      setNewAlpRoles((newAlpRoles) => newAlpRoles.filter((r) => r !== role));
    }
  }, []);

  const hasChanges = useCallback((): boolean => {
    const changes1 = getRoleChanges(Object.keys(availableTenantRoles), user?.roles || [], newTenantRoles);

    const changes2 = getRoleChanges(Object.keys(ALP_ROLES), alpUserRoles, newAlpRoles);
    const changes3 = getRoleChanges(Object.keys(availableDataAdminRoles), dataAdminUserRoles, newDataAdminRoles);

    return (
      changes1.grantRoles.length > 0 ||
      changes1.withdrawRoles.length > 0 ||
      changes2.grantRoles.length > 0 ||
      changes2.withdrawRoles.length > 0 ||
      changes3.grantRoles.length > 0 ||
      changes3.withdrawRoles.length > 0
    );
  }, [user, newTenantRoles, dataAdminUserRoles, newDataAdminRoles, alpUserRoles, newAlpRoles]);

  return (
    <Dialog
      className="edit-tenant-role-dialog"
      title={getText(i18nKeys.EDIT_TENANT_ROLE_DIALOG__EDIT)}
      closable
      open={open}
      onClose={() => handleClose("cancelled")}
      feedback={feedback}
    >
      <Divider />
      <div className="edit-tenant-role-dialog__content">
        <div className="roles__title">{getText(i18nKeys.EDIT_TENANT_ROLE_DIALOG__ROLES)}</div>
        {userInfo.isUserAdmin && (
          <>
            {Object.keys(availableTenantRoles).map((role) => (
              <Checkbox
                key={role}
                checked={newTenantRoles?.includes(role)}
                checkbox-id={availableTenantRoles[role]}
                disabled={role === Roles.TENANT_VIEWER}
                label={availableTenantRoles[role]}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleRoleChange(event, role)}
              />
            ))}
            <>
              {Object.keys(availableDataAdminRoles).map((role) => (
                <Checkbox
                  key={role}
                  checked={newDataAdminRoles?.includes(role)}
                  checkbox-id={availableDataAdminRoles[role]}
                  label={availableDataAdminRoles[role]}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => handleDataAdminRoleChange(event, role)}
                />
              ))}
            </>
            <>
              {Object.keys(ALP_ROLES).map((role) => (
                <Checkbox
                  key={role}
                  checked={newAlpRoles?.includes(role)}
                  checkbox-id={ALP_ROLES[role]}
                  label={ALP_ROLES[role]}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => handleAlpRoleChange(event, role)}
                />
              ))}
            </>
          </>
        )}
      </div>
      <Divider />
      <div className="button-group-actions">
        <Button
          text={getText(i18nKeys.EDIT_TENANT_ROLE_DIALOG__CANCEL)}
          onClick={() => handleClose("cancelled")}
          variant="secondary"
          block
          disabled={loading}
        />
        <Button
          text={getText(i18nKeys.EDIT_TENANT_ROLE_DIALOG__SAVE)}
          onClick={handleSave}
          block
          loading={loading}
          disabled={!hasChanges()}
        />
      </div>
    </Dialog>
  );
};

export default EditTenantRoleDialog;

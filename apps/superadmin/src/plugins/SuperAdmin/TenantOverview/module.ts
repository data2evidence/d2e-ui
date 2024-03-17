import { SuperAdminPagePlugin } from "@portal/plugin";
import TenantOverview from "./TenantOverview";

export const plugin = new SuperAdminPagePlugin(TenantOverview);

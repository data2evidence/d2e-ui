import React, { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { PageProps, ResearcherStudyMetadata } from "@portal/plugin";
import { Button, Checkbox } from "@portal/components";
import "./KaplanMeier.scss";
import { Box, Drawer, Tab, Tabs, TextField, Typography } from "@mui/material";
import { tabNames } from "./utils/constants";
import { terminologyApi } from "../../../axios/terminology";
import { useDatasets } from "../../../hooks";
import { useTranslation, useUser } from "../../../contexts";

export interface TerminologyProps extends PageProps<ResearcherStudyMetadata> {}

export const KaplanMeier: FC<TerminologyProps> = ({ metadata }: TerminologyProps) => {
  return <div>KM Chart</div>;
};

export default KaplanMeier;

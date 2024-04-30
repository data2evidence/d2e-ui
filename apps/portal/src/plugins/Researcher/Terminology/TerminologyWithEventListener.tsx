import React, { useCallback, useEffect, useState } from "react";
import Terminology, { TerminologyProps } from "./Terminology";
import { useUserInfo } from "../../../contexts/UserContext";
import { FhirValueSetExpansionContainsWithExt } from "./utils/types";

const eventListenerName = "alp-terminology-open";

export const TerminologyWithEventListener = () => {
  const [props, setProps] = useState<TerminologyProps | null>(null);
  const [open, setOpen] = useState(false);
  const tenantId = useUserInfo().user?.tenantId[0];
  const userId = useUserInfo().user?.userId;

  const listener = useCallback((e: Event) => {
    const customEvent = e as CustomEvent<{ props: TerminologyProps }>;
    const eventProps = customEvent.detail.props;
    setProps(eventProps);
    setOpen(true);
    return;
  }, []);

  useEffect(() => {
    // Ensure only one listener is created, and clean up if component is unmounted
    window.addEventListener(eventListenerName, listener);
    return () => {
      window.removeEventListener(eventListenerName, listener);
    };
  }, []);

  if (!tenantId || !userId || !props?.selectedDatasetId) {
    return null;
  }

  return (
    <Terminology
      onClose={(values) => {
        props?.onClose?.(values);
        setOpen(false);
        setProps(null);
        return;
      }}
      baseUserId={userId}
      open={open}
      initialInput={props?.initialInput}
      onConceptIdSelect={(value: FhirValueSetExpansionContainsWithExt) => {
        props?.onConceptIdSelect?.(value);
        setOpen(false);
        return;
      }}
      selectedConceptSetId={props?.selectedConceptSetId}
      isConceptSet={props?.isConceptSet}
      mode={props?.mode}
      selectedDatasetId={props?.selectedDatasetId}
    />
  );
};

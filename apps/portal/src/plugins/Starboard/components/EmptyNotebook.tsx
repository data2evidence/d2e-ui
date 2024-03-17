import { Button } from "@portal/components";
import { PageProps, ResearcherStudyMetadata } from "@portal/plugin";
import React, { FC } from "react";
import "../style/Main.scss";

interface EmptyNotebookProps extends PageProps<ResearcherStudyMetadata> {
  createNotebook: () => void;
  importJupyterNb: (event: any) => Promise<void>;
}

export const EmptyNotebook: FC<EmptyNotebookProps> = ({ createNotebook, importJupyterNb }) => {
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);

  const handleJupyterInput = () => {
    if (hiddenFileInput.current !== null) {
      hiddenFileInput.current.click();
    }
  };

  return (
    <div className="notebook-main">
      <div>
        <h1>ALP Notebook</h1>
        <Button text="Add New Notebook" onClick={createNotebook}></Button>
        <Button className="button-import" text="Import Notebook" onClick={handleJupyterInput}></Button>
        <input
          type="file"
          name="jupyterFile"
          ref={hiddenFileInput}
          onChange={importJupyterNb}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

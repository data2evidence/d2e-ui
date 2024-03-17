import React, { FC } from "react";

export interface LegalPageProps {
  type?: string;
}

const Imprint: FC<LegalPageProps> = ({ type }) => {
  return (
    <>
      {type === "public" && <div className="page-header">Imprint</div>}
      <div className="sub-header">
        <strong>D4L data4life gGmbH</strong>
      </div>
      <div className="content margin-small">
        {`c/o Digital Health Cluster (DHC) im Hasso-Plattner-Institut (HPI)
        Rudolf-Breitscheid-Straße 187
        14482 Potsdam, Germany`}
      </div>

      <div className="content margin-small">
        {`Freephone International: 00800 83646 700
            Freephone USA: 1 888 882 0956`}
      </div>

      <div className="content margin-small">
        Email: <a href={"mailto:" + "we@data4life.help"}>we@data4life.help</a>
      </div>

      <div className="content margin-small">
        {`Managing Director: Christian-Cornelius Weiß 
          Registration Court: Amtsgericht Potsdam 
          Register No.: HRB 30667`}
      </div>

      <div className="content margin-small">
        Responsible for the content pursuant to § 55 para. 2 of the German Interstate Broadcasting Treaty:
      </div>

      <div className="content">D4L data4life gGmbH, address as above</div>
    </>
  );
};

export default Imprint;

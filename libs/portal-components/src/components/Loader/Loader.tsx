import React, { FC } from "react";
import "./Loader.scss";

export interface LoaderProps {
  text?: string;
}

export const Loader: FC<LoaderProps> = ({ text }) => {
  return (
    <div className="alp-loader" data-testid="loader">
      <d4l-spinner />
      {text && <div className="alp-loader__text">{text}</div>}
    </div>
  );
};

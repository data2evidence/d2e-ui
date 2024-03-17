import React, { FC } from "react";
import classNames from "classnames";
import "./Card.scss";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  icon?: React.ComponentClass | React.FunctionComponent;
  borderRadius?: number;
};

export const Card: FC<CardProps> = ({ title, icon: Icon, borderRadius = 8, className, children }) => {
  const classes = classNames("alp-card", { [`${className}`]: !!className });

  return (
    <div className={classes} style={{ borderRadius }} data-testid="card">
      {title && (
        <div
          className="alp-card__header"
          style={{ borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }}
        >
          <div className="alp-card__header-title">
            {Icon && <Icon data-testid="card-icon" />}
            <div className="alp-card__header-title-text" data-testid="card-title">
              {title}
            </div>
          </div>
        </div>
      )}
      <div className="alp-card__content" data-testid="card-content">
        {children}
      </div>
    </div>
  );
};

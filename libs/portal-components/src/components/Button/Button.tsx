import React, { AllHTMLAttributes, forwardRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import classNames from "classnames";
import "./Button.scss";

export type Ref = HTMLButtonElement;

export type ButtonProps = AllHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  loading?: boolean;
  onClick?: (event?: any) => void;
  block?: boolean;
  variant?: "primary" | "secondary" | "tertiary" | "alarm";
};

export const Button = forwardRef<Ref, ButtonProps>(
  ({ loading, className, disabled, block, variant = "primary", onClick, ...props }, ref) => {
    const containerClasses = classNames(
      "alp-button__container",
      { "button--block": block },
      { [`${className}`]: !!className }
    );
    const classes = classNames(
      "alp-button",
      { "button--block": block },
      { [`button--${variant}`]: !!variant },
      { [`${className}`]: !!className }
    );

    return (
      <div className={containerClasses} data-testid="button-container">
        <d4l-button
          //@ts-ignore
          ref={ref}
          classes={classes}
          disabled={loading || disabled}
          data-testid="button"
          {...(!disabled && { onClick })}
          {...props}
        />
        {loading && (
          <CircularProgress size={32} color="inherit" className="alp-button--loading" data-testid="button-loading" />
        )}
      </div>
    );
  }
);

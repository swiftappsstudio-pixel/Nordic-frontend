"use client";
import React from "react";
import {  GenericInputFieldProps } from "@/app/_common/interfaces";

export const GenericInputField: React.FC<GenericInputFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  startIcon,
  endIcon,
  endButton,
  disabled = false,
  inputClassName = "",
  wrapperClassName = "",
  prefix,
  error,
  showError = true,
  errorClassName = "",
}) => {
  const hasError = error && showError;

  return (
    <div className={`flex flex-col mb-4 w-full ${wrapperClassName}`}>
      {/* Label (optional) */}
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Input Field Wrapper */}
      <div className="relative flex items-center">
        {/* Start Icon */}
        {startIcon && !prefix && (
          <span className="absolute left-3 text-gray-400 flex items-center">
            {startIcon}
          </span>
        )}

        {/* Prefix */}
        {prefix && (
          <span className="absolute left-0 bg-gray text-gray-600 flex items-center font-medium bg-gray-50 p-2 rounded-l-md border-r border-l z-10 border-inputFieldBorder">
            {prefix}
          </span>
        )}

        {/* Input */}
        <input
          className={`w-full p-2 border border-inputFieldBorder rounded-md 
            focus:outline-none focus:ring-2 
            ${startIcon && !prefix ? "pl-9" : prefix ? "pl-14" : "pl-3"} 
            ${endIcon || endButton ? "pr-12" : "pr-3"}
            ${hasError 
              ? "border-red-500 focus:ring-red-500" 
              : "border-gray-300 focus:ring-primary"
            }
            ${inputClassName}
          `}
          type={type}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />

        {/* End Icon */}
        {endIcon && (
          <span className="absolute right-3 text-gray-400 flex items-center">
            {endIcon}
          </span>
        )}

        {/* End Button */}
        {endButton && (
          <div className="absolute right-2 flex items-center">{endButton}</div>
        )}
      </div>

      {/* Error Message */}
      {hasError && (
        <p className={`text-red-500 text-sm mt-1 ${errorClassName}`}>
          {error}
        </p>
      )}
    </div>
  );
};

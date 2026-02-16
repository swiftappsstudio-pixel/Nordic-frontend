import React from "react";
import { MdOutlineSimCardDownload } from "react-icons/md";
import { GenericButtonProps } from "@/app/_common/interfaces";
export const PrimaryButton: React.FC<GenericButtonProps> = ({
  color,
  title,
  disabled,
  onPress,
  roundedClass,
  height,
  isLoader,
  textSize,
  paddinhHorizontal,
  paddingVertical,
  marginTop,
  marginInlineEnd,
  marginBottom,
  textColor,
  icon,
  loaderColor,
  btnTextSize,
  btnTextColor,
}) => {
  const heightClass = height ? height : "h-12";
  const buttonClasses = ` disabled:bg-gray-400 ${
    textColor || "text-white"
  } w-full ${heightClass} bg-gradient-to-b  ${
    roundedClass != undefined ? roundedClass : "rounded-lg"
  } ${textSize ? textSize : "text-x-small sm:text-normal"} ${
    paddinhHorizontal || "px-5"
  } ${paddingVertical || "py-2.5"} text-center ${marginTop || "mt-5"} ${
    marginInlineEnd || "me-2"
  } ${marginBottom || "mb-2"} ${color || "bg-primaryColor"}`;

  return (
    <button
      type="button"
      style={{ fontFamily: "br-medium" }}
      className={buttonClasses}
      disabled={disabled}
      onClick={onPress}
    >
      {isLoader ? (
        <div className="flex items-center justify-center">
          <div
            className={`border-4 border-white ${
              loaderColor ? loaderColor : "border-t-[#49f6e1]"
            } rounded-full w-6 h-6 animate-spin flex justify-center items-center`}
          />
        </div>
      ) : (
        <>
          {icon ? (
            <div className="flex flex-row items-center justify-center gap-2">
              {/* <span className={`icon-download text-black text-xxlarge`}></span> */}
              <MdOutlineSimCardDownload size={25} />

              <p className="text-white text-small sm:text-large font-medium mt-[2px]">
                {title}
              </p>
            </div>
          ) : (
            <p
              className={`${btnTextColor ? btnTextColor : "text-white"} ${
                btnTextSize || "text-xxsmall sm:text-normal"
              }  font-medium`}
            >
              {title}
            </p>
          )}
        </>
      )}
    </button>
  );
};

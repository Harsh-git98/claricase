import React from "react";

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  const { width = 120, height = 120, ...rest } = props;

  return (
    <svg
      {...rest}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="rounded">
          <rect width={width} height={height} rx="50" ry="50" />
        </clipPath>
      </defs>

      <image
        href="/claricase.svg"
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid meet"
        clipPath="url(#rounded)"
      />
    </svg>
  );
};

export default LogoIcon;

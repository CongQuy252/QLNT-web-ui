import * as React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const PlusRoom = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width={size}
        height={size}
        fill="currentColor"
        strokeWidth={4}
        className={className}
        {...props}
      >
        <g
          transform="translate(0,512) scale(0.1,-0.1)"
          strokeWidth={4}
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <path
            d="M120 4035 l0 -1085 1605 0 1605 0 0 1085 0 1085 -1605 0 -1605 0 0
-1085z m1970 415 l0 -160 -365 0 -365 0 0 160 0 160 365 0 365 0 0 -160z"
          />

          <path
            d="M120 1555 l0 -1085 1290 0 c870 0 1290 3 1290 10 0 6 -11 38 -25 73
-66 161 -100 364 -92 551 11 268 97 526 244 734 104 146 301 325 443 404 l60
33 0 182 0 183 -1605 0 -1605 0 0 -1085z m1970 480 l0 -155 -365 0 -365 0 0
155 0 155 365 0 365 0 0 -155z"
          />

          <path
            d="M3820 2099 c-219 -25 -432 -125 -595 -280 -189 -180 -296 -398 -326
-664 -40 -357 128 -731 430 -954 407 -302 997 -254 1360 110 133 132 228 298
278 484 23 89 26 118 26 260 0 141 -3 172 -26 257 -98 366 -372 650 -728 752
-85 24 -246 47 -311 45 -18 -1 -67 -5 -108 -10z m280 -699 l0 -190 200 0 200
0 0 -155 0 -155 -200 0 -200 0 0 -190 0 -190 -155 0 -155 0 0 190 0 190 -200
0 -200 0 0 155 0 155 200 0 200 0 0 190 0 190 155 0 155 0 0 -190z"
          />
        </g>
      </svg>
    );
  },
);

PlusRoom.displayName = 'MyIcon';

export default PlusRoom;

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface GridLoaderIconProps extends React.SVGAttributes<SVGSVGElement> {}

export const GridLoaderIcon = React.forwardRef<
    SVGSVGElement,
    GridLoaderIconProps
>(({ className, ...props }, ref) => {
    return (
        <svg
            viewBox="0 0 105 105"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn('size-4', className)}
            ref={ref}
            {...props}
        >
            <title>Grid Loader</title>
            <circle cx="12.5" cy="12.5" r="12.5">
                <animate
                    attributeName="fill-opacity"
                    begin="0s"
                    dur="1s"
                    values="1;.2;1"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
            </circle>
            <circle cx="12.5" cy="52.5" r="12.5" fillOpacity=".5">
                <animate
                    attributeName="fill-opacity"
                    begin="100ms"
                    dur="1s"
                    values="1;.2;1"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
            </circle>
            <circle cx="52.5" cy="12.5" r="12.5">
                <animate
                    attributeName="fill-opacity"
                    begin="300ms"
                    dur="1s"
                    values="1;.2;1"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
            </circle>
            <circle cx="52.5" cy="52.5" r="12.5">
                <animate
                    attributeName="fill-opacity"
                    begin="600ms"
                    dur="1s"
                    values="1;.2;1"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
            </circle>
            <circle cx="92.5" cy="12.5" r="12.5">
                <animate
                    attributeName="fill-opacity"
                    begin="800ms"
                    dur="1s"
                    values="1;.2;1"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
            </circle>
            <circle cx="92.5" cy="52.5" r="12.5">
                <animate
                    attributeName="fill-opacity"
                    begin="400ms"
                    dur="1s"
                    values="1;.2;1"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
            </circle>
            <circle cx="12.5" cy="92.5" r="12.5">
                <animate
                    attributeName="fill-opacity"
                    begin="700ms"
                    dur="1s"
                    values="1;.2;1"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
            </circle>
            <circle cx="52.5" cy="92.5" r="12.5">
                <animate
                    attributeName="fill-opacity"
                    begin="500ms"
                    dur="1s"
                    values="1;.2;1"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
            </circle>
            <circle cx="92.5" cy="92.5" r="12.5">
                <animate
                    attributeName="fill-opacity"
                    begin="200ms"
                    dur="1s"
                    values="1;.2;1"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
            </circle>
        </svg>
    );
});

export interface PuffLoaderIconProps extends React.SVGAttributes<SVGSVGElement> {}

export const PuffLoaderIcon = React.forwardRef<
    SVGSVGElement,
    PuffLoaderIconProps
>(({ className, ...props }, ref) => {
    return (
        <svg
            viewBox="0 0 44 44"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            strokeWidth="2"
            className={cn('size-4', className)}
            ref={ref}
            {...props}
        >
            <title>Puff Loader</title>
            <g fill="none" fillRule="evenodd">
                <circle cx="22" cy="22" r="1">
                    <animate
                        attributeName="r"
                        begin="0s"
                        dur="1.8s"
                        values="1; 20"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.165, 0.84, 0.44, 1"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="stroke-opacity"
                        begin="0s"
                        dur="1.8s"
                        values="1; 0"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.3, 0.61, 0.355, 1"
                        repeatCount="indefinite"
                    />
                </circle>
                <circle cx="22" cy="22" r="1">
                    <animate
                        attributeName="r"
                        begin="-0.9s"
                        dur="1.8s"
                        values="1; 20"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.165, 0.84, 0.44, 1"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="stroke-opacity"
                        begin="-0.9s"
                        dur="1.8s"
                        values="1; 0"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.3, 0.61, 0.355, 1"
                        repeatCount="indefinite"
                    />
                </circle>
            </g>
        </svg>
    );
});

export interface OrbitLoaderIconProps extends React.SVGAttributes<SVGSVGElement> {}

export const OrbitLoaderIcon = React.forwardRef<
    SVGSVGElement,
    OrbitLoaderIconProps
>(({ className, ...props }, ref) => {
    return (
        <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-4', className)}
            ref={ref}
            {...props}
        >
            <title>Orbit Loader</title>
            <circle
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                cx="50"
                cy="50"
                r="44"
                style={{ opacity: 0.5 }}
            />
            <circle
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="3"
                cx="8"
                cy="54"
                r="6"
            >
                <animateTransform
                    attributeName="transform"
                    dur="2s"
                    type="rotate"
                    from="0 50 48"
                    to="360 50 52"
                    repeatCount="indefinite"
                />
            </circle>
        </svg>
    );
});

export interface SnakeLoaderIconProps extends React.SVGAttributes<SVGSVGElement> {}

export const SnakeLoaderIcon = React.forwardRef<
    SVGSVGElement,
    SnakeLoaderIconProps
>(({ className, ...props }, ref) => {
    return (
        <svg
            viewBox="0 14 32 4"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            fill="currentColor"
            className={cn('size-4', className)}
            ref={ref}
            {...props}
        >
            <title>Snake Loader</title>
            <path
                opacity={0.8}
                transform="translate(0 0)"
                d="M2 14 V18 H6 V14z"
            >
                <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0 0; 24 0; 0 0"
                    dur="2s"
                    begin="0"
                    repeatCount="indefinite"
                    keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                    calcMode="spline"
                />
            </path>
            <path
                opacity={0.5}
                transform="translate(0 0)"
                d="M0 14 V18 H8 V14z"
            >
                <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0 0; 24 0; 0 0"
                    dur="2s"
                    begin="0.1s"
                    repeatCount="indefinite"
                    keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                    calcMode="spline"
                />
            </path>
            <path
                opacity={0.25}
                transform="translate(0 0)"
                d="M0 14 V18 H8 V14z"
            >
                <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0 0; 24 0; 0 0"
                    dur="2s"
                    begin="0.2s"
                    repeatCount="indefinite"
                    keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                    calcMode="spline"
                />
            </path>
        </svg>
    );
});

export interface TwoBodyLoaderIconProps extends React.SVGAttributes<SVGSVGElement> {}

export const TwoBodyLoaderIcon = React.forwardRef<
    SVGSVGElement,
    TwoBodyLoaderIconProps
>(({ className, ...props }, ref) => {
    return (
        <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn('size-4', className)}
            ref={ref}
            {...props}
        >
            <title>Two Body Loader</title>
            <defs>
                <filter id="spinner-gF01">
                    <feGaussianBlur
                        in="SourceGraphic"
                        stdDeviation="1"
                        result="y"
                    />
                    <feColorMatrix
                        in="y"
                        mode="matrix"
                        values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7"
                        result="z"
                    />
                    <feBlend in="SourceGraphic" in2="z" />
                </filter>
            </defs>
            <g filter="url(#spinner-gF01)">
                <circle cx="5" cy="12" r="4">
                    <animate
                        attributeName="cx"
                        calcMode="spline"
                        dur="2s"
                        values="5;8;5"
                        keySplines=".36,.62,.43,.99;.79,0,.58,.57"
                        repeatCount="indefinite"
                    />
                </circle>
                <circle cx="19" cy="12" r="4">
                    <animate
                        attributeName="cx"
                        calcMode="spline"
                        dur="2s"
                        values="19;16;19"
                        keySplines=".36,.62,.43,.99;.79,0,.58,.57"
                        repeatCount="indefinite"
                    />
                </circle>
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    dur="0.75s"
                    values="0 12 12;360 12 12"
                    repeatCount="indefinite"
                />
            </g>
        </svg>
    );
});

GridLoaderIcon.displayName = 'GridLoaderIcon';
PuffLoaderIcon.displayName = 'PuffLoaderIcon';
OrbitLoaderIcon.displayName = 'OrbitLoaderIcon';
SnakeLoaderIcon.displayName = 'SnakeLoaderIcon';
TwoBodyLoaderIcon.displayName = 'TwoBodyLoaderIcon';

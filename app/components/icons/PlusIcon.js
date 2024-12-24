"use client";

const PlusIcon = ({ size = 24, strokeWidth = 1.5, color = 'currentColor', ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={strokeWidth}
            stroke={color}
            width={size}
            height={size}
            className="icon"
            {...props}
        >

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
            />
        </svg>
    );
};

export default PlusIcon;

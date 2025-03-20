'use client';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
}

export default function Label({ children, className, ...props }: LabelProps) {
    return (
        <label {...props} className={`block text-gray-300 ${className || ''}`}>
            {children}
        </label>
    );
}

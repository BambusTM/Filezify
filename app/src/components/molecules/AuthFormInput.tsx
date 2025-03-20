'use client';
import Label from '../atoms/Label';
import Input from '../atoms/Input';
import {ChangeEvent} from "react";

interface AuthFormInputProps {
    id: string;
    name: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    label: string;
    autoComplete?: string;
}

export default function AuthFormInput({
                                          id,
                                          name,
                                          type,
                                          placeholder,
                                          value,
                                          onChange,
                                          label,
                                          autoComplete,
                                      }: AuthFormInputProps) {
    return (
        <div>
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                required
            />
        </div>
    );
}

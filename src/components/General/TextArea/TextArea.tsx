import './TextArea.scss';
import React, { useEffect, useState } from 'react';
interface IProps {
    readonly label: string;
    readonly value?: string;
    readonly onChange: (value: string) => void;
    readonly className?: string;
}
export const TextArea: React.FC<IProps> = ({ className, label, onChange, value }: IProps): React.ReactElement => {
    const [internalValue, setInternalValue] = useState<string>();
    const [classNameArray, setClassNameArray] = useState<string[]>(['spg-textarea']);
    useEffect((): void => {
        setInternalValue(value);
    }, [value]);

    useEffect((): void => {
        setClassNameArray(['spg-textarea', ...(!!className ? [className] : []), ...(!!internalValue ? ['spg-textarea--has-value'] : [])]);
    }, [internalValue]);

    function onChangeTextArea(event: React.ChangeEvent<HTMLTextAreaElement>): void {
        onChange(event.target.value);
        setInternalValue(event.target.value);
    }
    return (
        <div className={classNameArray.join(' ')}>
            <textarea placeholder="" className="spg-textarea__input" onChange={onChangeTextArea} value={internalValue} rows={3} />
            <span className="spg-textarea__label">{label}</span>
        </div>
    );
};

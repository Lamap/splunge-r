import './DashboardImageEditor.scss';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { ISpgImage } from 'splunge-common-lib';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material';
import { ImageDateType } from '../../enums/ImageDateType';

interface IProps {
    readonly image?: ISpgImage;
    readonly saveImage: (updatedImage: ISpgImage) => void;
}
export const DashboardImageEditor: React.FC<IProps> = ({ image, saveImage }: IProps): React.ReactElement => {
    // TODO: introduce formik? handle savings, error handling invalid texts
    // TODO: use date picker
    const [editedImage, setEditedImage] = useState<ISpgImage | undefined>();
    const [dateType, setDateType] = useState<ImageDateType>(ImageDateType.EXACT);
    useEffect((): void => {
        setEditedImage(image);
    }, [image]);
    function closeEditImage(): void {
        setEditedImage(undefined);
    }
    function updateEditedImage(target: string, value: string): void {
        if (!editedImage) {
            return;
        }
        setEditedImage({
            ...editedImage,
            [target]: value,
        });
    }
    function onDateTypeChanged(event: ChangeEvent<HTMLInputElement>): void {
        console.log((event.target as HTMLInputElement).value);
        setDateType(event.target.value as ImageDateType);
    }
    function saveEditedImage(): void {
        if (!!editedImage) {
            saveImage(editedImage);
        }
        setEditedImage(undefined);
    }

    return (
        <div className="spg-image-editor">
            <Dialog open={!!editedImage} onClose={closeEditImage} maxWidth={'xl'}>
                <DialogTitle>Edit the selected image</DialogTitle>
                <DialogContent>
                    <div className="spg-image-editor__content">
                        <img className="spg-image-editor__image" src={image?.url} alt={image?.url} />
                        <div className="spg-image-editor__form">
                            <div className={'spg-image-editor__title'}>
                                <TextField
                                    className={'spg-image-editor__title-field'}
                                    label={'Title'}
                                    size={'small'}
                                    variant={'standard'}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>): void => updateEditedImage('title', event.target.value)}
                                    defaultValue={image?.title}
                                />
                            </div>

                            <FormControl onChange={onDateTypeChanged}>
                                <FormLabel id="date-type-group-label">Date type</FormLabel>
                                <RadioGroup row name={'date-type'} defaultValue={ImageDateType.EXACT}>
                                    <FormControlLabel value={ImageDateType.EXACT} control={<Radio />} label="Exact" />
                                    <FormControlLabel value={ImageDateType.RANGE} control={<Radio />} label="Range" />
                                </RadioGroup>
                            </FormControl>
                            <div>
                                <span className={'spg-image-editor__start-date-field'}>
                                    <TextField label={dateType !== ImageDateType.RANGE ? 'Date' : 'Start date'} variant={'standard'} size={'small'} />
                                </span>

                                {dateType === ImageDateType.RANGE && <TextField label={'End date'} variant={'standard'} size={'small'} />}
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={saveEditedImage} variant={'contained'}>
                        Save
                    </Button>
                    <Button onClick={closeEditImage}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
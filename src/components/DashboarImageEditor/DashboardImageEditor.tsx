import './DashboardImageEditor.scss';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { DateFormat, IDateInformation, ISpgImage } from 'splunge-common-lib';
import {
    Alert,
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
import { useTranslation } from 'react-i18next';
import { TextArea } from '../General/TextArea/TextArea';

interface IProps {
    readonly image?: ISpgImage;
    readonly saveImage: (updatedImage: ISpgImage) => void;
}
export const DashboardImageEditor: React.FC<IProps> = ({ image, saveImage }: IProps): React.ReactElement => {
    // TODO: introduce formik? handle savings, error handling invalid texts
    // TODO: use date picker
    const [editedImage, setEditedImage] = useState<ISpgImage | undefined>();
    const [dateError, setDateError] = useState<string>();

    const { t } = useTranslation('common');

    useEffect((): void => {
        setEditedImage(image);
    }, [image]);

    useEffect((): void => {
        validateDate(editedImage?.date);
    }, [editedImage?.date]);

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
        if (!editedImage) {
            return;
        }
        setEditedImage({
            ...editedImage,
            date: {
                ...editedImage?.date,
                start: editedImage?.date?.start || 0,
                type: event.target.value as DateFormat,
            },
        });
    }
    function onDateStartChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        if (!editedImage) {
            return;
        }
        setEditedImage({
            ...editedImage,
            date: {
                ...(editedImage.date || { type: DateFormat.EXACT }),
                start: event.target.value as unknown as number,
            },
        });
    }
    function onDateEndChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        if (!editedImage) {
            return;
        }
        setEditedImage({
            ...editedImage,
            date: {
                ...(editedImage.date || { type: DateFormat.EXACT }),
                start: editedImage.date?.start || 0,
                end: event.target.value as unknown as number,
            },
        });
    }

    // TODO: if we would have more fields to validate we should use Yup
    function validateDate(date?: IDateInformation): void {
        if (!!date && date.type === DateFormat.RANGE && !date.end) {
            return setDateError(t('dashboardImageEditor.missingEndDate') || '');
        }
        if (!!date && date.type === DateFormat.RANGE && !!date.end && date.start > date.end) {
            return setDateError(t('dashboardImageEditor.invalidDateRange') || '');
        }
        setDateError(undefined);
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
                <DialogTitle>{t('dashboardImageEditor.header')}</DialogTitle>
                <DialogContent>
                    <div className="spg-image-editor__content">
                        <img className="spg-image-editor__image" src={image?.url} alt={image?.url} />
                        <div className="spg-image-editor__form">
                            <div className={'spg-image-editor__title'}>
                                <TextField
                                    className={'spg-image-editor__title-field'}
                                    label={t('dashboardImageEditor.titleLabel')}
                                    size={'small'}
                                    variant={'standard'}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>): void => updateEditedImage('title', event.target.value)}
                                    defaultValue={image?.title}
                                />
                            </div>
                            <div className={'spg-image-editor__description'}>
                                <TextArea
                                    label={t('dashboardImageEditor.descriptionLabel')}
                                    onChange={(value: string): void => updateEditedImage('description', value)}
                                    value={image?.description}
                                ></TextArea>
                            </div>

                            <FormControl onChange={onDateTypeChanged}>
                                <FormLabel id="date-type-group-label">{t('dashboardImageEditor.dateTypeLabel')}</FormLabel>
                                <RadioGroup row name={'date-type'} defaultValue={image?.date?.type || DateFormat.EXACT}>
                                    <FormControlLabel value={DateFormat.EXACT} control={<Radio />} label={t('dashboardImageEditor.dateTypeExact')} />
                                    <FormControlLabel value={DateFormat.RANGE} control={<Radio />} label={t('dashboardImageEditor.dateTypeRange')} />
                                </RadioGroup>
                            </FormControl>
                            <div className={'spg-image-editor__dates'}>
                                <span className={'spg-image-editor__start-date-field'}>
                                    <TextField
                                        label={
                                            editedImage?.date?.type !== DateFormat.RANGE
                                                ? t('dashboardImageEditor.dateLabel')
                                                : t('dashboardImageEditor.startDateLabel')
                                        }
                                        variant={'standard'}
                                        size={'small'}
                                        type={'number'}
                                        defaultValue={editedImage?.date?.start}
                                        onChange={onDateStartChanged}
                                    />
                                </span>

                                {editedImage?.date?.type === DateFormat.RANGE && (
                                    <TextField
                                        label={t('dashboardImageEditor.endDateLabel')}
                                        variant={'standard'}
                                        size={'small'}
                                        type={'number'}
                                        defaultValue={editedImage?.date?.end}
                                        onChange={onDateEndChanged}
                                    />
                                )}
                            </div>
                            {!!dateError && <Alert severity={'error'}>{dateError}</Alert>}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={saveEditedImage} variant={'contained'} disabled={!!dateError}>
                        {t('general.save')}
                    </Button>
                    <Button onClick={closeEditImage}>{t('general.cancel')}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

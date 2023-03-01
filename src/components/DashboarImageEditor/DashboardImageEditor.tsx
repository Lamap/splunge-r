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
    const [dateType, setDateType] = useState<ImageDateType>(ImageDateType.EXACT);
    const { t } = useTranslation('common');

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
                                <RadioGroup row name={'date-type'} defaultValue={ImageDateType.EXACT}>
                                    <FormControlLabel
                                        value={ImageDateType.EXACT}
                                        control={<Radio />}
                                        label={t('dashboardImageEditor.dateTypeExact')}
                                    />
                                    <FormControlLabel
                                        value={ImageDateType.RANGE}
                                        control={<Radio />}
                                        label={t('dashboardImageEditor.dateTypeRange')}
                                    />
                                </RadioGroup>
                            </FormControl>
                            <div>
                                <span className={'spg-image-editor__start-date-field'}>
                                    <TextField
                                        label={
                                            dateType !== ImageDateType.RANGE
                                                ? t('dashboardImageEditor.dateLabel')
                                                : t('dashboardImageEditor.startDateLabel')
                                        }
                                        variant={'standard'}
                                        size={'small'}
                                    />
                                </span>

                                {dateType === ImageDateType.RANGE && (
                                    <TextField label={t('dashboardImageEditor.endDateLabel')} variant={'standard'} size={'small'} />
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={saveEditedImage} variant={'contained'}>
                        {t('general.save')}
                    </Button>
                    <Button onClick={closeEditImage}>{t('general.cancel')}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

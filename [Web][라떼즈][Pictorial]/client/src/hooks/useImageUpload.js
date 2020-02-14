import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { uploadImage, initImage } from '../modules/imageUpload'

export default function useImageUpload() {
  const encodedImg = useSelector((state) => state.imageUpload.encodedImg);
  const answer = useSelector((state) => state.imageUpload.answer);
  const status = useSelector((state) => state.imageUpload.status);
  const possibles = useSelector((state) => state.imageUpload.possibles);
  const dispatch = useDispatch();

  const onUploadImage = useCallback(
    (name, code, image) => dispatch(uploadImage(name, code, image)),
    [dispatch]
  );

  const onInitImage = useCallback(
    () => dispatch(initImage()),
    [dispatch]
  );

  return {
    encodedImg, answer, status, possibles,
    onUploadImage, onInitImage,
  };
}
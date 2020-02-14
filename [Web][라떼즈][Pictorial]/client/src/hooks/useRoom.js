import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchRoomCode, connectRoom, setName, setCode, checkRoomCode, setRound, setTimeLimit, setMemberList, imageReady } from '../modules/room'

export default function useRoom() {
  const name = useSelector((state) => state.room.name);
  const code = useSelector((state) => state.room.code);
  const round = useSelector((state) => state.room.round);
  const timeLimit = useSelector((state) => state.room.timeLimit);
  const connected = useSelector((state) => state.room.connected);
  const errorMsg = useSelector((state) => state.room.errorMsg);
  const memberList = useSelector((state) => state.room.memberList);
  const images = useSelector((state) => state.room.images);
  
  const dispatch = useDispatch();

  const onFetchRoomID = useCallback(
    (name) => dispatch(fetchRoomCode(name)),
    [dispatch]
  );
  
  const onConnectRoom = useCallback(
    (name, code) => dispatch(connectRoom(name, code)),
    [dispatch]
  );

  const onSetName = useCallback(
    (name) => dispatch(setName(name)),
    [dispatch]
  );

  const onSetCode = useCallback(
    (code) => dispatch(setCode(code)),
    [dispatch]
  );

  const onCheckRoomCode = useCallback(
    (code) => dispatch(checkRoomCode(code)),
    [dispatch]
  );

  const onSetRound = useCallback(
    (round) => dispatch(setRound(round)),
    [dispatch]
  );

  const onSetTimeLimit = useCallback(
    (time) => dispatch(setTimeLimit(time)),
    [dispatch]
  );

  const onSetMemberList = useCallback(
    (list) => dispatch(setMemberList(list)),
    [dispatch]
  );

  const onImageReady = useCallback(
    (code) => dispatch(imageReady(code)),
    [dispatch]
  );

  return {
    name, code, errorMsg, round, timeLimit, connected, memberList, images,
    onFetchRoomID,
    onConnectRoom,
    onSetName, onSetCode, onSetRound, onSetTimeLimit,
    onCheckRoomCode, onSetMemberList, onImageReady
  };
}
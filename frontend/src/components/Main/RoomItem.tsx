import { Cookies } from 'react-cookie';
import { useSocket } from '../../context/MyContext';
import { Socket } from 'socket.io-client';

const RoomItem = ({
  id,
  name,
  description,
  total,
}: {
  id: string;
  name: string;
  description: string;
  total: string;
}) => {
  const socket: Socket = useSocket()!;
  const cookies = new Cookies();

  const joinRoom = (e: React.MouseEvent<HTMLElement>) => {
    socket.emit('redundancyCheck', { userID: cookies.get('userID'), roomID: id });
  };

  return (
    <div className={'room'} onClick={joinRoom} key={id}>
      <p className="room-name">{name}</p>
      <p className="room-description">{description}</p>
      <p>{total}</p>
    </div>
  );
};

export default RoomItem;

function Title({ name = "Title", singer = "Singer" }: { name: string | undefined; singer: string | undefined }) {
  return (
    <div className="musicplayer-title-area">
      <span className="musicplayer-title">{name}</span>
      <span className="musicplayer-subtitle">{singer}</span>
    </div>
  );
}

export default Title;
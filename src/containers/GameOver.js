const containerStyle = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center"
};

export const GameOver = (props) => {
  return (
    <div style={containerStyle}>
      <h2>Game Over</h2>
      <h3>{`You scored ${props.score}`}</h3>
    </div>
  );
};

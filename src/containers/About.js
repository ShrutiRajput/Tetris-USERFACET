const containerStyle = {
  display: "flex",
  flex: 1,
  flexDirection: "row",
  textAlign: "center",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0px 20px",
  backgroundColor: "#3367d6",
  color: "#fff",
  fontFamily: "Roboto",
  fontSize: "1rem",
  fontWeight: "600"
};

export const About = (props) => {
  return (
    <div style={containerStyle}>
      <h3>{`Score : ${props.score}`}</h3>
      <h3>{`Timer : `}</h3>
    </div>
  );
};

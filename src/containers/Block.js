import { COLORS, blockSize } from "../config/config";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center",
  margin: 0,
  padding: 0,
  borderRadius: 0,
  minWidth: 10,
  minHeight: 10,
  height: blockSize(),
  width: blockSize()
};

const buttonStyle = {
  border: "1px solid black",
  padding: 0
};

const buttonContentStyle = {
  display: "flex",
  flex: 1,
  height: "100%",
  width: "100%",
  flexDirection: "column",
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center"
};

const mainTextStyle = {
  fontFamily: "'Roboto', sans-serif",
  color: "#ffffff",
  fontSize: 9,
  fontWeight: 600
};

const subTextStyle = {
  display: "none"
};

export const Block = (props) => {
  const { letter, pos, onLetterClick } = props;

  const _onBlockClick = () => {
    if (letter && onLetterClick) {
      onLetterClick(letter);
    }
  };

  let buttonBackgroundColor;
  if (letter) {
    buttonBackgroundColor = letter.moving ? COLORS.MOVING : COLORS.NOTMOVING;
    if (letter.isWord) buttonBackgroundColor = COLORS.POSSIBLE_WORD;
  }

  return (
    <button
      style={{
        ...containerStyle,
        ...buttonStyle,
        backgroundColor: buttonBackgroundColor
      }}
      onClick={_onBlockClick}
    >
      <div style={buttonContentStyle}>
        {letter && <span style={mainTextStyle}>{letter.letter}</span>}
        {process.env.NODE_ENV !== "production" && (
          <span style={subTextStyle}>
            {" "}
            {pos && pos.x && pos.y ? `${pos.x},${pos.y}` : ""}
          </span>
        )}
      </div>
    </button>
  );
};

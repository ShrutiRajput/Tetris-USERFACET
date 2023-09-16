import { Block } from "./Block";
import { numberOfRow } from "../config/config";

const containerStyle = {
  display: "flex",
  flexDirection: "column"
};

export const Column = (props) => {
  const { letters, columnId, onLetterClick } = props;

  const getLetterOnBlock = (bId) => {
    if (letters) {
      for (let i = 0; i < letters.length; i++) {
        if (letters[i].pos.y === bId) {
          return letters[i];
        }
      }
    }

    return undefined;
  };

  const getBlocks = () => {
    let blocks = [];
    for (let i = 0; i < numberOfRow; i++) {
      const _letterOnBlock = getLetterOnBlock(i);
      const blockStyle = {
        key: `block${i}`,
        onLetterClick: onLetterClick,
        pos: { x: columnId, y: i },
        letter: _letterOnBlock
      };
      blocks.push(<Block {...blockStyle} />);
    }
    return blocks;
  };

  return <div style={containerStyle}>{getBlocks()}</div>;
};

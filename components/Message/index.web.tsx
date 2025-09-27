import React, { ComponentProps } from "react";
import Content from "./Content";

type Props = ComponentProps<typeof Content> & {
  onDeleteMessage: (id: string) => Promise<void>;
};

const Message: React.FC<Props> = ({ onDeleteMessage, ...props }) => {
  return (
    <>
      <Content {...props} />
    </>
  );
};

export default Message;

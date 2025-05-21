import { IconButton, type IconButtonProps } from "@chakra-ui/react";
import { memo, type FC } from "react";
import { MdEdit } from "react-icons/md";

type Props = IconButtonProps;

const EditIconButtonComponent: FC<Props> = (props) => {
  return <IconButton icon={<MdEdit />} {...props} />;
};

export const EditIconButton = memo(EditIconButtonComponent);
EditIconButton.displayName = "EditIconButton";

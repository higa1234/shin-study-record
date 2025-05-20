import { IconButton, type IconButtonProps } from "@chakra-ui/react";
import { memo, type FC } from "react";
import { FaTrash } from "react-icons/fa";

type Props = IconButtonProps;

const DeleteIconButtonComponent: FC<Props> = (props) => {
  return <IconButton icon={<FaTrash />} {...props} />;
};

export const DeleteIconButton = memo(DeleteIconButtonComponent);
DeleteIconButton.displayName = "DeleteIconButton";

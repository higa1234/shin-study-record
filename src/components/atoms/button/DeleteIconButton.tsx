import { IconButton, type IconButtonProps } from "@chakra-ui/react";
import { memo, type FC } from "react";
import { FaTrash } from "react-icons/fa";

type Props = IconButtonProps;

const DeleteIconButtonComponent: FC<Props> = (props) => {
  return (
    <IconButton
      variant="ghost"
      _hover={{
        boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)", // 青っぽいグロー
        borderColor: "blue.200",
      }}
      icon={<FaTrash />}
      {...props}
    />
  );
};

export const DeleteIconButton = memo(DeleteIconButtonComponent);
DeleteIconButton.displayName = "DeleteIconButton";

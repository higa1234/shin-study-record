import { IconButton, type IconButtonProps } from "@chakra-ui/react";
import { memo, type FC } from "react";
import { MdEdit } from "react-icons/md";

type Props = IconButtonProps;

const EditIconButtonComponent: FC<Props> = (props) => {
  return (
    <IconButton
      variant="ghost"
      _hover={{
        boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)", // 青っぽいグロー
        borderColor: "blue.200",
      }}
      icon={<MdEdit />}
      {...props}
    />
  );
};

export const EditIconButton = memo(EditIconButtonComponent);
EditIconButton.displayName = "EditIconButton";

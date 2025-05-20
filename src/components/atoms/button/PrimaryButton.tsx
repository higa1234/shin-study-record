import { Button, type ButtonProps } from "@chakra-ui/react";
import { memo, type FC } from "react";

type Props = ButtonProps;

const PrimaryButtonComponent: FC<Props> = (props) => {
  return <Button {...props} />;
};

export const PrimaryButton = memo(PrimaryButtonComponent);
PrimaryButton.displayName = "PrimaryButton";

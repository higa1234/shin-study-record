import { Button, type ButtonProps } from "@chakra-ui/react";
import { memo, type FC } from "react";

type Props = ButtonProps;

const PrimaryButtonComponent: FC<Props> = (props) => {
  return (
    <Button
      size={{ base: "md", md: "lg" }}
      mx={{ base: 4, md: 8 }}
      mt={{ base: 4, md: 8 }}
      colorScheme="blue"
      {...props}
    />
  );
};

export const PrimaryButton = memo(PrimaryButtonComponent);
PrimaryButton.displayName = "PrimaryButton";

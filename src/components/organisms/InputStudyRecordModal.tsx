import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  onClickRegister: (title: string, time: number) => Promise<boolean>;
  getAllStudyRecordsData: () => void;
};

type Inputs = {
  studyTitle: string;
  studyTime: number;
};

export const InputStudyRecordModal: FC<Props> = (props) => {
  const { onClickRegister, getAllStudyRecordsData } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const success = await onClickRegister(
      data.studyTitle,
      Number(data.studyTime)
    );
    if (success) {
      reset();
      onClose();
      await getAllStudyRecordsData();
    }
  };

  return (
    <>
      <Button onClick={onOpen}>新規登録</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader data-testid="modal-header">新規登録</ModalHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <Stack>
                <Text>学習内容</Text>
                <Input
                  type="text"
                  placeholder="学習内容"
                  {...register("studyTitle", {
                    required: "内容の入力は必須です",
                  })}
                ></Input>
                <Text>{errors.studyTitle && errors.studyTitle.message}</Text>

                <Text>学習時間</Text>
                <Input
                  type="number"
                  placeholder="学習時間"
                  {...register("studyTime", {
                    required: "時間の入力は必須です",
                    validate: (value) =>
                      value > 0 || "時間は0以上である必要があります",
                  })}
                ></Input>
                <Text>{errors.studyTime && errors.studyTime.message}</Text>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button type="submit" colorScheme="blue" mr={3}>
                登録
              </Button>
              <Button colorScheme="gray" mr={3} onClick={onClose}>
                キャンセル
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

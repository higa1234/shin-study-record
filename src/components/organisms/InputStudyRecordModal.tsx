import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { memo, useEffect, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { ModalMode } from "../../domain/modal";
import type { StudyRecord } from "../../domain/studyRecords";

type Props = {
  onClickRegister: (title: string, time: number) => Promise<boolean>;
  onClickUpdate: (is: string, title: string, time: number) => Promise<boolean>;
  getAllStudyRecordsData: () => void;
  isOpen: boolean;
  onClose: () => void;
  modalMode: ModalMode;
  studyRecord: StudyRecord;
};

type Inputs = {
  studyTitle: string;
  studyTime: number;
};

const InputStudyRecordModalComponent: FC<Props> = (props) => {
  const {
    onClickRegister,
    onClickUpdate,
    getAllStudyRecordsData,
    isOpen,
    onClose,
    modalMode,
    studyRecord,
  } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Inputs>();

  // 登録ボタン押下時の処理
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { studyTitle, studyTime } = data;
    let success = false;
    console.log(data);

    // 新規登録の場合
    if (modalMode === ModalMode.CREATE) {
      success = await onClickRegister(studyTitle, Number(studyTime));
    }

    // 編集の場合
    if (modalMode === ModalMode.EDIT) {
      success = await onClickUpdate(
        studyRecord.id,
        studyTitle,
        Number(studyTime)
      );
    }

    if (success) {
      reset();
      onClose();
      await getAllStudyRecordsData();
    }
  };

  // 初回実行
  useEffect(() => {
    reset(); // フォームの値をリセット

    // 編集の場合
    if (modalMode === ModalMode.EDIT) {
      setValue("studyTitle", studyRecord.title ?? "");
      setValue("studyTime", studyRecord.time);
    }
  }, [modalMode, studyRecord]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader data-testid="modal-header">
            {modalMode === ModalMode.CREATE ? "新規登録" : "編集"}
          </ModalHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <Stack>
                <FormControl isInvalid={!!errors.studyTitle}>
                  <FormLabel>学習内容</FormLabel>
                  <Input
                    type="text"
                    placeholder="学習内容"
                    {...register("studyTitle", {
                      required: "内容の入力は必須です",
                    })}
                  ></Input>
                  <FormErrorMessage>
                    {errors.studyTitle && errors.studyTitle.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.studyTime}>
                  <FormLabel>学習時間</FormLabel>
                  <Input
                    type="number"
                    placeholder="学習時間"
                    {...register("studyTime", {
                      required: "時間の入力は必須です",
                      validate: (value) =>
                        value > 0 || "時間は0以上である必要があります",
                    })}
                  ></Input>
                  <FormErrorMessage>
                    {errors.studyTime && errors.studyTime.message}
                  </FormErrorMessage>
                </FormControl>
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

export const InputStudyRecordModal = memo(InputStudyRecordModalComponent);
InputStudyRecordModal.displayName = "InputStudyRecordModal";

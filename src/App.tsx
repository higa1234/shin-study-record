import {
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Box,
  Container,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useAllStudyRecords } from "./hooks/useAllStudyRecords";
import { useInputStudyRecord } from "./hooks/useInputStudyRecord";
import { InputStudyRecordModal } from "./components/organisms/InputStudyRecordModal";
import { DeleteIconButton } from "./components/atoms/button/DeleteIconButton";
import { useDeleteStudyRecord } from "./hooks/useDeleteStudyRecord";
import { EditIconButton } from "./components/atoms/button/EditIconButton";
import { PrimaryButton } from "./components/atoms/button/PrimaryButton";
import { ModalMode } from "./domain/modal";
import { StudyRecord } from "./domain/studyRecords";
import { useUpdateStudyRecord } from "./hooks/useUpdateStudyRecord";

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { getAllStudyRecordsData, studyRecords, loading } =
    useAllStudyRecords();
  const { onClickRegister } = useInputStudyRecord();
  const { onClickDelete } = useDeleteStudyRecord();
  const { onClickUpdate } = useUpdateStudyRecord();

  // ステート
  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.CREATE); // モーダルのモード(編集 or 新規登録)
  const [editTarget, setEditTarget] = useState<StudyRecord>({
    id: "",
    title: "",
    time: 0,
  }); // 編集対象のstudyRecordの値の取得用

  // 削除ボタンのハンドル
  const handleDelete = async (id: string) => {
    const success = await onClickDelete(id);
    if (success) {
      await getAllStudyRecordsData(); // App 側から明示的に呼ぶ
    }
  };

  // 初回実行（学習記録リスト取得）
  useEffect(() => {
    getAllStudyRecordsData();
  }, []);

  if (loading) {
    return <p data-testid="loading">Loading...</p>;
  }

  return (
    <>
      <Container maxW="container.lg" centerContent>
        <Box w="100%" p={8}>
          <Stack spacing={4}>
            <Heading size={{ base: "xl", md: "2xl" }} textAlign={"center"}>
              シン・学習記録アプリ
            </Heading>
            <Box w="75%" textAlign="right">
              <PrimaryButton
                onClick={() => {
                  setModalMode(ModalMode.CREATE);
                  onOpen();
                }}
              >
                新規登録
              </PrimaryButton>
            </Box>
            <InputStudyRecordModal
              isOpen={isOpen}
              onClose={onClose}
              onClickRegister={onClickRegister}
              onClickUpdate={onClickUpdate}
              getAllStudyRecordsData={getAllStudyRecordsData}
              modalMode={modalMode}
              studyRecord={editTarget}
            />
            <TableContainer w={{ base: "fit-content", md: "100%" }} mx="auto">
              <Table variant="simple" data-testid="table">
                <Thead>
                  <Tr>
                    <Th textAlign="center">学習内容</Th>
                    <Th textAlign="center">学習時間</Th>
                    <Th></Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {studyRecords.map((studyRecord) => (
                    <Tr key={studyRecord.id}>
                      <Td textAlign="center">{studyRecord.title}</Td>
                      <Td textAlign="center">{studyRecord.time}</Td>
                      <Td>
                        <EditIconButton
                          aria-label="編集"
                          onClick={() => {
                            setModalMode(ModalMode.EDIT);
                            onOpen();
                            setEditTarget(studyRecord);
                          }}
                        />
                      </Td>
                      <Td>
                        <DeleteIconButton
                          aria-label="削除"
                          onClick={() => handleDelete(studyRecord.id)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Stack>
        </Box>
      </Container>
    </>
  );
}

export default App;

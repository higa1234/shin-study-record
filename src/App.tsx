import {
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect } from "react";

import { useAllStudyRecords } from "./hooks/useAllStudyRecords";
import { useInputStudyRecord } from "./hooks/useInputStudyRecord";
import { InputStudyRecordModal } from "./components/organisms/InputStudyRecordModal";
import { DeleteIconButton } from "./components/atoms/button/DeleteIconButton";
import { useDeleteStudyRecord } from "./hooks/useDeleteStudyRecord";

function App() {
  const { getAllStudyRecordsData, studyRecords, loading } =
    useAllStudyRecords();
  const { onClickRegister } = useInputStudyRecord();
  const { onClickDelete } = useDeleteStudyRecord();

  // 削除ボタンのハンドル
  const handleDelete = async (id: string) => {
    const success = await onClickDelete(id);
    if (success) {
      await getAllStudyRecordsData(); // App 側から明示的に呼ぶ
    }
  };

  useEffect(() => {
    getAllStudyRecordsData();
  }, []);

  if (loading) {
    return <p data-testid="loading">Loading...</p>;
  }

  return (
    <>
      <Heading>シン・学習記録アプリ</Heading>
      <InputStudyRecordModal
        onClickRegister={onClickRegister}
        getAllStudyRecordsData={getAllStudyRecordsData}
      />
      <TableContainer>
        <Table variant="simple" data-testid="table">
          <Thead>
            <Tr>
              <Th>学習内容</Th>
              <Th>学習時間</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {studyRecords.map((studyRecord) => (
              <Tr key={studyRecord.id}>
                <Td>{studyRecord.title}</Td>
                <Td>{studyRecord.time}</Td>
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
    </>
  );
}

export default App;

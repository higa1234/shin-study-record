import { useCallback, useState } from "react";

import type { StudyRecord } from "../domain/studyRecords";
import { getAllStudyRecords } from "../libs/studyRecords";

export const useAllStudyRecords = () => {
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getAllStudyRecordsData = useCallback(async () => {
    const studyRecordsData = await getAllStudyRecords();
    setStudyRecords(studyRecordsData);
    setLoading(false);
  }, []);

  return { getAllStudyRecordsData, studyRecords, loading };
};

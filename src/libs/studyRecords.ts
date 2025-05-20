import type { PostgrestError } from "@supabase/supabase-js";

import { StudyRecord } from "../domain/studyRecords";
import { supabase } from "../utils/supabase";

export async function getAllStudyRecords(): Promise<StudyRecord[]> {
  // supabaseの"study-record"テーブルから全件取得
  const response = await supabase.from("study-record").select("*");

  // 取得結果エラー
  if (response.error) {
    throw new Error(response.error.message);
  }

  const studyRecordsData = response.data.map((record) => {
    return new StudyRecord(record.id, record.title, record.time);
  });

  return studyRecordsData;
}

export async function insertStudyRecord(
  title: string,
  time: number
): Promise<{ error: PostgrestError | null }> {
  const { error } = await supabase
    .from("study-record")
    .insert({ title: title, time: time });
  return { error };
}

export async function deleteStudyRecordById(
  id: string
): Promise<{ error: PostgrestError | null }> {
  const { error } = await supabase.from("study-record").delete().eq("id", id);
  return { error };
}

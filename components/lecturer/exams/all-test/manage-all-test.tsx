import FinalExamList from "@/components/lecturer/exams/all-test/final-exam/final-exam-list"
import EntryTestList from "./entry-test/entry-test-list"

export default function ManageAllTest() {
  return (
    <div className="flex flex-col gap-8">
      <EntryTestList />
      <FinalExamList />
    </div>
  )
}
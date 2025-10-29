import EntryTestList from "./entry-test/entry-test-list"
import OtherTestList from "./other-test-list"

export default function ManageAllTest() {
  return (
    <div className="flex flex-col gap-8">
      <EntryTestList />
      <OtherTestList />
    </div>
  )
}
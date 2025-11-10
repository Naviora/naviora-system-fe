import { apiClient } from '@/lib/api/client'
import type { EntryTestDto } from '@/hooks/api/principal/use-entry-tests'

export const entryTestService = {
  /**
   * Update an entry test
   */
  async updateEntryTest(
    entryTestId: string,
    data: Partial<EntryTestDto>
  ): Promise<EntryTestDto> {
    return apiClient.patch<EntryTestDto>(
      `/entry-test/${entryTestId}`,
      data
    )
  }
}

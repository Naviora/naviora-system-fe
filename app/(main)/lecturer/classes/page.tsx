'use client';

import { useState } from 'react';
import { ClassCard } from '@/components/lecturer/classes/class-card';
import { ClassFilters } from '@/components/lecturer/classes/class-filters';
import { CreateClassDialog } from '@/components/lecturer/classes/create-class-dialog';
import { useClasses } from '@/hooks/api/use-classes';
import { ClassType } from '@/types/api/class';
import { LoadingSpinner } from '@/components/ui/loading';
import { Empty } from '@/components/ui/empty';
import { Button } from '@/components/ui/button';

export default function ClassesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ClassType | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useClasses({
    page: currentPage,
    limit: 12,
    q: searchQuery || undefined,
    class_type: selectedType === 'all' ? undefined : selectedType,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleTypeFilter = (type: ClassType | 'all') => {
    setSelectedType(type);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const classes = data?.classes || [];
  const pagination = data?.pagination;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
          <p className="text-muted-foreground mt-1">
            Manage your classes and students
          </p>
        </div>
        <CreateClassDialog />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <ClassFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          classType={selectedType}
          onClassTypeChange={handleTypeFilter}
        />
      </div>

      {/* Classes Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : classes.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((classItem) => (
              <ClassCard key={classItem.class_id} classData={classItem} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.total_pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.total_pages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <Empty
          title="No classes found"
          description={
            searchQuery || selectedType !== 'all'
              ? 'Try adjusting your filters to find classes'
              : 'Get started by creating your first class'
          }
        />
      )}
    </div>
  );
}

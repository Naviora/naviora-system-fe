import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/fade-slide-scale";
import { Search, Home, ArrowLeft, Compass } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      <FadeIn className='max-w-2xl w-full text-center space-y-8'>
        {/* 404 Illustration */}
        <div className='relative'>
          <div className='text-[120px] sm:text-[200px] font-bold text-greyscale-100 leading-none'>
            404
          </div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-20 h-20 bg-primary-0 rounded-full flex items-center justify-center shadow-container'>
              <Compass className='w-10 h-10 text-primary' />
            </div>
          </div>
        </div>

        {/* Error Title & Description */}
        <div className='space-y-4'>
          <h1 className='heading-2 text-foreground'>Trang không tìm thấy</h1>
          <p className='body-large-regular text-muted-foreground max-w-md mx-auto'>
            Trang bạn đang tìm kiếm có thể đã được di chuyển, đổi tên hoặc không
            tồn tại.
          </p>
        </div>

        {/* Search Suggestion */}
        <div className='bg-secondary rounded-lg p-6 space-y-4'>
          <div className='flex items-center justify-center space-x-2 text-muted-foreground'>
            <Search className='w-5 h-5' />
            <span className='body-medium-semibold'>Có thể bạn đang tìm:</span>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <Link href='/'>
              <div className='p-3 bg-background rounded-lg border border-border hover:border-primary transition-colors group cursor-pointer'>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-primary-0 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors'>
                    <Home className='w-4 h-4' />
                  </div>
                  <div className='text-left'>
                    <div className='body-small-semibold text-foreground'>
                      Trang chủ
                    </div>
                    <div className='body-xsmall-regular text-muted-foreground'>
                      Quay về trang chính
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href='/about'>
              <div className='p-3 bg-background rounded-lg border border-border hover:border-primary transition-colors group cursor-pointer'>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-primary-0 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors'>
                    <Compass className='w-4 h-4' />
                  </div>
                  <div className='text-left'>
                    <div className='body-small-semibold text-foreground'>
                      Về chúng tôi
                    </div>
                    <div className='body-xsmall-regular text-muted-foreground'>
                      Tìm hiểu thêm
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Button asChild size='lg' className='min-w-[140px]'>
            <Link href='/' className='flex items-center space-x-2'>
              <Home className='w-4 h-4' />
              <span>Về trang chủ</span>
            </Link>
          </Button>

          <Button
            variant='outline'
            onClick={() => window.history.back()}
            className='flex items-center space-x-2 min-w-[140px]'
            size='lg'
          >
            <ArrowLeft className='w-4 h-4' />
            <span>Quay lại</span>
          </Button>
        </div>

        {/* Help Text */}
        <div className='pt-6 border-t border-border'>
          <p className='body-small-regular text-muted-foreground'>
            Nếu bạn tin rằng đây là lỗi, vui lòng{" "}
            <Link href='/contact' className='text-primary hover:underline'>
              liên hệ với chúng tôi
            </Link>
            .
          </p>
        </div>
      </FadeIn>
    </div>
  );
}

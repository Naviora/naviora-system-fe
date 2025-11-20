import { FaRegQuestionCircle } from "react-icons/fa"

export default function HelpPage() {
  return (
    <div className="max-w-6xl mx-auto bg-greyscale-0 rounded shadow-lg p-8 mt-10 border border-greyscale-100">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-primary/10 rounded-full p-3">
          <FaRegQuestionCircle className="text-primary text-3xl" />
        </div>
        <h1 className="text-3xl font-bold text-primary tracking-tight">Trợ giúp & Hướng dẫn</h1>
      </div>
      <div className="space-y-8 text-greyscale-700">
        <section>
          <h2 className="text-xl font-semibold mb-2 text-primary">1. Giới thiệu</h2>
          <p className="leading-relaxed">
            Trang này cung cấp thông tin hướng dẫn sử dụng hệ thống <span className="font-bold text-primary">Naviora</span> và giải đáp các thắc mắc thường gặp. Nếu bạn gặp khó khăn trong quá trình sử dụng, hãy tham khảo các mục bên dưới hoặc liên hệ hỗ trợ.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2 text-primary">2. Các câu hỏi thường gặp</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <span className="font-semibold text-greyscale-900">Đăng nhập hệ thống như thế nào?</span>
              <div className="text-greyscale-600 ml-1">Sử dụng tài khoản được cấp để đăng nhập tại trang chủ.</div>
            </li>
            <li>
              <span className="font-semibold text-greyscale-900">Làm sao để đổi mật khẩu?</span>
              <div className="text-greyscale-600 ml-1">
                Vào mục <span className="font-medium text-primary">Tài khoản</span> &rarr; <span className="font-medium text-primary">Đổi mật khẩu</span>.
              </div>
            </li>
            <li>
              <span className="font-semibold text-greyscale-900">Làm sao xem kết quả bài kiểm tra?</span>
              <div className="text-greyscale-600 ml-1">
                Vào mục <span className="font-medium text-primary">Kết quả</span> trong trang cá nhân.
              </div>
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2 text-primary">3. Liên hệ hỗ trợ</h2>
          <div className="bg-greyscale-25 rounded-lg p-4 flex flex-col gap-2 border border-greyscale-100">
            <span>Nếu bạn cần thêm trợ giúp, vui lòng liên hệ:</span>
            <ul className="pl-4">
              <li>
                <span className="font-medium">Email:</span>{" "}
                <a href="mailto:support@naviora.edu.vn" className="text-primary underline hover:text-primary-600 transition">
                  support@naviora.edu.vn
                </a>
              </li>
              <li>
                <span className="font-medium">Hotline:</span>{" "}
                <span className="font-semibold text-primary">0123 456 789</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
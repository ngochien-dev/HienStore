import { Shield, Eye, Lock, Globe } from 'lucide-react'

export const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-3xl space-y-12 animate-fade-in font-sans">
      {/* Header */}
      <section className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
          Chính Sách Bảo Mật Thông Tin
        </h1>
        <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Cập nhật lần cuối: Tháng 5, 2026</p>
        <div className="w-12 h-1 bg-indigo-500 rounded-full" />
      </section>

      {/* Main Content */}
      <section className="prose dark:prose-invert text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-8">
        <p>
          HienStore tôn trọng và cam kết bảo vệ quyền riêng tư cá nhân của khách hàng. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin khi bạn truy cập website HienStore.
        </p>

        {/* 1. Thu thập thông tin */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
            <Eye size={18} className="text-indigo-500" />
            1. Phạm vi thu thập thông tin
          </h2>
          <p>Để thực hiện giao dịch mua sắm, chúng tôi thu thập các thông tin sau từ khách hàng:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Họ và tên, địa chỉ email, số điện thoại liên hệ.</li>
            <li>Địa chỉ nhận hàng chi tiết phục vụ quá trình bàn giao hàng hóa.</li>
            <li>Thông tin lịch sử mua hàng, danh sách giỏ hàng.</li>
          </ul>
        </div>

        {/* 2. Sử dụng thông tin */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
            <Globe size={18} className="text-indigo-500" />
            2. Mục đích sử dụng thông tin
          </h2>
          <p>Thông tin thu thập được chỉ sử dụng cho các mục đích nội bộ sau:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Xác nhận đơn hàng và liên hệ vận chuyển giao sản phẩm cho khách hàng.</li>
            <li>Hỗ trợ khách hàng trong các sự cố phát sinh như lỗi đơn hàng, hoàn tiền, đổi trả.</li>
            <li>Gửi email giới thiệu bộ sưu tập mới hoặc chương trình ưu đãi giảm giá (chỉ khi có sự đồng ý của khách hàng).</li>
          </ul>
        </div>

        {/* 3. Bảo mật giao dịch VNPay */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
            <Lock size={18} className="text-indigo-500" />
            3. Bảo mật thông tin thanh toán VNPay
          </h2>
          <p>
            Mọi giao dịch thanh toán trực tuyến qua cổng VNPay đều được mã hóa theo các tiêu chuẩn bảo mật quốc tế khắt khe nhất (SSL/TLS). HienStore **không** lưu trữ trực tiếp bất kỳ thông tin tài khoản ngân hàng, số thẻ hay mã OTP nào của khách hàng trên máy chủ của chúng tôi.
          </p>
        </div>

        {/* 4. Cam kết bảo mật */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
            <Shield size={18} className="text-indigo-500" />
            4. Cam kết không chia sẻ thông tin
          </h2>
          <p>
            HienStore cam kết tuyệt đối không bán, cho thuê hay trao đổi thông tin khách hàng cho bất kỳ bên thứ ba nào khác vì mục đích thương mại. Chúng tôi chỉ cung cấp thông tin liên hệ và địa chỉ giao hàng cho đối tác vận chuyển chuyên trách của hãng nhằm mục đích duy nhất là thực hiện giao đơn hàng.
          </p>
        </div>
      </section>
    </div>
  )
}

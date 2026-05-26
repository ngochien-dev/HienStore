import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react'

export const ShippingPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-3xl space-y-12 animate-fade-in font-sans">
      {/* Header */}
      <section className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
          Chính Sách Giao Hàng
        </h1>
        <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Cập nhật lần cuối: Tháng 5, 2026</p>
        <div className="w-12 h-1 bg-indigo-500 rounded-full" />
      </section>

      {/* Main Content */}
      <section className="prose dark:prose-invert text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-8">
        <p>
          HienStore luôn nỗ lực đem lại dịch vụ giao hàng nhanh chóng, chuyên nghiệp nhất tới quý khách. Dưới đây là thông tin chi tiết về chính sách vận chuyển của chúng tôi.
        </p>

        {/* 1. Phương thức vận chuyển */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
            <Truck size={18} className="text-indigo-500" />
            1. Các phương thức vận chuyển
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-100 font-heading text-sm">Giao hàng Hỏa Tốc (2H)</span>
              <p className="text-xs text-slate-500">Áp dụng cho khu vực nội thành TP. Hồ Chí Minh. Nhận hàng ngay trong 2 giờ kể từ khi duyệt đơn.</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-100 font-heading text-sm">Giao hàng Tiêu Chuẩn</span>
              <p className="text-xs text-slate-500">Áp dụng toàn quốc. Thời gian giao hàng dao động từ 2 - 3 ngày làm việc tuỳ khu vực.</p>
            </div>
          </div>
        </div>

        {/* 2. Chi phí giao hàng */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
            <ShieldCheck size={18} className="text-indigo-500" />
            2. Biểu phí giao hàng
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Miễn phí vận chuyển</strong>: Áp dụng cho mọi đơn hàng có giá trị thanh toán từ <strong>500.000 ₫</strong> trở lên trên phạm vi toàn quốc.</li>
            <li><strong>Đơn hàng dưới 500.000 ₫</strong>: Phí giao hàng tiêu chuẩn đồng giá là <strong>30.000 ₫</strong>.</li>
            <li><strong>Phí giao hàng Hỏa tốc 2h</strong>: Đồng giá <strong>50.000 ₫</strong>.</li>
          </ul>
        </div>

        {/* 3. Thời gian xử lý đơn */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
            <Clock size={18} className="text-indigo-500" />
            3. Thời gian xử lý đơn hàng
          </h2>
          <p>
            Đơn hàng đặt trước 17:00 hàng ngày sẽ được đóng gói và bàn giao cho đơn vị vận chuyển ngay trong ngày. Đơn đặt sau 17:00 sẽ được xử lý vào ngày làm việc tiếp theo.
          </p>
        </div>

        {/* 4. Nhận hàng & Đồng kiểm */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
            <MapPin size={18} className="text-indigo-500" />
            4. Chính sách đồng kiểm khi nhận hàng
          </h2>
          <p>
            Nhằm bảo vệ quyền lợi tối đa của khách hàng, HienStore áp dụng chính sách <strong>ĐỒNG KIỂM</strong>. Khi nhận hàng, quý khách được quyền mở hộp kiểm tra đúng mẫu mã, màu sắc, size trước khi thực hiện thanh toán tiền mặt cho nhân viên giao hàng hoặc ký xác nhận.
          </p>
        </div>
      </section>
    </div>
  )
}

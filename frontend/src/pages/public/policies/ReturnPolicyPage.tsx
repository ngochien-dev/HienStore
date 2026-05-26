import { RefreshCw, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react'

export const ReturnPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-3xl space-y-12 animate-fade-in font-sans">
      {/* Header */}
      <section className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
          Chính Sách Đổi Trả 24H
        </h1>
        <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Cập nhật lần cuối: Tháng 5, 2026</p>
        <div className="w-12 h-1 bg-indigo-500 rounded-full" />
      </section>

      {/* Main Content */}
      <section className="prose dark:prose-invert text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-8">
        <p>
          HienStore cam kết mang lại sự an tâm tuyệt đối cho khách hàng khi mua sắm. Với chính sách đổi trả hàng linh hoạt trong vòng 24 giờ, chúng tôi sẵn sàng hỗ trợ bạn khi sản phẩm không vừa size hoặc phát sinh lỗi từ nhà sản xuất.
        </p>

        {/* 1. Điều kiện đổi trả */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
            <CheckCircle size={18} className="text-indigo-500" />
            1. Điều kiện chấp nhận đổi trả hàng
          </h2>
          <p>Sản phẩm chỉ được chấp nhận đổi trả khi thỏa mãn đầy đủ các điều kiện sau:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Sản phẩm được mua trực tiếp tại website hoặc hệ thống cửa hàng HienStore.</li>
            <li>Thời gian yêu cầu đổi trả trong vòng <strong>24 giờ</strong> kể từ thời điểm nhận hàng thành công.</li>
            <li>Sản phẩm còn nguyên nhãn mác (tags), hóa đơn mua hàng đi kèm và hộp đóng gói nguyên vẹn.</li>
            <li>Sản phẩm chưa qua giặt tẩy, không có mùi lạ, không bị dính bẩn hay bị hư hại vật lý do tác động bên ngoài.</li>
          </ul>
        </div>

        {/* 2. Trường hợp không được đổi trả */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
            <AlertTriangle size={18} className="text-indigo-500" />
            2. Các trường hợp từ chối đổi trả hàng
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Sản phẩm nằm trong chương trình "Xả hàng cuối năm" hoặc các chương trình giảm giá sâu (Sale trên 50%) được ghi chú rõ không đổi trả khi mua hàng.</li>
            <li>Quá thời hạn 24 giờ kể từ khi quý khách nhận hàng.</li>
            <li>Sản phẩm có dấu hiệu đã qua sử dụng, giặt ủi hoặc bị bẩn, hư hỏng.</li>
          </ul>
        </div>

        {/* 3. Quy trình đổi trả */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
            <RefreshCw size={18} className="text-indigo-500" />
            3. Quy trình thực hiện đổi trả hàng
          </h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80">
              <span className="font-bold text-xs text-indigo-500 uppercase tracking-widest block mb-1">Bước 1: Đăng ký yêu cầu</span>
              <p className="text-xs text-slate-500">Liên hệ Hotline <strong>0123 456 789</strong> hoặc nhắn tin qua Fanpage HienStore để thông báo mã đơn hàng và lý do muốn đổi trả.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80">
              <span className="font-bold text-xs text-indigo-500 uppercase tracking-widest block mb-1">Bước 2: Đóng gói và gửi hàng</span>
              <p className="text-xs text-slate-500">Đóng gói sản phẩm cẩn thận kèm nhãn mác cũ, gửi về địa chỉ: <strong>12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, TP.HCM</strong>.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80">
              <span className="font-bold text-xs text-indigo-500 uppercase tracking-widest block mb-1">Bước 3: Xác nhận & Hoàn tiền</span>
              <p className="text-xs text-slate-500">HienStore kiểm tra tình trạng hàng hóa, tiến hành gửi sản phẩm mới (nếu đổi size) hoặc chuyển khoản hoàn tiền trong vòng 2 ngày làm việc.</p>
            </div>
          </div>
        </div>

        {/* 4. Chi phí phát sinh */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
            <HelpCircle size={18} className="text-indigo-500" />
            4. Chi phí vận chuyển đổi trả
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Lỗi từ nhà sản xuất</strong> (nhầm mẫu, nhầm size, rách vải): HienStore chịu 100% phí ship 2 chiều.</li>
            <li><strong>Yêu cầu từ khách hàng</strong> (đổi ý, muốn đổi màu khác, size khác): Quý khách vui lòng thanh toán phí ship gửi hàng về kho và phí gửi lại hàng mới (đồng giá 30.000 ₫).</li>
          </ul>
        </div>
      </section>
    </div>
  )
}

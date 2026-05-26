import { useState } from 'react'
import { Plus, Minus, HelpCircle } from 'lucide-react'

export const FaqPage = () => {
  const [activeId, setActiveId] = useState<number | null>(null)

  const faqs = [
    {
      id: 1,
      category: 'Đặt hàng & Thanh toán',
      question: 'Tôi có thể thanh toán qua những hình thức nào?',
      answer: 'HienStore hỗ trợ đa dạng phương thức thanh toán bảo mật bao gồm: Thanh toán qua cổng VNPay (quét mã QR, ATM nội địa, thẻ quốc tế Visa/Mastercard) và Thanh toán tiền mặt khi nhận hàng (COD).'
    },
    {
      id: 2,
      category: 'Đặt hàng & Thanh toán',
      question: 'Làm thế nào để áp dụng mã giảm giá vào đơn hàng?',
      answer: 'Tại bước Thanh toán (Checkout), bạn sẽ thấy ô nhập "Mã giảm giá" ở cột tóm tắt đơn hàng phía bên phải. Hãy điền mã ưu đãi của bạn vào đó và nhấn áp dụng để hệ thống tự động khấu trừ số tiền.'
    },
    {
      id: 3,
      category: 'Vận chuyển & Đổi trả',
      question: 'Thời gian giao hàng mất bao lâu?',
      answer: 'Đối với khu vực nội thành TP. Hồ Chí Minh, chúng tôi hỗ trợ giao nhanh hỏa tốc trong vòng 2 giờ. Đối với các tỉnh thành khác trên toàn quốc, thời gian giao nhận tiêu chuẩn dao động từ 2 - 3 ngày làm việc.'
    },
    {
      id: 4,
      category: 'Vận chuyển & Đổi trả',
      question: 'Chính sách đổi trả 24h hoạt động như thế nào?',
      answer: 'Nếu sản phẩm bị lỗi do nhà sản xuất hoặc bạn muốn đổi size áo/quần, bạn có thể thực hiện đổi trả miễn phí trong vòng 24h kể từ khi nhận hàng. Lưu ý sản phẩm phải còn nguyên mác tags, chưa qua sử dụng và chưa qua giặt tẩy.'
    },
    {
      id: 5,
      category: 'Tài khoản & Bảo mật',
      question: 'Thông tin cá nhân của tôi có được bảo mật không?',
      answer: 'HienStore cam kết bảo mật tuyệt đối thông tin khách hàng bằng các tiêu chuẩn mã hóa tiên tiến nhất. Chúng tôi không bao giờ chia sẻ thông tin cá nhân của bạn cho bên thứ ba ngoại trừ đối tác vận chuyển phục vụ đơn hàng.'
    }
  ]

  const toggleFaq = (id: number) => {
    setActiveId(prev => (prev === id ? null : id))
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-3xl space-y-16 animate-fade-in font-sans">
      
      {/* 1. HEADER SECTION */}
      <section className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Hỗ trợ khách hàng
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading">
          Câu Hỏi Thường Gặp
        </h1>
        <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
      </section>

      {/* 2. ACCORDION LIST */}
      <section className="space-y-4">
        {faqs.map((faq) => {
          const isOpen = activeId === faq.id
          return (
            <div 
              key={faq.id} 
              className={`rounded-2xl border transition-all duration-300 ${
                isOpen 
                  ? 'border-indigo-500/30 bg-indigo-50/10 dark:bg-indigo-950/10' 
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              } overflow-hidden`}
            >
              {/* Trigger Button */}
              <button 
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className={`shrink-0 transition-colors ${isOpen ? 'text-indigo-500' : 'text-slate-400'}`} size={20} />
                  <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 font-heading leading-snug">
                    {faq.question}
                  </span>
                </div>
                <div className={`p-1.5 rounded-lg transition-colors ${isOpen ? 'bg-indigo-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}>
                  {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                </div>
              </button>

              {/* Collapsible Answer Panel */}
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-48 border-t border-slate-100 dark:border-slate-800/80' : 'max-h-0'
                }`}
              >
                <div className="px-6 py-5 space-y-2 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  <p>{faq.answer}</p>
                  <span className="inline-block text-[10px] font-bold text-indigo-500/80 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {faq.category}
                  </span>
                </div>
              </div>

            </div>
          )
        })}
      </section>

      {/* 3. FOOTER SUPPORT BANNER */}
      <section className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 text-center space-y-3">
        <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 font-heading">
          Không tìm thấy câu trả lời bạn cần?
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          Đội ngũ chăm sóc khách hàng của HienStore luôn sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ với chúng tôi qua hotline hoặc email.
        </p>
        <div className="pt-2 flex justify-center gap-6 text-xs font-bold text-indigo-600 dark:text-indigo-400">
          <span>Hotline: 0123 456 789</span>
          <span>Email: support@hienstore.com</span>
        </div>
      </section>

    </div>
  )
}

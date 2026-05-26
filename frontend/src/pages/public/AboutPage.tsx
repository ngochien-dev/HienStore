import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Heart, Award, Sparkles } from 'lucide-react'
import { Button } from '../../components/ui/Button'

export const AboutPage = () => {
  const values = [
    {
      icon: <ShieldCheck size={28} />,
      title: 'Chất lượng Thượng hạng',
      desc: 'HienStore cam kết 100% sản phẩm chính hãng, được dệt từ các sợi sợi tự nhiên siêu bền màu và êm ái cho làn da.'
    },
    {
      icon: <Award size={28} />,
      title: 'Tỉ mỉ từng Chi tiết',
      desc: 'Mỗi chiếc áo, chiếc quần đều trải qua quy trình kiểm soát chất lượng nghiêm ngặt, từ phom dáng đến từng đường chỉ may.'
    },
    {
      icon: <Heart size={28} />,
      title: 'Tận tâm phục vụ',
      desc: 'Sự hài lòng của khách hàng là mục tiêu cao nhất. Chúng tôi hỗ trợ giao nhanh 2h và chính sách đổi size linh hoạt trong 24h.'
    }
  ]

  const historySteps = [
    {
      year: '2020',
      title: 'Khởi đầu Đam mê',
      desc: 'HienStore được thành lập từ một cửa hàng thời trang nam nhỏ tại TP. Hồ Chí Minh với mong muốn đem lại phong cách tối giản cho giới trẻ.'
    },
    {
      year: '2022',
      title: 'Mở rộng Bộ sưu tập',
      desc: 'Ra mắt các dòng sản phẩm unisex và phụ kiện chất lượng cao. Trở thành cái tên được hàng chục nghìn khách hàng tin tưởng lựa chọn.'
    },
    {
      year: '2024',
      title: 'Chuyển đổi Số hóa',
      desc: 'Xây dựng website mua sắm trực tuyến HienStore hiện đại, kết nối thanh toán VNPay và mang lại trải nghiệm mua hàng 1-click mượt mà.'
    },
    {
      year: '2026',
      title: 'Định hình Tương lai',
      desc: 'Đột phá với bộ sưu tập thời trang bền vững từ cotton hữu cơ, hướng tới bảo vệ môi trường và định hình phong cách sống hiện đại.'
    }
  ]

  return (
    <div className="w-full space-y-24 pb-20 animate-fade-in font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800/40">
        <div className="absolute top-0 right-10 -mr-24 -mt-24 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-3xl space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={12} className="fill-indigo-600 dark:fill-indigo-400" />
            Câu chuyện thương hiệu
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-heading">
            Về Chúng Tôi — <span className="text-gradient-primary">HienStore</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            Chúng tôi tin rằng thời trang không chỉ là những bộ quần áo bạn khoác lên người hàng ngày, mà đó là lời khẳng định tinh tế về cá tính và phong cách sống của riêng bạn.
          </p>
        </div>
      </section>

      {/* 2. CORE VALUES */}
      <section className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-heading">Giá trị cốt lõi</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">Những nguyên tắc vàng định hướng cho mọi hành trình sáng tạo tại HienStore.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, idx) => (
            <div 
              key={idx} 
              className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 space-y-5"
            >
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                {v.icon}
              </div>
              <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-slate-100">
                {v.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TIMELINE JOURNEY */}
      <section className="bg-slate-50 dark:bg-slate-900/40 py-20 border-y border-slate-100 dark:border-slate-800/40">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-heading">Hành trình phát triển</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mt-2" />
          </div>

          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 sm:ml-32 space-y-12">
            {historySteps.map((step, idx) => (
              <div key={idx} className="relative pl-8 sm:pl-10">
                {/* Year Badge on the left for larger screens */}
                <div className="absolute -left-[54px] top-0 hidden sm:flex w-24 justify-end pr-8">
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-lg tracking-tight font-heading">
                    {step.year}
                  </span>
                </div>
                
                {/* Timeline Node Dot */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-indigo-600 dark:border-indigo-400 shadow-sm" />

                {/* Mobile Year display */}
                <span className="inline-block sm:hidden text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">
                  Năm {step.year}
                </span>

                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-heading mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="glass-premium rounded-3xl p-10 sm:p-14 text-center space-y-6 relative overflow-hidden border border-white/20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 pointer-events-none" />
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading">
            Trải nghiệm Mua Sắm Khác biệt
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Khám phá ngay hàng trăm mẫu thiết kế thời trang nam nữ tối giản, hiện đại và được yêu thích nhất tại HienStore.
          </p>
          <div className="pt-4 flex justify-center">
            <Button variant="gradient" size="lg" rounded="full" className="hover-scale group">
              <Link to="/products" className="flex items-center gap-2">
                Ghé thăm cửa hàng
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}

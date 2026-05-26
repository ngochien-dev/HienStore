import { Calendar, Clock, User, ArrowRight } from 'lucide-react'

export const BlogPage = () => {
  const blogs = [
    {
      id: 1,
      title: 'Bí quyết phối màu trang phục tối giản mà cuốn hút cho nam giới',
      category: 'Xu hướng',
      image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=600&q=80',
      excerpt: 'Thời trang tối giản (Minimalism) không chỉ đơn giản là chọn các gam màu trắng đen. Khám phá ngay cách kết hợp các tông màu trung tính như be, xám, và xanh ô-liu...',
      author: 'Nguyen Ngoc Hien',
      date: '24 Tháng 05, 2026',
      readTime: '5 phút đọc'
    },
    {
      id: 2,
      title: 'Cách bảo quản áo thun 100% Cotton bền màu và không bị giãn',
      category: 'Mẹo hay',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
      excerpt: 'Sở hữu một chiếc áo thun chất lượng cao là tốt, nhưng biết bảo quản nó đúng cách sẽ giúp sản phẩm đồng hành cùng bạn nhiều năm mà phom dáng vẫn chuẩn như mới...',
      author: 'Bảo Trân',
      date: '18 Tháng 05, 2026',
      readTime: '4 phút đọc'
    },
    {
      id: 3,
      title: 'Xu hướng thời trang Unisex: Xóa nhòa ranh giới phái tính',
      category: 'Thời trang',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
      excerpt: 'Phong cách Unisex ngày càng củng cố vị thế vững chắc trong tủ đồ của giới trẻ hiện đại. Cùng tìm hiểu tại sao sự phóng khoáng này lại được yêu chuộng đến vậy...',
      author: 'Hoàng Anh',
      date: '10 Tháng 05, 2026',
      readTime: '6 phút đọc'
    }
  ]

  const featuredBlog = {
    title: 'Top 5 món đồ "Must-Have" không thể thiếu trong tủ quần áo mùa hè 2026',
    category: 'Bộ sưu tập',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Mùa hè gõ cửa cũng là lúc bạn cần làm mới tủ đồ của mình. Không cần mua sắm quá nhiều, chỉ cần tập trung vào 5 món đồ basic đa năng này, bạn đã có thể tự tin biến hóa hàng chục phong cách ấn tượng khác nhau.',
    author: 'Nguyen Ngoc Hien',
    date: '26 Tháng 05, 2026',
    readTime: '8 phút đọc'
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-16 animate-fade-in font-sans">
      
      {/* 1. HEADER SECTION */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Phong cách sống & Cảm hứng
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading">
          HienStore Blog
        </h1>
        <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
      </section>

      {/* 2. FEATURED ARTICLE */}
      <section className="group relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-premium transition-all duration-500 grid grid-cols-1 lg:grid-cols-12">
        {/* Featured Image */}
        <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden bg-slate-50 dark:bg-slate-950">
          <img 
            src={featuredBlog.image} 
            alt={featuredBlog.title} 
            className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-700 ease-out"
          />
        </div>
        
        {/* Featured Content */}
        <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-center space-y-5">
          <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-full self-start">
            {featuredBlog.category}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-800 dark:text-slate-100 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {featuredBlog.title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            {featuredBlog.excerpt}
          </p>
          
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 font-medium pt-2 border-t border-slate-50 dark:border-slate-800/60">
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{featuredBlog.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{featuredBlog.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{featuredBlog.readTime}</span>
            </div>
          </div>

          <a href="#" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 pt-2 group/btn">
            Đọc bài viết
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* 3. LATEST BLOGS GRID */}
      <section className="space-y-10">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight font-heading border-b border-slate-100 dark:border-slate-800 pb-4">
          Bài viết mới nhất
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article 
              key={blog.id} 
              className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="aspect-[16/10] overflow-hidden bg-slate-50 dark:bg-slate-950">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-550"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow space-y-4">
                <span className="inline-block px-2.5 py-0.5 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-full self-start">
                  {blog.category}
                </span>
                
                <h3 className="text-base font-bold font-heading text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                  {blog.title}
                </h3>
                
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-3">
                  {blog.excerpt}
                </p>

                {/* Metadata */}
                <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/40 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{blog.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{blog.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

    </div>
  )
}

import { use, useEffect, useState } from "react";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import slide from "../../assets/images/slide.png";
import raucu from "../../assets/images/raucu.png";
import cuqua from "../../assets/images/cuqua.png";
import suatuoi from "../../assets/images/suatuoi.png";
import bannerproduct5 from "../../assets/images/img_banner_index.webp";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import apiCategory from "../../api/user/apiCategory";
import apiProduct from "../../api/user/apiProduct";
import apiBrand from "../../api/user/apiBrand";
import apiPost from "../../api/user/apiPost";
import ProductItem from "./ProductItem";
import { getImageUrl } from "../../api/config";
import { useNavigate } from "react-router-dom";
import useAddToCart from "../../hooks/useAddToCart";
import "react-toastify/dist/ReactToastify.css";
import { FaSortAmountDownAlt, FaFilter, FaCheck } from "react-icons/fa"; // Thêm FaFilter, FaCheck


const videos = [
  {
    thumbnail: "https://thuanchay.vn/wp-content/uploads/2024/04/6-Cach-Nau-Sua-Hat-Sen-Thom-Ngon-Me-Ly-Nen-Thu-Ngay-29.webp",
    title: "Hướng dẫn cách làm sữa hạt sen ngon mê ly ngay tại nhà",
    url: "https://www.youtube.com/watch?v=4zH5iYM4wJo",
  },
  {
    thumbnail: "https://bearviet.vn/wp-content/uploads/2024/06/cach-lam-sua-dau-do-bang-may-lam-sua-hat.jpg",
    title: "Hướng dẫn cách làm sữa hạt đậu đỏ thơm ngon, béo ngậy",
    url: "https://www.youtube.com/watch?v=yA1B7rF-yZc",
  },
  {
    thumbnail: "https://file.hstatic.net/200000700229/article/lam-sua-hat-dieu-thumb_8769d4e4cb954630980272c75789bf39.jpg",
    title: "Hướng dẫn cách làm sữa hạt điều đơn giản mà không phải ai cũng biết",
    url: "https://www.youtube.com/watch?v=EwZkzGkQj2s",
  },
  {
    thumbnail: "https://matika.vn/wp-content/uploads/2023/05/uong-sua-hat-giam-can-tot-cho-suc-khoe.jpg",
    title: "Hướng dẫn cách làm sữa hạt đậu đen siêu ngon cho cả gia đình",
    url: "https://www.youtube.com/watch?v=BtK9O6Hh2vw",
  },
];



const Home = () => {
  const [categorys, setcategorys] = useState([]);
  const [productNew, setProductNew] = useState([]);
  const [saleProducts, setProductSale] = useState([]);
  const navigate = useNavigate();
  const handleAddToCart = useAddToCart();

  const [countdown, setCountdown] = useState({
    days: 5,
    hours: 2,
    minutes: 33,
    seconds: 35,
  });

  useEffect(() => {
    const end = new Date(
      Date.now() +
      5 * 24 * 3600 * 1000 +
      2 * 3600 * 1000 +
      33 * 60 * 1000 +
      35 * 1000
    );

    const timer = setInterval(() => {
      const now = new Date();
      const diff = end - now;
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      } else {
        const days = Math.floor(diff / (24 * 3600 * 1000));
        const hours = Math.floor((diff % (24 * 3600 * 1000)) / (3600 * 1000));
        const minutes = Math.floor((diff % (3600 * 1000)) / (60 * 1000));
        const seconds = Math.floor((diff % (60 * 1000)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [producsCat, setProductsCat] = useState([]);
  const [Brands, setBrands] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);

  // Data mẫu cho Đánh giá (Testimonials)
  const testimonials = [
    {
      id: 1,
      name: "Đặng Chinh Đức",
      role: "Đầu bếp",
      content: "Đặt hàng buổi sáng, hẹn chiều giao để đi công trình. Vừa ăn trưa xong, hàng giao luôn tới công trình. Rất nhanh chóng, tiện lợi cho công việc.",
      avatar: "https://vnn-imgs-a1.akamaized.net/live_image/2021/08/21/image-20210821213000-1.jpg",
    },
    {
      id: 2,
      name: "Nguyễn Văn A",
      role: "Khách hàng thân thiết",
      content: "Sản phẩm tươi ngon, đóng gói cẩn thận. Tôi rất hài lòng với chất lượng dịch vụ của cửa hàng. Sẽ tiếp tục ủng hộ lâu dài.",
      avatar: "https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg",
    },
  ];
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latestRes, catRes, discountRes, brandRes, homeCatsRes, postsRes] = await Promise.all([
          apiProduct.getLatest(8),
          apiCategory.getAll(),
          apiProduct.getLatestDiscount(8),
          apiBrand.getAll(),
          apiProduct.getHomeCategories(),
          apiPost.getNewest()
        ]);

        setProductNew(latestRes || []);
        setcategorys(catRes.data || catRes || []);
        setProductSale(discountRes.content || discountRes || []);
        setBrands(brandRes.data || brandRes || []);
        setProductsCat(homeCatsRes || []);
        setLatestPosts(postsRes || []);

      } catch (err) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", err);
      }
    };

    fetchData();
  }, []);




  return (
    <div>
      <main className="max-w-7xl mx-auto pt-10 px-2 sm:px-0">
        {/* ===== SLIDE BANNER ===== */}
        <section className="mt-4 px-2 sm:px-0">
          <div className="relative overflow-hidden rounded-2xl shadow-lg group">
            <img
              src={slide}
              alt="banner"
              className="
        w-full h-auto max-h-[420px] object-cover
        transition-transform duration-[1200ms] ease-out
        group-hover:scale-[1.03]
      "
            />

            {/* Overlay gradient nhẹ */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </section>


        {/* ===== DANH MỤC NỔI BẬT ===== */}
        <section className="mt-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 px-2 sm:px-0">
            <div className="flex items-center gap-3">

              <h2 className="text-lg sm:text-3xl font-bold  tracking-tight font-semibold">
                Danh mục nổi bật
              </h2>
            </div>

            {/* Quick links */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {[
                { slug: "trai-cay", name: "Trái cây" },
                { slug: "rau-xanh", name: "Rau xanh" },
                { slug: "thit-heo", name: "Thịt heo" },
              ].map((c) => (
                <Link
                  key={c.slug}
                  to={`/products?category=${c.slug}`}
                  state={{ categorySlug: c.slug, categoryName: c.name }}
                  className="
            whitespace-nowrap text-sm sm:text-base font-medium
            text-emerald-700
            hover:text-yellow-500
            transition-colors
          "
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="relative">
            {/* Left button */}
            <button
              onClick={() =>
                document
                  .getElementById("category-list")
                  .scrollBy({ left: -220, behavior: "smooth" })
              }
              className="
        hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20
        w-10 h-10 rounded-full bg-white
        shadow-md hover:shadow-lg
        hover:bg-emerald-50 hover:scale-110
        transition
        items-center justify-center
      "
            >
              <MdArrowBackIos className="text-gray-600 text-sm" />
            </button>

            {/* Scroll container */}
            <div
              id="category-list"
              className="
        flex gap-4 overflow-x-auto scroll-smooth
        px-2 sm:px-0 pb-3 scrollbar-hide
      "
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {categorys
                .filter((c) => c.parentId !== null)
                .map((category) => (
                  <div
                    key={category.id}
                    onClick={() =>
                      navigate(`/products?category=${category.slug}`, {
                        state: { categoryName: category.name },
                      })
                    }
                    className="
                    mt-2
              group relative
              h-44 w-40 flex-shrink-0
              rounded-2xl p-3 cursor-pointer
              bg-white
              border border-gray-200
              shadow-sm
              hover:shadow-xl hover:-translate-y-1
              hover:border-gray-300
              transition-all duration-300
            "
                  >
                    {/* Glow overlay */}
                    <div className="
              absolute inset-0 rounded-2xl
              bg-gradient-to-t from-emerald-200/20 to-transparent
              opacity-0 group-hover:opacity-100
              transition
            " />

                    {/* Image */}
                    <div className="relative z-10 w-full h-28 flex items-center justify-center">
                      <img
                        src={getImageUrl(category.image, "category")}
                        alt={category.name}
                        className="
                  h-full w-full object-contain
                  transition-transform duration-500
                  group-hover:scale-110
                "
                      />
                    </div>

                    {/* Name */}
                    <h3 className="
              relative z-10 mt-2 text-center
              text-sm sm:text-base font-semibold
              text-gray-800
              group-hover:text-emerald-700
              transition-colors
            ">
                      {category.name}
                    </h3>
                  </div>
                ))}
            </div>

            {/* Right button */}
            <button
              onClick={() =>
                document
                  .getElementById("category-list")
                  .scrollBy({ left: 220, behavior: "smooth" })
              }
              className="
        hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20
        w-10 h-10 rounded-full bg-white
        shadow-md hover:shadow-lg
        hover:bg-emerald-50 hover:scale-110
        transition
        items-center justify-center
      "
            >
              <MdArrowForwardIos className="text-gray-600 text-sm" />
            </button>
          </div>
        </section>



        {/* ===== SALE / BEST SELLING ===== */}
        <section className="mt-12 bg-gray-50 rounded-3xl px-3 sm:px-5 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">

            {/* ===== LEFT BANNER ===== */}
            <div className="
      lg:col-span-1
      relative overflow-hidden rounded-3xl
      min-h-[240px] sm:min-h-[500px]
      shadow-lg
      bg-emerald-500
    ">
              {/* Background Image - Hidden on Mobile */}
              <div
                className="hidden sm:block absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url('/src/assets/images/banner1.png')`,
                  backgroundSize: "contain",
                  backgroundPosition: "bottom",
                  backgroundRepeat: "no-repeat",
                }}
              />
              {/* Gradient Overlay - Top Half Only */}
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-600 via-yellow-500 to-transparent" style={{ height: "50%" }} />
              {/* Content Overlay */}
              <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-3xl font-bold text-white leading-tight mb-2">
                    Sản phẩm nổi bật<br />trong farm
                  </h3>

                  <p className="text-sm sm:text-base text-white/90 font-medium italic mb-3">
                    Ưu đãi độc quyền - Giảm giá 10%
                  </p>

                  <p className="text-base sm:text-xl text-white font-bold mb-2">
                    Mua sắm thoải mái chỉ từ<br />10.000 VNĐ
                  </p>

                  <p className="text-xs sm:text-sm text-white/80 max-w-[240px] mb-4">
                    Chỉ trong tuần này. Mua ngay kẻo lỡ...
                  </p>

                  <button className="
                    px-6 py-2.5 rounded-full
                    bg-white text-emerald-700 font-semibold text-sm
                    shadow-md
                    hover:shadow-xl hover:scale-105
                    transition
                  ">
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>

            {/* ===== PRODUCT LIST ===== */}
            <div className="lg:col-span-3">

              {/* Mobile: horizontal scroll */}
              <div className="lg:hidden">
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
                  {productNew.map((product) => (
                    <div
                      key={product.id}
                      className="min-w-[170px] sm:min-w-[210px]"
                    >
                      <ProductItem product={product} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop: grid */}
              <div className="hidden lg:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productNew.slice(0, 8).map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>

              {/* View all */}
              <div className="text-center mt-7">
                <Link to="/products">
                  <button
                    className="
              inline-flex items-center gap-2
              px-6 py-2 rounded-full
              border border-emerald-600
              text-emerald-600 font-medium
              hover:bg-emerald-600 hover:text-white
              shadow-sm hover:shadow-md
              transition
            "
                  >
                    Xem thêm
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>



        {/* ===== PROMO BANNER ===== */}
        <section className="mt-12 px-2 sm:px-0">
          <div className="
    flex md:grid md:grid-cols-3
    gap-5 sm:gap-6
    overflow-x-auto md:overflow-visible
    scrollbar-hide scroll-smooth
  ">

            {/* CARD ITEM */}
            {[
              {
                img: cuqua,
                title: "Nông sản tươi mới",
                desc: "100% từ thiên nhiên",
              },
              {
                img: suatuoi,
                title: "Bữa sáng lành mạnh",
                desc: "Sữa tươi nguyên chất",
              },
              {
                img: raucu,
                title: "Rau củ hữu cơ",
                desc: "Sạch – an toàn – chất lượng",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="
          relative group
          bg-white rounded-3xl overflow-hidden
          shadow-md hover:shadow-xl
          transition-all duration-300
          min-w-[260px] sm:min-w-0
        "
              >
                {/* Image */}
                <img
                  src={item.img}
                  alt={item.title}
                  className="
            w-full h-40 sm:h-60 object-cover
            transition-transform duration-700
            group-hover:scale-110
          "
                />

                {/* Overlay */}
                <div className="
          absolute inset-0
          bg-gradient-to-t from-black/70 via-black/30 to-transparent
          flex flex-col justify-end
          p-5 sm:p-6
        ">
                  <h3 className="text-white text-base sm:text-lg font-bold">
                    {item.title}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm mt-1">
                    {item.desc}
                  </p>

                  <Link
                    to="/products"
                    className="
              mt-4 inline-flex items-center
              w-fit px-4 py-2 rounded-full
              bg-emerald-600 text-white text-xs sm:text-sm font-semibold
              hover:bg-yellow-500
              transition
            "
                  >
                    Xem ngay
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ===== FLASH SALE ===== */}
        <section className="mt-12">
          <div className="
    rounded-3xl overflow-hidden
    border border-gray-200
    shadow-lg
    bg-white
  ">
            {/* ===== HEADER ===== */}
            <div className="
      bg-gradient-to-r from-emerald-600 to-green-500
      text-white p-5 sm:p-6
      flex flex-col sm:flex-row
      justify-between items-center gap-4
    ">
              <div className="flex items-center gap-3">
                <span className="text-yellow-300 text-3xl drop-shadow animate-shake">
                  ⚡
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-semibold tracking-tight">
                    Khuyến mãi đặc biệt
                  </h2>
                  <p className="text-sm sm:text-base opacity-90 mt-1">
                    Giảm giá hấp dẫn — Số lượng có hạn
                  </p>
                </div>
              </div>

              {/* Countdown */}
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { label: "Ngày", value: countdown.days },
                  { label: "Giờ", value: countdown.hours },
                  { label: "Phút", value: countdown.minutes },
                  { label: "Giây", value: countdown.seconds },
                ].map((t, i) => (
                  <div
                    key={i}
                    className="
              bg-white text-emerald-700
              rounded-xl px-3 sm:px-4 py-1.5
              font-semibold shadow-md
              flex flex-col items-center
              min-w-[56px]
            "
                  >
                    <span className="text-lg sm:text-xl font-bold">
                      {String(t.value).padStart(2, "0")}
                    </span>
                    <span className="text-[11px] font-medium opacity-80">
                      {t.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ===== MOBILE ===== */}
            <div className="p-4 md:hidden bg-white">
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {saleProducts.slice(0, 6).map((p) => {
                  const discountPercent =
                    p.salePrice && p.discountPrice && p.discountPrice < p.salePrice
                      ? Math.round(((p.salePrice - p.discountPrice) / p.salePrice) * 100)
                      : 0;

                  const soldCount = p.sold || 0;
                  const stockCount = p.qty || 0;
                  const soldPercent =
                    stockCount > 0 ? Math.round((soldCount / stockCount) * 100) : 0;

                  return (
                    <div
                      key={p.id}
                      className="
                relative flex-shrink-0
                w-[78%] sm:w-[48%]
                bg-white rounded-2xl
                border border-gray-200
                shadow-md hover:shadow-lg
                hover:-translate-y-1
                transition-all
              "
                    >
                      {/* SALE BADGE */}
                      {discountPercent > 0 && (
                        <div
                          className="
      absolute top-2 left-2
      bg-gradient-to-r from-rose-500 to-pink-500
      text-white text-xs font-bold
      px-2 py-0.5
      shadow-md
      animate-pulse
      badge-shake
      rounded-r-xl rounded-l-sm
    "
                        >
                          -{discountPercent}%
                        </div>
                      )}


                      <Link to={`/product/${p.slug}`} className="block p-3">
                        <img
                          src={getImageUrl(p.image, "product")}
                          alt={p.name}
                          className="w-full h-28 object-contain mx-auto"
                        />
                      </Link>

                      <div className="px-3 pb-3 space-y-2">
                        <Link
                          to={`/product/${p.slug}`}
                          className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-emerald-700 transition leading-snug min-h-[40px]"
                        >
                          {p.name}
                        </Link>

                        {p.discountPrice && p.discountPrice < p.salePrice ? (
                          <>
                            <p className="text-gray-400 line-through text-[11px]">
                              {p.salePrice.toLocaleString()}₫
                            </p>
                            <p className="text-rose-600 font-bold text-sm">
                              {p.discountPrice.toLocaleString()}₫
                            </p>
                          </>
                        ) : (
                          <p className="text-rose-600 font-bold text-sm">
                            {p.salePrice?.toLocaleString()}₫
                          </p>
                        )}

                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full font-medium">
                            /{(p.baseWeight ? p.baseWeight : "")}
                            {p.saleType === "WEIGHT" ? (p.unitLabel || "kg") : (p.unitLabel || "cái")}
                          </span>
                        </div>

                        {/* Progress */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full transition-all ${soldPercent > 70
                              ? "bg-rose-500 animate-pulse"
                              : "bg-emerald-500"
                              }`}
                            style={{ width: `${soldPercent}%` }}
                          />
                        </div>

                        <button
                          onClick={() => handleAddToCart(p)}
                          disabled={p.qty === 0}
                          className={`
                    w-full py-2.5 mt-3 rounded-xl text-sm font-bold
                    transition-all duration-300
                    ${p.qty === 0
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-95"
                            }
                  `}
                        >
                          {p.qty === 0 ? "Hết hàng" : "Thêm vào giỏ"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ===== DESKTOP ===== */}
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-6 p-6 bg-white">
              {saleProducts.slice(0, 8).map((p) => {
                const discountPercent =
                  p.salePrice && p.discountPrice && p.discountPrice < p.salePrice
                    ? Math.round(((p.salePrice - p.discountPrice) / p.salePrice) * 100)
                    : 0;

                const soldCount = p.sold || 0;
                const stockCount = p.qty || 0;
                const soldPercent =
                  stockCount > 0 ? Math.round((soldCount / stockCount) * 100) : 0;

                return (
                  <div
                    key={p.id}
                    className="
              relative flex gap-3
              bg-white border border-gray-200
              rounded-2xl p-4
              shadow-sm hover:shadow-lg
              hover:-translate-y-1
              transition-all
            "
                  >
                    {discountPercent > 0 && (
                      <div
                        className="
      absolute top-2 left-2
      bg-gradient-to-r from-rose-500 to-pink-500
      text-white text-xs font-bold
      px-2 py-0.5
      shadow-md
      animate-pulse
      badge-shake
      rounded-r-xl rounded-l-sm
    "
                      >
                        -{discountPercent}%
                      </div>
                    )}

                    <div className="basis-5/12">
                      <Link to={`/product/${p.slug}`}>
                        <img
                          src={getImageUrl(p.image, "product")}
                          alt={p.name}
                          className="w-full h-32 object-contain"
                        />
                      </Link>
                    </div>

                    <div className="basis-7/12">
                      <Link
                        to={`/product/${p.slug}`}
                        className="font-semibold text-gray-800 line-clamp-2 hover:text-emerald-700 transition leading-snug"
                      >
                        {p.name}
                      </Link>

                      {p.discountPrice && p.discountPrice < p.salePrice ? (
                        <>
                          <p className="text-gray-400 line-through text-xs">
                            {p.salePrice.toLocaleString()}₫
                          </p>
                          <p className="text-rose-600 font-bold text-sm">
                            {p.discountPrice.toLocaleString()}₫
                          </p>
                        </>
                      ) : (
                        <p className="text-rose-600 font-bold text-sm">
                          {p.salePrice?.toLocaleString()}₫
                        </p>
                      )}

                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full font-medium">
                          /{(p.baseWeight ? p.baseWeight : "")}
                          {p.saleType === "WEIGHT" ? (p.unitLabel || "kg") : (p.unitLabel || "cái")}
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full transition-all ${soldPercent > 70
                            ? "bg-rose-500 animate-pulse"
                            : "bg-emerald-500"
                            }`}
                          style={{ width: `${soldPercent}%` }}
                        />
                      </div>

                      <button
                        onClick={() => handleAddToCart(p)}
                        disabled={p.qty === 0}
                        className={`
                  w-full py-2.5 mt-3 rounded-xl text-sm font-bold
                  transition-all duration-300
                  ${p.qty === 0
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-95"
                          }
                `}
                      >
                        {p.qty === 0 ? "Hết hàng" : "Thêm vào giỏ"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>






        {/* ===== VIDEO HƯỚNG DẪN ===== */}
        <section className="
  mt-12
  bg-gray-50
  border border-gray-200
  shadow-lg
  p-4 sm:p-6
  rounded-3xl
">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">

              <h2 className="text-lg sm:text-3xl font-bold  tracking-tight font-semibold">
                Video hướng dẫn
              </h2>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  document
                    .getElementById("video-scroll")
                    .scrollBy({ left: -300, behavior: "smooth" })
                }
                className="
              w-8 h-8 rounded-full
              bg-white border border-gray-200
              shadow-sm
              flex items-center justify-center
              hover:bg-emerald-50 hover:border-emerald-200
              transition
            "
              >
                <MdArrowBackIos className="text-gray-600 text-sm translate-x-1" />
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("video-scroll")
                    .scrollBy({ left: 300, behavior: "smooth" })
                }
                className="
              w-8 h-8 rounded-full
              bg-white border border-gray-200
              shadow-sm
              flex items-center justify-center
              hover:bg-emerald-50 hover:border-emerald-200
              transition
            "
              >
                <MdArrowForwardIos className="text-gray-600 text-sm" />
              </button>
            </div>

            {/* <button
              onClick={() => navigate("/videos")}
              className="
        hidden sm:inline-flex
        px-5 py-2 rounded-full
        border border-emerald-600
        text-emerald-700 font-medium
        hover:bg-emerald-600 hover:text-white
        shadow-sm hover:shadow-md
        transition
      "
            >
              Xem tất cả
            </button> */}
          </div>

          {/* List */}
          <div
            id="video-scroll"
            className="
    flex md:grid md:grid-cols-4
    gap-4
    overflow-x-auto md:overflow-visible
    scrollbar-hide scroll-smooth
    pb-2
  "
          >
            {videos.map((v, i) => (
              <div
                key={i}
                className="
          group flex-shrink-0
          min-w-[60%] xs:min-w-[50%] sm:min-w-0
          bg-white rounded-2xl
          border border-gray-200
          shadow-md hover:shadow-xl
          hover:-translate-y-1
          hover:border-emerald-300
          transition-all duration-300
          overflow-hidden
        "
              >
                {/* Thumbnail */}
                <div className="relative">
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="
              w-full h-44 sm:h-48 object-cover
              transition-transform duration-700
              group-hover:scale-110
            "
                  />

                  {/* Overlay + Play */}
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
              absolute inset-0
              flex items-center justify-center
              bg-gradient-to-t from-black/60 via-black/30 to-transparent
              opacity-0 group-hover:opacity-100
              transition-opacity
            "
                  >
                    <div className="
              w-14 h-14 sm:w-16 sm:h-16
              rounded-full
              bg-white/90
              flex items-center justify-center
              shadow-lg
              ring-2 ring-white
              group-hover:scale-110
              transition
            ">
                      <Play className="text-emerald-600 w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                  </a>
                </div>

                {/* Title */}
                <div className="p-4">
                  <p className="
            text-sm font-semibold
            text-gray-800
            line-clamp-2
            group-hover:text-emerald-700
            transition-colors
          ">
                    {v.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile button */}
          <div className="text-center mt-6 sm:hidden">
            <button
              onClick={() => navigate("/videos")}
              className="
        px-6 py-2 rounded-full
        border border-emerald-600
        text-emerald-700 font-medium
        hover:bg-emerald-600 hover:text-white
        shadow-sm hover:shadow-md
        transition
      "
            >
              Xem thêm
            </button>
          </div>
        </section>


        {/* ===== BANNER CUỐI ===== */}
        <section className="mt-14 px-2 sm:px-0">
          <div className="
    relative overflow-hidden
    rounded-2xl
    shadow-lg
    group
  ">
            <img
              src={bannerproduct5}
              alt=""
              className="
        w-full h-32 sm:h-full object-cover
        transition-transform duration-[1200ms] ease-out
        group-hover:scale-110
      "
            />

            {/* overlay gradient */}
            <div className="
      absolute inset-0
      bg-gradient-to-r from-black/20 via-transparent to-black/10
      pointer-events-none
    " />
          </div>
        </section>


        {/* ===== NHÓM DANH MỤC NHỎ ===== */}
        <section className="mt-12 flex flex-nowrap overflow-x-auto lg:grid lg:grid-cols-3 gap-6 px-2 sm:px-0 scrollbar-none pb-4">
          {producsCat.map((cat) => (
            <div
              key={cat.id}
              className="
                flex-shrink-0 w-[85%] sm:w-[450px] lg:w-full
                rounded-3xl
                border border-gray-200
                bg-white
                shadow-md hover:shadow-xl
                transition-all duration-300
                p-5
              "
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg sm:text-3xl font-bold  tracking-tight font-semibold">
                  {cat.name}
                </h4>

                <Link
                  to={`/products?category=${cat.slug}`}
                  state={{ categoryName: cat.name }}
                  className="
            text-emerald-700 text-xs font-semibold
            hover:text-yellow-500
            transition
          "
                >
                  Xem thêm
                </Link>
              </div>

              {/* Product list */}
              <div className="flex flex-col gap-3">
                {cat.products.map((p) => {
                  const hasDiscount =
                    p.salePrice && p.discountPrice && p.discountPrice < p.salePrice;

                  const discountPercent = hasDiscount
                    ? Math.round(((p.salePrice - p.discountPrice) / p.salePrice) * 100)
                    : 0;

                  return (
                    <div
                      key={p.id}
                      className="
                group relative
                flex items-center gap-4
                bg-white border border-gray-200
                p-3 rounded-2xl
                hover:-translate-y-1 hover:shadow-md
                transition-all duration-300
              "
                    >
                      {/* Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 relative">
                        <Link to={`/product/${p.slug}`}>
                          <img
                            src={getImageUrl(p.image, "product")}
                            alt={p.name}
                            className="object-contain w-full h-full rounded-lg"
                          />
                        </Link>

                        {/* SALE BADGE */}
                        {hasDiscount && (
                          <div
                            className="
                      absolute top-1 left-1
                      bg-gradient-to-r from-rose-500 to-pink-500
                      text-white text-[11px] sm:text-xs font-bold
                      px-1.5 py-0.5
                      rounded-r-lg rounded-l-sm
                      shadow
                      animate-pulse badge-shake
                    "
                          >
                            -{discountPercent}%
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <Link
                          to={`/product/${p.slug}`}
                          className="
                    text-sm sm:text-base font-semibold
                    text-gray-800
                    line-clamp-2
                    leading-snug
                    group-hover:text-emerald-700
                    transition-colors
                  "
                        >
                          {p.name}
                        </Link>

                        <div className="flex items-center gap-2 mt-1 text-sm">
                          {hasDiscount ? (
                            <>
                              <span className="text-rose-600 font-bold">
                                {p.discountPrice.toLocaleString()}₫
                              </span>
                              <span className="text-gray-400 line-through text-xs">
                                {p.salePrice.toLocaleString()}₫
                              </span>
                            </>
                          ) : (
                            <span className="text-rose-600 font-bold">
                              {p.salePrice?.toLocaleString()}₫
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full font-medium">
                            /{(p.baseWeight ? p.baseWeight : "")}
                            {p.saleType === "WEIGHT" ? (p.unitLabel || "kg") : (p.unitLabel || "cái")}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* ===== TIN TỨC & ĐÁNH GIÁ ===== */}
        <section className="mt-14 px-2 sm:px-0">
          <div className="lg:grid-cols-12 gap-6">

            {/* ===== NEWS ===== */}
            <div className="
      lg:col-span-9
      bg-gradient-to-br from-gray-50 to-white
      rounded-3xl
      p-5 sm:p-6
      shadow-md
      border border-gray-100
    ">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-3xl font-bold  tracking-tight font-semibold">
                  Tin tức mới nhất
                </h3>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      document
                        .getElementById("news-scroll")
                        .scrollBy({ left: -300, behavior: "smooth" })
                    }
                    className="
              w-8 h-8 rounded-full
              bg-white border border-gray-200
              shadow-sm
              flex items-center justify-center
              hover:bg-emerald-50 hover:border-emerald-200
              transition
            "
                  >
                    <MdArrowBackIos className="text-gray-600 text-sm translate-x-1" />
                  </button>

                  <button
                    onClick={() =>
                      document
                        .getElementById("news-scroll")
                        .scrollBy({ left: 300, behavior: "smooth" })
                    }
                    className="
              w-8 h-8 rounded-full
              bg-white border border-gray-200
              shadow-sm
              flex items-center justify-center
              hover:bg-emerald-50 hover:border-emerald-200
              transition
            "
                  >
                    <MdArrowForwardIos className="text-gray-600 text-sm" />
                  </button>
                </div>
              </div>

              <div
                id="news-scroll"
                className="flex gap-4 overflow-x-auto scrollbar-hide  scroll-smooth pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {latestPosts.length > 0 ? (
                  latestPosts.slice(0, 6).map((post) => {
                    const date = new Date(post.createdAt);
                    const day = date.getDate();
                    const monthYear = `${(date.getMonth() + 1)
                      .toString()
                      .padStart(2, "0")}/${date.getFullYear()}`;

                    return (
                      <div
                        key={post.id}
                        className="
                  group min-w-[280px] sm:min-w-[320px]
                  bg-white rounded-2xl
                  overflow-hidden
                  border border-gray-100
                  shadow-sm hover:shadow-md
                  transition
                "
                      >
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={getImageUrl(post.image, "post")}
                            alt={post.title}
                            className="
                      w-full h-full object-cover
                      transition-transform duration-500
                      group-hover:scale-110
                    "
                          />

                          <div className="
                    absolute top-2 left-2
                    bg-emerald-600 text-white
                    rounded-lg px-2 py-1
                    text-center shadow
                  ">
                            <div className="text-sm font-bold leading-none">
                              {day}
                            </div>
                            <div className="text-[10px] opacity-80">
                              {monthYear}
                            </div>
                          </div>
                        </div>

                        <div className="p-4 flex flex-col gap-2">
                          <Link
                            to={`/post/${post.slug}`}
                            className="
                      font-bold text-gray-800
                      line-clamp-2
                      hover:text-emerald-600
                      transition
                      min-h-[3rem]
                    "
                          >
                            {post.title}
                          </Link>

                          <p className="text-sm text-gray-500 line-clamp-2">
                            {post.description}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full py-10 text-center text-gray-400">
                    Đang cập nhật tin tức...
                  </div>
                )}
              </div>

              <div className="text-center mt-5">
                <Link
                  to="/posts"
                  className="
            inline-block
            py-2 px-8 rounded-full
            border border-emerald-600
            text-emerald-600 text-sm font-semibold
            hover:bg-emerald-600 hover:text-white
            transition shadow-sm
          "
                >
                  Xem thêm
                </Link>
              </div>
            </div>



          </div>
        </section>



        {/* ===== THƯƠNG HIỆU ĐỐI TÁC ===== */}
        <section className="mt-14 px-2 sm:px-0">
          <div className="
    relative
    rounded-3xl
    border border-gray-200
    bg-white
    shadow-lg
    p-4 sm:p-6
  ">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-lg sm:text-3xl font-bold  tracking-tight font-semibold">
                  Đối tác của chúng tôi
                </h3>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    document
                      .getElementById("brand-scroll")
                      .scrollBy({ left: -200, behavior: "smooth" })
                  }
                  className="
                w-8 h-8 rounded-full
                bg-white border border-gray-200
                shadow-sm
                flex items-center justify-center
                hover:bg-emerald-50 hover:border-emerald-200
                transition
              "
                >
                  <MdArrowBackIos className="text-gray-600 text-sm translate-x-1" />
                </button>

                <button
                  onClick={() =>
                    document
                      .getElementById("brand-scroll")
                      .scrollBy({ left: 200, behavior: "smooth" })
                  }
                  className="
                w-8 h-8 rounded-full
                bg-white border border-gray-200
                shadow-sm
                flex items-center justify-center
                hover:bg-emerald-50 hover:border-emerald-200
                transition
              "
                >
                  <MdArrowForwardIos className="text-gray-600 text-sm" />
                </button>
              </div>
            </div>

            {/* Brand list - Horizontal Scroll */}
            <div
              id="brand-scroll"
              className="
              flex gap-4 sm:gap-5
              overflow-x-auto scrollbar-hide scroll-smooth
              pb-4
              relative
            "
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {Brands.length > 0 ? (
                Brands.map((brand, i) => (
                  <div
                    key={i}
                    className="
                    mt-2
              group flex-shrink-0
              min-w-[100px] sm:min-w-[120px]
              bg-white rounded-2xl
              border border-gray-200
              p-3 sm:p-4
              flex flex-col items-center justify-center
              shadow-sm
              hover:shadow-lg hover:-translate-y-1 hover:z-10
              hover:border-gray-300
              transition-all duration-300
              relative
            "
                  >
                    {/* Logo */}
                    {brand.image ? (
                      <div className="
                w-14 h-14 sm:w-16 sm:h-16
                flex items-center justify-center
              ">
                        <img
                          src={getImageUrl(brand.image, "brand")}
                          alt={brand.name}
                          className="
                    w-full h-full object-contain
                  
                    group-hover:grayscale-0
                    transition duration-300
                    group-hover:scale-110
                  "
                        />
                      </div>
                    ) : (
                      <div className="
                w-14 h-14 sm:w-16 sm:h-16
                flex items-center justify-center
                text-gray-400 text-xs
                border border-gray-200 rounded-full
              ">
                        No Image
                      </div>
                    )}

                    {/* Name */}
                    <p className="
              text-xs sm:text-sm font-medium
              text-gray-700 mt-2 text-center
              group-hover:text-emerald-700
              transition
            ">
                      {brand.name}
                    </p>
                  </div>
                ))
              ) : (
                <p className="w-full text-center text-gray-400 text-sm py-10">
                  Đang tải thương hiệu...
                </p>
              )}
            </div>
          </div>
        </section>



        {/* Service badges */}


        <section className="mt-16 pt-10 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2 sm:px-0">
          {[
            { t: "Vận chuyển miễn phí", s: "Hóa đơn trên 3 triệu" },
            { t: "Đổi trả miễn phí", s: "Trong vòng 7 ngày" },
            { t: "100% Hoàn tiền", s: "Nếu sản phẩm lỗi" },
            { t: "Hotline: 1900 6750", s: "Hỗ trợ 24/7" },
          ].map((b, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-default"
            >
              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <FaCheck className="text-sm" />
              </div>
              <div>
                <div className="text-sm font-bold text-emerald-800 uppercase tracking-wide">
                  {b.t}
                </div>
                <div className="text-xs text-emerald-600 font-medium mt-0.5">{b.s}</div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Home;

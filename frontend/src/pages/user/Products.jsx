import { FaSortAmountDownAlt, FaFilter, FaCheck } from "react-icons/fa"; // Thêm FaFilter, FaCheck
import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import apiProduct from "../../api/user/apiProduct";
import apiCategory from "../../api/user/apiCategory";
import apiBrand from "../../api/user/apiBrand";
import ProductItem from "./ProductItem";

const Products = () => {
  // === State cho dữ liệu ===
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // === State cho việc lọc và phân trang ===
  const [filters, setFilters] = useState({
    name: "",
    categoryId: [],
    brandId: [],
    minPrice: "",
    maxPrice: "",
    sortBy: "id_desc",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // === State cho UI và quản lý luồng ===
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isInitialSetupDone, setIsInitialSetupDone] = useState(false);

  // === Lấy params từ URL ===
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const keyword = searchParams.get("keyword");
  const categorySlug = location.state?.categorySlug || searchParams.get("category");

  const categoryName = categories.find(cat => cat.slug === categorySlug)?.name || "Danh mục sản phẩm";

  // ✅ EFFECT 1: Thiết lập ban đầu.
  useEffect(() => {
    const setup = async () => {
      try {
        setIsInitialSetupDone(false);
        setLoading(true);

        const [catRes, brandRes] = await Promise.all([
          apiCategory.getAll(),
          apiBrand.getAll(),
        ]);
        
        const fetchedCategories = Array.isArray(catRes) ? catRes : (catRes?.data || []);
        const fetchedBrands = Array.isArray(brandRes) ? brandRes : (brandRes?.data || []);

        setCategories(fetchedCategories);
        setBrands(fetchedBrands);

        let initialCategoryIds = [];
        if (categorySlug) {
          const matchedCategory = fetchedCategories.find(cat => cat.slug === categorySlug);
          if (matchedCategory) initialCategoryIds = [matchedCategory.id];
        }

        setFilters({
          name: keyword || "",
          categoryId: initialCategoryIds,
          brandId: [],
          minPrice: "",
          maxPrice: "",
          sortBy: "id_desc",
        });

        const pageParam = parseInt(searchParams.get("page")) || 1;
        setPage(pageParam);

      } catch (error) {
        console.error("Lỗi setup:", error);
      } finally {
        setIsInitialSetupDone(true);
      }
    };

    setup();
  }, [categorySlug, keyword]);

  // ✅ EFFECT 2: Lấy danh sách sản phẩm.
  useEffect(() => {
    if (!isInitialSetupDone) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        let effectiveFilters = { ...filters };

        // Logic tìm kiếm thông minh
        if (filters.name && filters.categoryId.length === 0) {
          const matchedCategoryByName = categories.find(
            cat => cat.name.toLowerCase().includes(filters.name.toLowerCase())
          );
          if (matchedCategoryByName) {
            effectiveFilters = {
              ...effectiveFilters,
              categoryId: [matchedCategoryByName.id],
              name: "",
            };
          }
        }

        const isFilterOrSortActive =
          effectiveFilters.name ||
          effectiveFilters.categoryId.length > 0 ||
          effectiveFilters.brandId.length > 0 ||
          effectiveFilters.minPrice ||
          effectiveFilters.maxPrice ||
          effectiveFilters.sortBy !== 'id_desc';

        let res;
        if (isFilterOrSortActive) {
          const cleanFilters = Object.fromEntries(
            Object.entries(effectiveFilters).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
          );

          const params = {
            ...cleanFilters,
            categoryId: cleanFilters.categoryId?.length > 0 ? cleanFilters.categoryId : undefined,
            brandId: cleanFilters.brandId?.length > 0 ? cleanFilters.brandId : undefined,
            page
          };
          res = await apiProduct.filter(params);
        } else {
          res = await apiProduct.getAll(page);
        }

        if (res && res.content) {
          setProducts(res.content);
          setTotalPages(res.totalPages || 1);
        } else if (Array.isArray(res)) {
          setProducts(res);
          setTotalPages(1);
        } else if (res && res.data) {
          setProducts(res.data.content || res.data || []);
          setTotalPages(res.data.totalPages || 1);
        }
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, page, isInitialSetupDone, categories]); 

  // === Các hàm xử lý sự kiện ===
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  
  const handleChangePage = (newPage) => {
    setPage(newPage);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(newPage));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll lên đầu khi chuyển trang
  };

  const updateFiltersAndResetPage = (newFilterPart) => {
    setFilters(prev => ({ ...prev, ...newFilterPart }));
    if (page !== 1) {
      setPage(1);
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", "1");
      setSearchParams(newParams);
    }
  };

  const handleFilterChange = (type, value) => {
    const currentValues = filters[type];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    updateFiltersAndResetPage({ [type]: newValues });
  };

  const handlePriceFilter = (range) => {
    const map = {
      "Dưới 100.000đ": { min: "0", max: "100000" },
      "100.000đ - 200.000đ": { min: "100000", max: "200000" },
      "200.000đ - 300.000đ": { min: "200000", max: "300000" },
      "300.000đ - 500.000đ": { min: "300000", max: "500000" },
      "Trên 500.000đ": { min: "500000", max: "999999999" },
    };
    const { min, max } = map[range];
    if (filters.minPrice === min && filters.maxPrice === max) {
      updateFiltersAndResetPage({ minPrice: "", maxPrice: "" });
    } else {
      updateFiltersAndResetPage({ minPrice: min, maxPrice: max });
    }
  };

  const handleSortChange = (e) => {
    updateFiltersAndResetPage({ sortBy: e.target.value });
  };

  const priceFilters = [
    "Dưới 100.000đ", "100.000đ - 200.000đ", "200.000đ - 300.000đ",
    "300.000đ - 500.000đ", "Trên 500.000đ",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* 🌟 BANNER MỚI: Tạo điểm nhấn */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Thực phẩm Tươi & Sạch</h1>
            <p className="opacity-90">Mang tinh hoa nông sản Việt chất lượng cao đến gian bếp gia đình bạn.</p>
        </div>
        {/* Họa tiết trang trí mờ */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-yellow-300 opacity-20 rounded-full blur-2xl"></div>
      </div>

      <div className="flex justify-between items-center mb-4 md:hidden">
        <h2 className="text-xl font-bold text-gray-800">Danh sách sản phẩm</h2>
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm active:scale-95 transition-transform"
        >
          <FaFilter /> Bộ lọc
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* 🌟 SIDEBAR: Sticky & Shadow */}
        <aside
          className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:w-1/4 h-fit
            ${showSidebar ? "fixed inset-0 z-50 overflow-y-auto m-0 rounded-none" : "hidden md:block sticky top-4"} 
          `}
        >
            {showSidebar && <button onClick={toggleSidebar} className="mb-4 text-gray-500 md:hidden">✕ Đóng bộ lọc</button>}
            
            <h2 className="font-bold text-emerald-700 mb-4 border-b border-gray-100 pb-2 uppercase text-sm tracking-wide">Danh mục</h2>
            <ul className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 pr-1">
                {categories.length > 0 ? (
                categories.filter(c => c.parentId !== null).map(c => (
                    <label key={c.id} className="flex items-center gap-3 cursor-pointer group py-1">
                    <div className="relative flex items-center">
                        <input 
                            type="checkbox" 
                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:border-green-600 checked:bg-green-600 focus:ring-green-500"
                            onChange={() => handleFilterChange("categoryId", c.id)}
                            checked={filters.categoryId.includes(c.id)}
                        />
                         <FaCheck className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-white opacity-0 peer-checked:opacity-100" />
                    </div>
                    <span className={`text-sm group-hover:text-green-600 transition-colors ${filters.categoryId.includes(c.id) ? "font-semibold text-green-700" : "text-gray-600"}`}>
                        {c.name}
                    </span>
                    </label>
                ))
                ) : (
                <li className="text-gray-400 text-xs italic">Đang cập nhật...</li>
                )}
            </ul>

            <div className="mt-8">
                <h2 className="font-bold text-emerald-700 mb-4 border-b border-gray-100 pb-2 uppercase text-sm tracking-wide">Mức giá</h2>
                <div className="flex flex-col gap-2">
                {priceFilters.map((p, i) => {
                    const map = {
                        "Dưới 100.000đ": { min: "0", max: "100000" },
                        "100.000đ - 200.000đ": { min: "100000", max: "200000" },
                        "200.000đ - 300.000đ": { min: "200000", max: "300000" },
                        "300.000đ - 500.000đ": { min: "300000", max: "500000" },
                        "Trên 500.000đ": { min: "500000", max: "999999999" },
                    };
                    const { min, max } = map[p];
                    const isChecked = filters.minPrice === min && filters.maxPrice === max;
                    
                    return (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group py-1">
                        <div className="relative flex items-center">
                            <input type="checkbox" className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-300 shadow-sm checked:border-green-600 checked:bg-green-600 focus:ring-green-500"
                            onChange={() => handlePriceFilter(p)}
                            checked={isChecked}
                            />
                             <div className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                        </div>
                        <span className={`text-sm group-hover:text-green-600 transition-colors ${isChecked ? "font-semibold text-green-700" : "text-gray-600"}`}>
                            {p}
                        </span>
                    </label>
                    )
                })}
                </div>
            </div>

            <div className="mt-8">
                <h2 className="font-bold text-emerald-700 mb-4 border-b border-gray-100 pb-2 uppercase text-sm tracking-wide">Thương hiệu</h2>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto scrollbar-thin" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {brands.length > 0 ? (
                    brands.map(b => (
                    <label key={b.id} className="flex items-center gap-3 cursor-pointer group py-1">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        onChange={() => handleFilterChange("brandId", b.id)}
                        checked={filters.brandId.includes(b.id)}
                        />
                        <span className={`text-sm group-hover:text-green-600 ${filters.brandId.includes(b.id) ? "font-semibold text-green-700" : "text-gray-600"}`}>
                        {b.name}
                        </span>
                    </label>
                    ))
                ) : (
                    <p className="text-gray-400 text-xs italic">Không có thương hiệu</p>
                )}
                </div>
            </div>
        </aside>

        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div>
                 <h1 className="text-lg font-bold text-gray-800 uppercase">
                    {keyword ? `Kết quả: "${keyword}"` : categorySlug ? categoryName : "Tất cả sản phẩm"}
                </h1>
                <p className="text-xs text-gray-500 mt-1">Hiển thị <b>{products.length}</b> sản phẩm</p>
            </div>
           
            <div className="flex items-center gap-2 mt-3 sm:mt-0">
              <FaSortAmountDownAlt className="text-gray-400" />
              <select
                className="border-none bg-gray-50 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 font-medium text-gray-700 cursor-pointer"
                onChange={handleSortChange}
                value={filters.sortBy}
              >
                <option value="id_desc">Mới nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
              </select>
            </div>
          </div>

          {loading ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, n) => (
                    <div key={n} className="animate-pulse bg-gray-100 rounded-xl h-64"></div>
                ))}
             </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.length > 0 ? (
                  products.map(product => <ProductItem key={product.id} product={product} />)
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                     <p className="text-gray-400 text-lg mb-2">Không tìm thấy sản phẩm nào.</p>
                     <button onClick={() => setFilters({name: "", categoryId: [], brandId: [], minPrice: "", maxPrice: "", sortBy: "id_desc"})} className="text-green-600 font-medium hover:underline">Xóa bộ lọc</button>
                  </div>
                )}
              </div>

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-10 gap-2 flex-wrap">
                  <button
                    onClick={() => handleChangePage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-green-50 hover:text-green-600 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                  >
                    Trước
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => handleChangePage(p)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        page === p
                          ? "bg-green-600 text-white shadow-md transform scale-105"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-green-50 hover:text-green-600"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  {totalPages > 5 && (
                    <>
                      <span className="px-2 self-end pb-2 text-gray-400">...</span>
                      <button
                        onClick={() => handleChangePage(totalPages)}
                        className={`w-10 h-10 rounded-lg font-medium bg-white border border-gray-200 text-gray-600 hover:bg-green-50 hover:text-green-600`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleChangePage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-green-50 hover:text-green-600 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* 🌟 FEATURE SECTION: Phần bạn yêu cầu thêm vào cuối */}
      <section className="mt-16 pt-10 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2 sm:px-0">
        {[
          { t: "Vận chuyển miễn phí", s: "Hóa đơn trên 3 triệu" },
          { t: "Đổi trả miễn phí", s: "Trong vòng 7 ngày" },
          { t: "100% Hoàn tiền", s: "Nếu sản phẩm lỗi" },
          { t: "Hotline: 1900 6750", s: "Hỗ trợ 24/7" },
        ].map((b, i) => (
          <div
            key={i}
            className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-default"
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
    </div>
  );
};

export default Products;
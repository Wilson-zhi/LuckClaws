"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type AdminLanguage = "zh" | "en";

export type AdminLabel = {
  zh: string;
  en: string;
};

type AdminLanguageContextValue = {
  language: AdminLanguage;
  setLanguage: (language: AdminLanguage) => void;
  t: (key: AdminLabelKey) => string;
  text: (label: AdminLabel | string) => string;
};

export const adminLanguageStorageKey = "luck-claws-admin-language";

export const adminLabels = {
  admin: { zh: "后台", en: "Admin" },
  languageChinese: { zh: "中文", en: "中文" },
  languageEnglish: { zh: "English", en: "English" },
  dashboard: { zh: "仪表盘", en: "Dashboard" },
  products: { zh: "商品", en: "Products" },
  categories: { zh: "分类", en: "Categories" },
  orders: { zh: "订单", en: "Orders" },
  customers: { zh: "客户", en: "Customers" },
  homepage: { zh: "首页", en: "Homepage" },
  manageStore: { zh: "管理 LUCK CLAWS 店铺运营", en: "Manage LUCK CLAWS store operations." },
  reviewPaymentFulfillment: { zh: "查看付款和发货状态", en: "Review payment and fulfillment status." },
  viewCustomerProfiles: { zh: "查看客户资料和角色", en: "View customer profile and role basics." },
  manageCatalog: { zh: "管理商品目录和展示设置", en: "Manage catalog and display settings." },
  manageCategories: { zh: "管理商品分类、导航和首页展示", en: "Manage product categories, navigation, and homepage display." },
  manageHomepage: { zh: "管理首页主视觉、按钮和信任标识。", en: "Manage homepage hero, buttons, and trust badges." },
  backToAdmin: { zh: "返回后台", en: "Back to Admin" },
  backToProducts: { zh: "返回商品列表", en: "Back to Products" },
  backToCategories: { zh: "返回分类", en: "Back to Categories" },
  backToCustomers: { zh: "返回客户", en: "Back to Customers" },
  backToOrders: { zh: "返回订单", en: "Back to Orders" },
  backToMyAccount: { zh: "返回我的账户", en: "Back to My Account" },
  view: { zh: "查看", en: "View" },
  edit: { zh: "编辑", en: "Edit" },
  preview: { zh: "预览", en: "Preview" },
  archive: { zh: "归档", en: "Archive" },
  archiving: { zh: "正在归档...", en: "Archiving..." },
  actions: { zh: "操作", en: "Actions" },
  notPublic: { zh: "未公开", en: "Not public" },
  productNotPublic: { zh: "商品未公开", en: "Product is not public." },
  yes: { zh: "是", en: "Yes" },
  no: { zh: "否", en: "No" },
  unavailable: { zh: "不可用", en: "Unavailable" },
  notProvided: { zh: "未填写", en: "Not provided" },
  notAdded: { zh: "未添加", en: "Not added" },
  default: { zh: "默认", en: "Default" },
  all: { zh: "全部", en: "All" },
  allCategories: { zh: "全部分类", en: "All categories" },
  loadingProduct: { zh: "正在加载商品...", en: "Loading product..." },
  loadingProducts: { zh: "正在加载商品...", en: "Loading products..." },
  loadingCustomer: { zh: "正在加载客户...", en: "Loading customer..." },
  loadingCustomers: { zh: "正在加载客户...", en: "Loading customers..." },
  loadingCategories: { zh: "正在加载分类...", en: "Loading categories..." },
  loadingOrder: { zh: "正在加载订单...", en: "Loading order..." },
  loadingOrders: { zh: "正在加载订单...", en: "Loading orders..." },
  loadingHomepage: { zh: "正在加载首页设置...", en: "Loading homepage settings..." },
  checkingAdminAccess: { zh: "正在验证后台权限...", en: "Checking admin access..." },
  noProductsYet: { zh: "暂无商品", en: "No products yet." },
  noCategoriesYet: { zh: "暂无分类", en: "No categories yet." },
  noProductsMatchFilters: { zh: "没有符合筛选条件的商品", en: "No products match your filters." },
  noCustomersYet: { zh: "暂无客户", en: "No customers found yet." },
  noOrdersYet: { zh: "暂无订单", en: "No orders yet." },
  noSavedAddresses: { zh: "暂无保存地址", en: "No saved addresses." },
  noOrderItems: { zh: "未找到订单商品", en: "No order items found." },
  productNotFound: { zh: "未找到商品", en: "Product not found." },
  categoryNotFound: { zh: "未找到分类", en: "Category not found." },
  customerNotFound: { zh: "未找到客户", en: "Customer not found." },
  orderNotFound: { zh: "未找到订单", en: "Order not found." },
  accessDenied: { zh: "拒绝访问", en: "Access Denied" },
  noAdminAccess: { zh: "此账号没有后台权限", en: "This account does not have admin access." },
  adminAccessUnverified: { zh: "无法验证后台权限", en: "Admin access could not be verified." },
  supabaseMissing: {
    zh: "当前构建未配置 Supabase 公开环境变量",
    en: "Supabase public environment variables are not configured for this build."
  },
  manageProductRecords: { zh: "管理 Supabase 商品记录", en: "Manage Supabase product records." },
  manageCategoryRecords: { zh: "管理 Supabase 商品分类记录", en: "Manage Supabase product category records." },
  productVisibilityNote: {
    zh: "上架商品会显示在前台。草稿和已归档商品会从前台商品页、分类、搜索、商品 Feed 和站点地图中隐藏。",
    en: "Active products are visible on the public storefront. Draft and archived products stay hidden from public product pages, collections, search, product feed, and sitemap."
  },
  categoryVisibilityNote: {
    zh: "上架分类可用于后台商品选择。草稿和已归档分类不会显示在公开导航或首页分类卡片中。",
    en: "Active categories can be used in product selection. Draft and archived categories are hidden from public navigation and homepage category cards."
  },
  addProduct: { zh: "添加商品", en: "Add Product" },
  editProduct: { zh: "编辑商品", en: "Edit Product" },
  addCategory: { zh: "添加分类", en: "Add Category" },
  editCategory: { zh: "编辑分类", en: "Edit Category" },
  saveCategory: { zh: "保存分类", en: "Save Category" },
  saveProduct: { zh: "保存商品", en: "Save Product" },
  saveHomepage: { zh: "保存首页", en: "Save Homepage" },
  saving: { zh: "正在保存...", en: "Saving..." },
  cancel: { zh: "取消", en: "Cancel" },
  title: { zh: "标题", en: "Title" },
  productTitle: { zh: "商品标题", en: "Title" },
  categoryName: { zh: "分类名称", en: "Category name" },
  categorySlug: { zh: "分类 Slug", en: "Category slug" },
  categoryDescription: { zh: "分类描述", en: "Category description" },
  slug: { zh: "Slug", en: "Slug" },
  category: { zh: "分类", en: "Category" },
  productCategory: { zh: "商品分类", en: "Category" },
  price: { zh: "价格", en: "Price" },
  compareAtPrice: { zh: "划线价", en: "Compare at price" },
  currency: { zh: "货币", en: "Currency" },
  description: { zh: "描述", en: "Description" },
  mainImageUrl: { zh: "主图链接", en: "Main Image URL" },
  mainImageUrlFull: {
    zh: "主图链接（由图库主图自动更新）",
    en: "Main Image URL (auto-updated from gallery primary image)"
  },
  useGalleryHelper: {
    zh: "使用下方商品图片库上传和管理图片",
    en: "Use Product Image Gallery below to upload and manage product images."
  },
  noMainImageUrl: { zh: "暂无主图链接", en: "No main image URL yet." },
  noProductImage: { zh: "暂无商品图片", en: "No product image yet." },
  productImage: { zh: "商品主图", en: "Product Image" },
  productImagePreview: { zh: "商品图片预览", en: "Product image preview" },
  productImageGallery: { zh: "商品图片库", en: "Product Image Gallery" },
  productGalleryDescription: {
    zh: "上传商品图片、选择主图并编辑 Alt 文本",
    en: "Upload product gallery images, choose one primary image, and edit alt text."
  },
  uploadGalleryImages: { zh: "上传图库图片", en: "Upload gallery images" },
  uploadingImage: { zh: "正在上传图片...", en: "Uploading image..." },
  galleryImageUploaded: { zh: "图库图片已上传", en: "Gallery image uploaded." },
  galleryImagesUploaded: { zh: "图库图片已上传", en: "gallery images uploaded." },
  addImageUrlToGallery: { zh: "添加图片链接到图库", en: "Add Image URL to Gallery" },
  noGalleryImages: { zh: "暂无图库图片", en: "No gallery images yet." },
  primaryImage: { zh: "主图", en: "Primary image" },
  primaryImageLabel: { zh: "主图", en: "Primary Image" },
  setAsPrimary: { zh: "设为主图", en: "Set as Primary" },
  moveUp: { zh: "上移", en: "Move Up" },
  moveDown: { zh: "下移", en: "Move Down" },
  remove: { zh: "删除", en: "Remove" },
  altText: { zh: "图片 Alt 文本", en: "Alt text" },
  imageUrl: { zh: "图片链接", en: "Image URL" },
  categoryImage: { zh: "分类图片", en: "Category image" },
  categoryImagePreview: { zh: "分类图片预览", en: "Category image preview" },
  noCategoryImage: { zh: "暂无分类图片", en: "No category image yet." },
  status: { zh: "状态", en: "Status" },
  active: { zh: "上架", en: "Active" },
  draft: { zh: "草稿", en: "Draft" },
  archived: { zh: "已归档", en: "Archived" },
  statusHelper: {
    zh: "上架 = 前台公开显示；草稿 = 前台隐藏；已归档 = 前台隐藏并保留记录",
    en: "Active = visible publicly; Draft = hidden from public storefront; Archived = hidden and kept for record."
  },
  categoryStatusHelper: {
    zh: "上架 = 可用于公开展示；草稿 = 暂不公开；已归档 = 隐藏并保留记录。",
    en: "Active = available for public display; Draft = not public yet; Archived = hidden and kept for records."
  },
  inventory: { zh: "库存", en: "Inventory" },
  inventoryStatus: { zh: "库存状态", en: "Inventory status" },
  inStock: { zh: "有库存", en: "In stock" },
  outOfStock: { zh: "缺货", en: "Out of stock" },
  preorder: { zh: "预售", en: "Preorder" },
  stockQuantity: { zh: "库存数量", en: "Stock quantity" },
  sale: { zh: "促销", en: "Sale" },
  saleOnly: { zh: "仅促销", en: "Sale only" },
  nonSaleOnly: { zh: "非促销", en: "Non-sale only" },
  featured: { zh: "推荐", en: "Featured" },
  storefrontDisplay: { zh: "前台展示", en: "Storefront display" },
  categoryDisplay: { zh: "分类展示", en: "Category display" },
  storefrontDisplayHelper: {
    zh: "控制商品排序、首页展示位置和卡片标签",
    en: "Control product ordering, homepage placement, and card badges."
  },
  sortOrder: { zh: "排序", en: "Sort order" },
  sortOrderHelper: {
    zh: "数字越小越靠前；留空使用默认排序",
    en: "Lower numbers appear first. Leave blank/default for normal ordering."
  },
  homepageSection: { zh: "首页展示区", en: "Homepage section" },
  homepageFeatured: { zh: "推荐商品", en: "Featured" },
  homepageBestSeller: { zh: "热销商品", en: "Best Seller" },
  homepageNewArrivals: { zh: "新品上架", en: "New Arrivals" },
  none: { zh: "无", en: "None" },
  badge: { zh: "标签", en: "Badge" },
  publishedAt: { zh: "发布时间", en: "Published at" },
  heroContent: { zh: "首页主视觉", en: "Hero content" },
  homepageContentDescription: {
    zh: "这些字段控制首页首屏文案、按钮和图片。留空字段会在前台使用安全备用内容。",
    en: "These fields control homepage hero copy, buttons, and image. Blank fields use safe storefront fallbacks."
  },
  heroEyebrow: { zh: "主视觉眉题", en: "Hero eyebrow" },
  heroTitle: { zh: "主视觉标题", en: "Hero title" },
  heroSubtitle: { zh: "主视觉副标题", en: "Hero subtitle" },
  primaryButtonText: { zh: "主按钮文本", en: "Primary button text" },
  primaryButtonLink: { zh: "主按钮链接", en: "Primary button link" },
  secondaryButtonText: { zh: "次按钮文本", en: "Secondary button text" },
  secondaryButtonLink: { zh: "次按钮链接", en: "Secondary button link" },
  heroImageUrl: { zh: "主视觉图片链接", en: "Hero image URL" },
  heroImageAltText: { zh: "主视觉图片 Alt 文本", en: "Hero image alt text" },
  heroImagePreview: { zh: "主视觉图片预览", en: "Hero image preview" },
  noHomepageImage: { zh: "暂无首页图片", en: "No homepage image yet." },
  uploadHomepageImage: { zh: "上传首页图片", en: "Upload homepage image" },
  homepageImageUploadHelper: {
    zh: "支持 JPEG、PNG、WebP，最大 5MB。上传成功后会自动填入图片链接。",
    en: "Supports JPEG, PNG, and WebP up to 5MB. A successful upload automatically fills the image URL."
  },
  homepageImageUploaded: { zh: "首页图片已上传。", en: "Homepage image uploaded." },
  featuredLabel: { zh: "精选标签", en: "Featured label" },
  featuredText: { zh: "精选文字", en: "Featured text" },
  trustBadges: { zh: "信任标识", en: "Trust badges" },
  trustBadgesDescription: {
    zh: "编辑首页顶部紧凑信任标识。删除全部并保存会存为空列表，前台仍会使用备用标识。",
    en: "Edit the compact trust badges near the top of the homepage. Saving none stores an empty list and the storefront keeps fallback badges."
  },
  trustBadgeIcon: { zh: "图标", en: "Icon" },
  trustBadgeTitle: { zh: "标题", en: "Title" },
  addBadge: { zh: "添加标识", en: "Add Badge" },
  noTrustBadges: { zh: "暂无信任标识", en: "No trust badges." },
  homepageSaved: { zh: "首页设置已保存。", en: "Homepage settings saved." },
  productDetailContent: { zh: "商品详情内容", en: "Product detail content" },
  editableProductDetailContent: { zh: "可编辑商品详情内容", en: "Editable Product Detail Content" },
  productDetailContentHelper: {
    zh: "这些字段控制前台商品详情页；留空会使用当前备用内容",
    en: "These fields control the public product detail page. Leave any field blank to keep the current fallback content."
  },
  shortDescription: { zh: "短描述", en: "Short description" },
  shortDescriptionHelper: {
    zh: "显示在商品页顶部附近；留空则使用 Description",
    en: "Used near the top of the product page. Leave blank to use Description."
  },
  productHighlights: { zh: "商品亮点", en: "Product Highlights" },
  productHighlightsDescription: {
    zh: "显示为商品卖点卡片；图标可选",
    en: "Shown as product benefit cards. Icon is optional."
  },
  addHighlight: { zh: "添加亮点", en: "Add Highlight" },
  noProductHighlights: {
    zh: "暂无商品亮点。商品页会使用可用的备用内容。",
    en: "No product highlights. The product page will use fallback content if available."
  },
  highlight: { zh: "亮点", en: "Highlight" },
  iconOptional: { zh: "图标（可选）", en: "Icon optional" },
  iconPaw: { zh: "爪印", en: "Paw" },
  iconShield: { zh: "盾牌", en: "Shield" },
  iconHeart: { zh: "爱心", en: "Heart" },
  iconStar: { zh: "星标", en: "Star" },
  iconSparkles: { zh: "闪光", en: "Sparkles" },
  iconLeaf: { zh: "叶子", en: "Leaf" },
  iconTruck: { zh: "卡车", en: "Truck" },
  iconPackage: { zh: "包裹", en: "Package" },
  iconCheck: { zh: "勾选", en: "Check" },
  iconRotate: { zh: "旋转", en: "Rotate" },
  iconLock: { zh: "锁", en: "Lock" },
  text: { zh: "文本", en: "Text" },
  detailsAtGlance: { zh: "商品概览", en: "Details at a Glance" },
  detailsAtGlanceDescription: {
    zh: "显示为紧凑的标签和值",
    en: "Shown as compact label and value rows."
  },
  addDetailRow: { zh: "添加概览行", en: "Add Detail Row" },
  noDetailRows: {
    zh: "暂无概览行。商品页会使用可用的备用内容。",
    en: "No detail rows. The product page will use fallback content if available."
  },
  label: { zh: "标签", en: "Label" },
  value: { zh: "值", en: "Value" },
  position: { zh: "位置", en: "Position" },
  bestFor: { zh: "适用场景", en: "Best For" },
  bestForDescription: { zh: "商品页使用场景短要点", en: "Short use-case bullets for the product page." },
  addBestForItem: { zh: "添加适用场景", en: "Add Best For Item" },
  noBestFor: {
    zh: "暂无适用场景。商品页会使用可用的备用内容。",
    en: "No Best For items. The product page will use fallback content if available."
  },
  careInstructions: { zh: "护理说明", en: "Care Instructions" },
  careInstructionsDescription: { zh: "商品页护理短要点", en: "Short care bullets for the product page." },
  addCareInstruction: { zh: "添加护理说明", en: "Add Care Instruction" },
  noCareInstructions: {
    zh: "暂无护理说明。商品页会使用可用的备用内容。",
    en: "No care instructions. The product page will use fallback content if available."
  },
  productFaq: { zh: "商品问答", en: "Product Questions / FAQ" },
  productFaqCard: { zh: "商品问答", en: "Product FAQs" },
  productFaqDescription: { zh: "显示在商品问答区域", en: "Shown in the product questions section." },
  addFaq: { zh: "添加 FAQ", en: "Add FAQ" },
  noProductFaq: {
    zh: "暂无商品问答。商品页会使用可用的备用问题。",
    en: "No product FAQs. The product page will use fallback questions if available."
  },
  faq: { zh: "问答", en: "FAQ" },
  question: { zh: "问题", en: "Question" },
  answer: { zh: "回答", en: "Answer" },
  accordionSections: { zh: "折叠内容区", en: "Accordion Sections" },
  accordionSectionsDescription: {
    zh: "显示在可展开的商品信息区域",
    en: "Shown in the expandable product information area."
  },
  addAccordionSection: { zh: "添加折叠内容", en: "Add Accordion Section" },
  noAccordionSections: {
    zh: "暂无折叠内容。商品页会使用可用的备用内容。",
    en: "No accordion sections. The product page will use fallback sections if available."
  },
  section: { zh: "内容区", en: "Section" },
  content: { zh: "内容", en: "Content" },
  relatedProductSlugs: { zh: "相关商品 Slug", en: "Related Product Slugs" },
  relatedProductSlugsDescription: {
    zh: "输入商品 Slug 来控制相关商品；空白会被忽略",
    en: "Enter product slugs to control related products. Blank entries are ignored."
  },
  addRelatedProduct: { zh: "添加相关商品", en: "Add Related Product" },
  noRelatedProductSlugs: {
    zh: "暂无相关商品 Slug。商品页会自动选择相关商品。",
    en: "No related product slugs. The product page will choose related products automatically."
  },
  productSlug: { zh: "商品 Slug", en: "Product slug" },
  seoTitle: { zh: "SEO 标题", en: "SEO title" },
  seoDescription: { zh: "SEO 描述", en: "SEO description" },
  googleProductCategory: { zh: "Google 商品分类", en: "Google product category" },
  showInNav: { zh: "显示在导航", en: "Show in nav" },
  showOnHome: { zh: "显示在首页", en: "Show on home" },
  legacyCategory: { zh: "旧分类", en: "Legacy category" },
  categoryLoadWarning: { zh: "无法加载分类下拉选项；可稍后重试。", en: "Unable to load category dropdown options. Try again later." },
  productDetail: { zh: "商品详情", en: "Product Detail" },
  productRecordDescription: { zh: "查看 Supabase 商品记录", en: "Review Supabase product records." },
  customerDetail: { zh: "客户详情", en: "Customer Detail" },
  customerDetailDescription: {
    zh: "查看客户资料、保存地址和相关订单",
    en: "Review customer profile, saved addresses, and related orders."
  },
  customerProfile: { zh: "客户资料", en: "Customer Profile" },
  email: { zh: "邮箱", en: "Email" },
  name: { zh: "姓名", en: "Name" },
  role: { zh: "角色", en: "Role" },
  registered: { zh: "注册时间", en: "Registered" },
  addresses: { zh: "地址", en: "Addresses" },
  savedAddresses: { zh: "保存地址", en: "Saved Addresses" },
  phone: { zh: "电话", en: "Phone" },
  addressLine1: { zh: "地址行 1", en: "Address line 1" },
  addressLine2: { zh: "地址行 2", en: "Address line 2" },
  city: { zh: "城市", en: "City" },
  state: { zh: "州", en: "State" },
  postalCode: { zh: "邮编", en: "Postal code" },
  country: { zh: "国家", en: "Country" },
  created: { zh: "创建", en: "Created" },
  updated: { zh: "更新", en: "Updated" },
  orderDetail: { zh: "订单详情", en: "Order Detail" },
  orderDetailDescription: { zh: "查看订单付款、收货地址和商品明细", en: "Review order payment, shipping, and item details." },
  orderSummary: { zh: "订单概览", en: "Order Summary" },
  orderNumber: { zh: "订单号", en: "Order number" },
  orderNumberUnavailable: { zh: "订单号不可用", en: "Order number unavailable" },
  customerEmail: { zh: "客户邮箱", en: "Customer email" },
  customerName: { zh: "客户姓名", en: "Customer name" },
  customerPhone: { zh: "客户电话", en: "Customer phone" },
  payment: { zh: "付款", en: "Payment" },
  paymentStatus: { zh: "付款状态", en: "Payment status" },
  fulfillment: { zh: "发货", en: "Fulfillment" },
  fulfillmentStatus: { zh: "发货状态", en: "Fulfillment status" },
  subtotal: { zh: "小计", en: "Subtotal" },
  shipping: { zh: "运费", en: "Shipping" },
  total: { zh: "合计", en: "Total" },
  source: { zh: "来源", en: "Source" },
  shippingAddress: { zh: "收货地址", en: "Shipping Address" },
  orderItems: { zh: "订单商品", en: "Order Items" },
  product: { zh: "商品", en: "Product" },
  quantity: { zh: "数量", en: "Quantity" },
  unitPrice: { zh: "单价", en: "Unit Price" },
  lineTotal: { zh: "行合计", en: "Line Total" },
  pending: { zh: "待处理", en: "pending" },
  paid: { zh: "已付款", en: "paid" },
  captured: { zh: "已收款", en: "captured" },
  failed: { zh: "失败", en: "failed" },
  unfulfilled: { zh: "未发货", en: "unfulfilled" },
  fulfilled: { zh: "已发货", en: "fulfilled" },
  canceled: { zh: "已取消", en: "canceled" },
  searchByTitleSlug: { zh: "按标题或 Slug 搜索", en: "Search by title or slug" },
  showingProducts: { zh: "显示", en: "Showing" },
  of: { zh: "/", en: "of" },
  productCountUnit: { zh: "个商品", en: "products" },
  archiveConfirmSuffix: {
    zh: "已归档商品会从前台隐藏，但仍保留在后台。",
    en: "Archived products are hidden publicly but remain available in admin."
  },
  archiveCategoryConfirmSuffix: {
    zh: "已归档分类不会显示在公开导航或首页分类卡片中，但仍会保留在后台。",
    en: "Archived categories are hidden from public navigation and homepage cards but remain available in admin."
  },
  customerManagementFallback: {
    zh: "客户管理暂时无法加载",
    en: "Customer management will be connected here."
  },
  unableToLoadProduct: { zh: "无法加载商品", en: "Unable to load product." },
  unableToLoadProducts: { zh: "无法加载商品", en: "Unable to load products." },
  unableToSaveProduct: { zh: "无法保存商品", en: "Unable to save product." },
  unableToLoadHomepage: { zh: "无法加载首页设置", en: "Unable to load homepage settings." },
  unableToSaveHomepage: { zh: "无法保存首页设置", en: "Unable to save homepage settings." },
  unableToArchiveProduct: { zh: "无法归档商品", en: "Unable to archive product." },
  unableToLoadCategory: { zh: "无法加载分类", en: "Unable to load category." },
  unableToLoadCategories: { zh: "无法加载分类", en: "Unable to load categories." },
  unableToSaveCategory: { zh: "无法保存分类", en: "Unable to save category." },
  unableToArchiveCategory: { zh: "无法归档分类", en: "Unable to archive category." },
  unableToLoadCustomer: { zh: "无法加载客户", en: "Unable to load customer." },
  unableToLoadCustomers: { zh: "无法加载客户", en: "Unable to load customers." },
  unableToLoadOrder: { zh: "无法加载订单", en: "Unable to load order." },
  unableToLoadOrders: { zh: "无法加载订单", en: "Unable to load orders." },
  chooseImage: { zh: "请选择一张图片", en: "Please choose an image." },
  chooseValidImage: { zh: "请选择 JPEG、PNG 或 WebP 图片", en: "Please choose a JPEG, PNG, or WebP image." },
  imageSizeLimit: { zh: "图片必须小于或等于 5MB", en: "Image must be 5MB or smaller." },
  uploadConfigMissing: { zh: "当前构建未配置 Supabase 上传", en: "Supabase is not configured for uploads in this build." },
  unableToUploadGallery: { zh: "无法上传图库图片", en: "Unable to upload gallery images." },
  unableToUploadHomepageImage: { zh: "无法上传首页图片", en: "Unable to upload homepage image." },
  addImageUrlFirst: { zh: "请先有主图链接，再添加到图库", en: "Add an Image URL before adding it to the gallery." },
  duplicateImageUrl: { zh: "此图片链接已在图库中", en: "This Image URL is already in the gallery." },
  imageUrlAdded: { zh: "图片链接已添加到图库", en: "Image URL added to gallery." },
  titleRequired: { zh: "标题必填", en: "Title is required." },
  nameRequired: { zh: "名称必填", en: "Name is required." },
  slugRequired: { zh: "Slug 必填", en: "Slug is required." },
  slugInvalid: { zh: "Slug 只能使用小写字母、数字和连字符", en: "Slug must use lowercase letters, numbers, and hyphens." },
  categoryStatusInvalid: { zh: "分类状态必须是 active、draft 或 archived", en: "Category status must be active, draft, or archived." },
  priceRequired: { zh: "价格必填", en: "Price is required." },
  priceInvalid: { zh: "价格必须大于或等于 0", en: "Price must be greater than or equal to 0." },
  compareAtInvalid: { zh: "划线价必须大于或等于 0", en: "Compare at price must be greater than or equal to 0." },
  stockInvalid: { zh: "库存数量必须大于或等于 0", en: "Stock quantity must be greater than or equal to 0." },
  sortInvalid: { zh: "排序必须是正整数，或留空", en: "Sort order must be a positive whole number, or leave it blank." },
  statusInvalid: { zh: "状态必须是 active、draft 或 archived", en: "Status must be active, draft, or archived." },
  inventoryInvalid: {
    zh: "库存状态必须是 in_stock、out_of_stock 或 preorder",
    en: "Inventory status must be in stock, out of stock, or preorder."
  },
  homepageInvalid: {
    zh: "首页展示区必须是 featured、best_seller、new_arrivals 或留空",
    en: "Homepage section must be featured, best_seller, new_arrivals, or blank."
  },
  publishedInvalid: { zh: "发布时间必须是有效日期", en: "Published date must be a valid date." },
  highlightsInvalid: {
    zh: "有内容的商品亮点必须包含标题和文本",
    en: "Product highlight rows with content must include title and text."
  },
  detailRowsInvalid: { zh: "有内容的概览行必须包含标签和值", en: "Detail rows with content must include label and value." },
  faqInvalid: { zh: "有内容的 FAQ 必须包含问题和回答", en: "FAQ rows with content must include question and answer." },
  accordionInvalid: {
    zh: "有内容的折叠内容区必须包含标题和内容",
    en: "Accordion sections with content must include title and content."
  },
  slugChangeWarning: { zh: "修改 Slug 可能会改变前台商品链接", en: "Changing slug may change the public product URL." }
} as const;

export type AdminLabelKey = keyof typeof adminLabels;

const AdminLanguageContext = createContext<AdminLanguageContextValue | null>(null);

export function adminLabel(zh: string, en: string): AdminLabel {
  return { zh, en };
}

export function textForLanguage(label: AdminLabel | string, language: AdminLanguage) {
  return typeof label === "string" ? label : label[language];
}

export function useAdminLanguagePreference() {
  const [language, setLanguageState] = useState<AdminLanguage>("zh");

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(adminLanguageStorageKey);

    if (storedLanguage === "zh" || storedLanguage === "en") {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = useCallback((nextLanguage: AdminLanguage) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(adminLanguageStorageKey, nextLanguage);
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: AdminLabelKey) => adminLabels[key][language],
      text: (label: AdminLabel | string) => textForLanguage(label, language)
    }),
    [language, setLanguage]
  );

  return value;
}

export function AdminLanguageProvider({
  value,
  children
}: {
  value: AdminLanguageContextValue;
  children: React.ReactNode;
}) {
  return <AdminLanguageContext.Provider value={value}>{children}</AdminLanguageContext.Provider>;
}

export function useAdminLanguage() {
  const context = useContext(AdminLanguageContext);

  if (!context) {
    throw new Error("useAdminLanguage must be used inside AdminLanguageProvider.");
  }

  return context;
}

export function formatAdminStatus(value: string | null, t: (key: AdminLabelKey) => string) {
  const normalizedValue = value?.trim() ?? "";
  const statusLabels: Record<string, AdminLabelKey> = {
    active: "active",
    draft: "draft",
    archived: "archived",
    in_stock: "inStock",
    out_of_stock: "outOfStock",
    preorder: "preorder",
    pending: "pending",
    paid: "paid",
    captured: "captured",
    failed: "failed",
    unfulfilled: "unfulfilled",
    fulfilled: "fulfilled",
    canceled: "canceled",
    paypal: "payment",
    featured: "homepageFeatured",
    best_seller: "homepageBestSeller",
    new_arrivals: "homepageNewArrivals"
  };

  const labelKey = statusLabels[normalizedValue];

  return labelKey ? t(labelKey) : normalizedValue ? normalizedValue.replaceAll("_", " ") : t("notProvided");
}

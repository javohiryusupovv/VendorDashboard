"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "uz" | "en"

interface Translations {
  [key: string]: {
    uz: string
    en: string
  }
}

const translations: Translations = {
  dashboard: { uz: "Boshqaruv paneli", en: "Dashboard" },
  products: { uz: "Mahsulotlar", en: "Products" },
  orders: { uz: "Buyurtmalar", en: "Orders" },
  analytics: { uz: "Analitika", en: "Analytics" },
  settings: { uz: "Sozlamalar", en: "Settings" },
  login: { uz: "Kirish", en: "Login" },
  logout: { uz: "Chiqish", en: "Logout" },
  username: { uz: "Foydalanuvchi nomi", en: "Username" },
  password: { uz: "Parol", en: "Password" },
  search: { uz: "Qidirish", en: "Search" },
  add_product: { uz: "Mahsulot qo'shish", en: "Add Product" },
  edit: { uz: "Tahrirlash", en: "Edit" },
  delete: { uz: "O'chirish", en: "Delete" },
  save: { uz: "Saqlash", en: "Save" },
  cancel: { uz: "Bekor qilish", en: "Cancel" },
  title: { uz: "Nomi", en: "Title" },
  price: { uz: "Narxi", en: "Price" },
  category: { uz: "Kategoriya", en: "Category" },
  stock: { uz: "Omborda", en: "Stock" },
  description: { uz: "Tavsif", en: "Description" },
  total_sales: { uz: "Jami sotuvlar", en: "Total Sales" },
  total_orders: { uz: "Jami buyurtmalar", en: "Total Orders" },
  total_products: { uz: "Jami mahsulotlar", en: "Total Products" },
  revenue: { uz: "Daromad", en: "Revenue" },
  daily: { uz: "Kunlik", en: "Daily" },
  weekly: { uz: "Haftalik", en: "Weekly" },
  export_csv: { uz: "CSV eksport", en: "Export CSV" },
  no_products: { uz: "Mahsulotlar topilmadi", en: "No products found" },
  loading: { uz: "Yuklanmoqda...", en: "Loading..." },
  welcome: { uz: "Xush kelibsiz", en: "Welcome" },
  vendor_dashboard: { uz: "Vendor Dashboard", en: "Vendor Dashboard" },
  all_categories: { uz: "Barcha kategoriyalar", en: "All Categories" },
  filter_by_category: { uz: "Kategoriya bo'yicha", en: "Filter by category" },
  actions: { uz: "Amallar", en: "Actions" },
  image: { uz: "Rasm", en: "Image" },
  customer: { uz: "Mijoz", en: "Customer" },
  date: { uz: "Sana", en: "Date" },
  status: { uz: "Holat", en: "Status" },
  total: { uz: "Jami", en: "Total" },
  items: { uz: "Mahsulotlar", en: "Items" },
  notifications: { uz: "Bildirishnomalar", en: "Notifications" },
  new_order: { uz: "Yangi buyurtma", en: "New order" },
  product_sold: { uz: "Mahsulot sotildi", en: "Product sold" },
  dark_mode: { uz: "Qorong'i rejim", en: "Dark mode" },
  light_mode: { uz: "Yorug' rejim", en: "Light mode" },
  brand: { uz: "Brend", en: "Brand" },
  rating: { uz: "Reyting", en: "Rating" },
  discount: { uz: "Chegirma", en: "Discount" },
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("uz")

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return <I18nContext.Provider value={{ language, setLanguage, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

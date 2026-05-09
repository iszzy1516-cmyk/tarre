# TAREÉ JEWELRY — E-Commerce Platform

## Overview
Build a luxury Nigerian jewelry e-commerce platform for **TAREÉ JEWELRY** using **FastAPI (backend)** + **React + Vite + TypeScript (frontend)**. The design is finalized in Google Stitch — a dark navy + champagne gold luxury aesthetic with cinematic hero sections, category grids, product showcases, and editorial photography. This is a production-ready MVP with payment integration (Paystack + Flutterwave), WhatsApp support, and a custom admin dashboard.

---

## Brand Identity
- **Logo**: Gold butterfly monogram with crown, deep navy background
- **Brand Name**: "TAREÉ" in refined gold serif typography, "JEWELRY" underneath
- **Color Palette**:
  - Deep Navy: `#1a1f2e` (primary background, nav, footer)
  - Champagne Gold: `#d4af37` (accents, CTAs, headings, hover states)
  - Soft Cream: `#f5f0e8` (secondary backgrounds, trust bar)
  - Pure White: `#ffffff` (product cards, text on dark)
  - Text Dark: `#2d2d2d` (body text on light backgrounds)
- **Typography**: 
  - Headings: Playfair Display or Cormorant Garamond (serif, elegant)
  - Body: Inter or Lato (sans-serif, readable)
- **Vibe**: Royal, feminine, timeless luxury with African elegance

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite + TypeScript |
| **Styling** | Tailwind CSS v4 + Framer Motion (animations) |
| **State Management** | Zustand (client state: cart, auth, UI) + TanStack Query v5 (server state) |
| **Routing** | React Router v7 (data API routes) |
| **HTTP Client** | Axios with interceptors |
| **Backend** | FastAPI + Pydantic v2 + SQLAlchemy 2.0 (async) |
| **Database** | PostgreSQL 15+ |
| **Migrations** | Alembic |
| **Auth** | JWT (access + refresh tokens) in `httpOnly` cookies |
| **Payments** | Paystack (primary) + Flutterwave (fallback) |
| **Image Storage** | Cloudinary |
| **Search** | Meilisearch (self-hosted or cloud) |
| **Email** | Resend or SendGrid |
| **WhatsApp** | WhatsApp Business API (Twilio or direct) |
| **Admin Dashboard** | React + Shadcn UI (separate build or protected routes) |
| **Hosting** | Render/Railway (API + DB) + Vercel (Frontend) |

---

## Project Structure

```
taree-jewelry/
├── taree-api/                    # FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI app factory, middleware, CORS
│   │   ├── config.py             # Pydantic Settings (env vars)
│   │   ├── database.py           # SQLAlchemy async engine, session, base
│   │   ├── dependencies.py       # Auth deps (get_current_user, get_admin_user)
│   │   ├── models/               # SQLAlchemy ORM models
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   ├── category.py
│   │   │   ├── order.py
│   │   │   ├── review.py
│   │   │   ├── banner.py
│   │   │   └── wishlist.py
│   │   ├── schemas/              # Pydantic request/response models
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   ├── category.py
│   │   │   ├── cart.py
│   │   │   ├── order.py
│   │   │   ├── payment.py
│   │   │   └── review.py
│   │   ├── routers/              # API route modules
│   │   │   ├── __init__.py
│   │   │   ├── auth.py           # Register, login, logout, refresh, me
│   │   │   ├── users.py          # Profile, addresses
│   │   │   ├── products.py       # CRUD, search, filter, featured
│   │   │   ├── categories.py     # Tree structure, slug-based
│   │   │   ├── cart.py           # Session/guest cart + user cart merge
│   │   │   ├── orders.py         # Create, list, detail, status
│   │   │   ├── payments.py       # Initialize, verify, webhook
│   │   │   ├── reviews.py        # CRUD per product
│   │   │   ├── wishlist.py       # Add, remove, list
│   │   │   ├── banners.py        # Hero slides, promo banners
│   │   │   └── admin.py          # Protected: stats, inventory, orders mgmt
│   │   ├── services/             # Business logic / external APIs
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py   # Password hashing, JWT creation
│   │   │   ├── paystack.py       # Paystack API wrapper
│   │   │   ├── flutterwave.py    # Flutterwave API wrapper
│   │   │   ├── cloudinary.py     # Image upload/delete
│   │   │   ├── email_service.py  # Resend/SendGrid templates
│   │   │   └── whatsapp.py       # WhatsApp notification templates
│   │   └── utils/
│   │       ├── security.py       # bcrypt, token utils
│   │       └── validators.py     # Nigerian phone, email validators
│   ├── alembic/                  # Database migrations
│   ├── tests/                    # Pytest async tests
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
├── taree-web/                    # React Frontend
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── routes.tsx            # React Router route definitions
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx    # Sticky, logo center, search, cart, account
│   │   │   │   ├── Footer.tsx    # 4-column, payment icons, social links
│   │   │   │   ├── MobileMenu.tsx
│   │   │   │   └── WhatsAppFloat.tsx
│   │   │   ├── sections/
│   │   │   │   ├── HeroSlider.tsx
│   │   │   │   ├── TrustBar.tsx
│   │   │   │   ├── CategoryGrid.tsx
│   │   │   │   ├── FeaturedProducts.tsx
│   │   │   │   ├── BridalSpotlight.tsx
│   │   │   │   ├── AboutSection.tsx
│   │   │   │   ├── Testimonials.tsx
│   │   │   │   └── Newsletter.tsx
│   │   │   ├── product/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductGrid.tsx
│   │   │   │   ├── ProductDetail.tsx
│   │   │   │   ├── ProductImageGallery.tsx
│   │   │   │   ├── AddToCartButton.tsx
│   │   │   │   └── ProductFilters.tsx
│   │   │   ├── cart/
│   │   │   │   ├── CartDrawer.tsx
│   │   │   │   ├── CartItem.tsx
│   │   │   │   └── CartSummary.tsx
│   │   │   ├── ui/               # Shadcn UI components + custom
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Skeleton.tsx
│   │   │   │   └── Toast.tsx
│   │   │   └── admin/
│   │   │       ├── AdminLayout.tsx
│   │   │       ├── DashboardStats.tsx
│   │   │       ├── ProductTable.tsx
│   │   │       └── OrderTable.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── ProductsPage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   ├── CategoryPage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── PaymentSuccessPage.tsx
│   │   │   ├── PaymentFailedPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── AccountPage.tsx
│   │   │   ├── OrderHistoryPage.tsx
│   │   │   ├── WishlistPage.tsx
│   │   │   ├── AdminDashboardPage.tsx
│   │   │   └── AdminProductsPage.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useCart.ts
│   │   │   ├── useProducts.ts
│   │   │   └── useDebounce.ts
│   │   ├── stores/
│   │   │   ├── authStore.ts      # Zustand: user, login, logout
│   │   │   ├── cartStore.ts      # Zustand: items, add, remove, total
│   │   │   └── uiStore.ts        # Zustand: mobile menu, toast, modal
│   │   ├── lib/
│   │   │   ├── api.ts            # Axios instance, interceptors
│   │   │   ├── queryClient.ts    # TanStack Query config
│   │   │   └── utils.ts          # cn(), formatNaira(), etc.
│   │   └── types/
│   │       ├── api.ts            # Shared TypeScript interfaces
│   │       └── index.ts
│   ├── public/
│   │   ├── images/
│   │   │   ├── logo.svg
│   │   │   ├── hero/
│   │   │   └── categories/
│   │   └── favicon.ico
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── docker-compose.yml              # Local dev: API + DB + Meilisearch
└── README.md
```

---

## Database Schema (SQLAlchemy Models)

### User Model
```python
class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    phone: Mapped[str | None] = mapped_column(String(20), unique=True, nullable=True)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    role: Mapped[str] = mapped_column(String(20), default="customer")  # customer, admin, superadmin
    email_verified: Mapped[bool] = mapped_column(default=False)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    addresses: Mapped[list["Address"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    orders: Mapped[list["Order"]] = relationship(back_populates="user")
    reviews: Mapped[list["Review"]] = relationship(back_populates="user")
    wishlist_items: Mapped[list["WishlistItem"]] = relationship(back_populates="user", cascade="all, delete-orphan")
```

### Address Model
```python
class Address(Base):
    __tablename__ = "addresses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    label: Mapped[str] = mapped_column(String(50))  # "Home", "Office"
    street: Mapped[str] = mapped_column(String(255))
    city: Mapped[str] = mapped_column(String(100))
    state: Mapped[str] = mapped_column(String(100))  # Lagos, Abuja, etc.
    zip_code: Mapped[str | None] = mapped_column(String(20))
    country: Mapped[str] = mapped_column(String(100), default="Nigeria")
    is_default: Mapped[bool] = mapped_column(default=False)

    user: Mapped["User"] = relationship(back_populates="addresses")
```

### Category Model (Self-referential for subcategories)
```python
class Category(Base):
    __tablename__ = "categories"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(100), unique=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    description: Mapped[str | None] = mapped_column(Text)
    image: Mapped[str | None] = mapped_column(String(500))  # Cloudinary URL
    parent_id: Mapped[str | None] = mapped_column(ForeignKey("categories.id"), nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)
    sort_order: Mapped[int] = mapped_column(default=0)

    # Self-referential
    parent: Mapped["Category | None"] = relationship(remote_side=[id], back_populates="children")
    children: Mapped[list["Category"]] = relationship(back_populates="parent")
    products: Mapped[list["Product"]] = relationship(back_populates="category")
```

### Product Model
```python
class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(200))
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    description: Mapped[str] = mapped_column(Text)
    short_description: Mapped[str | None] = mapped_column(String(500))
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    compare_at_price: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))  # Sale logic
    cost_price: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))  # Admin only
    sku: Mapped[str] = mapped_column(String(100), unique=True)
    stock_quantity: Mapped[int] = mapped_column(default=0)
    weight_grams: Mapped[float | None] = mapped_column()
    material: Mapped[str | None] = mapped_column(String(100))  # "18K Gold", "Sterling Silver"
    is_active: Mapped[bool] = mapped_column(default=True)
    is_featured: Mapped[bool] = mapped_column(default=False)
    is_new_arrival: Mapped[bool] = mapped_column(default=False)
    category_id: Mapped[str] = mapped_column(ForeignKey("categories.id"))

    # SEO
    meta_title: Mapped[str | None] = mapped_column(String(200))
    meta_description: Mapped[str | None] = mapped_column(String(500))

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    category: Mapped["Category"] = relationship(back_populates="products")
    images: Mapped[list["ProductImage"]] = relationship(back_populates="product", cascade="all, delete-orphan", order_by="ProductImage.sort_order")
    variants: Mapped[list["ProductVariant"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    tags: Mapped[list["Tag"]] = relationship(secondary="product_tags", back_populates="products")
    reviews: Mapped[list["Review"]] = relationship(back_populates="product")
    order_items: Mapped[list["OrderItem"]] = relationship(back_populates="product")
    wishlist_items: Mapped[list["WishlistItem"]] = relationship(back_populates="product")
```

### ProductImage Model
```python
class ProductImage(Base):
    __tablename__ = "product_images"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id: Mapped[str] = mapped_column(ForeignKey("products.id"))
    url: Mapped[str] = mapped_column(String(500))
    alt_text: Mapped[str | None] = mapped_column(String(200))
    sort_order: Mapped[int] = mapped_column(default=0)
    is_primary: Mapped[bool] = mapped_column(default=False)

    product: Mapped["Product"] = relationship(back_populates="images")
```

### ProductVariant Model
```python
class ProductVariant(Base):
    __tablename__ = "product_variants"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id: Mapped[str] = mapped_column(ForeignKey("products.id"))
    name: Mapped[str] = mapped_column(String(100))  # "Size 7", "Gold/White Gold"
    price_adjustment: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))  # +/- from base
    stock_quantity: Mapped[int] = mapped_column(default=0)
    sku: Mapped[str] = mapped_column(String(100), unique=True)

    product: Mapped["Product"] = relationship(back_populates="variants")
```

### Tag Model (Many-to-Many)
```python
class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(50), unique=True)
    slug: Mapped[str] = mapped_column(String(50), unique=True)

    products: Mapped[list["Product"]] = relationship(secondary="product_tags", back_populates="tags")

class ProductTag(Base):
    __tablename__ = "product_tags"

    product_id: Mapped[str] = mapped_column(ForeignKey("products.id"), primary_key=True)
    tag_id: Mapped[str] = mapped_column(ForeignKey("tags.id"), primary_key=True)
```

### Order Model
```python
class OrderStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"

class Order(Base):
    __tablename__ = "orders"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_number: Mapped[str] = mapped_column(String(20), unique=True)  # TAREE-2026-00001
    user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)

    # Guest checkout support
    guest_email: Mapped[str | None] = mapped_column(String(255))
    guest_phone: Mapped[str | None] = mapped_column(String(20))

    status: Mapped[OrderStatus] = mapped_column(default=OrderStatus.PENDING)
    payment_status: Mapped[PaymentStatus] = mapped_column(default=PaymentStatus.PENDING)
    payment_method: Mapped[str] = mapped_column(String(50))  # "paystack", "flutterwave", "bank_transfer"
    payment_reference: Mapped[str | None] = mapped_column(String(100), unique=True)

    # Pricing
    subtotal: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    shipping_cost: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"))
    discount_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"))
    tax_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"))
    total: Mapped[Decimal] = mapped_column(Numeric(12, 2))

    # Shipping snapshot
    shipping_address: Mapped[dict | None] = mapped_column(JSON)  # Full address JSON

    # Tracking
    tracking_number: Mapped[str | None] = mapped_column(String(100))
    shipped_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    delivered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    notes: Mapped[str | None] = mapped_column(Text)  # Customer notes
    admin_notes: Mapped[str | None] = mapped_column(Text)  # Internal

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user: Mapped["User | None"] = relationship(back_populates="orders")
    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")
```

### OrderItem Model
```python
class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id: Mapped[str] = mapped_column(ForeignKey("orders.id"))
    product_id: Mapped[str] = mapped_column(ForeignKey("products.id"))
    variant_id: Mapped[str | None] = mapped_column(ForeignKey("product_variants.id"), nullable=True)

    product_name: Mapped[str] = mapped_column(String(200))  # Snapshot
    product_image: Mapped[str | None] = mapped_column(String(500))  # Snapshot
    quantity: Mapped[int] = mapped_column()
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12, 2))  # Price at purchase
    total_price: Mapped[Decimal] = mapped_column(Numeric(12, 2))

    order: Mapped["Order"] = relationship(back_populates="items")
    product: Mapped["Product"] = relationship(back_populates="order_items")
```

### Review Model
```python
class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    product_id: Mapped[str] = mapped_column(ForeignKey("products.id"))
    rating: Mapped[int] = mapped_column()  # 1-5
    title: Mapped[str | None] = mapped_column(String(200))
    comment: Mapped[str | None] = mapped_column(Text)
    is_approved: Mapped[bool] = mapped_column(default=False)  # Admin moderation

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="reviews")
    product: Mapped["Product"] = relationship(back_populates="reviews")
```

### WishlistItem Model
```python
class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    product_id: Mapped[str] = mapped_column(ForeignKey("products.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="wishlist_items")
    product: Mapped["Product"] = relationship(back_populates="wishlist_items")

    __table_args__ = (UniqueConstraint("user_id", "product_id", name="uq_user_product_wishlist"),)
```

### Banner Model (Hero Slides, Promo)
```python
class BannerPosition(str, Enum):
    HERO = "hero"
    PROMO = "promo"
    CATEGORY = "category"

class Banner(Base):
    __tablename__ = "banners"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(200))
    subtitle: Mapped[str | None] = mapped_column(String(500))
    image: Mapped[str] = mapped_column(String(500))  # Cloudinary URL
    mobile_image: Mapped[str | None] = mapped_column(String(500))
    cta_text: Mapped[str | None] = mapped_column(String(100))
    cta_link: Mapped[str | None] = mapped_column(String(500))
    position: Mapped[BannerPosition] = mapped_column(default=BannerPosition.HERO)
    is_active: Mapped[bool] = mapped_column(default=True)
    sort_order: Mapped[int] = mapped_column(default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
```

---

## API Routes (FastAPI Routers)

### Auth Router (`/api/v1/auth`)
```
POST /register          → Create account, send verification email
POST /login             → Authenticate, set httpOnly cookies
POST /logout            → Clear cookies, blacklist token
POST /refresh           → Rotate access token using refresh token
GET  /me                → Current user profile
POST /verify-email      → Email verification with token
POST /forgot-password   → Send reset email
POST /reset-password    → Reset with token
```

### User Router (`/api/v1/users`)
```
GET    /profile         → Get profile
PATCH  /profile         → Update profile
GET    /addresses       → List addresses
POST   /addresses       → Add address
PATCH  /addresses/{id}  → Update address
DELETE /addresses/{id}  → Remove address
PATCH  /addresses/{id}/default → Set default
```

### Product Router (`/api/v1/products`)
```
GET    /               → List products (paginated, filter, sort)
GET    /featured       → Featured products (for homepage)
GET    /new-arrivals   → New arrivals
GET    /search         → Full-text search (Meilisearch)
GET    /{slug}         → Single product detail
POST   /               → Create product (admin)
PATCH  /{id}           → Update product (admin)
DELETE /{id}           → Delete product (admin)
POST   /{id}/images    → Upload images (admin)
```

**Query params for GET /**:
- `category` (slug), `min_price`, `max_price`, `material`, `is_new_arrival`, `is_featured`, `sort` (price_asc, price_desc, newest, bestseller), `page`, `limit`

### Category Router (`/api/v1/categories`)
```
GET /                  → Tree structure (parent + children)
GET /{slug}            → Category with products
GET /{slug}/products   → Products in category (paginated)
```

### Cart Router (`/api/v1/cart`)
```
GET    /               → Get cart (guest via session_id cookie, user via auth)
POST   /items          → Add item (product_id, variant_id, quantity)
PATCH  /items/{id}     → Update quantity
DELETE /items/{id}     → Remove item
POST   /merge          → Merge guest cart into user cart (on login)
DELETE /               → Clear cart
```

### Order Router (`/api/v1/orders`)
```
POST   /               → Create order from cart
GET    /               → List user orders
GET    /{id}           → Order detail
POST   /{id}/cancel    → Cancel order (if pending)
```

### Payment Router (`/api/v1/payments`)
```
POST /initialize       → Initiate Paystack/Flutterwave payment
POST /verify          → Verify payment (called by frontend after redirect)
POST /webhook/paystack → Paystack webhook (async verification)
POST /webhook/flutterwave → Flutterwave webhook
```

### Review Router (`/api/v1/reviews`)
```
GET    /products/{product_id} → List approved reviews
POST   /products/{product_id} → Create review (auth required)
```

### Wishlist Router (`/api/v1/wishlist`)
```
GET    /               → List wishlist
POST   /               → Add item (product_id)
DELETE /{product_id}   → Remove item
```

### Banner Router (`/api/v1/banners`)
```
GET  /                 → List active banners by position
GET  /hero             → Hero slides only
```

### Admin Router (`/api/v1/admin`) — Protected by `require_admin`
```
GET    /stats          → Dashboard: revenue, orders, users, low stock
GET    /orders         → All orders (filter by status, paginated)
PATCH  /orders/{id}/status → Update order status
GET    /products       → All products (admin view with cost_price)
POST   /products       → Create product
PATCH  /products/{id}  → Update product
DELETE /products/{id}  → Delete product
GET    /reviews        → All reviews (moderation queue)
PATCH  /reviews/{id}/approve → Approve review
GET    /customers      → Customer list
```

---

## Authentication & Security

### JWT Strategy
- **Access Token**: 15 minutes, stored in `httpOnly` cookie named `access_token`
- **Refresh Token**: 7 days, stored in `httpOnly` cookie named `refresh_token`
- **Token Type**: JWT HS256, secret from `JWT_SECRET_KEY` env var
- **Payload**: `{"sub": user_id, "role": "customer", "iat": ..., "exp": ...}`

### Cookie Settings
```python
response.set_cookie(
    key="access_token",
    value=access_token,
    httponly=True,
    secure=True,        # HTTPS only in production
    samesite="lax",
    max_age=900,        # 15 minutes
    path="/"
)
```

### CORS Policy
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],  # Explicit, not "*"
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
```

### Rate Limiting (slowapi)
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, ...):
    ...
```

### Password Security
- Hash with `bcrypt` (salt rounds: 12)
- Minimum password: 8 chars, 1 uppercase, 1 number, 1 special char
- No plaintext storage anywhere

### Input Validation
- All inputs via Pydantic schemas
- Sanitize HTML in product descriptions (bleach or markdown-only)
- File uploads: validate type (jpg, png, webp), max 5MB, scan with Cloudinary

### Admin Authorization
```python
async def get_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user
```

---

## Payment Flow (Paystack Primary)

### 1. Initialize Payment
```python
@router.post("/initialize")
async def initialize_payment(
    data: PaymentInitializeSchema,
    current_user: User = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    # Validate order/cart
    cart = await get_cart(db, current_user.id if current_user else None, session_id)

    # Create order with PENDING status
    order = await create_order(db, cart, current_user, data.shipping_address)

    # Call Paystack
    paystack_data = await paystack.initialize(
        email=current_user.email if current_user else data.guest_email,
        amount=int(order.total * 100),  # kobo
        reference=f"TAREE-{order.order_number}",
        callback_url=f"{settings.FRONTEND_URL}/payment/verify"
    )

    return {"authorization_url": paystack_data["authorization_url"], "reference": paystack_data["reference"]}
```

### 2. Verify (Frontend Callback)
```python
@router.post("/verify")
async def verify_payment(
    data: PaymentVerifySchema,
    db: AsyncSession = Depends(get_db)
):
    verification = await paystack.verify(data.reference)

    if verification["status"] == "success":
        order = await update_order_payment(db, data.reference, "paid")
        await send_order_confirmation_email(order)
        await send_whatsapp_notification(order)
        await reduce_stock(db, order)
        return {"status": "success", "order_id": order.id}
    else:
        await update_order_payment(db, data.reference, "failed")
        return {"status": "failed"}
```

### 3. Webhook (Backup Verification)
```python
@router.post("/webhook/paystack")
async def paystack_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    payload = await request.body()
    signature = request.headers.get("x-paystack-signature")

    # Verify signature with HMAC
    if not verify_paystack_signature(payload, signature):
        raise HTTPException(status_code=400, detail="Invalid signature")

    event = json.loads(payload)
    if event["event"] == "charge.success":
        await process_successful_payment(db, event["data"])

    return {"received": True}
```

---

## Frontend Implementation Details

### Homepage Sections (in order)
1. **Navbar** — Sticky, transparent → solid on scroll. Logo center. Left: hamburger (mobile). Right: search, account, wishlist, cart (with count badge). Secondary nav: category links.
2. **HeroSlider** — Full-width, 3 slides auto-rotating (6s). Dark overlay gradient. Headline + subheadline + CTA button. Framer Motion fade transitions.
3. **TrustBar** — 4 icons in a row on cream background. Icons from Lucide (Gem, Shield, Truck, Headphones).
4. **CategoryGrid** — 4 columns desktop, 2 mobile. Image with dark gradient overlay, category name + "SHOP NOW". Hover: slight zoom (`scale-105`).
5. **FeaturedProducts** — Tabs: "New Arrivals" / "Bestsellers". 4-column product grid. ProductCard: image, name, price (₦ format), quick-add button.
6. **BridalSpotlight** — Full-width romantic image, overlay text, two CTAs.
7. **AboutSection** — Split layout: image left, text right. Brand story.
8. **Testimonials** — Carousel with auto-play. Quote, name, location, star rating.
9. **Newsletter** — Dark navy background, gold accents. Email input + subscribe button.
10. **Footer** — 4 columns, payment methods, social links, copyright.

### ProductCard Component
```tsx
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    images: { url: string; alt?: string }[];
    isNewArrival?: boolean;
    isFeatured?: boolean;
  };
}

// Features:
// - Image hover: swap to second image if available
// - Badge: "NEW" or "SALE" if compareAtPrice exists
// - Price: formatNaira(price) → "₦45,000"
// - Quick add: "+" button appears on hover
// - Click: navigate to /products/{slug}
```

### Cart System
- **Guest Cart**: Stored in `localStorage` with `session_id` (UUID). Synced to backend via `session_id` cookie.
- **User Cart**: Merged on login. Backend persists to `cart_items` table (or use Order draft concept).
- **CartDrawer**: Slide-in from right. Shows items, quantity controls, subtotal, checkout button.
- **CartBadge**: Real-time count update via Zustand.

### Checkout Page
1. **Shipping Address** — Form or select from saved addresses (auth users). Guest checkout allowed.
2. **Order Summary** — Items, subtotal, shipping (flat rate or calculated), total.
3. **Payment Method** — Paystack (default), Flutterwave (alternative), Bank Transfer (manual).
4. **Place Order** → Initialize payment → Redirect to Paystack → Return to `/payment/verify`.

### Admin Dashboard (Protected Route)
- **Stats Cards**: Total Revenue (today, month, year), Orders (pending, shipped), Low Stock Alerts, New Customers.
- **Orders Table**: Sortable, filterable, status update dropdown.
- **Products Table**: Inline edit for stock, quick actions.
- **Review Moderation**: Approve/reject queue.

---

## State Management (Zustand Stores)

### Auth Store
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}
```

### Cart Store
```typescript
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, variant?: Variant, qty?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
}
```

---

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/taree_db

# Auth
JWT_SECRET_KEY=your-super-secret-key-min-32-chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# Frontend
FRONTEND_URL=https://tareejewelry.com

# Paystack
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...

# Flutterwave
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-...
FLUTTERWAVE_PUBLIC_KEY=FLWPUB_TEST-...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Meilisearch
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=...

# Email (Resend)
RESEND_API_KEY=re_...
FROM_EMAIL=hello@tareejewelry.com

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

---

## Development Commands

```bash
# Backend
cd taree-api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000

# Frontend
cd taree-web
npm install
npm run dev        # Vite dev server on :5173

# Docker (full stack)
docker-compose up  # API + PostgreSQL + Meilisearch
```

---

## Deployment

| Service | What | Config |
|---------|------|--------|
| **Vercel** | Frontend | Build: `npm run build`, Output: `dist` |
| **Render/Railway** | API + DB | Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Cloudinary** | Images | Upload preset: `taree_products` |
| **Paystack** | Payments | Webhook URL: `https://api.tareejewelry.com/api/v1/payments/webhook/paystack` |
| **Meilisearch** | Search | Self-hosted on Render or Meilisearch Cloud |

---

## Security Checklist (Pre-Production)

- [ ] All secrets in `.env`, never committed
- [ ] `httpOnly` cookies for all tokens
- [ ] CORS restricted to production domain only
- [ ] Rate limiting on auth + payment endpoints
- [ ] Paystack webhook signature verification
- [ ] SQL injection: ORM only, no raw queries
- [ ] XSS: React escapes by default, sanitize rich text
- [ ] File upload: type validation, size limit, Cloudinary scan
- [ ] Admin routes: role-based access control (RBAC)
- [ ] HTTPS everywhere (Vercel + Render auto-SSL)
- [ ] Dependency scanning (`pip-audit`, `npm audit`)
- [ ] Database backups (Render/Railway automated)

---

## MVP vs Full Build Priority

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Homepage, product listing, product detail, cart, checkout (Paystack), order confirmation, basic admin (products + orders) | 3-4 weeks |
| **v1.1** | User auth (register/login), wishlist, order history, address book, reviews | +1 week |
| **v1.2** | Search (Meilisearch), filters, inventory tracking, admin stats dashboard | +1 week |
| **v1.3** | Flutterwave fallback, WhatsApp notifications, email templates, SEO meta tags | +1 week |
| **v2.0** | Multi-currency, gift cards, referral system, advanced analytics | +2 weeks |

---

## Notes for AI Coding Assistant

1. **Follow the schema exactly** — use SQLAlchemy 2.0 style with `Mapped[]` and `mapped_column()`.
2. **All API responses** must use Pydantic schemas, never return ORM objects directly.
3. **Frontend components** must be fully typed with TypeScript interfaces.
4. **Use async/await everywhere** — both FastAPI and React data fetching.
5. **Error handling**: FastAPI returns `{ "detail": "..." }` for errors; frontend shows toast notifications.
6. **Image optimization**: Use Cloudinary transformations (`f_auto,q_auto,w_600`) for responsive images.
7. **Mobile-first**: All Tailwind classes should work on `sm:` and `md:` breakpoints.
8. **Accessibility**: ARIA labels on interactive elements, focus states, alt text on images.
9. **Performance**: Use React.lazy() for admin routes, TanStack Query caching for product data.
10. **Nigerian context**: Naira formatting, local shipping states, mobile-first design, WhatsApp integration.

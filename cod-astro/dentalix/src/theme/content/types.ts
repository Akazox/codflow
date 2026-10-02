/**
 * StoreFront Content Interface
 * 
 * Defines all user-facing text strings used throughout the theme.
 * Each language file (ar.ts, en.ts) must implement this interface completely.
 */

export interface StoreFrontContent {
  // ── Announcement bar ─────────────────────────────────────────────────────
  announcementText: string;

  // ── Hero ──────────────────────────────────────────────────────────────────
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPlaceholderTitle: string;
  heroPlaceholderSub: string;

  // ── Trust badges ──────────────────────────────────────────────────────────
  trust1Title: string;
  trust1Sub: string;
  trust2Title: string;
  trust2Sub: string;
  trust3Title: string;
  trust3Sub: string;

  // ── Hero CTAs ────────────────────────────────────────────────────────────
  heroCtaPrimary: string;
  heroCtaSecondary: string;

  // ── Navigation ────────────────────────────────────────────────────────────
  navHome: string;
  navProducts: string;
  navNewArrivals: string;
  navBestSellers: string;
  navCategories: string;

  // ── Section headings ──────────────────────────────────────────────────────
  categoriesSection: string;
  featuredSection: string;
  allProductsSection: string;
  bestSellersSection: string;
  bestSellersSub: string;
  newArrivalsSection: string;
  newArrivalsSub: string;
  viewAllCta: string;

  // ── How It Works (COD trust) ────────────────────────────────────────────
  howItWorksTitle: string;
  howItWorksSub: string;
  howStep1Title: string;
  howStep1Sub: string;
  howStep2Title: string;
  howStep2Sub: string;
  howStep3Title: string;
  howStep3Sub: string;

  // ── Features bar ────────────────────────────────────────────────────────
  feature1Title: string;
  feature2Title: string;
  feature3Title: string;
  feature5Title: string;

  // ── Promo banner ────────────────────────────────────────────────────────
  promoTitle: string;
  promoSub: string;
  promoCtaText: string;

  // ── Testimonials ────────────────────────────────────────────────────────
  testimonialsTitle: string;
  testimonialsSub: string;

  // ── Footer ──────────────────────────────────────────────────────────────
  footerAbout: string;
  footerQuickLinks: string;
  footerSupport: string;
  footerRights: string;

  // ── Order form ────────────────────────────────────────────────────────────
  orderCta: string;
  orderCtaSubtext: string;
  formTitle: string;
  formDeliverySection: string;
  formNameLabel: string;
  formNamePlaceholder: string;
  formPhoneLabel: string;
  formPhonePlaceholder: string;
  formPhoneInvalid: string;
  formWilayaLabel: string;
  formWilayaPlaceholder: string;
  formCommuneLabel: string;
  formCommunePlaceholder: string;
  formCommuneLoading: string;
  formCommuneDisabled: string;
  formAddressLabel: string;
  formAddressPlaceholder: string;
  formDeliveryLabel: string;
  formHomeDelivery: string;
  formStopDesk: string;
  formNotesLabel: string;
  formNotesPlaceholder: string;
  /** Email row — rendered only when the merchant enables the field. */
  formEmailLabel: string;
  formEmailPlaceholder: string;
  /** Shown under a required dropdown the shopper submitted without answering. */
  formRequiredField: string;
  formSubmit: string;
  formConfirmNote: string;
  /**
   * The pre-order consent line. Contains exactly two tokens, `{terms}` and
   * `{refund}`, which OrderForm.astro replaces with real links to the
   * store's Terms and Refund pages (resolved by kind, from `config.pages` —
   * never a hardcoded slug). The whole sentence — word order included — is
   * this key's job, because "I agree to X" then "and Y" bolted on afterward
   * does not read naturally in every language this pack supports. The line
   * is skipped entirely when either page is not configured, never rendered
   * with a dead or missing link.
   */
  checkoutConsentText: string;

  // ── WhatsApp OTP verification ─────────────────────────────────────────────
  otpTitle: string;
  otpSubtitle: string;
  otpInputLabel: string;
  otpInputPlaceholder: string;
  otpVerifyBtn: string;
  otpVerifying: string;
  otpResendIn: string;
  otpResend: string;
  otpChangePhone: string;
  otpErrorWrong: string;
  otpErrorAttempts: string;
  otpErrorExpired: string;
  otpErrorRate: string;
  otpErrorGeneric: string;

  // ── Cloudflare Turnstile (checkout bot protection) ─────────────────────────
  turnstileErrorFailed: string;
  turnstileVerifying: string;

  // ── WhatsApp contact widget ────────────────────────────────────────────────
  /** Accessible label for the floating launcher button */
  waOpenChat: string;
  /** Accessible label for the panel close button */
  waCloseChat: string;
  /** Fallback caption under agent name when merchant has none */
  waCaptionDefault: string;
  /** Fallback welcome bubble text when merchant has none */
  waWelcomeDefault: string;
  /** Fallback label on the "Chat on WhatsApp" action button */
  waCtaDefault: string;
  /** Fallback prefill template for pages without a product */
  waPrefillGeneralDefault: string;
  /** Fallback prefill template for product/landing pages */
  waPrefillProductDefault: string;
  /** Fallback button label for thank-you page inline button */
  waThankYouButtonDefault: string;
  /** Fallback prefill template for thank-you page */
  waPrefillThankYouDefault: string;
  /** Placeholder for visitor compose textarea */
  waComposePlaceholder: string;
  /** Send button label for visitor compose mode */
  waSend: string;

  // ── Order summary ──────────────────────────────────────────────────────────
  qtyLabel: string;
  qtyUnit: string;
  shippingLabel: string;
  shippingCalculated: string;
  shippingFree: string;
  totalLabel: string;
  itemsLabel: string;

  // ── Thank you page ────────────────────────────────────────────────────────
  thankYouTitle: string;
  thankYouSubtitle: string;
  orderNumberLabel: string;
  totalAmountLabel: string;
  codNote: string;
  step1Title: string;
  step1Sub: string;
  step2Title: string;
  step2Sub: string;
  step3Title: string;
  step3Sub: string;
  backToStore: string;

  // ── Empty / error states ──────────────────────────────────────────────────
  noProductsTitle: string;
  noProductsSub: string;
  emptyStoreTitle: string;
  emptyStoreSub: string;
  productNotFoundTitle: string;

  // ── Reviews ───────────────────────────────────────────────────────────────
  reviewsTitle: string;
  reviewsNoReviews: string;
  reviewsBeFirst: string;
  reviewsVerifiedBuyer: string;
  reviewFormTitle: string;
  reviewFormOrderLabel: string;
  reviewFormOrderPlaceholder: string;
  reviewFormOrderHelp: string;
  reviewFormRatingLabel: string;
  reviewFormTitleLabel: string;
  reviewFormTitlePlaceholder: string;
  reviewFormBodyLabel: string;
  reviewFormBodyPlaceholder: string;
  reviewFormSubmit: string;
  reviewFormSuccess: string;
  reviewFormErrorDuplicate: string;
  reviewFormErrorInvalidOrder: string;
  reviewFormErrorGeneric: string;

  // ── Offers ───────────────────────────────────────────────────────────────
  /** Sub-text under offer banner: "Automatically applied at checkout" */
  offerAutoApplied: string;
  /** Label for the free item row in the order summary */
  offerFreeLabel: string;
  /** Offer card header when threshold not yet reached */
  offerActive: string;
  /** Offer card header when threshold reached */
  offerUnlocked: string;
  /** Hint when {n} more units needed — use {n} as placeholder */
  offerAddMore: string;
  /** Hint when exactly 1 more unit needed */
  offerAddOne: string;
  /** Hint shown when offer is unlocked */
  offerYouGet: string;
  /** Title above the offer tier selector section */
  offerSectionTitle: string;
  /** Badge text on free-shipping offer tiers */
  offerFreeShippingBadge: string;
  /** "Buy 1" label on the base tier card */
  offerBuyOne: string;
  /** "Full Price" badge on the base tier card */
  offerFullPrice: string;
  /** "Most Popular" badge on the first offer tier */
  offerMostPopular: string;

  // ── Misc ──────────────────────────────────────────────────────────────────
  breadcrumbHome: string;
  required: string;
  viewProduct: string;
  featured: string;
  lowStock: string;
  outOfStock: string;
  qtyMaxStock: string;
  freeShippingBadge: string;
  searchLabel: string;
  noResultsLabel: string;
  loadMoreLabel: string;
  allLabel: string;
  productCountLabel: string;
  reviewFormMinLengthError: string;
  reviewFormRatingRequired: string;
  offerSaveBadge: string;
  offerSavingsText: string;
  offerUnitLabel: string;
  ariaMainNavigation: string;
  ariaQuantity: string;
  ariaGoToImage: string;
  ariaBrowseAllProducts: string;
  ariaBrowseCategoryProducts: string;
  ariaProductCard: string;
  ariaStarRating: string;
  thankYouPageTitle: string;
  defaultMetaDescription: string;

  // ── Shopping cart ─────────────────────────────────────────────────────────
  cartTitle: string;
  cartItemsLabel: string;
  cartEmptyTitle: string;
  cartEmptyHint: string;
  cartAddToCart: string;
  cartAdded: string;
  cartOpenLabel: string;
  cartCloseLabel: string;
  cartSubtotalLabel: string;
  cartCheckoutCta: string;
  cartRemoveLabel: string;
  cartIncreaseLabel: string;
  cartDecreaseLabel: string;
  cartFreeDeliveryEarned: string;
  cartFreeDeliveryRemaining: string;
  cartLineUnavailable: string;
  cartLineOutOfStock: string;
  cartGiftLabel: string;
  cartFixBeforeCheckout: string;
  cartDeliveryNote: string;
  cartUnavailableNotice: string;
  cartContinueShopping: string;

  // ── Checkout page ─────────────────────────────────────────────────────────
  checkoutTitle: string;
  checkoutSummaryTitle: string;
  checkoutLoading: string;

  // ── Related products ──────────────────────────────────────────────────────
  relatedTitle: string;
  relatedSub: string;

  // ── 404 page ──────────────────────────────────────────────────────────────
  notFoundTitle: string;
  notFoundSubtitle: string;
  notFoundCtaHome: string;
  notFoundCtaProducts: string;
  notFoundPageTitle: string;
  // ── Dentalix — navigation & brand ───────────────────────────────────────────
  navFeatures: string;
  navDemo: string;
  navPricing: string;
  navFaq: string;
  navMenuOpen: string;
  navMenuClose: string;
  brandTagline: string;

  // ── Dentalix — hero ─────────────────────────────────────────────────────────
  /** Second line of the hero title, rendered with the brand gradient */
  heroTitleAccent: string;
  /** Small tag inside the hero eyebrow pill (empty hides it) */
  heroEyebrowTag: string;
  /** Accessible label of the HTML product visual */
  heroVisualLabel: string;

  // ── Dentalix — modules (sidebar of the product visual + modules band) ───────
  modulesTitle: string;
  modDashboard: string;
  modAgenda: string;
  modWaiting: string;
  modPatients: string;
  modChart: string;
  modPlans: string;
  modNotes: string;
  modRx: string;
  modImaging: string;
  modBilling: string;
  modInsurance: string;
  modCash: string;
  modLab: string;
  modStock: string;
  modReports: string;
  modTeam: string;
  modReminders: string;

  // ── Dentalix — demo data shown inside the HTML product visuals ──────────────
  mockToday: string;
  mockDoctor1: string;
  mockDoctor2: string;
  mockAppt1: string;
  mockAppt2: string;
  mockAppt3: string;
  mockAppt4: string;
  mockAppt5: string;
  mockAppt6: string;
  mockPatient1: string;
  mockPatient2: string;
  mockPatient3: string;
  mockPatient4: string;
  mockPatient5: string;
  mockPatient6: string;
  mockChartSub: string;
  legendCaries: string;
  legendRestoration: string;
  legendCrown: string;
  legendEndo: string;
  legendImplant: string;
  legendMissing: string;
  mockReminderTitle: string;
  mockReminderSub: string;
  mockInvoiceTitle: string;
  mockInvoiceSub: string;
  mockWaitingStatus1: string;
  mockWaitingStatus2: string;
  mockWaitingStatus3: string;
  mockPlanPhase1: string;
  mockPlanPhase2: string;
  /** Uses {n} */
  mockPlanDone: string;
  mockDocQuote: string;
  mockDocInvoice: string;
  mockDocReceipt: string;
  mockCnasLabel: string;
  mockLabSent: string;
  mockLabProgress: string;
  mockLabReceived: string;
  mockLabItem: string;
  mockLabItem2: string;
  mockStockItem: string;
  mockStockItem2: string;
  mockStockLow: string;
  mockReportsTitle: string;
  mockRole1: string;
  mockRole2: string;
  mockRole3: string;

  // ── Dentalix — features by workflow (an empty point is skipped) ─────────────
  featuresKicker: string;
  featuresTitle: string;
  featuresSub: string;
  flow1Kicker: string;
  flow1Title: string;
  flow1Desc: string;
  flow1Point1: string;
  flow1Point2: string;
  flow1Point3: string;
  flow1Point4: string;
  flow2Kicker: string;
  flow2Title: string;
  flow2Desc: string;
  flow2Point1: string;
  flow2Point2: string;
  flow2Point3: string;
  flow2Point4: string;
  flow3Kicker: string;
  flow3Title: string;
  flow3Desc: string;
  flow3Point1: string;
  flow3Point2: string;
  flow3Point3: string;
  flow3Point4: string;
  flow4Kicker: string;
  flow4Title: string;
  flow4Desc: string;
  flow4Point1: string;
  flow4Point2: string;
  flow4Point3: string;
  flow4Point4: string;

  // ── Dentalix — demo video ───────────────────────────────────────────────────
  demoKicker: string;
  demoTitle: string;
  demoSub: string;
  /** Demo video: an https YouTube or Vimeo link, or a direct https .mp4 file. Anything else is ignored and the demo-on-request card shows instead */
  demoVideoUrl: string;
  /** Optional https poster image for the video (empty: the built-in HTML poster) */
  demoPosterUrl: string;
  /** Optional duration chip on the poster, e.g. 4 min (empty hides it) */
  demoVideoDuration: string;
  demoVideoCaption: string;
  demoPlayLabel: string;
  demoCloseLabel: string;
  demoRequestTitle: string;
  demoRequestSub: string;
  demoRequestPoint1: string;
  demoRequestPoint2: string;
  demoRequestPoint3: string;
  demoRequestWhatsapp: string;
  demoRequestCall: string;
  demoRequestPricing: string;
  /** WhatsApp number for demo requests, international format digits (e.g. 213555000000). Empty: the store WhatsApp widget number is used when configured */
  contactWhatsapp: string;
  /** Phone number for the call-an-advisor button (empty hides it) */
  contactPhone: string;
  waDemoPrefill: string;

  // ── Dentalix — how buying works (steps 1–3 reuse howStep*) ──────────────────
  howKicker: string;
  howStep4Title: string;
  howStep4Sub: string;
  howPaymentNote: string;

  // ── Dentalix — pricing ──────────────────────────────────────────────────────
  pricingKicker: string;
  pricingTitle: string;
  pricingSub: string;
  /** Category slug whose products are the pricing cards */
  pricingCategorySlug: string;
  /** Category slug whose products are shown as add-ons under the pricing cards */
  pricingAddonsSlug: string;
  /** Product handle highlighted as recommended (empty: none) */
  pricingRecommendedHandle: string;
  pricingRecommendedBadge: string;
  pricingDurationLabel: string;
  pricingFrom: string;
  /** Uses {duration} */
  pricingPer: string;
  /** Uses {amount} and {currency} */
  pricingSave: string;
  /** Uses {plan} */
  pricingChoose: string;
  pricingIncludedTitle: string;
  pricingCommon1: string;
  pricingCommon2: string;
  pricingCommon3: string;
  pricingAddonKicker: string;
  pricingAddonCta: string;
  pricingEmpty: string;

  // ── Dentalix — FAQ (an empty question hides its item) ───────────────────────
  faqKicker: string;
  faqTitle: string;
  faqSub: string;
  faq1Q: string;
  faq1A: string;
  faq2Q: string;
  faq2A: string;
  faq3Q: string;
  faq3A: string;
  faq4Q: string;
  faq4A: string;
  faq5Q: string;
  faq5A: string;
  faq6Q: string;
  faq6A: string;
  faq7Q: string;
  faq7A: string;

  // ── Dentalix — final CTA, footer, plan page, listing, thank-you, landing page ──
  ctaTitle: string;
  ctaSub: string;
  footerPayNote: string;
  planWithEvery: string;
  planScreensTitle: string;
  /** Uses {duration} */
  planLicenceFor: string;
  planPriceNote: string;
  listingSub: string;
  thankYouNextTitle: string;
  lpFormKicker: string;
}

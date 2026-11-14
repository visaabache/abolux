// Store admin in Arabic (default, right-to-left), French and English: dashboard, orders, products, categories
// and settings. Talks to /api/admin/*. Pages are addressed by the URL hash (#dashboard, #orders,
// #order-12…) so links and the back button work. The chosen language is remembered in localStorage.
(() => {
  const app = document.getElementById('app');

  const I18N = {
    ar: {
      locale: 'ar-MA',
      status: { new: 'جديد', confirmed: 'مؤكد', shipped: 'تم الشحن', delivered: 'تم التوصيل', cancelled: 'ملغى', returned: 'مرتجع' },
      nav: { dashboard: 'لوحة التحكم', orders: 'الطلبات', products: 'المنتجات', categories: 'الأصناف', blog: 'المدونة', settings: 'الإعدادات' },
      navShort: { dashboard: 'الرئيسية', settings: 'الإعدادات' },
      blog: {
        postTitle: 'العنوان', date: 'التاريخ', newPost: 'مقال جديد', editPost: 'تعديل المقال',
        count: (n) => (n === 1 ? 'مقال واحد' : `${n} مقالات`),
        noPosts: 'لا توجد مقالات بعد. اكتب أول مقال لجلب زوار من Google.',
        excerpt: 'ملخص قصير', excerptHint: 'جملة أو جملتان تظهران في Google وفي قائمة المقالات (حتى 300 حرف). ضع فيهما الكلمات التي يبحث عنها زبناؤك.',
        cover: 'صورة الغلاف', coverHint: 'تظهر في أعلى المقال وعند مشاركته على واتساب وفيسبوك.', uploadCover: 'رفع صورة', coverLink: 'أو رابط صورة',
        body: 'نص المقال', published: 'منشور في الموقع', saved: 'تم حفظ المقال', deleted: 'تم حذف المقال', confirmDelete: 'حذف هذا المقال؟',
      },
      seo: 'Google (الظهور في البحث)', seoHint: 'خريطة الموقع تُنشر تلقائيًا على /sitemap.xml وتتضمن المنتجات والأصناف والمقالات الحالية. لربط المتجر بـ Google Search Console، الصق رمز التحقق هنا.',
      googleVerify: 'رمز التحقق من Google Search Console', googleHow: 'في Search Console اختر «بادئة عنوان URL» ثم طريقة «علامة HTML»، وانسخ الوسم كاملًا أو قيمة content فقط.',
      viewStore: 'عرض المتجر',
      logout: 'تسجيل الخروج',
      logoutAsk: 'تسجيل الخروج من فضاء البائع؟',
      sellerSpace: 'فضاء البائع',
      loginHint: 'سجّل الدخول لإدارة طلباتك.',
      password: 'كلمة السر',
      signIn: 'دخول',
      errors: {
        wrong_password: 'كلمة السر غير صحيحة.',
        locked: 'محاولات كثيرة خاطئة. تم إيقاف الدخول من هذا الجهاز مؤقتًا، حاول لاحقًا.',
        bad_origin: 'طلب مرفوض.',
        slug_taken: 'هذا الرابط (slug) مستعمل من قبل.',
        name_required: 'أضف اسمًا واحدًا على الأقل.',
        title_required: 'أضف عنوانًا واحدًا على الأقل.',
        price_required: 'حدّد الثمن.',
        not_enough_stock: 'المخزون غير كافٍ لإعادة فتح هذا الطلب.',
        bad_shipping_rates: 'أثمنة التوصيل حسب المدينة: صيغة غير صحيحة.',
        no_r2: 'تخزين الصور (R2) غير مفعّل.',
        too_large: 'الصورة كبيرة جدًا (5 ميغا كحد أقصى).',
        video_too_large: 'الفيديو كبير جدًا (5 ميغا كحد أقصى).',
        bad_type: 'صيغة الصورة غير مدعومة.',
        no_ai_key: 'مفتاح Claude (ANTHROPIC_API_KEY) غير مثبت فـ Cloudflare.', ai_bad_key: 'مفتاح Claude غير صحيح.', ai_busy: 'Claude مشغول، عاود من بعد دقيقة.', ai_failed: 'ما قدرش يكتب الوصف، عاود.', ai_refused: 'Claude رفض يكتب على هاد المنتج.', ai_needs_input: 'زيد سمية المنتج، معلومات ولا تصاور أولا.',
        no_email_key: 'مفتاح Brevo غير مثبت بعد (انظر الخطوات أسفله).',
        no_email_from: 'أدخل عنوان الإرسال (المؤكد في Brevo).',
        no_notify_email: 'أدخل العنوان الذي يستقبل التنبيهات.',
        email_failed: 'رفض Brevo الإرسال.',
        generic: 'خطأ',
      },
      ago: { now: 'الآن', min: (n) => `منذ ${n} د`, hour: (n) => `منذ ${n} س`, day: (n) => `منذ ${n} ي` },
      hello: ['صباح الخير', 'مساء الخير', 'مساء الخير'],
      pending: (n) => `${n} ${n > 1 ? 'طلبات' : 'طلب'} في انتظار التأكيد.`,
      pendingHint: 'اتصل بالزبون أو راسله على واتساب قبل الإرسال.',
      sales30: 'المبيعات · 30 يومًا',
      orders30: 'الطلبات · 30 يومًا',
      today: 'اليوم',
      aov: 'متوسط السلة',
      excludingCancelled: 'بدون الملغاة',
      collected30: 'المحصّل · 30 يومًا',
      deliveredOrders: 'الطلبات المسلّمة',
      deliveredRate: (n) => `${n}% سُلّمت من الطلبات المغلقة`,
      isNew: 'جديد',
      salesPerDay: 'المبيعات اليومية',
      last30dh: 'آخر 30 يومًا، بالدرهم',
      days30: '30 يومًا',
      salesChartLabel: 'المبيعات اليومية خلال 30 يومًا',
      ordersN: (n) => `${n} ${n === 1 ? 'طلب' : 'طلبات'}`,
      pipeline: 'تتبع الطلبات',
      noOrdersMonth: 'لا توجد طلبات هذا الشهر بعد.',
      cities: 'المدن',
      ordersShort30: 'الطلبات، 30 يومًا',
      nothingYet: 'لا شيء للعرض حاليًا.',
      bestSellers: 'الأكثر مبيعًا',
      bestSellersEmpty: 'ستظهر هنا منتجاتك الأكثر مبيعًا.',
      latestOrders: 'آخر الطلبات',
      seeAll: 'عرض الكل',
      noOrdersYet: 'لا توجد طلبات بعد. شارك رابط متجرك!',
      lowStock: 'مخزون منخفض',
      left: (n) => `${n} متبقية`,
      soldOut: 'نفد',
      emails: 'الرسائل التلقائية',
      emailsOn: 'مفعّلة',
      emailsOff: 'غير مفعّلة',
      emailsOnText: (to) => `تأكيد للزبون وتنبيه إلى <strong>${to}</strong> عند كل طلب.`,
      emailsOffText: 'أرسل تأكيدًا لزبائنك وتوصّل بتنبيه عند كل طلب.',
      emailSettings: 'إعدادات الرسائل',
      setUp: 'الإعداد في 5 دقائق',
      exportCsv: 'تصدير CSV',
      total: (n) => `${n} في المجموع`,
      all: 'الكل',
      searchOrders: 'رقم، اسم، هاتف، مدينة',
      thOrder: 'الطلب', thCustomer: 'الزبون', thCity: 'المدينة', thTotal: 'المجموع', thStatus: 'الحالة',
      noMatch: 'لا توجد طلبات مطابقة.',
      orderAt: 'طلب',
      language: 'اللغة',
      phone: 'الهاتف', email: 'البريد', city: 'المدينة', address: 'العنوان', note: 'ملاحظة',
      call: 'اتصال',
      delivery: 'التوصيل', free: 'مجاني', toCollect: 'المبلغ المستحق',
      adminNote: 'ملاحظة داخلية', adminNoteHint: 'لا يراها إلا أنت',
      changeStatus: 'تغيير الحالة',
      statusEmailHint: 'يتوصل الزبون برسالة عندما يصبح الطلب مؤكدًا، تم شحنه، تم توصيله أو ملغى.',
      updated: 'تم تحديث الطلب',
      updatedEmailed: 'تم تحديث الطلب · أُرسلت رسالة للزبون',
      noteSaved: 'تم حفظ الملاحظة',
      close: 'إغلاق',
      thProduct: 'المنتج', thCategory: 'الصنف', thPrice: 'الثمن', thStock: 'المخزون', thState: 'الحالة',
      home: '★ الرئيسية', online: 'معروض', hidden: 'مخفي',
      noProducts: 'لا توجد منتجات. أضف أول منتج.',
      nProducts: (n) => `${n} ${n === 1 ? 'منتج' : 'منتجات'}`,
      add: 'إضافة',
      editProduct: 'تعديل المنتج', newProduct: 'منتج جديد',
      name: 'الاسم', priceStock: 'الثمن والمخزون',
      price: 'الثمن (درهم)', comparePrice: 'الثمن القديم (مشطوب، اختياري)', stock: 'المخزون (فارغ = غير محدود)', category: 'الصنف',
      options: 'الخيارات (الألوان، المقاسات…)',
      opt: {
        hint: 'أضف ما يختاره الزبون قبل الطلب: اللون، المقاس، السعة… يظهر اختياره في الطلب وفي الرسائل.',
        color: 'لون', size: 'مقاس', other: 'خيار آخر',
        colorName: 'اللون', sizeName: 'المقاس',
        groupName: 'اسم الخيار', type: 'النوع', typeText: 'أزرار نص', typeColor: 'ألوان',
        value: 'القيمة', valuePh: 'مثال: أحمر، XL، 128GB', extra: 'فرق الثمن (درهم)', addValue: 'إضافة قيمة', removeGroup: 'حذف هذا الخيار',
        needValue: 'أضف قيمة واحدة على الأقل لكل خيار، أو احذفه.',
      },
      offers: 'عروض الكمية (مثال: 2 بـ 340 درهم)',
      bun: {
        hint: 'تظهر كبطاقات يختار منها الزبون في صفحة المنتج: قطعة واحدة بالثمن العادي، ثم العروض. الثمن هو ثمن كل القطع معًا، ويُحسب التوفير تلقائيًا.',
        qty: 'عدد القطع', price: 'ثمن الكل (درهم)', title: 'عنوان البطاقة (اختياري)', titlePh: 'مثال: جوج طقوم بـ 340 درهم', hot: 'الأكثر طلبًا 🔥',
        add: 'إضافة عرض', save: (x) => `توفير ${x}`, notCheaper: 'ليس أرخص من الثمن العادي، لن يظهر',
        bad: 'كل عرض يحتاج عدد قطع من 2 إلى 20 وثمنًا، وعددًا مختلفًا عن العروض الأخرى.',
        left: 'بقي غير X قطع (لهذا المنتج)', leftHint: 'كيظهر "بقي غير 7 قطع من عرض الـ2" وكينقص مع كل طلب. فارغ = العدد العام من الإعدادات، 0 = إخفاء.',
      },
      photos: 'الصور', addPhotos: 'اختيار صور', takePhoto: 'التقاط صورة',
      dropHere: 'اسحب الصور هنا أو اخترها من جهازك', dropHint: 'JPG، PNG، WEBP… تُصغَّر تلقائيًا قبل الرفع. الصورة الأولى هي الرئيسية.',
      mainPhoto: 'رئيسية', moveBefore: 'تقديم', moveAfter: 'تأخير', pasteLinks: 'أو الصق روابط صور',
      uploadFailed: (n) => `تعذّر رفع ${n}`, notImage: (n) => `${n} ليس صورة مدعومة`, waitUploads: 'انتظر حتى ينتهي رفع الصور.',
      photoLinks: 'روابط الصور (رابط في كل سطر)', remove: 'حذف',
      description: 'الوصف', display: 'العرض',
      videoTooBig: (n) => `الفيديو ${n} أكبر من 5 ميغا. صغّره ثم أعد المحاولة.`, photoTooBig: (n) => `الصورة ${n} أكبر من 1 ميغا.`,
      notMedia: (n) => `${n} ليس صورة أو فيديو مدعوم`,
      gifTooBig: (n, mb) => `صورة GIF ${n} أكبر من ${mb} ميغا.`,
      ai: {
        title: 'اكتب الوصف بالذكاء الاصطناعي', hint: 'Claude يشوف تصاور المنتج والمعلومات ديالك، ويكتب وصف كيبيع بالعربية والفرنسية والإنجليزية: وعد قوي، المشكل اللي كيحل، المميزات كفوائد، طريقة الاستعمال، شنو فالعلبة والعرض.',
        notes: 'شنو كتعرف على المنتج؟', notesPh: 'مثلا: 4 علب إينوكس، 2 لتر، كيسخن ف 10 دقايق، 220 فولط، فالعلبة: الكابل والدليل…',
        style: 'أسلوب العربية', darija: 'الدارجة المغربية', fusha: 'العربية الفصحى', alsoNames: 'اقترح حتى سمية المنتج',
        go: 'اكتب الوصف', working: 'كيكتب… (حتى دقيقة)', done: 'الوصف واجد. راجعو قبل ما تسجل.',
        review: 'كيستعمل غير المعلومات اللي عطيتي واللي باينة فالتصاور. راجع الأرقام قبل التسجيل.',
        replace: 'الوصف الحالي غادي يتبدل. نكملو؟',
        noKey: 'خاص مفتاح Claude (ANTHROPIC_API_KEY) فـ Cloudflare باش تخدم هاد الخاصية.',
      },
      rte: {
        hint: 'اكتب كما في Word. أضف الصور وصور GIF والفيديو بالأزرار، أو اسحبها أو الصقها داخل النص. اضغط على صورة أو فيديو لتغيير الحجم أو المحاذاة أو حذفه، أو اسحب أحد جوانبه أو زواياه.',
        placeholder: 'اكتب وصف المنتج هنا…', undo: 'تراجع', redo: 'إعادة', p: 'نص عادي', h2: 'عنوان كبير', h3: 'عنوان صغير', quote: 'اقتباس',
        bold: 'عريض', italic: 'مائل', underline: 'تسطير', strike: 'شطب', color: 'لون النص', highlight: 'تظليل',
        ul: 'قائمة نقطية', ol: 'قائمة مرقمة', left: 'محاذاة لليسار', center: 'توسيط', right: 'محاذاة لليمين',
        link: 'إضافة رابط', unlink: 'إزالة الرابط', photo: 'صورة أو GIF', video: 'فيديو (MP4، MOV، WebM)', embed: 'من رابط: يوتيوب أو Vimeo أو صورة أو فيديو',
        hr: 'خط فاصل', clear: 'مسح التنسيق', linkPrompt: 'الصق الرابط (https://…)', embedPrompt: 'الصق رابط يوتيوب أو Vimeo أو رابط صورة أو فيديو (https://…)',
        badLink: 'رابط غير صالح. يجب أن يبدأ بـ https://', size: 'الحجم', smaller: 'أصغر', bigger: 'أكبر', dragSize: 'اسحب لتغيير الحجم أو الشكل', resetShape: 'الحجم والشكل الأصليان', alignL: 'يسار', alignC: 'وسط', alignR: 'يمين', del: 'حذف',
      },
      slug: 'رابط الصفحة (slug)', auto: 'تلقائي', sort: 'ترتيب العرض',
      featured: 'إبرازه في الصفحة الرئيسية', active: 'معروض (ظاهر في المتجر)',
      cancel: 'إلغاء', view: 'عرض', del: 'حذف', save: 'حفظ',
      confirmDeleteProduct: 'حذف هذا المنتج؟ الطلبات السابقة تبقى محفوظة.',
      productDeleted: 'تم حذف المنتج', productSaved: 'تم حفظ المنتج',
      uploading: (n) => `جارٍ رفع ${n}…`,
      catsSub: 'أقسام متجرك',
      thPhoto: 'الصورة', thPhotoLink: 'رابط الصورة', thSort: 'الترتيب', thProducts: 'المنتجات',
      newCategory: 'صنف جديد', ok: 'حفظ',
      catSaved: 'تم حفظ الصنف',
      confirmDeleteCat: 'حذف هذا الصنف؟ تبقى منتجاته معروضة بدون صنف.',
      store: 'المتجر', storeName: 'اسم المتجر', whatsapp: 'رقم واتساب (مثال 212612345678)', contactEmail: 'بريد التواصل (الزبائن يردّون عليه)',
      emailsIntro: 'عند كل طلب، يتوصل الزبون بتأكيد بلغته (إذا أدخل بريده) وتتوصل أنت بتنبيه. ويُخبَر الزبون أيضًا عندما يصبح طلبه مؤكدًا، تم شحنه، تم توصيله أو ملغى.',
      keyOk: 'مفتاح Brevo مثبت', keyMissing: 'مفتاح Brevo غير مثبت',
      emailFrom: 'عنوان الإرسال (مؤكد في Brevo)', notifyEmail: 'استقبال تنبيهات الطلبات على',
      statusUpdates: 'إخبار الزبون عند كل تغيير في الحالة',
      currency: 'العملة', autoCurrency: 'عرض الأثمنة بعملة بلد الزائر (يورو، دولار، جنيه…)',
      urgency: 'الاستعجال في صفحة المنتج',
      urgencyHint: 'عداد تنازلي في أعلى صفحة كل منتج فيه عرض: كل زائر عندو 24 ساعة من أول زيارة، ومن بعد كيبدا من جديد. وجملة "بقي غير X قطع من العرض" فوق العروض، كتنقص بوحدها مع كل طلب.',
      countdownOn: 'إظهار العداد التنازلي "ينتهي العرض خلال…" (24 ساعة)',
      offerLeftAll: 'عدد القطع المتبقية فالعرض (لكل المنتجات)', offerLeftAllHint: 'مثال: 7. اتركه فارغًا لإخفاء الجملة. يمكن تغييره لكل منتج في صفحة المنتج.',
      currencyHint: 'الزبون يدفع دائمًا بالدرهم عند الاستلام: الأثمنة المحوّلة للتوضيح فقط، وتُحدَّث أسعار الصرف كل 12 ساعة. الطلبات والإدارة تبقى بالدرهم.',
      weakPassword: 'كلمة سر الإدارة قصيرة. استعمل 12 حرفًا على الأقل (npx wrangler secret put ADMIN_PASSWORD).',
      social: 'مواقع التواصل',
      socialHint: 'الصق رابط الصفحة أو اسم الحساب فقط (مثلا @abolux). تظهر الأيقونات أسفل المتجر.',
      pixels: 'بيكسل الإعلانات',
      pixelsHint: 'الصق رقم البيكسل فقط، وليس الكود كاملًا. لا يُحمَّل أي بيكسل إلا بعد موافقة الزائر على ملفات الارتباط.',
      adsenseHint: 'إعلانات Google تظهر فمقالات المدونة فقط، ماشي فصفحات المتجر ولا الطلب. كتحمّل من بعد ما يتحمّل المقال، باش ما تبطّاش الموقع.', adsenseId: 'رقم الناشر (Publisher ID)', adsenseHow: 'فـ AdSense: Account ← Account information ← Publisher ID (كيبدا بـ pub-). ملف ads.txt كيتزاد بوحدو.',
      metaPixel: 'رقم Meta Pixel (فيسبوك وإنستغرام)',
      metaHow: 'فيسبوك: Meta Events Manager ← مصادر البيانات ← اختر البيكسل ← الرقم (Dataset ID) من 15 أو 16 رقمًا.',
      tiktokPixel: 'رقم TikTok Pixel',
      tiktokHow: 'تيك توك: TikTok Ads Manager ← Tools ← Events ← Web Events ← البيكسل ← الرقم (مثل C4ABC…).',
      legal: 'معلومات الشركة (للصفحات القانونية)',
      legalHint: 'تظهر في صفحتي «سياسة الخصوصية» و«شروط البيع». النصوص نسخة أولية، يُستحسن مراجعتها من طرف محاسب أو مختص قانوني.',
      legalName: 'الاسم القانوني (شركة أو مقاول ذاتي)',
      legalIce: 'رقم ICE',
      legalRc: 'السجل التجاري (RC) أو رقم المقاول الذاتي',
      legalAddress: 'العنوان',
      legalCndp: 'رقم التصريح لدى CNDP (إن وُجد)',
      viewPages: 'عرض الصفحات:',
      legalPrivacy: 'سياسة الخصوصية',
      legalTerms: 'شروط البيع',
      sendTest: 'إرسال رسالة تجريبية', howItWorks: 'كيف يعمل؟',
      steps: [
        'أنشئ حسابًا مجانيًا على <a href="https://www.brevo.com" target="_blank" rel="noopener">brevo.com</a> (300 رسالة في اليوم مجانًا).',
        'في Brevo، افتح <em>Senders, domains &amp; dedicated IPs</em> وأضف عنوان الإرسال (مثلًا بريد Gmail). اضغط على رابط التأكيد الذي يصلك.',
        'في Brevo، افتح <em>SMTP &amp; API → API keys</em> وأنشئ مفتاحًا. لا تشاركه مع أحد.',
        'على حاسوبك، في مجلد المتجر، شغّل <code>npx wrangler secret put BREVO_API_KEY</code> والصق المفتاح عندما يُطلب منك.',
        'أدخل العنوان المؤكد أسفله، احفظ، ثم اضغط «إرسال رسالة تجريبية».',
      ],
      shipping: 'التوصيل', shippingIncluded: 'التوصيل مجاني لجميع المدن: ثمنه داخل في ثمن المنتجات، والزبون يدفع ثمن المنتج فقط عند الاستلام.', shippingFee: 'ثمن التوصيل الافتراضي (درهم)', freeOver: 'توصيل مجاني ابتداءً من (درهم، 0 = أبدًا)',
      rates: 'أثمنة حسب المدينة (سطر لكل مدينة: المدينة = الثمن)',
      banner: 'شريط الإعلان', bannerHint: 'الرسالة التي تمر أعلى كل صفحة.',
      homePage: 'الصفحة الرئيسية', homeHint: 'اتركه فارغًا للاحتفاظ بالنص الافتراضي.',
      heroTitle: 'العنوان', heroText: 'النص',
      saveSettings: 'حفظ الإعدادات', settingsSaved: 'تم حفظ الإعدادات',
      testSent: (to) => `أُرسلت الرسالة التجريبية إلى ${to}`,
      fr: 'الفرنسية', ar: 'العربية', en: 'الإنجليزية',
    },
    fr: {
      locale: 'fr-MA',
      status: { new: 'Nouvelle', confirmed: 'Confirmée', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée', returned: 'Retournée' },
      nav: { dashboard: 'Tableau de bord', orders: 'Commandes', products: 'Produits', categories: 'Catégories', blog: 'Blog', settings: 'Réglages' },
      navShort: { dashboard: 'Accueil', orders: 'Commandes', categories: 'Catégories', settings: 'Réglages' },
      blog: {
        postTitle: 'Titre', date: 'Date', newPost: 'Nouvel article', editPost: 'Modifier l’article',
        count: (n) => (n === 1 ? '1 article' : `${n} articles`),
        noPosts: 'Aucun article pour le moment. Écrivez le premier pour attirer des visiteurs depuis Google.',
        excerpt: 'Résumé court', excerptHint: 'Une ou deux phrases affichées dans Google et dans la liste des articles (300 caractères max). Mettez-y les mots que vos clients recherchent.',
        cover: 'Photo de couverture', coverHint: 'Affichée en haut de l’article et quand on le partage sur WhatsApp ou Facebook.', uploadCover: 'Envoyer une photo', coverLink: 'Ou lien d’une image',
        body: 'Texte de l’article', published: 'Publié sur le site', saved: 'Article enregistré', deleted: 'Article supprimé', confirmDelete: 'Supprimer cet article ?',
      },
      seo: 'Google (référencement)', seoHint: 'Le plan du site est publié automatiquement sur /sitemap.xml, avec les produits, catégories et articles du moment. Pour relier la boutique à Google Search Console, collez ici le code de vérification.',
      googleVerify: 'Code de vérification Google Search Console', googleHow: 'Dans Search Console, choisissez « Préfixe de l’URL » puis la méthode « Balise HTML », et copiez la balise entière ou seulement la valeur content.',
      viewStore: 'Voir la boutique',
      logout: 'Déconnexion',
      logoutAsk: 'Se déconnecter de l’espace vendeur ?',
      sellerSpace: 'Espace vendeur',
      loginHint: 'Connectez-vous pour gérer vos commandes.',
      password: 'Mot de passe',
      signIn: 'Se connecter',
      errors: {
        wrong_password: 'Mot de passe incorrect.',
        locked: 'Trop d’essais ratés. La connexion depuis cet appareil est bloquée un moment, réessayez plus tard.',
        bad_origin: 'Requête refusée.',
        slug_taken: 'Cette adresse (slug) est déjà utilisée.',
        name_required: 'Ajoutez au moins un nom.',
        title_required: 'Ajoutez au moins un titre.',
        price_required: 'Indiquez un prix.',
        not_enough_stock: 'Stock insuffisant pour rouvrir cette commande.',
        bad_shipping_rates: 'Tarifs par ville : format invalide.',
        no_r2: 'Le stockage des photos (R2) n’est pas configuré.',
        too_large: 'Photo trop lourde (5 Mo max).',
        video_too_large: 'Vidéo trop lourde (5 Mo max).',
        bad_type: 'Format de photo non pris en charge.',
        no_ai_key: 'La clé Claude (ANTHROPIC_API_KEY) n’est pas installée dans Cloudflare.', ai_bad_key: 'La clé Claude n’est pas valide.', ai_busy: 'Claude est occupé, réessayez dans une minute.', ai_failed: 'La description n’a pas pu être écrite, réessayez.', ai_refused: 'Claude a refusé d’écrire sur ce produit.', ai_needs_input: 'Ajoutez d’abord un nom, des notes ou des photos.',
        no_email_key: 'La clé Brevo n’est pas encore installée (voir les étapes ci-dessous).',
        no_email_from: 'Indiquez l’adresse d’envoi (vérifiée dans Brevo).',
        no_notify_email: 'Indiquez l’adresse qui reçoit les alertes.',
        email_failed: 'Brevo a refusé l’envoi.',
        generic: 'Erreur',
      },
      ago: { now: 'à l’instant', min: (n) => `il y a ${n} min`, hour: (n) => `il y a ${n} h`, day: (n) => `il y a ${n} j` },
      hello: ['Bonjour', 'Bon après-midi', 'Bonsoir'],
      pending: (n) => `${n} commande${n > 1 ? 's' : ''} à confirmer.`,
      pendingHint: 'Appelez ou écrivez sur WhatsApp avant d’expédier.',
      sales30: 'Ventes · 30 jours',
      orders30: 'Commandes · 30 j',
      today: 'Aujourd’hui',
      aov: 'Panier moyen',
      excludingCancelled: 'hors annulées',
      collected30: 'Encaissé · 30 j',
      deliveredOrders: 'commandes livrées',
      deliveredRate: (n) => `${n} % livrées sur les clôturées`,
      isNew: 'Nouveau',
      salesPerDay: 'Ventes par jour',
      last30dh: '30 derniers jours, en DH',
      days30: '30 jours',
      salesChartLabel: 'Ventes par jour sur 30 jours',
      ordersN: (n) => `${n} commande${n > 1 ? 's' : ''}`,
      pipeline: 'Suivi des commandes',
      noOrdersMonth: 'Pas encore de commandes ce mois-ci.',
      cities: 'Villes',
      ordersShort30: 'commandes, 30 j',
      nothingYet: 'Rien à afficher pour l’instant.',
      bestSellers: 'Meilleures ventes',
      bestSellersEmpty: 'Vos produits les plus vendus apparaîtront ici.',
      latestOrders: 'Dernières commandes',
      seeAll: 'Tout voir',
      noOrdersYet: 'Aucune commande pour l’instant. Partagez le lien de votre boutique !',
      lowStock: 'Stock bas',
      left: (n) => `${n} restant${n > 1 ? 's' : ''}`,
      soldOut: 'Épuisé',
      emails: 'E-mails automatiques',
      emailsOn: 'Actifs',
      emailsOff: 'À configurer',
      emailsOnText: (to) => `Confirmation au client et alerte à <strong>${to}</strong> pour chaque commande.`,
      emailsOffText: 'Envoyez une confirmation à vos clients et recevez une alerte à chaque commande.',
      emailSettings: 'Réglages des e-mails',
      setUp: 'Configurer en 5 minutes',
      exportCsv: 'Export CSV',
      total: (n) => `${n} au total`,
      all: 'Toutes',
      searchOrders: 'N°, nom, téléphone, ville',
      thOrder: 'Commande', thCustomer: 'Client', thCity: 'Ville', thTotal: 'Total', thStatus: 'Statut',
      noMatch: 'Aucune commande ne correspond.',
      orderAt: 'Commande',
      language: 'Langue',
      phone: 'Téléphone', email: 'E-mail', city: 'Ville', address: 'Adresse', note: 'Remarque',
      call: 'Appeler',
      delivery: 'Livraison', free: 'Gratuite', toCollect: 'À encaisser',
      adminNote: 'Note interne', adminNoteHint: 'Visible uniquement par vous',
      changeStatus: 'Changer le statut',
      statusEmailHint: 'Le client reçoit un e-mail quand la commande passe à Confirmée, Expédiée, Livrée ou Annulée.',
      updated: 'Commande mise à jour',
      updatedEmailed: 'Commande mise à jour · e-mail envoyé au client',
      noteSaved: 'Note enregistrée',
      close: 'Fermer',
      thProduct: 'Produit', thCategory: 'Catégorie', thPrice: 'Prix', thStock: 'Stock', thState: 'État',
      home: '★ Accueil', online: 'En ligne', hidden: 'Masqué',
      noProducts: 'Aucun produit. Ajoutez le premier.',
      nProducts: (n) => `${n} produit${n > 1 ? 's' : ''}`,
      add: 'Ajouter',
      editProduct: 'Modifier le produit', newProduct: 'Nouveau produit',
      name: 'Nom', priceStock: 'Prix et stock',
      price: 'Prix (DH)', comparePrice: 'Ancien prix (barré, facultatif)', stock: 'Stock (vide = illimité)', category: 'Catégorie',
      options: 'Options (couleurs, tailles…)',
      opt: {
        hint: 'Ajoutez ce que le client choisit avant de commander : couleur, taille, capacité… Son choix apparaît dans la commande et les e-mails.',
        color: 'Couleur', size: 'Taille', other: 'Autre option',
        colorName: 'Couleur', sizeName: 'Taille',
        groupName: 'Nom de l’option', type: 'Type', typeText: 'Boutons texte', typeColor: 'Couleurs',
        value: 'Valeur', valuePh: 'ex. Rouge, XL, 128 Go', extra: 'Écart de prix (DH)', addValue: 'Ajouter une valeur', removeGroup: 'Supprimer cette option',
        needValue: 'Ajoutez au moins une valeur à chaque option, ou supprimez-la.',
      },
      offers: 'Offres par quantité (ex. 2 pour 340 DH)',
      bun: {
        hint: 'Affichées en cartes à choisir sur la page produit : 1 pièce au prix normal, puis vos offres. Le prix est celui de toutes les pièces ensemble ; l’économie est calculée toute seule.',
        qty: 'Pièces', price: 'Prix du lot (DH)', title: 'Titre de la carte (facultatif)', titlePh: 'ex. 2 sets pour 340 DH', hot: 'Le plus choisi 🔥',
        add: 'Ajouter une offre', save: (x) => `Économie ${x}`, notCheaper: 'Pas moins cher que le prix normal : ne sera pas affichée',
        bad: 'Chaque offre demande de 2 à 20 pièces et un prix, avec un nombre de pièces différent des autres offres.',
        left: 'Pièces restantes (ce produit)', leftHint: 'Affiche « Plus que 7 pièces pour l’offre 2 pièces » et baisse à chaque commande. Vide = le nombre des réglages, 0 = masqué.',
      },
      photos: 'Photos', addPhotos: 'Choisir des photos', takePhoto: 'Prendre une photo',
      dropHere: 'Glissez vos photos ici ou choisissez-les sur votre appareil', dropHint: 'JPG, PNG, WEBP… réduites automatiquement avant l’envoi. La première photo est la photo principale.',
      mainPhoto: 'Principale', moveBefore: 'Avancer', moveAfter: 'Reculer', pasteLinks: 'Ou collez des liens d’images',
      uploadFailed: (n) => `Échec de l’envoi de ${n}`, notImage: (n) => `${n} n’est pas une image prise en charge`, waitUploads: 'Attendez la fin de l’envoi des photos.',
      photoLinks: 'Liens des photos (un par ligne)', remove: 'Retirer',
      description: 'Description', display: 'Affichage',
      videoTooBig: (n) => `La vidéo ${n} dépasse 5 Mo. Réduisez-la puis réessayez.`, photoTooBig: (n) => `La photo ${n} dépasse 1 Mo.`,
      notMedia: (n) => `${n} n’est pas une photo ou une vidéo prise en charge`,
      gifTooBig: (n, mb) => `Le GIF ${n} dépasse ${mb} Mo.`,
      ai: {
        title: 'Écrire la description avec l’IA', hint: 'Claude regarde les photos du produit et vos notes, et écrit une description qui vend en arabe, français et anglais : promesse forte, problème résolu, avantages, mode d’emploi, contenu de la boîte et offre.',
        notes: 'Ce que vous savez du produit', notesPh: 'Ex. : 4 bols inox, 2 L, chauffe en 10 min, 220 V, dans la boîte : câble et notice…',
        style: 'Style de l’arabe', darija: 'Darija marocaine', fusha: 'Arabe standard', alsoNames: 'Proposer aussi le nom du produit',
        go: 'Écrire la description', working: 'Rédaction… (jusqu’à 1 min)', done: 'Description prête. Relisez-la avant d’enregistrer.',
        review: 'Seules vos informations et ce qui est visible sur les photos sont utilisés. Vérifiez les chiffres avant d’enregistrer.',
        replace: 'La description actuelle sera remplacée. Continuer ?',
        noKey: 'Cette fonction demande la clé Claude (ANTHROPIC_API_KEY) dans Cloudflare.',
      },
      rte: {
        hint: 'Écrivez comme dans Word. Ajoutez photos, GIF et vidéos avec les boutons, ou glissez-les / collez-les dans le texte. Cliquez sur une photo ou une vidéo pour changer sa taille, son alignement ou la supprimer, ou tirez un de ses côtés ou coins.',
        placeholder: 'Écrivez la description du produit…', undo: 'Annuler', redo: 'Rétablir', p: 'Texte normal', h2: 'Grand titre', h3: 'Petit titre', quote: 'Citation',
        bold: 'Gras', italic: 'Italique', underline: 'Souligné', strike: 'Barré', color: 'Couleur du texte', highlight: 'Surligner',
        ul: 'Liste à puces', ol: 'Liste numérotée', left: 'Aligner à gauche', center: 'Centrer', right: 'Aligner à droite',
        link: 'Ajouter un lien', unlink: 'Retirer le lien', photo: 'Photo ou GIF', video: 'Vidéo (MP4, MOV, WebM)', embed: 'Depuis un lien : YouTube, Vimeo, image ou vidéo',
        hr: 'Ligne de séparation', clear: 'Effacer la mise en forme', linkPrompt: 'Collez le lien (https://…)', embedPrompt: 'Collez un lien YouTube, Vimeo, ou le lien d’une image ou d’une vidéo (https://…)',
        badLink: 'Lien invalide. Il doit commencer par https://', size: 'Taille', smaller: 'Plus petit', bigger: 'Plus grand', dragSize: 'Glissez pour changer la taille ou la forme', resetShape: 'Taille et forme d’origine', alignL: 'Gauche', alignC: 'Centre', alignR: 'Droite', del: 'Supprimer',
      },
      slug: 'Adresse de la page (slug)', auto: 'automatique', sort: 'Ordre d’affichage',
      featured: 'Mettre en avant sur l’accueil', active: 'En ligne (visible dans la boutique)',
      cancel: 'Annuler', view: 'Voir', del: 'Supprimer', save: 'Enregistrer',
      confirmDeleteProduct: 'Supprimer ce produit ? Les anciennes commandes sont conservées.',
      productDeleted: 'Produit supprimé', productSaved: 'Produit enregistré',
      uploading: (n) => `Envoi de ${n}…`,
      catsSub: 'Les rayons de votre boutique',
      thPhoto: 'Photo', thPhotoLink: 'Lien de la photo', thSort: 'Ordre', thProducts: 'Produits',
      newCategory: 'Nouvelle catégorie', ok: 'OK',
      catSaved: 'Catégorie enregistrée',
      confirmDeleteCat: 'Supprimer cette catégorie ? Ses produits restent en ligne, sans catégorie.',
      store: 'Boutique', storeName: 'Nom de la boutique', whatsapp: 'Numéro WhatsApp (ex. 212612345678)', contactEmail: 'E-mail de contact (les clients y répondent)',
      emailsIntro: 'À chaque commande, le client reçoit une confirmation dans sa langue (s’il a donné son e-mail) et vous recevez une alerte. Le client est aussi prévenu quand sa commande est confirmée, expédiée, livrée ou annulée.',
      keyOk: 'Clé Brevo installée', keyMissing: 'Clé Brevo manquante',
      emailFrom: 'Adresse d’envoi (vérifiée dans Brevo)', notifyEmail: 'Recevoir les alertes de commande sur',
      statusUpdates: 'Prévenir le client à chaque changement de statut',
      currency: 'Devise', autoCurrency: 'Afficher les prix dans la devise du pays du visiteur (euro, dollar, livre…)',
      urgency: 'Urgence sur la page produit',
      urgencyHint: 'Un compte à rebours en haut de chaque produit avec une offre : chaque visiteur a 24 h à partir de sa première visite, puis il repart. Et la phrase « Plus que X pièces pour l’offre » au-dessus des offres, qui baisse toute seule à chaque commande.',
      countdownOn: 'Afficher le compte à rebours « L’offre se termine dans… » (24 h)',
      offerLeftAll: 'Pièces restantes dans l’offre (tous les produits)', offerLeftAllHint: 'ex. 7. Laissez vide pour masquer la phrase. Modifiable produit par produit.',
      currencyHint: 'Le client paie toujours en dirhams à la livraison : les prix convertis sont indicatifs, avec des taux mis à jour toutes les 12 heures. Commandes et administration restent en dirhams.',
      weakPassword: 'Le mot de passe admin est court. Utilisez au moins 12 caractères (npx wrangler secret put ADMIN_PASSWORD).',
      social: 'Réseaux sociaux',
      socialHint: 'Collez le lien de la page ou juste le nom du compte (ex. @abolux). Les icônes s’affichent en bas de la boutique.',
      pixels: 'Pixels publicitaires',
      pixelsHint: 'Collez seulement l’identifiant, pas le code complet. Aucun pixel n’est chargé tant que le visiteur n’a pas accepté les cookies.',
      adsenseHint: 'Les annonces Google s’affichent seulement dans les articles du blog, jamais sur les pages de la boutique ni de commande. Elles se chargent après l’article, sans ralentir le site.', adsenseId: 'ID d’éditeur (Publisher ID)', adsenseHow: 'Dans AdSense : Compte → Informations sur le compte → ID d’éditeur (commence par pub-). Le fichier ads.txt est ajouté tout seul.',
      metaPixel: 'ID Meta Pixel (Facebook et Instagram)',
      metaHow: 'Facebook : Meta Events Manager → Sources de données → votre pixel → l’ID (Dataset ID) de 15 ou 16 chiffres.',
      tiktokPixel: 'ID TikTok Pixel',
      tiktokHow: 'TikTok : TikTok Ads Manager → Tools → Events → Web Events → votre pixel → l’ID (ex. C4ABC…).',
      legal: 'Informations légales',
      legalHint: 'Affichées dans la politique de confidentialité et les conditions de vente. Ces textes sont un projet : faites-les relire par un comptable ou un juriste.',
      legalName: 'Raison sociale ou nom (auto-entrepreneur)',
      legalIce: 'ICE',
      legalRc: 'RC ou n° auto-entrepreneur',
      legalAddress: 'Adresse',
      legalCndp: 'N° de déclaration CNDP (si disponible)',
      viewPages: 'Voir les pages :',
      legalPrivacy: 'Confidentialité',
      legalTerms: 'Conditions de vente',
      sendTest: 'Envoyer un test', howItWorks: 'Comment ça marche ?',
      steps: [
        'Créez un compte gratuit sur <a href="https://www.brevo.com" target="_blank" rel="noopener">brevo.com</a> (300 e-mails par jour offerts).',
        'Dans Brevo, ouvrez <em>Expéditeurs, domaines et IP dédiées</em> et ajoutez votre adresse d’envoi (par ex. votre Gmail). Cliquez sur le lien de vérification reçu.',
        'Dans Brevo, ouvrez <em>SMTP et API → Clés API</em> et créez une clé. Ne la partagez avec personne.',
        'Sur votre PC, dans le dossier de la boutique, lancez <code>npx wrangler secret put BREVO_API_KEY</code> et collez la clé quand on vous la demande.',
        'Indiquez ci-dessous l’adresse vérifiée, enregistrez, puis cliquez sur « Envoyer un test ».',
      ],
      shipping: 'Livraison', shippingIncluded: 'Livraison gratuite dans toutes les villes : elle est comprise dans le prix des produits, le client paie seulement le prix affiché à la livraison.', shippingFee: 'Frais de livraison par défaut (DH)', freeOver: 'Livraison gratuite à partir de (DH, 0 = jamais)',
      rates: 'Tarifs par ville (une ligne par ville : Ville = prix)',
      banner: 'Bandeau d’annonce', bannerHint: 'Le message qui défile en haut de chaque page.',
      homePage: 'Accueil', homeHint: 'Laissez vide pour garder le texte par défaut.',
      heroTitle: 'Titre', heroText: 'Sous-titre',
      saveSettings: 'Enregistrer les réglages', settingsSaved: 'Réglages enregistrés',
      testSent: (to) => `E-mail de test envoyé à ${to}`,
      fr: 'Français', ar: 'العربية', en: 'English',
    },
    en: {
      locale: 'en-GB',
      status: { new: 'New', confirmed: 'Confirmed', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled', returned: 'Returned' },
      nav: { dashboard: 'Dashboard', orders: 'Orders', products: 'Products', categories: 'Categories', blog: 'Blog', settings: 'Settings' },
      navShort: { dashboard: 'Home', orders: 'Orders', categories: 'Categories', settings: 'Settings' },
      blog: {
        postTitle: 'Title', date: 'Date', newPost: 'New post', editPost: 'Edit post',
        count: (n) => (n === 1 ? '1 post' : `${n} posts`),
        noPosts: 'No posts yet. Write the first one to bring in visitors from Google.',
        excerpt: 'Short summary', excerptHint: 'One or two sentences shown in Google and in the post list (300 characters max). Use the words your customers search for.',
        cover: 'Cover photo', coverHint: 'Shown at the top of the post and when it is shared on WhatsApp or Facebook.', uploadCover: 'Upload a photo', coverLink: 'Or an image link',
        body: 'Post text', published: 'Published on the site', saved: 'Post saved', deleted: 'Post deleted', confirmDelete: 'Delete this post?',
      },
      seo: 'Google (search)', seoHint: 'The sitemap is published automatically at /sitemap.xml, with your current products, categories and posts. To connect the store to Google Search Console, paste the verification code here.',
      googleVerify: 'Google Search Console verification code', googleHow: 'In Search Console, choose “URL prefix”, then the “HTML tag” method, and copy the whole tag or just the content value.',
      viewStore: 'View store',
      logout: 'Log out',
      logoutAsk: 'Log out of the seller space?',
      sellerSpace: 'Seller space',
      loginHint: 'Sign in to manage your orders.',
      password: 'Password',
      signIn: 'Sign in',
      errors: {
        wrong_password: 'Wrong password.',
        locked: 'Too many failed attempts. Sign-in from this device is blocked for a while, try again later.',
        bad_origin: 'Request refused.',
        slug_taken: 'This address (slug) is already used.',
        name_required: 'Add at least one name.',
        title_required: 'Add at least one title.',
        price_required: 'Enter a price.',
        not_enough_stock: 'Not enough stock to reopen this order.',
        bad_shipping_rates: 'Rates by city: invalid format.',
        no_r2: 'Photo storage (R2) is not set up.',
        too_large: 'Photo too large (5 MB max).',
        video_too_large: 'Video too large (5 MB max).',
        bad_type: 'Photo format not supported.',
        no_ai_key: 'The Claude key (ANTHROPIC_API_KEY) is not installed in Cloudflare.', ai_bad_key: 'The Claude key is not valid.', ai_busy: 'Claude is busy, try again in a minute.', ai_failed: 'The description could not be written, try again.', ai_refused: 'Claude declined to write about this product.', ai_needs_input: 'Add a name, notes or photos first.',
        no_email_key: 'The Brevo key is not installed yet (see the steps below).',
        no_email_from: 'Enter the sender address (verified in Brevo).',
        no_notify_email: 'Enter the address that receives the alerts.',
        email_failed: 'Brevo refused to send.',
        generic: 'Error',
      },
      ago: { now: 'just now', min: (n) => `${n} min ago`, hour: (n) => `${n} h ago`, day: (n) => `${n} d ago` },
      hello: ['Good morning', 'Good afternoon', 'Good evening'],
      pending: (n) => `${n} order${n > 1 ? 's' : ''} to confirm.`,
      pendingHint: 'Call or message on WhatsApp before shipping.',
      sales30: 'Sales · 30 days',
      orders30: 'Orders · 30 d',
      today: 'Today',
      aov: 'Average order',
      excludingCancelled: 'excluding cancelled',
      collected30: 'Collected · 30 d',
      deliveredOrders: 'orders delivered',
      deliveredRate: (n) => `${n} % delivered of closed orders`,
      isNew: 'New',
      salesPerDay: 'Sales per day',
      last30dh: 'Last 30 days, in DH',
      days30: '30 days',
      salesChartLabel: 'Sales per day over 30 days',
      ordersN: (n) => `${n} order${n > 1 ? 's' : ''}`,
      pipeline: 'Order pipeline',
      noOrdersMonth: 'No orders yet this month.',
      cities: 'Cities',
      ordersShort30: 'orders, 30 d',
      nothingYet: 'Nothing to show yet.',
      bestSellers: 'Best sellers',
      bestSellersEmpty: 'Your best-selling products will appear here.',
      latestOrders: 'Latest orders',
      seeAll: 'See all',
      noOrdersYet: 'No orders yet. Share your store link!',
      lowStock: 'Low stock',
      left: (n) => `${n} left`,
      soldOut: 'Sold out',
      emails: 'Automatic emails',
      emailsOn: 'On',
      emailsOff: 'To set up',
      emailsOnText: (to) => `Confirmation to the customer and an alert to <strong>${to}</strong> for every order.`,
      emailsOffText: 'Send your customers a confirmation and get an alert for every order.',
      emailSettings: 'Email settings',
      setUp: 'Set up in 5 minutes',
      exportCsv: 'Export CSV',
      total: (n) => `${n} in total`,
      all: 'All',
      searchOrders: 'No., name, phone, city',
      thOrder: 'Order', thCustomer: 'Customer', thCity: 'City', thTotal: 'Total', thStatus: 'Status',
      noMatch: 'No orders match.',
      orderAt: 'Order',
      language: 'Language',
      phone: 'Phone', email: 'Email', city: 'City', address: 'Address', note: 'Note',
      call: 'Call',
      delivery: 'Delivery', free: 'Free', toCollect: 'To collect',
      adminNote: 'Internal note', adminNoteHint: 'Only visible to you',
      changeStatus: 'Change status',
      statusEmailHint: 'The customer gets an email when the order moves to Confirmed, Shipped, Delivered or Cancelled.',
      updated: 'Order updated',
      updatedEmailed: 'Order updated · email sent to the customer',
      noteSaved: 'Note saved',
      close: 'Close',
      thProduct: 'Product', thCategory: 'Category', thPrice: 'Price', thStock: 'Stock', thState: 'State',
      home: '★ Home', online: 'Online', hidden: 'Hidden',
      noProducts: 'No products. Add the first one.',
      nProducts: (n) => `${n} product${n > 1 ? 's' : ''}`,
      add: 'Add',
      editProduct: 'Edit product', newProduct: 'New product',
      name: 'Name', priceStock: 'Price and stock',
      price: 'Price (DH)', comparePrice: 'Old price (crossed out, optional)', stock: 'Stock (empty = unlimited)', category: 'Category',
      options: 'Options (colours, sizes…)',
      opt: {
        hint: 'Add what the customer picks before ordering: colour, size, capacity… Their choice appears in the order and the emails.',
        color: 'Colour', size: 'Size', other: 'Other option',
        colorName: 'Colour', sizeName: 'Size',
        groupName: 'Option name', type: 'Type', typeText: 'Text buttons', typeColor: 'Colours',
        value: 'Value', valuePh: 'e.g. Red, XL, 128 GB', extra: 'Price difference (DH)', addValue: 'Add a value', removeGroup: 'Remove this option',
        needValue: 'Add at least one value to each option, or remove it.',
      },
      offers: 'Quantity offers (e.g. 2 for 340 DH)',
      bun: {
        hint: 'Shown as cards to pick on the product page: 1 piece at the normal price, then your offers. The price is for all the pieces together; the saving is worked out for you.',
        qty: 'Pieces', price: 'Bundle price (DH)', title: 'Card title (optional)', titlePh: 'e.g. 2 sets for 340 DH', hot: 'Most popular 🔥',
        add: 'Add an offer', save: (x) => `Save ${x}`, notCheaper: 'Not cheaper than the normal price: it will not be shown',
        bad: 'Each offer needs 2 to 20 pieces and a price, with a number of pieces different from the other offers.',
        left: 'Pieces left (this product)', leftHint: 'Shows “Only 7 pieces left in the 2-piece offer” and goes down with each order. Empty = the number from the settings, 0 = hidden.',
      },
      photos: 'Photos', addPhotos: 'Choose photos', takePhoto: 'Take a photo',
      dropHere: 'Drag your photos here or choose them on your device', dropHint: 'JPG, PNG, WEBP… shrunk automatically before upload. The first photo is the main photo.',
      mainPhoto: 'Main', moveBefore: 'Move earlier', moveAfter: 'Move later', pasteLinks: 'Or paste image links',
      uploadFailed: (n) => `Upload of ${n} failed`, notImage: (n) => `${n} is not a supported image`, waitUploads: 'Wait for the photos to finish uploading.',
      photoLinks: 'Photo links (one per line)', remove: 'Remove',
      description: 'Description', display: 'Display',
      gifTooBig: (n, mb) => `The GIF ${n} is over ${mb} MB.`,
      ai: {
        title: 'Write the description with AI', hint: 'Claude looks at the product photos and your notes and writes a selling description in Arabic, French and English: a strong promise, the problem it solves, benefits, how to use it, what is in the box and the offer.',
        notes: 'What you know about the product', notesPh: 'E.g. 4 stainless steel bowls, 2 L, heats in 10 min, 220 V, in the box: cable and manual…',
        style: 'Arabic style', darija: 'Moroccan Darija', fusha: 'Standard Arabic', alsoNames: 'Also suggest the product name',
        go: 'Write the description', working: 'Writing… (up to 1 min)', done: 'Description ready. Check it before saving.',
        review: 'Only your notes and what the photos show are used. Check the numbers before saving.',
        replace: 'The current description will be replaced. Continue?',
        noKey: 'This needs the Claude key (ANTHROPIC_API_KEY) in Cloudflare.',
      },
      rte: {
        hint: 'Write like in Word. Add photos, GIFs and videos with the buttons, or drag / paste them into the text. Click a photo or video to change its size or alignment or delete it, or pull one of its sides or corners.',
        placeholder: 'Write the product description…', undo: 'Undo', redo: 'Redo', p: 'Normal text', h2: 'Large heading', h3: 'Small heading', quote: 'Quote',
        bold: 'Bold', italic: 'Italic', underline: 'Underline', strike: 'Strikethrough', color: 'Text colour', highlight: 'Highlight',
        ul: 'Bulleted list', ol: 'Numbered list', left: 'Align left', center: 'Center', right: 'Align right',
        link: 'Add a link', unlink: 'Remove link', photo: 'Photo or GIF', video: 'Video (MP4, MOV, WebM)', embed: 'From a link: YouTube, Vimeo, image or video',
        hr: 'Divider line', clear: 'Clear formatting', linkPrompt: 'Paste the link (https://…)', embedPrompt: 'Paste a YouTube or Vimeo link, or the link of an image or video (https://…)',
        badLink: 'Invalid link. It must start with https://', size: 'Size', smaller: 'Smaller', bigger: 'Bigger', dragSize: 'Drag to change the size or shape', resetShape: 'Original size and shape', alignL: 'Left', alignC: 'Center', alignR: 'Right', del: 'Delete',
      },
      videoTooBig: (n) => `The video ${n} is over 5 MB. Make it smaller and try again.`, photoTooBig: (n) => `The photo ${n} is over 1 MB.`,
      notMedia: (n) => `${n} is not a supported photo or video`,
      slug: 'Page address (slug)', auto: 'automatic', sort: 'Display order',
      featured: 'Feature on the home page', active: 'Online (visible in the store)',
      cancel: 'Cancel', view: 'View', del: 'Delete', save: 'Save',
      confirmDeleteProduct: 'Delete this product? Past orders are kept.',
      productDeleted: 'Product deleted', productSaved: 'Product saved',
      uploading: (n) => `Uploading ${n}…`,
      catsSub: 'The aisles of your store',
      thPhoto: 'Photo', thPhotoLink: 'Photo link', thSort: 'Order', thProducts: 'Products',
      newCategory: 'New category', ok: 'OK',
      catSaved: 'Category saved',
      confirmDeleteCat: 'Delete this category? Its products stay online, without a category.',
      store: 'Store', storeName: 'Store name', whatsapp: 'WhatsApp number (e.g. 212612345678)', contactEmail: 'Contact email (customers reply to it)',
      emailsIntro: 'For every order, the customer gets a confirmation in their language (if they gave their email) and you get an alert. The customer is also told when their order is confirmed, shipped, delivered or cancelled.',
      keyOk: 'Brevo key installed', keyMissing: 'Brevo key missing',
      emailFrom: 'Sender address (verified in Brevo)', notifyEmail: 'Send order alerts to',
      statusUpdates: 'Tell the customer at every status change',
      currency: 'Currency', autoCurrency: 'Show prices in the visitor’s country currency (euro, dollar, pound…)',
      urgency: 'Urgency on the product page',
      urgencyHint: 'A countdown at the top of every product with an offer: each visitor gets 24 hours from their first visit, then it starts again. And the line “Only X pieces left in the offer” above the offers, which goes down by itself with each order.',
      countdownOn: 'Show the countdown “The offer ends in…” (24 h)',
      offerLeftAll: 'Pieces left in the offer (all products)', offerLeftAllHint: 'e.g. 7. Leave empty to hide the line. Can be changed for each product.',
      currencyHint: 'The customer always pays in dirhams on delivery: converted prices are a guide, with rates updated every 12 hours. Orders and the admin stay in dirhams.',
      weakPassword: 'The admin password is short. Use at least 12 characters (npx wrangler secret put ADMIN_PASSWORD).',
      social: 'Social networks',
      socialHint: 'Paste the page link or just the account name (e.g. @abolux). The icons show at the bottom of the store.',
      pixels: 'Ad pixels',
      pixelsHint: 'Paste only the ID, not the full code. No pixel loads until the visitor accepts cookies.',
      adsenseHint: 'Google ads show only in blog articles, never on shop or order pages. They load after the article, so the site stays fast.', adsenseId: 'Publisher ID', adsenseHow: 'In AdSense: Account → Account information → Publisher ID (starts with pub-). The ads.txt file is added for you.',
      metaPixel: 'Meta Pixel ID (Facebook and Instagram)',
      metaHow: 'Facebook: Meta Events Manager → Data sources → your pixel → the 15 or 16 digit ID (Dataset ID).',
      tiktokPixel: 'TikTok Pixel ID',
      tiktokHow: 'TikTok: TikTok Ads Manager → Tools → Events → Web Events → your pixel → the ID (e.g. C4ABC…).',
      legal: 'Legal information',
      legalHint: 'Shown in the privacy policy and terms of sale. These texts are a draft: have an accountant or lawyer review them.',
      legalName: 'Company or personal name (auto-entrepreneur)',
      legalIce: 'ICE',
      legalRc: 'RC or auto-entrepreneur no.',
      legalAddress: 'Address',
      legalCndp: 'CNDP declaration no. (if available)',
      viewPages: 'See the pages:',
      legalPrivacy: 'Privacy',
      legalTerms: 'Terms of sale',
      sendTest: 'Send a test', howItWorks: 'How does it work?',
      steps: [
        'Create a free account on <a href="https://www.brevo.com" target="_blank" rel="noopener">brevo.com</a> (300 free emails a day).',
        'In Brevo, open <em>Senders, domains and dedicated IPs</em> and add your sender address (for example your Gmail). Click the verification link you receive.',
        'In Brevo, open <em>SMTP and API → API keys</em> and create a key. Do not share it with anyone.',
        'On your PC, in the store folder, run <code>npx wrangler secret put BREVO_API_KEY</code> and paste the key when asked.',
        'Enter the verified address below, save, then click “Send a test”.',
      ],
      shipping: 'Delivery', shippingIncluded: 'Free delivery to every city: it is included in the product prices, the customer only pays the price shown, on delivery.', shippingFee: 'Default delivery fee (DH)', freeOver: 'Free delivery from (DH, 0 = never)',
      rates: 'Rates by city (one line per city: City = price)',
      banner: 'Announcement bar', bannerHint: 'The message that scrolls at the top of every page.',
      homePage: 'Home page', homeHint: 'Leave empty to keep the default text.',
      heroTitle: 'Title', heroText: 'Subtitle',
      saveSettings: 'Save settings', settingsSaved: 'Settings saved',
      testSent: (to) => `Test email sent to ${to}`,
      fr: 'French', ar: 'Arabic', en: 'English',
    },
  };

  const savedLang = (() => {
    try {
      return localStorage.getItem('admin.lang');
    } catch {
      return null;
    }
  })();
  let lang = 'ar';
  let L = I18N.ar;
  function setLang(next) {
    lang = I18N[next] ? next : 'ar';
    L = I18N[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = `Abolux · ${L.sellerSpace}`;
    try {
      localStorage.setItem('admin.lang', lang);
    } catch {}
  }
  setLang(savedLang);

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const num = (n) => String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const colon = () => (lang === 'fr' ? ' : ' : ': ');
  const dh = (n) => (lang === 'ar' ? `${num(n)} درهم` : `${num(n)} DH`);
  const date = (s) => new Date(`${s.replace(' ', 'T')}Z`);
  const when = (s) => date(s).toLocaleString(L.locale, { dateStyle: 'short', timeStyle: 'short', numberingSystem: 'latn' });
  const ago = (s) => {
    const min = Math.round((Date.now() - date(s)) / 60000);
    if (min < 1) return L.ago.now;
    if (min < 60) return L.ago.min(min);
    if (min < 1440) return L.ago.hour(Math.round(min / 60));
    return L.ago.day(Math.round(min / 1440));
  };
  const STATUS_KEYS = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'];
  const PAGES = ['dashboard', 'orders', 'products', 'categories', 'blog', 'settings'];
  const LANG_LABEL = { ar: 'العربية', fr: 'Français', en: 'English' };
  const dirOf = (l) => (l === 'ar' ? 'dir="rtl" lang="ar"' : `dir="ltr" lang="${l}"`);
  // Translations are entered with the admin's own language first.
  const contentLangs = () => ({ ar: ['ar', 'fr', 'en'], fr: ['fr', 'ar', 'en'], en: ['en', 'fr', 'ar'] })[lang];
  // A name in the admin's language, else the nearest other one.
  const pick = (x, k) => contentLangs().map((l) => x[`${k}_${l}`]).find(Boolean);
  let state = { page: 'dashboard', status: '', q: '', images: false, emails: false, settings: {}, categories: [] };

  // Line icons, 24×24, stroke = currentColor.
  const ICONS = {
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/>',
    orders: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    products: '<path d="m21 8-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
    blog: '<path d="M5 3h10l4 4v14H5z"/><path d="M14 3v5h5"/><path d="M8 12h8M8 16h8M8 8h3"/>',
    categories: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    external: '<path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    up: '<path d="m6 15 6-6 6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    camera: '<path d="M3 8a2 2 0 0 1 2-2h2l2-3h6l2 3h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="4"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
    chevron: '<path d="m15 6-6 6 6 6"/>',
  };
  const icon = (n, s = 20) => `<svg class="i i-${n}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

  let toastTimer;
  function toast(text, bad) {
    const el = document.querySelector('.toast');
    el.textContent = text;
    el.className = `toast${bad ? ' bad' : ''}`;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (el.hidden = true), 3000);
  }

  async function api(path, { method = 'GET', body, raw } = {}) {
    const res = await fetch(`/api/admin${path}`, {
      method,
      // Writes always go out as JSON (DELETE too): the server refuses any other write.
      headers: raw ? { 'content-type': raw.type } : body || method !== 'GET' ? { 'content-type': 'application/json' } : {},
      body: raw || (body || method !== 'GET' ? JSON.stringify(body || {}) : undefined),
      credentials: 'same-origin',
    });
    if (res.status === 401 && path !== '/login') {
      login();
      throw new Error('unauthorized');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = L.errors[data.error] || data.error || `${L.errors.generic} ${res.status}`;
      throw new Error(data.error === 'email_failed' && data.detail ? `${msg} ${data.detail}` : msg);
    }
    return data;
  }

  // Language switcher: one button per admin language, the current one highlighted.
  const ADMIN_LANGS = [['ar', 'عربي'], ['fr', 'FR'], ['en', 'EN']];
  const langButton = (cls = '') =>
    `<div class="lang-switch ${cls}" role="group" aria-label="${L.language}">${icon('globe', 18)}${ADMIN_LANGS.map(([l, t]) => `<button type="button" data-lang="${l}" lang="${l}" title="${LANG_LABEL[l]}" aria-pressed="${l === lang}"${l === lang ? ' class="on"' : ''}>${t}</button>`).join('')}</div>`;

  // Login
  // Animated backdrop of the login page: drifting glows, a moving gold floor grid and rising sparks.
  function loginBackdrop() {
    const sparks = Array.from({ length: 22 }, () => {
      const r = (a, b) => (a + Math.random() * (b - a)).toFixed(2);
      return `<i class="spark" style="--x:${r(0, 100)}%;--s:${r(2, 5)}px;--d:${r(7, 14)}s;--t:-${r(0, 14)}s;--dx:${r(-40, 40)}px"></i>`;
    }).join('');
    return `<div class="login-fx" aria-hidden="true"><i class="orb o1"></i><i class="orb o2"></i><i class="orb o3"></i>${sparks}</div>`;
  }

  function login() {
    document.body.className = 'is-login';
    app.innerHTML = `${loginBackdrop()}<form class="login" id="login">
      <div class="login-top"><span class="login-logo-wrap"><img src="/admin/logo.png" alt="Abolux" class="login-logo"></span>${langButton()}</div>
      <h1>${L.sellerSpace}</h1>
      <p class="muted">${L.loginHint}</p>
      <label>${L.password}<input type="password" name="password" autocomplete="current-password" required autofocus dir="ltr"></label>
      <button class="btn btn-lg login-go"><span>${L.signIn}</span></button>
      <p class="error" hidden></p>
    </form>`;
    const f = document.getElementById('login');
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // A slight 3D tilt of the card that follows the mouse (computers only).
    if (!calm && matchMedia('(pointer: fine)').matches) {
      const tilt = (e) => {
        if (!f.isConnected) return document.removeEventListener('pointermove', tilt);
        const x = e.clientX / innerWidth - 0.5;
        const y = e.clientY / innerHeight - 0.5;
        f.style.setProperty('--ry', `${(x * 7).toFixed(2)}deg`);
        f.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`);
      };
      document.addEventListener('pointermove', tilt);
    }
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = f.querySelector('.login-go');
      const p = f.querySelector('.error');
      btn.disabled = true;
      p.hidden = true;
      f.classList.add('busy');
      try {
        await api('/login', { method: 'POST', body: { password: f.password.value } });
        f.classList.remove('busy');
        f.classList.add('ok');
        if (!calm) await new Promise((r) => setTimeout(r, 520));
        start();
      } catch (err) {
        f.classList.remove('busy', 'shake');
        void f.offsetWidth; // restart the shake each time
        f.classList.add('shake');
        p.textContent = err.message;
        p.hidden = false;
        btn.disabled = false;
        f.password.select();
      }
    });
  }

  function shell(title, content, { actions = '', sub = '' } = {}) {
    document.body.className = '';
    const nav = PAGES.map(
      (k) =>
        `<a href="#${k}" class="nav-item${state.page === k ? ' on' : ''}">${icon(k)}<span class="long">${L.nav[k]}</span><span class="short">${L.navShort[k] || L.nav[k]}</span>${k === 'orders' && state.pending ? `<b class="nav-badge">${state.pending}</b>` : ''}</a>`,
    ).join('');
    app.innerHTML = `<aside class="side">
        <a href="#dashboard" class="side-logo"><img src="/admin/logo.png" alt="${esc(state.settings.store_name || 'Abolux')}"></a>
        <nav class="side-nav">${nav}</nav>
        <div class="side-foot">
          ${langButton('side-lang')}
          <a href="/${lang}/" target="_blank" rel="noopener" class="nav-item">${icon('external')}<span>${L.viewStore}</span></a>
          <button class="nav-item" data-logout>${icon('logout')}<span>${L.logout}</span></button>
        </div>
      </aside>
      <div class="page">
        <header class="page-head"><div><h1>${title}</h1>${sub ? `<p class="muted">${sub}</p>` : ''}</div><div class="head-actions">${langButton('mobile-only')}${actions}<button type="button" class="head-logout mobile-only" data-logout data-ask aria-label="${L.logout}" title="${L.logout}">${icon('logout', 18)}</button></div></header>
        <main class="page-body">${content}</main>
      </div>
      <nav class="tabbar">${nav}</nav>`;
  }

  document.addEventListener('click', async (e) => {
    const sw = e.target.closest('[data-lang]');
    if (sw) {
      setLang(sw.dataset.lang);
      if (document.body.classList.contains('is-login')) login();
      else route();
      return;
    }
    const out = e.target.closest('[data-logout]');
    if (out) {
      // The phone button sits next to other buttons: ask first so a slip of the finger does not sign out.
      if (out.hasAttribute('data-ask') && !confirm(L.logoutAsk)) return;
      await api('/logout', { method: 'POST', body: {} });
      login();
    }
  });
  window.addEventListener('hashchange', route);

  async function start() {
    try {
      const me = await api('/me');
      state.images = me.images;
      state.r2 = me.r2;
      state.emails = me.emails;
      state.ai = me.ai;
      state.settings = (await api('/settings')).settings;
      state.categories = (await api('/categories')).categories;
      route();
      if (me.weak_password) toast(L.weakPassword, true);
    } catch (err) {
      if (err.message !== 'unauthorized') app.innerHTML = `<p class="error pad">${esc(err.message)}</p>`;
    }
  }

  function route() {
    const h = location.hash.slice(1) || 'dashboard';
    const m = h.match(/^order-(\d+)$/);
    if (m) {
      if (state.page !== 'orders' || !app.querySelector('[data-order]')) {
        state.page = 'orders';
        orders().then(() => orderDetail(m[1]));
      } else orderDetail(m[1]);
      return;
    }
    state.page = PAGES.includes(h) ? h : 'dashboard';
    ({ dashboard, orders, products, categories, blog, settings })[state.page]();
    window.scrollTo(0, 0);
  }

  const loading = (title) => shell(title, '<div class="skeleton-grid"><div></div><div></div><div></div><div></div></div>');
  const catName = (c) => pick(c, 'name') || '—';
  const prodName = (p) => pick(p, 'name');

  // Dashboard
  function trend(now, prev) {
    if (!prev) return now ? `<span class="trend up">${L.isNew}</span>` : '';
    const pct = Math.round(((now - prev) / prev) * 100);
    return `<span class="trend ${pct >= 0 ? 'up' : 'down'}" dir="ltr">${icon(pct >= 0 ? 'up' : 'down', 14)}${Math.abs(pct)} %</span>`;
  }

  // Sales per day for the last 30 days: one series, bars with a hover tooltip. Time always runs left to right.
  function salesChart(daily) {
    const byDay = Object.fromEntries(daily.map((d) => [d.d, d]));
    const days = [];
    const today = new Date(Date.now() + 3600e3);
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today - i * 864e5).toISOString().slice(0, 10);
      days.push({ d, sales: byDay[d]?.sales || 0, orders: byDay[d]?.orders || 0 });
    }
    const max = Math.max(...days.map((d) => d.sales), 1);
    const p10 = 10 ** Math.floor(Math.log10(max));
    const nice = [1, 2, 2.5, 5, 10].map((k) => k * p10).find((v) => v >= max);
    const W = 720, H = 220, Lm = 52, B = 26, T = 10;
    const bw = (W - Lm) / days.length;
    const y = (v) => T + (H - T - B) * (1 - v / nice);
    const grid = [0, 0.5, 1].map((f) => `<line x1="${Lm}" x2="${W}" y1="${y(nice * f)}" y2="${y(nice * f)}" class="grid"/><text x="${Lm - 8}" y="${y(nice * f) + 4}" class="axis" text-anchor="end">${num(nice * f)}</text>`).join('');
    const bars = days
      .map((d, i) => {
        const x = Lm + i * bw;
        const h = Math.max(d.sales ? 3 : 0, H - B - y(d.sales));
        const label = new Date(`${d.d}T12:00:00Z`).toLocaleDateString(L.locale, { day: 'numeric', month: 'short', numberingSystem: 'latn' });
        return `<g class="bar" data-tip="${esc(label)} · ${dh(d.sales)} · ${L.ordersN(d.orders)}">
          <rect class="hit" x="${x}" y="${T}" width="${bw}" height="${H - T - B}"/>
          ${h ? `<path class="fill" d="M${x + 2} ${H - B} V${H - B - h + 4} q0 -4 4 -4 H${x + bw - 6} q4 0 4 4 V${H - B} Z"/>` : ''}
          ${i % 5 === 4 || i === 29 ? `<text x="${x + bw / 2}" y="${H - 6}" class="axis" text-anchor="middle">${esc(label)}</text>` : ''}
        </g>`;
      })
      .join('');
    return `<div class="chart" dir="ltr"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${L.salesChartLabel}">${grid}<line x1="${Lm}" x2="${W}" y1="${H - B}" y2="${H - B}" class="base"/>${bars}</svg><div class="tip" hidden></div></div>`;
  }

  function wireTips(root) {
    root.querySelectorAll('.chart').forEach((c) => {
      const tip = c.querySelector('.tip');
      c.addEventListener('pointermove', (e) => {
        const g = e.target.closest('[data-tip]');
        if (!g) return (tip.hidden = true);
        c.querySelectorAll('.bar.on').forEach((b) => b.classList.remove('on'));
        g.classList.add('on');
        tip.textContent = g.dataset.tip;
        tip.dir = lang === 'ar' ? 'rtl' : 'ltr';
        tip.hidden = false;
        const r = c.getBoundingClientRect();
        tip.style.left = `${Math.min(Math.max(e.clientX - r.left, 90), r.width - 90)}px`;
        tip.style.top = `${e.clientY - r.top - 44}px`;
      });
      c.addEventListener('pointerleave', () => {
        tip.hidden = true;
        c.querySelectorAll('.bar.on').forEach((b) => b.classList.remove('on'));
      });
    });
  }

  // Order pipeline for the last 30 days: one stacked bar, each status labelled in the legend.
  function pipeline(by) {
    const total = STATUS_KEYS.reduce((a, k) => a + (by[k] || 0), 0);
    if (!total) return `<p class="empty-small">${L.noOrdersMonth}</p>`;
    return `<div class="stack">${STATUS_KEYS.filter((k) => by[k]).map((k) => `<span class="seg s-${k}" style="flex:${by[k]}" title="${L.status[k]} : ${by[k]}"></span>`).join('')}</div>
      <ul class="legend">${STATUS_KEYS.map((k) => `<li><i class="dot s-${k}"></i>${L.status[k]}<b>${by[k] || 0}</b></li>`).join('')}</ul>`;
  }

  function hbars(rows, label, value, fmt) {
    if (!rows.length) return `<p class="empty-small">${L.nothingYet}</p>`;
    const max = Math.max(...rows.map(value), 1);
    return `<ul class="hbars">${rows.map((r) => `<li><span class="hb-label">${label(r)}</span><span class="hb-track"><span style="width:${(value(r) / max) * 100}%"></span></span><b>${fmt(r)}</b></li>`).join('')}</ul>`;
  }

  function emailCard() {
    const s = state.settings;
    const ready = state.emails && s.email_from;
    return `<section class="card email-card ${ready ? 'ok' : ''}">
      <div class="card-head"><h2>${icon('mail')} ${L.emails}</h2><span class="chip ${ready ? 'chip-ok' : 'chip-warn'}">${ready ? L.emailsOn : L.emailsOff}</span></div>
      <p class="muted">${ready ? L.emailsOnText(`<bdi>${esc(s.notify_email || s.contact_email || '—')}</bdi>`) : L.emailsOffText}</p>
      <a href="#settings" class="link-arrow">${ready ? L.emailSettings : L.setUp} ${icon('arrow', 16)}</a>
    </section>`;
  }

  async function dashboard() {
    loading(L.nav.dashboard);
    const s = await api('/stats');
    state.pending = s.new_orders || 0;
    const aov = s.orders_30d - s.failed_30d > 0 ? s.sales_30d / (s.orders_30d - s.failed_30d) : 0;
    const closed = (s.delivered_30d || 0) + (s.failed_30d || 0);
    const rate = closed ? Math.round((s.delivered_30d / closed) * 100) : null;
    const hour = new Date().getHours();
    const hello = L.hello[hour < 12 ? 0 : hour < 18 ? 1 : 2];
    const today = new Date().toLocaleDateString(L.locale, { weekday: 'long', day: 'numeric', month: 'long', numberingSystem: 'latn' });
    shell(
      `${hello} 👋`,
      `${s.new_orders ? `<a href="#orders" class="callout" data-filter="new">${icon('alert')}<span><strong>${L.pending(s.new_orders)}</strong> ${L.pendingHint}</span>${icon('arrow', 18)}</a>` : ''}
      <section class="kpis">
        <div class="kpi kpi-hero"><span class="kpi-label">${L.sales30}</span><strong class="kpi-value">${dh(s.sales_30d)}</strong>${trend(s.sales_30d || 0, s.sales_prev || 0)}<span class="kpi-foot">${L.today}${colon()}${dh(s.today_sales)}</span></div>
        <div class="kpi"><span class="kpi-label">${L.orders30}</span><strong class="kpi-value">${num(s.orders_30d)}</strong>${trend(s.orders_30d || 0, s.orders_prev || 0)}<span class="kpi-foot">${L.today}${colon()}${num(s.today)}</span></div>
        <div class="kpi"><span class="kpi-label">${L.aov}</span><strong class="kpi-value">${dh(aov)}</strong><span class="kpi-foot">${L.excludingCancelled}</span></div>
        <div class="kpi"><span class="kpi-label">${L.collected30}</span><strong class="kpi-value">${dh(s.revenue_30d)}</strong><span class="kpi-foot">${rate == null ? L.deliveredOrders : L.deliveredRate(rate)}</span></div>
      </section>
      <section class="grid-2">
        <div class="card span-2"><div class="card-head"><h2>${L.salesPerDay}</h2><span class="muted small">${L.last30dh}</span></div>${salesChart(s.daily)}</div>
        <div class="card"><div class="card-head"><h2>${L.pipeline}</h2><span class="muted small">${L.days30}</span></div>${pipeline(s.by_status)}</div>
        <div class="card"><div class="card-head"><h2>${L.cities}</h2><span class="muted small">${L.ordersShort30}</span></div>${hbars(s.top_cities, (r) => esc(r.city), (r) => r.n, (r) => r.n)}</div>
        <div class="card"><div class="card-head"><h2>${L.bestSellers}</h2><span class="muted small">${L.days30}</span></div>
          ${s.top_products.length ? `<ol class="top">${s.top_products.map((p, i) => `<li><span class="rank">${i + 1}</span><img src="${esc(p.image || '/assets/placeholder.svg')}" alt=""><span class="grow">${esc((lang !== 'fr' && p[`name_${lang}`]) || p.name)}<small>${dh(p.sales)}</small></span><b dir="ltr">${p.qty}×</b></li>`).join('')}</ol>` : `<p class="empty-small">${L.bestSellersEmpty}</p>`}
        </div>
        <div class="card"><div class="card-head"><h2>${L.latestOrders}</h2><a href="#orders" class="link-arrow">${L.seeAll} ${icon('arrow', 16)}</a></div>
          ${s.recent.length ? `<ul class="recent">${s.recent.map((o) => `<li><a href="#order-${o.id}"><span class="avatar">${esc((o.name || '?').trim().charAt(0).toUpperCase())}</span><span class="grow"><strong><bdi>${esc(o.name)}</bdi></strong><small><bdi>${esc(o.city)}</bdi> · ${ago(o.created_at)}</small></span><span class="end"><b>${dh(o.total)}</b><span class="status s-${o.status}">${L.status[o.status]}</span></span></a></li>`).join('')}</ul>` : `<p class="empty-small">${L.noOrdersYet}</p>`}
        </div>
        ${s.low_stock.length ? `<div class="card"><div class="card-head"><h2>${icon('alert')} ${L.lowStock}</h2></div><ul class="recent">${s.low_stock.map((p) => `<li><a href="#products"><img class="thumb" src="${esc(JSON.parse(p.images || '[]')[0] || '/assets/placeholder.svg')}" alt=""><span class="grow"><strong>${esc(prodName(p))}</strong></span><span class="chip ${p.stock ? 'chip-warn' : 'chip-bad'}">${p.stock ? L.left(p.stock) : L.soldOut}</span></a></li>`).join('')}</ul></div>` : ''}
        ${emailCard()}
      </section>`,
      { sub: today.charAt(0).toUpperCase() + today.slice(1), actions: `<a class="btn ghost" href="/api/admin/orders.csv">${icon('download', 18)}<span>${L.exportCsv}</span></a>` },
    );
    app.querySelector('[data-filter]')?.addEventListener('click', () => (state.status = 'new'));
    wireTips(app);
  }

  // Orders
  async function orders() {
    loading(L.nav.orders);
    const list = await api(`/orders?status=${state.status}&q=${encodeURIComponent(state.q)}`);
    state.pending = list.counts.new || 0;
    const all = Object.values(list.counts).reduce((a, b) => a + b, 0);
    const filters = [['', L.all, all], ...STATUS_KEYS.map((k) => [k, L.status[k], list.counts[k] || 0])];
    shell(
      L.nav.orders,
      `<div class="toolbar">
        <div class="filters">${filters.map(([k, v, n]) => `<button class="pill${state.status === k ? ' on' : ''}" data-status="${k}">${k ? `<i class="dot s-${k}"></i>` : ''}${v}<span>${n}</span></button>`).join('')}</div>
        <form class="search" id="osearch">${icon('search', 18)}<input type="search" name="q" value="${esc(state.q)}" placeholder="${L.searchOrders}"></form>
      </div>
      ${list.orders.length ? `<div class="card flush"><table class="table"><thead><tr><th class="hide-sm">${L.thOrder}</th><th>${L.thCustomer}</th><th class="hide-sm">${L.thCity}</th><th>${L.thTotal}</th><th>${L.thStatus}</th></tr></thead><tbody>
        ${list.orders.map((o) => `<tr data-order="${o.id}"><td class="hide-sm"><span class="mono" dir="ltr">${esc(o.number)}</span><small>${ago(o.created_at)}</small></td><td><strong><bdi>${esc(o.name)}</bdi></strong><small><bdi dir="ltr" class="hide-sm">${esc(o.phone_display)}</bdi><span class="show-sm">${ago(o.created_at)}</span>${o.email ? ` · ${icon('mail', 13)}` : ''}</small></td><td class="hide-sm">${esc(o.city)}</td><td class="nowrap"><strong>${dh(o.total)}</strong></td><td><span class="status s-${o.status}">${L.status[o.status] || o.status}</span></td></tr>`).join('')}
      </tbody></table></div>` : `<div class="card empty">${icon('orders', 36)}<p>${state.q || state.status ? L.noMatch : L.noOrdersYet}</p></div>`}`,
      { sub: L.total(all), actions: `<a class="btn ghost" href="/api/admin/orders.csv?status=${state.status}">${icon('download', 18)}<span>${L.exportCsv}</span></a>` },
    );
    app.querySelectorAll('[data-status]').forEach((b) =>
      b.addEventListener('click', () => {
        state.status = b.dataset.status;
        orders();
      }),
    );
    document.getElementById('osearch').addEventListener('submit', (e) => {
      e.preventDefault();
      state.q = e.target.q.value.trim();
      orders();
    });
    app.querySelectorAll('[data-order]').forEach((tr) => tr.addEventListener('click', () => (location.hash = `order-${tr.dataset.order}`)));
  }

  // The WhatsApp confirmation message is written in the customer's language, not the admin's.
  function confirmMessage(o) {
    const store = state.settings.store_name || '';
    const total = o.lang === 'ar' ? `${o.total} درهم` : o.lang === 'en' ? `MAD ${o.total}` : `${o.total} DH`;
    if (o.lang === 'ar') return `السلام عليكم ${o.name}، شكرًا على طلبك رقم ${o.number} (${total}) من ${store}. هل تؤكد التوصيل إلى ${o.city}؟`;
    if (o.lang === 'en') return `Hello ${o.name}, thank you for your order ${o.number} (${total}) from ${store}. Can you confirm delivery to ${o.city}?`;
    return `Bonjour ${o.name}, merci pour votre commande ${o.number} (${total}) chez ${store}. Pouvez-vous confirmer la livraison à ${o.city} ?`;
  }

  async function orderDetail(id) {
    document.querySelector('dialog.drawer')?.close();
    const { order: o, items } = await api(`/orders/${id}`);
    const flow = ['new', 'confirmed', 'shipped', 'delivered'];
    const at = flow.indexOf(o.status);
    const emailNote = o.email && state.emails && state.settings.email_from && state.settings.email_status_updates !== '0';
    const dialog = document.createElement('dialog');
    dialog.className = 'drawer';
    dialog.innerHTML = `<form method="dialog" class="drawer-head"><div><p class="muted small">${L.orderAt} · <bdi>${when(o.created_at)}</bdi></p><h2 class="mono" dir="ltr">${esc(o.number)}</h2></div><button class="close" aria-label="${L.close}">✕</button></form>
      <ol class="steps">${flow.map((k, i) => `<li class="${at >= i ? 'done' : ''}${o.status === k ? ' now' : ''}"><span>${at >= i ? icon('check', 12) : ''}</span>${L.status[k]}</li>`).join('')}</ol>
      ${at < 0 ? `<p><span class="status s-${o.status}">${L.status[o.status]}</span></p>` : ''}
      <section class="box">
        <div class="cust"><span class="avatar lg">${esc((o.name || '?').trim().charAt(0).toUpperCase())}</span><div><strong><bdi>${esc(o.name)}</bdi></strong><small>${L.language} : ${L[o.lang] || o.lang}</small></div></div>
        <dl class="kv">
          <dt>${L.phone}</dt><dd><a href="tel:+${esc(o.phone)}" dir="ltr">${esc(o.phone_display)}</a></dd>
          ${o.email ? `<dt>${L.email}</dt><dd><a href="mailto:${esc(o.email)}" dir="ltr">${esc(o.email)}</a></dd>` : ''}
          <dt>${L.city}</dt><dd>${esc(o.city)}</dd>
          <dt>${L.address}</dt><dd>${esc(o.address)}</dd>
          ${o.note ? `<dt>${L.note}</dt><dd>« ${esc(o.note)} »</dd>` : ''}
        </dl>
        <div class="actions">
          <a class="btn wa" target="_blank" rel="noopener" href="https://wa.me/${esc(o.phone)}?text=${encodeURIComponent(confirmMessage(o))}">WhatsApp</a>
          <a class="btn ghost" href="tel:+${esc(o.phone)}">${icon('phone', 18)}<span>${L.call}</span></a>
        </div>
      </section>
      <section class="box">
        <ul class="lines">${items.map((i) => `<li><span>${esc(i.name)}${i.option ? ` <small dir="auto">(${esc(i.option)})</small>` : ''} <small dir="ltr">× ${i.qty}</small></span><b>${dh(i.price * i.qty)}</b></li>`).join('')}
          <li class="muted"><span>${L.delivery}</span><span>${o.shipping ? dh(o.shipping) : L.free}</span></li>
          <li class="total"><span>${L.toCollect}</span><b>${dh(o.total)}</b></li></ul>
      </section>
      <label>${L.adminNote}<textarea name="admin_note" rows="2" placeholder="${L.adminNoteHint}">${esc(o.admin_note)}</textarea></label>
      <div><p class="label">${L.changeStatus}</p>
      <div class="filters">${STATUS_KEYS.map((k) => `<button type="button" class="pill${o.status === k ? ' on' : ''}" data-set="${k}"><i class="dot s-${k}"></i>${L.status[k]}</button>`).join('')}</div>
      ${emailNote ? `<p class="muted small">${icon('mail', 14)} ${L.statusEmailHint}</p>` : ''}</div>`;
    document.body.append(dialog);
    dialog.addEventListener('close', () => {
      dialog.remove();
      if (location.hash === `#order-${id}`) history.replaceState(null, '', '#orders');
    });
    dialog.addEventListener('click', async (e) => {
      if (e.target === dialog) dialog.close();
      const set = e.target.closest('[data-set]');
      if (!set || set.dataset.set === o.status) return;
      try {
        const r = await api(`/orders/${id}`, { method: 'PATCH', body: { status: set.dataset.set, admin_note: dialog.querySelector('[name=admin_note]').value } });
        toast(r.emailed ? L.updatedEmailed : L.updated);
        dialog.close();
        orders();
      } catch (err) {
        toast(err.message, true);
      }
    });
    dialog.querySelector('[name=admin_note]').addEventListener('change', (e) => api(`/orders/${id}`, { method: 'PATCH', body: { admin_note: e.target.value } }).then(() => toast(L.noteSaved)));
    dialog.showModal();
  }

  // Products
  async function products() {
    loading(L.nav.products);
    const { products: list } = await api('/products');
    const cat = (id) => {
      const c = state.categories.find((x) => x.id === id);
      return c ? catName(c) : '—';
    };
    shell(
      L.nav.products,
      list.length
        ? `<div class="card flush"><table class="table"><thead><tr><th></th><th>${L.thProduct}</th><th class="hide-sm">${L.thCategory}</th><th>${L.thPrice}</th><th>${L.thStock}</th><th class="hide-sm">${L.thState}</th><th></th></tr></thead><tbody>
      ${list.map((p) => `<tr data-product="${p.id}"><td class="tight"><img class="thumb" src="${esc(JSON.parse(p.images || '[]')[0] || '/assets/placeholder.svg')}" alt=""></td><td><strong>${esc(prodName(p))}</strong>${p.featured ? ` <span class="chip chip-gold">${L.home}</span>` : ''}</td><td class="hide-sm">${esc(cat(p.category_id))}</td><td class="nowrap">${dh(p.price)}</td><td>${p.stock == null ? '<span class="muted">∞</span>' : p.stock <= 3 ? `<span class="chip ${p.stock ? 'chip-warn' : 'chip-bad'}">${p.stock}</span>` : p.stock}</td><td class="hide-sm">${p.active ? `<span class="chip chip-ok">${L.online}</span>` : `<span class="chip">${L.hidden}</span>`}</td><td class="tight"><button type="button" class="icon-btn danger" data-del-product="${p.id}" title="${L.del}" aria-label="${L.del}">${icon('trash', 18)}</button></td></tr>`).join('')}
      </tbody></table></div>`
        : `<div class="card empty">${icon('products', 36)}<p>${L.noProducts}</p></div>`,
      { sub: L.nProducts(list.length), actions: `<button class="btn" data-new>${icon('plus', 18)}<span>${L.add}</span></button>` },
    );
    app.querySelector('[data-new]').addEventListener('click', () => productForm({ active: 1, images: '[]' }));
    app.querySelectorAll('[data-product]').forEach((tr) => tr.addEventListener('click', () => productForm(list.find((p) => p.id === Number(tr.dataset.product)))));
    app.querySelectorAll('[data-del-product]').forEach((btn) =>
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!confirm(L.confirmDeleteProduct)) return;
        try {
          await api(`/products/${btn.dataset.delProduct}`, { method: 'DELETE' });
          toast(L.productDeleted);
          products();
        } catch (err) {
          toast(err.message, true);
        }
      }),
    );
  }

  // Rich description editor. Uses the browser's own editing commands; the server cleans the HTML on save.
  const RTE_ICONS = {
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
    redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
    ul: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
    ol: '<path d="M10 6h10M10 12h10M10 18h10"/><path d="M4 4.5h1.5V9M4 9h3M4 14.5a1.5 1.5 0 0 1 3 0c0 1.5-3 2-3 3.5h3"/>',
    left: '<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>',
    center: '<path d="M4 6h16M7 10h10M4 14h16M7 18h10"/>',
    right: '<path d="M4 6h16M10 10h10M4 14h16M10 18h10"/>',
    quote: '<path d="M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6"/>',
    link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',
    unlink: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/><path d="m3 3 18 18"/>',
    photo: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m21 16-5-5-9 9"/>',
    video: '<rect x="2.5" y="5" width="14" height="14" rx="2"/><path d="m16.5 10 5-3v10l-5-3"/>',
    embed: '<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8Z"/><path d="m10 15 5-3-5-3z"/>',
    hr: '<path d="M3 12h18"/>',
    clear: '<path d="M4 7V5h12v2M10 5l-3 14M14 19H6"/><path d="m15 13 6 6M21 13l-6 6"/>',
  };
  const rteIcon = (n) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${RTE_ICONS[n]}</svg>`;
  function richEditor(l, field = 'desc') {
    const R = L.rte;
    const b = (attrs, label, inner) => `<button type="button" ${attrs} title="${label}" aria-label="${label}">${inner}</button>`;
    return `<div class="rte" data-rte="${l}">
      <div class="rte-label">${LANG_LABEL[l]}</div>
      <div class="rte-bar" role="toolbar" aria-label="${L.description} ${LANG_LABEL[l]}">
        <span class="rte-group">${b('data-cmd="undo"', R.undo, rteIcon('undo'))}${b('data-cmd="redo"', R.redo, rteIcon('redo'))}</span>
        <span class="rte-group"><select data-block aria-label="${R.p}"><option value="p">${R.p}</option><option value="h2">${R.h2}</option><option value="h3">${R.h3}</option></select></span>
        <span class="rte-group">${b('data-cmd="bold"', R.bold, '<b>B</b>')}${b('data-cmd="italic"', R.italic, '<i>I</i>')}${b('data-cmd="underline"', R.underline, '<u>U</u>')}${b('data-cmd="strikeThrough"', R.strike, '<s>S</s>')}
          <label class="rte-color" title="${R.color}"><span>A</span><input type="color" value="#d43f21" data-color aria-label="${R.color}"></label></span>
        <span class="rte-group">${b('data-cmd="insertUnorderedList"', R.ul, rteIcon('ul'))}${b('data-cmd="insertOrderedList"', R.ol, rteIcon('ol'))}${b('data-quote', R.quote, rteIcon('quote'))}</span>
        <span class="rte-group">${b('data-cmd="justifyLeft"', R.left, rteIcon('left'))}${b('data-cmd="justifyCenter"', R.center, rteIcon('center'))}${b('data-cmd="justifyRight"', R.right, rteIcon('right'))}</span>
        <span class="rte-group">${b('data-link', R.link, rteIcon('link'))}${b('data-cmd="unlink"', R.unlink, rteIcon('unlink'))}</span>
        <span class="rte-group rte-media">
          <label title="${R.photo}" aria-label="${R.photo}">${rteIcon('photo')}<input type="file" accept="image/*" multiple hidden data-rte-file></label>
          <label title="${R.video}" aria-label="${R.video}">${rteIcon('video')}<input type="file" accept="video/mp4,video/webm,video/quicktime" multiple hidden data-rte-file></label>
          ${b('data-embed', R.embed, rteIcon('embed'))}</span>
        <span class="rte-group">${b('data-cmd="insertHorizontalRule"', R.hr, rteIcon('hr'))}${b('data-cmd="removeFormat"', R.clear, rteIcon('clear'))}</span>
      </div>
      <div class="rte-media-bar" hidden>
        <span>${R.size}</span><button type="button" data-step="-10" title="${R.smaller}" aria-label="${R.smaller}">−</button>${['25', '50', '75', '100'].map((w) => `<button type="button" data-w="w-${w}">${w}%</button>`).join('')}<button type="button" data-step="10" title="${R.bigger}" aria-label="${R.bigger}">+</button><button type="button" data-reset title="${R.resetShape}" aria-label="${R.resetShape}">↺</button>
        <span class="sep"></span>${[['left', R.alignL], ['center', R.alignC], ['right', R.alignR]].map(([a, t]) => `<button type="button" data-al="al-${a}" title="${t}" aria-label="${t}">${rteIcon(a)}</button>`).join('')}
        <span class="sep"></span><button type="button" class="danger" data-media-del>${icon('trash', 16)}<span>${R.del}</span></button>
      </div>
      <div class="rte-area rich" contenteditable="true" ${dirOf(l)} data-placeholder="${esc(R.placeholder)}"></div>
      <input type="hidden" name="${field}_${l}">
    </div>`;
  }

  function initEditors(f, p, shrink, field = 'desc') {
    const R = L.rte;
    let busy = 0;
    const isRich = (s) => /<\/?(p|br|div|h[2-4]|ul|ol|li|strong|em|b|i|u|s|img|video|figure|iframe|blockquote|span|a|table)\b/i.test(s || '');
    const plainToHtml = (s) => String(s || '').trim().split(/\n\s*\n/).filter(Boolean).map((x) => `<p>${esc(x).replace(/\n/g, '<br>')}</p>`).join('');
    const mediaHtml = (m) =>
      m.type === 'embed' ? `<iframe src="${esc(m.url)}" allowfullscreen></iframe>`
      : m.type === 'video' ? `<video src="${esc(m.url)}" controls playsinline preload="metadata"></video>`
      : `<img src="${esc(m.url)}" alt="">`;
    const figureHtml = (m, cls = 'w-100 al-center') => `<figure class="${cls}" contenteditable="false">${mediaHtml(m)}</figure>`;
    let legacy = [];
    try {
      if (field === 'desc') legacy = JSON.parse(p.desc_media || '[]').filter((m) => m && m.url);
    } catch {}
    // YouTube / Vimeo page links become embed links; other https links are treated as an image or a video.
    function fromLink(raw) {
      const u = String(raw || '').trim();
      if (!/^https:\/\//i.test(u)) return null;
      const yt = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{6,})/i);
      if (yt) return { type: 'embed', url: `https://www.youtube-nocookie.com/embed/${yt[1]}` };
      const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
      if (vm) return { type: 'embed', url: `https://player.vimeo.com/video/${vm[1]}` };
      if (/\.(mp4|webm|mov)(\?|#|$)/i.test(u)) return { type: 'video', url: u };
      return { type: 'image', url: u };
    }
    async function uploadOne(file) {
      const name = file.name || 'media';
      if (['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type)) {
        if (file.size > 5 * 1024 * 1024) throw new Error(L.videoTooBig(name));
        return { type: 'video', url: (await api('/images', { method: 'POST', raw: file })).url };
      }
      if (file.type === 'image/gif') {
        // GIFs are sent as they are so they stay animated.
        const mb = state.r2 ? 5 : 1.8;
        if (file.size > mb * 1024 * 1024) throw new Error(L.gifTooBig(name, mb));
        return { type: 'image', url: (await api('/images', { method: 'POST', raw: file })).url };
      }
      if (!file.type.startsWith('image/') && !/\.(heic|heif)$/i.test(name)) throw new Error(L.notMedia(name));
      let blob;
      try {
        blob = await shrink(file);
      } catch {
        throw new Error(L.notMedia(name));
      }
      if (blob.size > 1024 * 1024) throw new Error(L.photoTooBig(name));
      return { type: 'image', url: (await api('/images', { method: 'POST', raw: blob })).url };
    }

    const list = [...f.querySelectorAll('.rte')].map((root) => {
      const l = root.dataset.rte;
      const area = root.querySelector('.rte-area');
      const input = root.querySelector('input[type=hidden]');
      const mediaBar = root.querySelector('.rte-media-bar');
      const blockSel = root.querySelector('[data-block]');
      let saved = null;
      let selected = null;
      const raw = p[`${field}_${l}`] || '';
      const load = (html) => {
        area.innerHTML = html;
        // Media sits in its own block that the caret can't enter; wrap any loose media the same way.
        area.querySelectorAll('img, video, iframe').forEach((el) => {
          let fig = el.closest('figure');
          if (!fig) {
            fig = document.createElement('figure');
            fig.className = 'w-100 al-center';
            el.replaceWith(fig);
            fig.append(el);
          }
          fig.contentEditable = 'false';
          if (el.tagName === 'VIDEO') el.controls = true;
        });
      };
      load((isRich(raw) ? raw : plainToHtml(raw)) + legacy.map((m) => figureHtml(m)).join(''));

      const restore = () => {
        area.focus();
        const sel = getSelection();
        sel.removeAllRanges();
        if (saved && area.contains(saved.commonAncestorContainer)) sel.addRange(saved);
        else {
          const r = document.createRange();
          r.selectNodeContents(area);
          r.collapse(false);
          sel.addRange(r);
        }
      };
      const exec = (cmd, value = null) => {
        restore();
        document.execCommand('styleWithCSS', false, cmd === 'foreColor');
        document.execCommand(cmd, false, value);
        saved = getSelection().rangeCount ? getSelection().getRangeAt(0).cloneRange() : null;
      };
      const insertHtml = (html) => {
        restore();
        document.execCommand('insertHTML', false, html);
        saved = getSelection().rangeCount ? getSelection().getRangeAt(0).cloneRange() : null;
      };
      // Handles around the selected photo or video: sides change the width, top and bottom the height,
      // corners both. Width is kept in percent on the figure, the shape as an aspect ratio on the media.
      const sizer = document.createElement('div');
      sizer.className = 'rte-sizer';
      sizer.hidden = true;
      sizer.innerHTML = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].map((h) => `<span class="rte-size-handle h-${h}" data-h="${h}" title="${R.dragSize}"></span>`).join('');
      root.append(sizer);
      const inner = () => {
        const cs = getComputedStyle(area);
        return area.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      };
      const mediaOf = (fig) => fig.querySelector('img, video, iframe');
      const widthOf = (fig) => Math.round((fig.getBoundingClientRect().width / inner()) * 100);
      const SIZES = ['w-25', 'w-50', 'w-75', 'w-100'];
      const setWidth = (fig, w) => {
        w = Math.max(10, Math.min(100, Math.round(w)));
        fig.classList.remove(...SIZES);
        if (w >= 100) {
          fig.classList.add('w-100');
          fig.style.width = '';
        } else fig.style.width = `${w}%`;
        if (!fig.getAttribute('style')) fig.removeAttribute('style');
      };
      const place = () => {
        if (!selected || !selected.isConnected) return (sizer.hidden = true);
        const m = mediaOf(selected) || selected;
        const box = root.getBoundingClientRect();
        const r = m.getBoundingClientRect();
        const a = area.getBoundingClientRect();
        const top = Math.max(r.top, a.top);
        const bottom = Math.min(r.bottom, a.bottom);
        sizer.hidden = false;
        sizer.style.visibility = bottom > top ? '' : 'hidden';
        Object.assign(sizer.style, { top: `${r.top - box.top}px`, left: `${r.left - box.left}px`, width: `${r.width}px`, height: `${r.height}px` });
        sizer.querySelectorAll('.h-n, .h-ne, .h-nw').forEach((x) => (x.style.visibility = r.top >= a.top ? '' : 'hidden'));
        sizer.querySelectorAll('.h-s, .h-se, .h-sw').forEach((x) => (x.style.visibility = r.bottom <= a.bottom ? '' : 'hidden'));
      };
      const select = (fig) => {
        area.querySelectorAll('figure.sel').forEach((x) => x.classList.remove('sel'));
        selected = fig;
        mediaBar.hidden = !fig;
        if (!fig) return (sizer.hidden = true);
        fig.classList.add('sel');
        const custom = Boolean(fig.style.width);
        mediaBar.querySelectorAll('[data-w]').forEach((x) => x.classList.toggle('on', !custom && fig.classList.contains(x.dataset.w)));
        mediaBar.querySelectorAll('[data-al]').forEach((x) => x.classList.toggle('on', fig.classList.contains(x.dataset.al)));
        requestAnimationFrame(place);
      };
      area.addEventListener('scroll', place);
      area.addEventListener('input', place);
      addEventListener('resize', place);
      sizer.querySelectorAll('[data-h]').forEach((handle) =>
        handle.addEventListener('pointerdown', (e) => {
          if (!selected) return;
          e.preventDefault();
          handle.setPointerCapture(e.pointerId);
          const dir = handle.dataset.h;
          const fig = selected;
          const media = mediaOf(fig);
          const start = (media || fig).getBoundingClientRect();
          // A centred photo grows on both sides, a photo floated left or right on one.
          const k = fig.classList.contains('al-left') || fig.classList.contains('al-right') ? 1 : 2;
          const x0 = e.clientX;
          const y0 = e.clientY;
          const move = (ev) => {
            let w = start.width;
            let h = start.height;
            if (dir.includes('e')) w += (ev.clientX - x0) * k;
            if (dir.includes('w')) w -= (ev.clientX - x0) * k;
            if (dir.includes('s')) h += ev.clientY - y0;
            if (dir.includes('n')) h -= ev.clientY - y0;
            w = Math.max(40, Math.min(inner(), w));
            h = Math.max(40, h);
            setWidth(fig, (w / inner()) * 100);
            if (media) media.style.aspectRatio = Math.max(0.2, Math.min(5, w / h)).toFixed(3);
            select(fig);
          };
          const up = () => {
            handle.removeEventListener('pointermove', move);
            handle.removeEventListener('pointerup', up);
            handle.removeEventListener('pointercancel', up);
          };
          handle.addEventListener('pointermove', move);
          handle.addEventListener('pointerup', up);
          handle.addEventListener('pointercancel', up);
        }),
      );
      async function addFiles(files) {
        for (const file of files) {
          const id = `up${Math.random().toString(36).slice(2)}`;
          busy++;
          insertHtml(`<figure class="w-100 al-center uploading" contenteditable="false" data-up="${id}"><span class="spinner"></span></figure><p><br></p>`);
          const holder = () => area.querySelector(`[data-up="${id}"]`);
          try {
            const m = await uploadOne(file);
            const h = holder();
            if (h) {
              h.classList.remove('uploading');
              h.removeAttribute('data-up');
              h.innerHTML = mediaHtml(m);
            }
          } catch (err) {
            holder()?.remove();
            toast(err.message || L.uploadFailed(file.name || ''), true);
          }
          busy--;
        }
      }

      document.addEventListener('selectionchange', () => {
        const sel = getSelection();
        if (!sel.rangeCount || !area.contains(sel.anchorNode)) return;
        saved = sel.getRangeAt(0).cloneRange();
        const block = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement;
        const h = block?.closest('h2, h3');
        blockSel.value = h && area.contains(h) ? h.tagName.toLowerCase() : 'p';
      });
      // Toolbar buttons must not take the focus away from the text.
      root.querySelector('.rte-bar').addEventListener('mousedown', (e) => {
        if (e.target.closest('button')) e.preventDefault();
      });
      root.querySelector('.rte-bar').addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        if (btn.dataset.cmd) exec(btn.dataset.cmd);
        else if (btn.hasAttribute('data-quote')) {
          const q = getSelection().anchorNode?.parentElement?.closest('blockquote');
          exec('formatBlock', q && area.contains(q) ? 'p' : 'blockquote');
        }
        else if (btn.hasAttribute('data-link')) {
          const keep = saved;
          const url = prompt(R.linkPrompt, 'https://');
          saved = keep;
          if (!url || url === 'https://') return;
          if (!/^(https?:\/\/|mailto:|tel:)/i.test(url.trim())) return toast(R.badLink, true);
          exec('createLink', url.trim());
        } else if (btn.hasAttribute('data-embed')) {
          const keep = saved;
          const m = fromLink(prompt(R.embedPrompt, 'https://'));
          saved = keep;
          if (!m) return toast(R.badLink, true);
          insertHtml(figureHtml(m) + '<p><br></p>');
        }
      });
      blockSel.addEventListener('change', () => exec('formatBlock', blockSel.value));
      const color = root.querySelector('[data-color]');
      color.addEventListener('input', () => exec('foreColor', color.value));
      root.querySelectorAll('[data-rte-file]').forEach((inp) =>
        inp.addEventListener('change', () => {
          const files = [...inp.files];
          inp.value = '';
          addFiles(files);
        }),
      );
      // Click a photo or video to size, align or delete it.
      area.addEventListener('click', (e) => select(e.target.closest('figure')));
      area.addEventListener('keydown', (e) => {
        if (selected && (e.key === 'Delete' || e.key === 'Backspace')) {
          e.preventDefault();
          selected.remove();
          select(null);
        }
      });
      mediaBar.addEventListener('mousedown', (e) => e.preventDefault());
      mediaBar.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn || !selected) return;
        if (btn.dataset.w) {
          selected.classList.remove(...SIZES);
          selected.classList.add(btn.dataset.w);
          selected.style.width = '';
          if (!selected.getAttribute('style')) selected.removeAttribute('style');
        } else if (btn.dataset.step) {
          setWidth(selected, widthOf(selected) + Number(btn.dataset.step));
        } else if (btn.hasAttribute('data-reset')) {
          const m = mediaOf(selected);
          if (m) {
            m.style.aspectRatio = '';
            if (!m.getAttribute('style')) m.removeAttribute('style');
          }
          setWidth(selected, 100);
        } else if (btn.dataset.al) {
          selected.classList.remove('al-left', 'al-center', 'al-right');
          selected.classList.add(btn.dataset.al);
        } else if (btn.hasAttribute('data-media-del')) {
          selected.remove();
          return select(null);
        }
        select(selected);
      });
      document.addEventListener('click', (e) => {
        if (selected && !root.contains(e.target)) select(null);
      });
      // Drop or paste files straight into the text.
      area.addEventListener('dragover', (e) => {
        if ([...e.dataTransfer.types].includes('Files')) e.preventDefault();
      });
      area.addEventListener('drop', (e) => {
        if (!e.dataTransfer.files.length) return;
        e.preventDefault();
        const pos = document.caretRangeFromPoint?.(e.clientX, e.clientY);
        const cp = !pos && document.caretPositionFromPoint?.(e.clientX, e.clientY);
        if (pos) saved = pos;
        else if (cp) {
          saved = document.createRange();
          saved.setStart(cp.offsetNode, cp.offset);
        }
        addFiles([...e.dataTransfer.files]);
      });
      area.addEventListener('paste', (e) => {
        const files = [...(e.clipboardData?.files || [])];
        if (!files.length) return;
        e.preventDefault();
        addFiles(files);
      });

      const value = () => {
        const clone = area.cloneNode(true);
        clone.querySelectorAll('.uploading').forEach((x) => x.remove());
        clone.querySelectorAll('[contenteditable]').forEach((x) => x.removeAttribute('contenteditable'));
        clone.querySelectorAll('.sel').forEach((x) => x.classList.remove('sel'));
        const empty = !clone.textContent.trim() && !clone.querySelector('img, video, iframe, hr, table');
        return empty ? '' : clone.innerHTML;
      };
      return {
        lang: l,
        sync: () => (input.value = value()),
        text: () => area.innerText.trim(),
        set: (html) => {
          load(html);
          input.value = value();
        },
      };
    });
    document.execCommand('defaultParagraphSeparator', false, 'p');
    return {
      busy: () => busy > 0,
      sync: () => list.forEach((x) => x.sync()),
      text: (l) => list.find((x) => x.lang === l)?.text() || '',
      set: (l, html) => list.find((x) => x.lang === l)?.set(html),
    };
  }

  // Uploads: each photo is shrunk in the browser (longest side 1600 px, WebP or JPEG) and sent as it is.
  async function shrink(file) {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const encode = (type, q) => new Promise((r) => canvas.toBlob(r, type, q));
    let blob = await encode('image/webp', 0.84);
    if (!blob || blob.type !== 'image/webp') blob = await encode('image/jpeg', 0.85); // Safari without WebP encoding
    for (let q = 0.75; blob.size > 0.95 * 1024 * 1024 && q > 0.4; q -= 0.15) blob = await encode(blob.type, q);
    return blob;
  }

  // products.options holds the list of groups, or { groups, bundles } when the product has quantity offers.
  function parseBundles(raw) {
    const text = String(raw || '').trim();
    if (!text.startsWith('{')) return [];
    try {
      return (JSON.parse(text).bundles || []).map((b) => ({ qty: b.qty, price: b.price, label: { ar: '', fr: '', en: '', ...b.label }, hot: Boolean(b.hot) }));
    } catch {
      return [];
    }
  }
  // The product's own "pieces left in the offer" number, or '' when it uses the one from the settings.
  function parseLeft(raw) {
    const text = String(raw || '').trim();
    if (!text.startsWith('{')) return '';
    try {
      const n = JSON.parse(text).left;
      return Number.isInteger(n) && n >= 0 ? n : '';
    } catch {
      return '';
    }
  }
  function parseOptions(raw) {
    let text = String(raw || '').trim();
    if (!text) return [];
    if (text.startsWith('{')) {
      try {
        text = JSON.stringify(JSON.parse(text).groups || []);
      } catch {
        return [];
      }
    }
    if (text.startsWith('[')) {
      try {
        return JSON.parse(text).map((g) => ({ name: { ar: '', fr: '', en: '', ...g.name }, type: g.type === 'color' ? 'color' : 'text', values: (g.values || []).map((v) => ({ label: v.label || '', price: v.price || 0, color: v.color || '#cccccc' })) }));
      } catch {
        return [];
      }
    }
    return [{ name: { ar: '', fr: '', en: '' }, type: 'text', values: text.split(',').map((x) => x.trim()).filter(Boolean).map((label) => ({ label, price: 0 })) }];
  }
  function productForm(p) {
    const images = JSON.parse(p.images || '[]');
    const field = (name, label, attrs = '') => `<label>${label}<input name="${name}" value="${esc(p[name] ?? '')}" ${attrs}></label>`;
    shell(
      p.id ? L.editProduct : L.newProduct,
      `<form class="form" id="pform">
      <div class="card"><h2>${L.name}</h2><div class="cols3">
        ${contentLangs().map((l) => field(`name_${l}`, LANG_LABEL[l], dirOf(l))).join('')}
      </div></div>
      <div class="card"><h2>${L.priceStock}</h2><div class="cols">
        ${field('price', L.price, 'type="number" min="0" step="1" required inputmode="numeric"')}
        ${field('compare_price', L.comparePrice, 'type="number" min="0" step="1" inputmode="numeric"')}
        ${field('stock', L.stock, 'type="number" min="0" step="1" inputmode="numeric"')}
        <label>${L.category}<select name="category_id"><option value="">—</option>${state.categories.map((c) => `<option value="${c.id}"${c.id === p.category_id ? ' selected' : ''}>${esc(catName(c))}</option>`).join('')}</select></label>
      </div>
      </div>
      <div class="card"><h2>${L.options}</h2>
        <p class="muted small">${L.opt.hint}</p>
        <div id="opts"></div>
        <div class="actions opt-add">
          <button type="button" class="btn ghost" data-opt-add="color"><span class="swatch-ico"></span>${L.opt.color}</button>
          <button type="button" class="btn ghost" data-opt-add="size">${icon('plus', 18)}<span>${L.opt.size}</span></button>
          <button type="button" class="btn ghost" data-opt-add="other">${icon('plus', 18)}<span>${L.opt.other}</span></button>
        </div>
      </div>
      <div class="card"><h2>${L.offers}</h2>
        <p class="muted small">${L.bun.hint}</p>
        <div id="bundles"></div>
        <div class="actions"><button type="button" class="btn ghost" data-bun-add>${icon('plus', 18)}<span>${L.bun.add}</span></button></div>
        <label class="offer-left">${L.bun.left}<input name="offer_left" type="number" min="0" max="9999" step="1" inputmode="numeric" value="${parseLeft(p.options)}"></label>
        <p class="muted small">${L.bun.leftHint}</p>
      </div>
      <div class="card"><h2>${L.photos}</h2>
        <div class="photos" id="photos"></div>
        <div class="drop" id="drop">
          <p><strong>${L.dropHere}</strong><br><span class="muted small">${L.dropHint}</span></p>
          <div class="actions">
            <label class="btn">${icon('plus', 18)}<span>${L.addPhotos}</span><input type="file" accept="image/*" multiple hidden data-pick></label>
            <label class="btn ghost camera">${icon('camera', 18)}<span>${L.takePhoto}</span><input type="file" accept="image/*" capture="environment" hidden data-pick></label>
          </div>
        </div>
        <details${images.some((u) => /^https?:/.test(u)) ? ' open' : ''}><summary class="muted small">${L.pasteLinks}</summary>
        <label>${L.photoLinks}<textarea name="images" rows="2" dir="ltr">${esc(images.join('\n'))}</textarea></label></details>
      </div>
      <div class="card"><h2>${L.description}</h2><p class="muted small">${L.rte.hint}</p>
        <details class="ai-box"><summary>✨ ${L.ai.title}</summary>
          <p class="muted small">${L.ai.hint}</p>
          <label>${L.ai.notes}<textarea name="ai_notes" rows="5" dir="auto" placeholder="${esc(L.ai.notesPh)}"></textarea></label>
          <div class="ai-row">
            <label>${L.ai.style}<select name="ai_style"><option value="darija">${L.ai.darija}</option><option value="fusha">${L.ai.fusha}</option></select></label>
            <label class="switch"><input type="checkbox" name="ai_names"><span></span> ${L.ai.alsoNames}</label>
          </div>
          <button type="button" class="btn ai-go" data-ai>✨ <span>${L.ai.go}</span></button>
          ${state.ai ? '' : `<p class="ai-warn small">${L.ai.noKey}</p>`}
          <p class="muted small">${L.ai.review}</p>
        </details>
        ${contentLangs().map((l) => richEditor(l)).join('')}
        <input type="hidden" name="desc_media" value="[]">
      </div>
      <div class="card"><h2>${L.display}</h2><div class="cols">
        ${field('slug', L.slug, `placeholder="${L.auto}" dir="ltr"`)}
        ${field('sort', L.sort, 'type="number" step="1"')}
      </div>
      <label class="switch"><input type="checkbox" name="featured"${p.featured ? ' checked' : ''}><span></span> ${L.featured}</label>
      <label class="switch"><input type="checkbox" name="active"${p.active ? ' checked' : ''}><span></span> ${L.active}</label></div>
      <div class="sticky-actions"><button type="button" class="btn ghost" data-back>${L.cancel}</button>${p.id ? `<a class="btn ghost hide-sm" href="/${lang}/p/${esc(p.slug)}" target="_blank" rel="noopener">${L.view}</a><button type="button" class="btn danger" data-delete>${L.del}</button>` : ''}<button class="btn">${L.save}</button></div>
    </form>`,
    );
    const f = document.getElementById('pform');
    const list = () => f.images.value.split('\n').map((x) => x.trim()).filter(Boolean);
    const setList = (arr) => {
      f.images.value = arr.join('\n');
      drawPhotos();
    };
    let pending = []; // {id, name, preview} while uploading
    let dragFrom = null;
    const drawPhotos = () => {
      const urls = list();
      document.getElementById('photos').innerHTML =
        urls
          .map(
            (u, i) => `<figure draggable="true" data-i="${i}">${i === 0 ? `<span class="main-badge">${L.mainPhoto}</span>` : ''}<img src="${esc(u)}" alt="" loading="lazy">
            <div class="tile-actions">${i > 0 ? `<button type="button" data-move="${i}" data-by="-1" title="${L.moveBefore}" aria-label="${L.moveBefore}">${icon('chevron', 16)}</button>` : '<span></span>'}<button type="button" data-rm="${i}" title="${L.remove}" aria-label="${L.remove}">✕</button>${i < urls.length - 1 ? `<button type="button" data-move="${i}" data-by="1" class="flip" title="${L.moveAfter}" aria-label="${L.moveAfter}">${icon('chevron', 16)}</button>` : '<span></span>'}</div></figure>`,
          )
          .join('') + pending.map((x) => `<figure class="uploading"><img src="${x.preview}" alt=""><span class="spinner"></span></figure>`).join('');
    };
    drawPhotos();
    f.images.addEventListener('input', drawPhotos);
    f.addEventListener('click', async (e) => {
      if (e.target.closest('[data-back]')) products();
      const rm = e.target.closest('[data-rm]');
      if (rm) {
        const arr = list();
        arr.splice(Number(rm.dataset.rm), 1);
        setList(arr);
      }
      const mv = e.target.closest('[data-move]');
      if (mv) {
        const arr = list();
        const i = Number(mv.dataset.move);
        const j = i + Number(mv.dataset.by);
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setList(arr);
      }
      if (e.target.closest('[data-delete]') && confirm(L.confirmDeleteProduct)) {
        try {
          await api(`/products/${p.id}`, { method: 'DELETE' });
          toast(L.productDeleted);
          products();
        } catch (err) {
          toast(err.message, true);
        }
      }
    });
    // Drag tiles to reorder them.
    const grid = document.getElementById('photos');
    grid.addEventListener('dragstart', (e) => {
      const fig = e.target.closest('figure[data-i]');
      if (fig) dragFrom = Number(fig.dataset.i);
    });
    grid.addEventListener('dragover', (e) => {
      if (dragFrom != null) e.preventDefault();
    });
    grid.addEventListener('drop', (e) => {
      const fig = e.target.closest('figure[data-i]');
      if (dragFrom == null || !fig) return;
      e.preventDefault();
      const arr = list();
      const [moved] = arr.splice(dragFrom, 1);
      arr.splice(Number(fig.dataset.i), 0, moved);
      dragFrom = null;
      setList(arr);
    });
    grid.addEventListener('dragend', () => (dragFrom = null));

    async function upload(files) {
      const jobs = [...files].map((file) => ({ file, id: Math.random(), name: file.name || 'photo', preview: URL.createObjectURL(file) }));
      pending.push(...jobs);
      drawPhotos();
      const next = async () => {
        const job = jobs.shift();
        if (!job) return;
        try {
          if (!job.file.type.startsWith('image/') && !/\.(heic|heif)$/i.test(job.name)) throw new Error(L.notImage(job.name));
          let blob;
          try {
            blob = await shrink(job.file);
          } catch {
            throw new Error(L.notImage(job.name));
          }
          const { url } = await api('/images', { method: 'POST', raw: blob });
          f.images.value = [...list(), url].join('\n');
        } catch (err) {
          toast(err.message || L.uploadFailed(job.name), true);
        }
        pending = pending.filter((x) => x.id !== job.id);
        URL.revokeObjectURL(job.preview);
        drawPhotos();
        await next();
      };
      await Promise.all([next(), next(), next()]);
    }
    f.querySelectorAll('[data-pick]').forEach((input) =>
      input.addEventListener('change', () => {
        upload(input.files);
        input.value = '';
      }),
    );
    const drop = document.getElementById('drop');
    ['dragenter', 'dragover'].forEach((t) =>
      drop.addEventListener(t, (e) => {
        if (![...e.dataTransfer.types].includes('Files')) return;
        e.preventDefault();
        drop.classList.add('over');
      }),
    );
    ['dragleave', 'drop'].forEach((t) => drop.addEventListener(t, () => drop.classList.remove('over')));
    drop.addEventListener('drop', (e) => {
      if (!e.dataTransfer.files.length) return;
      e.preventDefault();
      upload(e.dataTransfer.files);
    });
    // Description editors (one per language): Word-like text with photos, GIFs, videos and embeds.
    const editors = initEditors(f, p, shrink);
    // AI description writer: Claude reads the photos and the notes, writes the three languages,
    // and the result goes into the editors for the seller to check before saving.
    const aiBtn = f.querySelector('[data-ai]');
    aiBtn.addEventListener('click', async () => {
      const filled = contentLangs().some((l) => editors.text(l));
      if (filled && !confirm(L.ai.replace)) return;
      const notes = f.ai_notes.value.trim() || contentLangs().map((l) => editors.text(l)).filter(Boolean)[0] || '';
      const names = Object.fromEntries(['ar', 'fr', 'en'].map((l) => [l, f[`name_${l}`]?.value || '']));
      const label = aiBtn.querySelector('span');
      aiBtn.disabled = true;
      label.textContent = L.ai.working;
      try {
        const r = await api('/ai/describe', { method: 'POST', body: { names, notes, style: f.ai_style.value, images: list().slice(0, 4) } });
        contentLangs().forEach((l) => r.desc[l] && editors.set(l, r.desc[l]));
        if (f.ai_names.checked) contentLangs().forEach((l) => r.names[l] && f[`name_${l}`] && (f[`name_${l}`].value = r.names[l]));
        toast(L.ai.done);
        f.querySelector('.rte')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (err) {
        if (err.message !== 'unauthorized') toast(err.message, true);
      } finally {
        aiBtn.disabled = false;
        label.textContent = L.ai.go;
      }
    });
    // Options builder (colours, sizes…). Saved as JSON; older products with "S, M, L" open as one group.
    const opts = parseOptions(p.options);
    const optsBox = document.getElementById('opts');
    const drawOpts = () => {
      optsBox.innerHTML = opts
        .map(
          (g, gi) => `<div class="opt-group" data-g="${gi}">
          <div class="opt-head">
            <div class="cols3">${contentLangs().map((l) => `<label>${L.opt.groupName} · ${LANG_LABEL[l]}<input data-k="name" data-l="${l}" value="${esc(g.name[l] || '')}" ${dirOf(l)} maxlength="40"></label>`).join('')}</div>
            <div class="opt-tools"><label>${L.opt.type}<select data-k="type"><option value="text"${g.type !== 'color' ? ' selected' : ''}>${L.opt.typeText}</option><option value="color"${g.type === 'color' ? ' selected' : ''}>${L.opt.typeColor}</option></select></label>
            <button type="button" class="btn ghost danger-text" data-opt-del>${L.opt.removeGroup}</button></div>
          </div>
          <div class="opt-values">
            <div class="opt-row opt-labels${g.type === 'color' ? ' has-color' : ''}">${g.type === 'color' ? '<span></span>' : ''}<span>${L.opt.value}</span><span>${L.opt.extra}</span><span></span></div>
            ${g.values
              .map(
                (v, vi) => `<div class="opt-row${g.type === 'color' ? ' has-color' : ''}" data-v="${vi}">
                ${g.type === 'color' ? `<input type="color" data-k="color" value="${esc(v.color || '#cccccc')}" aria-label="${L.opt.colorName}">` : ''}
                <input data-k="label" value="${esc(v.label)}" placeholder="${L.opt.valuePh}" maxlength="40" aria-label="${L.opt.value}">
                <input data-k="price" type="number" step="1" inputmode="numeric" value="${v.price ? v.price : ''}" placeholder="0" aria-label="${L.opt.extra}" dir="ltr">
                <button type="button" class="x" data-val-del title="${L.remove}" aria-label="${L.remove}">✕</button>
              </div>`,
              )
              .join('')}
          </div>
          <button type="button" class="btn ghost small" data-val-add>${icon('plus', 16)}<span>${L.opt.addValue}</span></button>
        </div>`,
        )
        .join('');
    };
    drawOpts();
    // Quantity offers builder.
    const bundles = parseBundles(p.options);
    const bunBox = document.getElementById('bundles');
    const basePrice = () => Math.round(Number(f.price.value) || 0);
    const bunNote = (b) => {
      const was = basePrice() * (b.qty || 0);
      if (!b.qty || !b.price || !was) return '';
      return b.price < was ? `<span class="bun-save">${L.bun.save(dh(was - b.price))}</span>` : `<span class="bun-warn">${L.bun.notCheaper}</span>`;
    };
    const drawBundles = () => {
      bunBox.innerHTML = bundles
        .map(
          (b, bi) => `<div class="bun" data-b="${bi}">
          <div class="bun-row">
            <label>${L.bun.qty}<input data-k="qty" type="number" min="2" max="20" step="1" inputmode="numeric" value="${b.qty || ''}" dir="ltr"></label>
            <label>${L.bun.price}<input data-k="price" type="number" min="1" step="1" inputmode="numeric" value="${b.price || ''}" dir="ltr"></label>
            <label class="switch"><input type="checkbox" data-k="hot"${b.hot ? ' checked' : ''}><span></span> ${L.bun.hot}</label>
            <button type="button" class="x" data-bun-del title="${L.remove}" aria-label="${L.remove}">✕</button>
          </div>
          <p class="bun-note small" data-bun-note>${bunNote(b)}</p>
          <details${contentLangs().some((l) => b.label[l]) ? ' open' : ''}><summary class="muted small">${L.bun.title}</summary>
            <div class="cols3">${contentLangs().map((l) => `<label>${LANG_LABEL[l]}<input data-k="label" data-l="${l}" value="${esc(b.label[l] || '')}" placeholder="${L.bun.titlePh}" ${dirOf(l)} maxlength="60"></label>`).join('')}</div>
          </details>
        </div>`,
        )
        .join('');
    };
    drawBundles();
    const refreshNotes = () => bunBox.querySelectorAll('[data-b]').forEach((el) => (el.querySelector('[data-bun-note]').innerHTML = bunNote(bundles[Number(el.dataset.b)])));
    f.price.addEventListener('input', refreshNotes);
    bunBox.addEventListener('input', (e) => {
      const el = e.target;
      const b = bundles[Number(el.closest('[data-b]')?.dataset.b)];
      if (!b) return;
      if (el.dataset.k === 'qty') b.qty = Math.round(Number(el.value) || 0);
      else if (el.dataset.k === 'price') b.price = Math.round(Number(el.value) || 0);
      else if (el.dataset.k === 'hot') b.hot = el.checked;
      else if (el.dataset.k === 'label') b.label[el.dataset.l] = el.value;
      refreshNotes();
    });
    bunBox.addEventListener('change', (e) => {
      if (e.target.dataset.k !== 'hot' || !e.target.checked) return;
      // Only one offer is "most popular".
      bundles.forEach((b, i) => (b.hot = i === Number(e.target.closest('[data-b]').dataset.b)));
      drawBundles();
    });
    f.addEventListener('click', (e) => {
      if (e.target.closest('[data-bun-add]')) {
        const last = bundles[bundles.length - 1];
        const qty = Math.min(20, last ? last.qty + 1 : 2);
        bundles.push({ qty, price: 0, label: { ar: '', fr: '', en: '' }, hot: false });
        drawBundles();
        bunBox.querySelector(`[data-b="${bundles.length - 1}"] [data-k="price"]`)?.focus();
      } else if (e.target.closest('[data-bun-del]')) {
        bundles.splice(Number(e.target.closest('[data-b]').dataset.b), 1);
        drawBundles();
      }
    });
    optsBox.addEventListener('input', (e) => {
      const el = e.target;
      const g = opts[Number(el.closest('[data-g]')?.dataset.g)];
      if (!g) return;
      const v = g.values[Number(el.closest('[data-v]')?.dataset.v)];
      if (el.dataset.k === 'name') g.name[el.dataset.l] = el.value;
      else if (el.dataset.k === 'type') {
        g.type = el.value;
        drawOpts();
      } else if (v && el.dataset.k === 'label') v.label = el.value;
      else if (v && el.dataset.k === 'price') v.price = Math.round(Number(el.value) || 0);
      else if (v && el.dataset.k === 'color') v.color = el.value;
    });
    f.addEventListener('click', (e) => {
      const add = e.target.closest('[data-opt-add]');
      const gEl = e.target.closest('[data-g]');
      const g = gEl && opts[Number(gEl.dataset.g)];
      if (add) {
        const kind = add.dataset.optAdd;
        const names = {
          color: { ar: 'اللون', fr: 'Couleur', en: 'Color' },
          size: { ar: 'المقاس', fr: 'Taille', en: 'Size' },
          other: { ar: '', fr: '', en: '' },
        };
        const values = kind === 'size' ? ['S', 'M', 'L', 'XL'].map((label) => ({ label, price: 0 })) : [{ label: '', price: 0, color: '#000000' }];
        opts.push({ name: names[kind], type: kind === 'color' ? 'color' : 'text', values });
        drawOpts();
        optsBox.querySelector(`[data-g="${opts.length - 1}"] [data-k="${kind === 'other' ? 'name' : 'label'}"]`)?.focus();
      } else if (g && e.target.closest('[data-opt-del]')) {
        opts.splice(Number(gEl.dataset.g), 1);
        drawOpts();
      } else if (g && e.target.closest('[data-val-add]')) {
        g.values.push({ label: '', price: 0, color: '#000000' });
        drawOpts();
        const rows = optsBox.querySelectorAll(`[data-g="${gEl.dataset.g}"] [data-k="label"]`);
        rows[rows.length - 1]?.focus();
      } else if (g && e.target.closest('[data-val-del]')) {
        g.values.splice(Number(e.target.closest('[data-v]').dataset.v), 1);
        drawOpts();
      }
    });
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (pending.length || editors.busy()) return toast(L.waitUploads, true);
      editors.sync();
      const data = Object.fromEntries(new FormData(f));
      data.featured = f.featured.checked;
      data.active = f.active.checked;
      const groups = opts.map((g) => ({ ...g, values: g.values.filter((v) => v.label.trim()) }));
      if (groups.some((g) => !g.values.length)) return toast(L.opt.needValue, true);
      data.options = JSON.stringify(groups);
      const qtys = bundles.map((b) => b.qty);
      if (bundles.some((b) => !(b.qty >= 2 && b.qty <= 20) || !(b.price > 0)) || new Set(qtys).size !== qtys.length) return toast(L.bun.bad, true);
      data.bundles = bundles;
      try {
        await api(p.id ? `/products/${p.id}` : '/products', { method: p.id ? 'PUT' : 'POST', body: data });
        toast(L.productSaved);
        products();
      } catch (err) {
        toast(err.message, true);
      }
    });
  }

  // Categories
  // Blog: articles bring visitors from Google whatever products are in the shop.
  const postTitle = (x) => pick(x, 'title') || '—';
  async function blog() {
    loading(L.nav.blog);
    const B = L.blog;
    const { posts: list } = await api('/posts');
    shell(
      L.nav.blog,
      list.length
        ? `<div class="card flush"><table class="table"><thead><tr><th></th><th>${B.postTitle}</th><th class="hide-sm">${B.date}</th><th class="hide-sm">${L.thState}</th><th></th></tr></thead><tbody>
      ${list.map((x) => `<tr data-post="${x.id}"><td class="tight"><img class="thumb" src="${esc(x.cover || '/assets/placeholder.svg')}" alt=""></td><td><strong>${esc(postTitle(x))}</strong><small dir="ltr">/blog/${esc(x.slug)}</small></td><td class="hide-sm nowrap">${esc(String(x.created_at).slice(0, 10))}</td><td class="hide-sm">${x.published ? `<span class="chip chip-ok">${L.online}</span>` : `<span class="chip">${L.hidden}</span>`}</td><td class="tight"><button type="button" class="icon-btn danger" data-del-post="${x.id}" title="${L.del}" aria-label="${L.del}">${icon('trash', 18)}</button></td></tr>`).join('')}
      </tbody></table></div>`
        : `<div class="card empty">${icon('blog', 36)}<p>${B.noPosts}</p></div>`,
      { sub: B.count(list.length), actions: `<button class="btn" data-new>${icon('plus', 18)}<span>${B.newPost}</span></button>` },
    );
    app.querySelector('[data-new]').addEventListener('click', () => postForm({ published: 1 }));
    app.querySelectorAll('[data-post]').forEach((tr) => tr.addEventListener('click', () => postForm(list.find((x) => x.id === Number(tr.dataset.post)))));
    app.querySelectorAll('[data-del-post]').forEach((btn) =>
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!confirm(B.confirmDelete)) return;
        try {
          await api(`/posts/${btn.dataset.delPost}`, { method: 'DELETE' });
          toast(B.deleted);
          blog();
        } catch (err) {
          toast(err.message, true);
        }
      }),
    );
  }

  function postForm(p) {
    const B = L.blog;
    const field = (name, label, attrs = '') => `<label>${label}<input name="${name}" value="${esc(p[name] ?? '')}" ${attrs}></label>`;
    const area = (name, label, attrs = '') => `<label>${label}<textarea name="${name}" rows="2" maxlength="300" ${attrs}>${esc(p[name] ?? '')}</textarea></label>`;
    shell(
      p.id ? B.editPost : B.newPost,
      `<form class="form" id="postform">
      <div class="card"><h2>${B.postTitle}</h2><div class="cols3">${contentLangs().map((l) => field(`title_${l}`, LANG_LABEL[l], `${dirOf(l)} maxlength="200"`)).join('')}</div></div>
      <div class="card"><h2>${B.excerpt}</h2><p class="muted small">${B.excerptHint}</p>${contentLangs().map((l) => area(`excerpt_${l}`, LANG_LABEL[l], dirOf(l))).join('')}</div>
      <div class="card"><h2>${B.cover}</h2><p class="muted small">${B.coverHint}</p>
        <div class="cover-row"><img class="cover-preview" src="${esc(p.cover || '/assets/placeholder.svg')}" alt="">
          <label class="btn ghost">${icon('camera', 18)}<span>${B.uploadCover}</span><input type="file" accept="image/*" hidden data-cover></label></div>
        ${field('cover', B.coverLink, 'dir="ltr" placeholder="https://…"')}
      </div>
      <div class="card"><h2>${B.body}</h2><p class="muted small">${L.rte.hint}</p>${contentLangs().map((l) => richEditor(l, 'body')).join('')}</div>
      <div class="card"><h2>${L.display}</h2>${field('slug', L.slug, `placeholder="${L.auto}" dir="ltr"`)}
        <label class="switch"><input type="checkbox" name="published"${p.published ? ' checked' : ''}><span></span> ${B.published}</label></div>
      <div class="sticky-actions"><button type="button" class="btn ghost" data-back>${L.cancel}</button>${p.id ? `<a class="btn ghost hide-sm" href="/${lang}/blog/${esc(p.slug)}" target="_blank" rel="noopener">${L.view}</a><button type="button" class="btn danger" data-delete>${L.del}</button>` : ''}<button class="btn">${L.save}</button></div>
    </form>`,
    );
    const f = document.getElementById('postform');
    const editors = initEditors(f, p, shrink, 'body');
    const preview = f.querySelector('.cover-preview');
    f.cover.addEventListener('input', () => (preview.src = f.cover.value.trim() || '/assets/placeholder.svg'));
    let coverBusy = false;
    f.querySelector('[data-cover]').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      e.target.value = '';
      if (!file) return;
      coverBusy = true;
      preview.style.opacity = 0.4;
      try {
        const { url } = await api('/images', { method: 'POST', raw: await shrink(file) });
        f.cover.value = url;
        preview.src = url;
      } catch (err) {
        toast(err.message || L.uploadFailed(file.name || ''), true);
      }
      coverBusy = false;
      preview.style.opacity = 1;
    });
    f.addEventListener('click', async (e) => {
      if (e.target.closest('[data-back]')) blog();
      if (e.target.closest('[data-delete]') && confirm(B.confirmDelete)) {
        try {
          await api(`/posts/${p.id}`, { method: 'DELETE' });
          toast(B.deleted);
          blog();
        } catch (err) {
          toast(err.message, true);
        }
      }
    });
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (coverBusy || editors.busy()) return toast(L.waitUploads, true);
      editors.sync();
      const data = Object.fromEntries(new FormData(f));
      data.published = f.published.checked;
      try {
        await api(p.id ? `/posts/${p.id}` : '/posts', { method: p.id ? 'PUT' : 'POST', body: data });
        toast(B.saved);
        blog();
      } catch (err) {
        toast(err.message, true);
      }
    });
  }

  async function categories() {
    state.categories = (await api('/categories')).categories;
    const cols = contentLangs();
    const inputs = (c) => cols.map((l) => `<td><input name="name_${l}" ${dirOf(l)} value="${esc(c[`name_${l}`] || '')}"${!c.id && l === lang ? ` placeholder="${L.newCategory}"` : ''}></td>`).join('');
    shell(
      L.nav.categories,
      `<div class="card flush"><table class="table cats"><thead><tr><th>${L.thPhoto}</th>${cols.map((l) => `<th>${LANG_LABEL[l]}</th>`).join('')}<th>${L.thPhotoLink}</th><th>${L.thSort}</th><th>${L.thProducts}</th><th></th></tr></thead><tbody>
      ${state.categories.map((c) => `<tr data-cat="${c.id}"><td><img class="thumb" src="${esc(c.image || '/assets/placeholder.svg')}" alt=""></td>${inputs(c)}<td><input name="image" dir="ltr" value="${esc(c.image || '')}" placeholder="/img/… https://…"></td><td><input name="sort" type="number" value="${c.sort}" class="num"></td><td>${c.products}</td><td class="nowrap"><button class="btn small" data-save>${L.ok}</button> <button class="link" data-del>${L.del}</button></td></tr>`).join('')}
      <tr data-cat="" class="new-row"><td></td>${inputs({})}<td><input name="image" dir="ltr" placeholder="/img/… https://…"></td><td><input name="sort" type="number" value="0" class="num"></td><td></td><td><button class="btn small" data-save>${L.add}</button></td></tr>
      </tbody></table></div>`,
      { sub: L.catsSub },
    );
    app.querySelectorAll('[data-cat]').forEach((tr) => {
      const id = tr.dataset.cat;
      tr.querySelector('[data-save]').addEventListener('click', async () => {
        const data = Object.fromEntries([...tr.querySelectorAll('input')].map((i) => [i.name, i.value]));
        if (id) data.slug = state.categories.find((c) => c.id === Number(id)).slug;
        try {
          await api(id ? `/categories/${id}` : '/categories', { method: id ? 'PUT' : 'POST', body: data });
          toast(L.catSaved);
          categories();
        } catch (err) {
          toast(err.message, true);
        }
      });
      tr.querySelector('[data-del]')?.addEventListener('click', async () => {
        if (!confirm(L.confirmDeleteCat)) return;
        try {
          await api(`/categories/${id}`, { method: 'DELETE' });
          categories();
        } catch (err) {
          toast(err.message, true);
        }
      });
    });
  }

  // Settings
  function settings() {
    const s = state.settings;
    const field = (k, label, attrs = '') => `<label>${label}<input name="${k}" value="${esc(s[k] ?? '')}" ${attrs}></label>`;
    const steps = `<ol class="howto">${L.steps.map((x) => `<li>${x}</li>`).join('')}</ol>`;
    shell(
      L.nav.settings,
      `<form class="form" id="sform">
      <div class="card"><h2>${L.store}</h2><div class="cols">
        ${field('store_name', L.storeName, 'required')}
        ${field('whatsapp', L.whatsapp, 'inputmode="tel" dir="ltr"')}
        ${field('contact_email', L.contactEmail, 'type="email" dir="ltr"')}
      </div></div>
      <div class="card" id="emails"><div class="card-head"><h2>${icon('mail')} ${L.emails}</h2><span class="chip ${state.emails ? 'chip-ok' : 'chip-warn'}">${state.emails ? L.keyOk : L.keyMissing}</span></div>
        <p class="muted small">${L.emailsIntro}</p>
        ${state.emails ? '' : steps}
        <div class="cols">
          ${field('email_from', L.emailFrom, 'type="email" dir="ltr" placeholder="boutique@gmail.com"')}
          ${field('notify_email', L.notifyEmail, 'type="email" dir="ltr" placeholder="you@gmail.com"')}
        </div>
        <label class="switch"><input type="checkbox" name="email_status_updates"${s.email_status_updates !== '0' ? ' checked' : ''}><span></span> ${L.statusUpdates}</label>
        <div class="actions"><button type="button" class="btn ghost" data-test>${icon('mail', 18)}<span>${L.sendTest}</span></button></div>
        ${state.emails ? `<details><summary class="muted small">${L.howItWorks}</summary>${steps}</details>` : ''}
      </div>
      <div class="card"><h2>${L.social}</h2><p class="muted small">${L.socialHint}</p><div class="cols">
        ${field('instagram', 'Instagram', 'dir="ltr" placeholder="https://instagram.com/…"')}
        ${field('facebook', 'Facebook', 'dir="ltr" placeholder="https://facebook.com/…"')}
        ${field('tiktok', 'TikTok', 'dir="ltr" placeholder="@…"')}
      </div></div>
      <div class="card"><h2>${L.seo}</h2><p class="muted small">${L.seoHint}</p>
        ${field('google_verify', L.googleVerify, 'dir="ltr" placeholder="&lt;meta name=&quot;google-site-verification&quot; content=&quot;…&quot;&gt;"')}<p class="muted small">${L.googleHow}</p>
      </div>
      <div class="card"><h2>Google AdSense</h2><p class="muted small">${L.adsenseHint}</p>
        ${field('adsense_client', L.adsenseId, 'dir="ltr" pattern="(ca-)?pub-[0-9]{10,20}" placeholder="ca-pub-1234567890123456"')}<p class="muted small">${L.adsenseHow}</p>
      </div>
      <div class="card"><h2>${L.pixels}</h2><p class="muted small">${L.pixelsHint}</p><div class="cols">
        <div>${field('meta_pixel_id', L.metaPixel, 'dir="ltr" inputmode="numeric" pattern="[0-9]{8,20}" placeholder="123456789012345"')}<p class="muted small">${L.metaHow}</p></div>
        <div>${field('tiktok_pixel_id', L.tiktokPixel, 'dir="ltr" pattern="[A-Za-z0-9]{10,30}" placeholder="C4ABCDEFGHIJ1234567"')}<p class="muted small">${L.tiktokHow}</p></div>
      </div></div>
      <div class="card"><h2>${L.legal}</h2><p class="muted small">${L.legalHint}</p><div class="cols">
        ${field('legal_name', L.legalName)}
        ${field('legal_ice', L.legalIce, 'dir="ltr" inputmode="numeric"')}
        ${field('legal_rc', L.legalRc, 'dir="ltr"')}
        ${field('legal_cndp', L.legalCndp, 'dir="ltr"')}
      </div>
        ${field('legal_address', L.legalAddress)}
        <p class="muted small">${L.viewPages} <a href="/${lang}/privacy" target="_blank" rel="noopener">${L.legalPrivacy}</a> · <a href="/${lang}/terms" target="_blank" rel="noopener">${L.legalTerms}</a></p>
      </div>
      <div class="card"><h2>${L.shipping}</h2><p class="muted small">${L.shippingIncluded}</p></div>
      <div class="card"><h2>${L.currency}</h2><p class="muted small">${L.currencyHint}</p>
        <label class="switch"><input type="checkbox" name="auto_currency"${s.auto_currency !== '0' ? ' checked' : ''}><span></span> ${L.autoCurrency}</label>
      </div>
      <div class="card"><h2>${L.urgency}</h2><p class="muted small">${L.urgencyHint}</p>
        <label class="switch"><input type="checkbox" name="countdown"${s.countdown !== '0' ? ' checked' : ''}><span></span> ${L.countdownOn}</label>
        <label>${L.offerLeftAll}<input name="offer_left" value="${esc(s.offer_left ?? '7')}" type="number" min="0" max="9999" step="1" inputmode="numeric" placeholder="7"></label>
        <p class="muted small">${L.offerLeftAllHint}</p>
      </div>
      <div class="card"><h2>${L.banner}</h2><p class="muted small">${L.bannerHint}</p>
        ${contentLangs().map((l) => field(`announcement_${l}`, LANG_LABEL[l], dirOf(l))).join('')}
      </div>
      <div class="card"><h2>${L.homePage}</h2><p class="muted small">${L.homeHint}</p><div class="cols">
        ${contentLangs().map((l) => field(`hero_title_${l}`, `${L.heroTitle} · ${LANG_LABEL[l]}`, dirOf(l)) + field(`hero_text_${l}`, `${L.heroText} · ${LANG_LABEL[l]}`, dirOf(l))).join('')}
      </div></div>
      <div class="sticky-actions"><button class="btn">${L.saveSettings}</button></div>
    </form>`,
    );
    const f = document.getElementById('sform');
    const save = async () => {
      const data = Object.fromEntries(new FormData(f));
      data.whatsapp = data.whatsapp.replace(/\D/g, '').replace(/^0(?=[5-7])/, '212');
      data.email_status_updates = f.email_status_updates.checked ? '1' : '0';
      data.auto_currency = f.auto_currency.checked ? '1' : '0';
      data.countdown = f.countdown.checked ? '1' : '0';
      data.meta_pixel_id = data.meta_pixel_id.trim();
      data.adsense_client = (data.adsense_client.match(/pub-\d{10,20}/) || [''])[0].replace(/^pub-/, 'ca-pub-');
      data.tiktok_pixel_id = data.tiktok_pixel_id.trim().toUpperCase();
      await api('/settings', { method: 'PUT', body: data });
      state.settings = (await api('/settings')).settings;
    };
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await save();
        toast(L.settingsSaved);
        settings();
      } catch (err) {
        toast(err.message, true);
      }
    });
    f.querySelector('[data-test]').addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;
      try {
        await save();
        const r = await api('/test-email', { method: 'POST', body: {} });
        toast(L.testSent(r.to));
      } catch (err) {
        toast(err.message, true);
      }
      btn.disabled = false;
    });
  }

  start();
})();

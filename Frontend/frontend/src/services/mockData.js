export const products = [
    // Pain Relief
    { id: 1, name: 'Panadol Extra', price: 40, originalPrice: 50, discount: 20, image: 'https://placehold.co/300x300/f0fdf4/16a34a?text=Panadol', category: 'Pain Relief', stock: 50, description: 'Effective relief from headaches, fever, and body pain. Contains Paracetamol 500mg with extra caffeine for enhanced pain relief.' },
    { id: 2, name: 'Brufen 400mg', price: 30, originalPrice: 40, discount: 25, image: 'https://placehold.co/300x300/f0fdf4/16a34a?text=Brufen', category: 'Pain Relief', stock: 100, description: 'Ibuprofen 400mg tablets for pain, inflammation, and fever. Suitable for adults and children over 12 years.' },
    { id: 3, name: 'Disprin', price: 10, originalPrice: 15, discount: 33, image: 'https://placehold.co/300x300/f0fdf4/16a34a?text=Disprin', category: 'Pain Relief', stock: 200, description: 'Fast-dissolving aspirin tablets for quick relief from headaches, toothaches, and minor body aches.' },
    { id: 4, name: 'Ponstan 500mg', price: 55, originalPrice: 60, discount: 8, image: 'https://placehold.co/300x300/f0fdf4/16a34a?text=Ponstan', category: 'Pain Relief', stock: 80, description: 'Mefenamic acid 500mg capsules for menstrual pain, dental pain, and mild to moderate pain relief.' },

    // Vitamins
    { id: 5, name: 'CaC-1000 Plus', price: 220, originalPrice: 250, discount: 12, image: 'https://placehold.co/300x300/fffbeb/d97706?text=CaC-1000', category: 'Vitamins', stock: 20, description: 'Effervescent Vitamin C 1000mg tablets with calcium. Boosts immunity and supports bone health. Orange flavor.' },
    { id: 6, name: 'Surbex Z', price: 280, originalPrice: 300, discount: 6, image: 'https://placehold.co/300x300/fffbeb/d97706?text=Surbex+Z', category: 'Vitamins', stock: 30, description: 'Multivitamin with Zinc supplement. Contains B-complex vitamins and Zinc for daily nutritional support.' },
    { id: 7, name: 'Caltrate 600mg', price: 450, originalPrice: 500, discount: 10, image: 'https://placehold.co/300x300/fffbeb/d97706?text=Caltrate', category: 'Vitamins', stock: 25, description: 'Calcium 600mg with Vitamin D3 supplement. Supports strong bones and teeth. Recommended for adults.' },
    { id: 8, name: 'Centrum Silver', price: 1200, originalPrice: 1350, discount: 11, image: 'https://placehold.co/300x300/fffbeb/d97706?text=Centrum', category: 'Vitamins', stock: 15, description: 'Complete multivitamin for adults 50+. Contains essential vitamins and minerals for heart, brain, and eye health.' },

    // Skin Care
    { id: 9, name: 'Nivea Lotion', price: 450, originalPrice: 500, discount: 10, image: 'https://placehold.co/300x300/fdf2f8/db2777?text=Nivea', category: 'Skin Care', stock: 15, description: 'Nourishing body lotion for 48-hour deep moisture. Suitable for normal to dry skin. Dermatologically tested.' },
    { id: 10, name: 'Vaseline Body Cream', price: 350, originalPrice: 380, discount: 8, image: 'https://placehold.co/300x300/fdf2f8/db2777?text=Vaseline', category: 'Skin Care', stock: 40, description: 'Intensive care body cream with micro-droplets of Vaseline jelly. Heals dry skin and locks in moisture.' },
    { id: 11, name: 'Dove Moisturizer', price: 520, originalPrice: 580, discount: 10, image: 'https://placehold.co/300x300/fdf2f8/db2777?text=Dove', category: 'Skin Care', stock: 20, description: 'Rich nourishment body cream with essential oils. Leaves skin soft and smooth for up to 72 hours.' },

    // Baby Care
    { id: 12, name: 'Pampers (Small)', price: 1200, originalPrice: 1300, discount: 8, image: 'https://placehold.co/300x300/eff6ff/2563eb?text=Pampers', category: 'Baby Care', stock: 25, description: 'Premium diapers for babies 3-8kg. 12-hour dryness with soft, breathable material. Pack of 40 diapers.' },
    { id: 13, name: 'Johnson Baby Oil', price: 380, originalPrice: 420, discount: 10, image: 'https://placehold.co/300x300/eff6ff/2563eb?text=J%26J+Oil', category: 'Baby Care', stock: 35, description: 'Pure mineral oil for gentle baby massage. Clinically proven mild formula. Locks in 10x more moisture.' },
    { id: 14, name: 'Cerelac Wheat', price: 650, originalPrice: 700, discount: 7, image: 'https://placehold.co/300x300/eff6ff/2563eb?text=Cerelac', category: 'Baby Care', stock: 18, description: 'Infant cereal with wheat and milk for babies 6+ months. Fortified with iron, vitamins, and minerals.' },
    { id: 15, name: 'Gripe Water', price: 120, originalPrice: 140, discount: 14, image: 'https://placehold.co/300x300/eff6ff/2563eb?text=Gripe', category: 'Baby Care', stock: 60, description: 'Herbal remedy for colic, gas, and stomach discomfort in infants. Alcohol-free and gentle formula.' },

    // Diabetes
    { id: 16, name: 'Glucochek Strips', price: 1500, originalPrice: 1600, discount: 6, image: 'https://placehold.co/300x300/f0fdf4/16a34a?text=Strips', category: 'Diabetes', stock: 12, description: 'Blood glucose test strips for Glucochek meters. Pack of 50 strips. Fast and accurate results in 5 seconds.' },
    { id: 17, name: 'Glucometer Device', price: 2500, originalPrice: 2800, discount: 11, image: 'https://placehold.co/300x300/f0fdf4/16a34a?text=Glucometer', category: 'Diabetes', stock: 8, description: 'Digital blood glucose monitoring device. Includes lancets, strips, and carrying case. Easy-to-read LCD display.' },
    { id: 18, name: 'Sugar Free Gold', price: 250, originalPrice: 280, discount: 11, image: 'https://placehold.co/300x300/f0fdf4/16a34a?text=SugarFree', category: 'Diabetes', stock: 45, description: 'Zero-calorie sweetener tablets. Safe for diabetics. 500 tablets per pack. No bitter aftertaste.' },

    // First Aid
    { id: 19, name: 'Dettol Antiseptic', price: 350, originalPrice: 380, discount: 8, image: 'https://placehold.co/300x300/fef9c3/ca8a04?text=Dettol', category: 'First Aid', stock: 40, description: 'Antiseptic liquid for wound cleaning and disinfection. Kills 99.9% germs. Multi-use protection.' },
    { id: 20, name: 'Band-Aid Pack', price: 180, originalPrice: 200, discount: 10, image: 'https://placehold.co/300x300/fef9c3/ca8a04?text=BandAid', category: 'First Aid', stock: 70, description: 'Assorted adhesive bandages for minor cuts and scrapes. Flexible fabric with non-stick pad. Pack of 30.' },
    { id: 21, name: 'Cotton Roll 500g', price: 150, originalPrice: 160, discount: 6, image: 'https://placehold.co/300x300/fef9c3/ca8a04?text=Cotton', category: 'First Aid', stock: 90, description: 'Medical-grade absorbent cotton roll. 500g pack. Ideal for wound dressing and first aid applications.' },
    { id: 22, name: 'Burnol Cream', price: 95, originalPrice: 110, discount: 14, image: 'https://placehold.co/300x300/fef9c3/ca8a04?text=Burnol', category: 'First Aid', stock: 55, description: 'Antiseptic burn cream for minor burns, cuts, and wounds. Soothes pain and prevents infection.' },

    // Nutrition
    { id: 23, name: 'Ensure Milk', price: 1600, originalPrice: 1800, discount: 11, image: 'https://placehold.co/300x300/faf5ff/9333ea?text=Ensure', category: 'Nutrition', stock: 10, description: 'Complete, balanced nutrition drink for adults. Rich in 32 essential nutrients. Vanilla flavor, 400g tin.' },
    { id: 24, name: 'Glucerna Shake', price: 1800, originalPrice: 2000, discount: 10, image: 'https://placehold.co/300x300/faf5ff/9333ea?text=Glucerna', category: 'Nutrition', stock: 8, description: 'Specialized nutrition for people with diabetes. Slow-release carbs help manage blood sugar. Chocolate flavor.' },
    { id: 25, name: 'Complan Chocolate', price: 750, originalPrice: 850, discount: 12, image: 'https://placehold.co/300x300/faf5ff/9333ea?text=Complan', category: 'Nutrition', stock: 22, description: 'Nutritional supplement drink with 34 vital nutrients. Supports growth and immunity. Chocolate flavor, 500g.' },
]

export const categories = [
    'Pain Relief',
    'Vitamins',
    'Skin Care',
    'Baby Care',
    'Diabetes',
    'First Aid',
    'Nutrition'
]

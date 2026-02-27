export const CATEGORIES_DATA = [
    {
        id: 'medicine',
        name: 'Medicine',
        bgColor: 'bg-blue-100',
        letterColor: 'text-blue-600',
        isFeatured: true,
        subcategories: [
            {
                id: 'derma',
                name: 'Derma',
                items: [
                    { id: 'eczema', name: 'Eczema' },
                    { id: 'acne', name: 'Acne' },
                    { id: 'skin-whitening', name: 'Skin Whitening' },
                    { id: 'hair-growth', name: 'Hair Growth' },
                    { id: 'scabies', name: 'Scabies' },
                    { id: 'dry-skin', name: 'Dry Skin' },
                    { id: 'melasma', name: 'Melasma' },
                ]
            },
            {
                id: 'gastro-intestinal',
                name: 'Gastro-Intestinal',
                items: [
                    { id: 'stomach-care', name: 'Stomach Care' },
                    { id: 'acidity-ulcers', name: 'Acidity & Ulcers' },
                    { id: 'probiotics', name: 'Probiotics' },
                    { id: 'diarrhoea', name: 'Diarrhoea' },
                    { id: 'heartburn', name: 'Heartburn & Indigestion' },
                ]
            },
            {
                id: 'infections',
                name: 'Infections',
                items: [
                    { id: 'bacterial-infection', name: 'Bacterial Infection' },
                    { id: 'viral-infection', name: 'Viral Infection' },
                    { id: 'fungal-infection', name: 'Fungal Infection' },
                ]
            },
            {
                id: 'bones-joints',
                name: 'Bones & Joints',
                items: [
                    { id: 'pain-inflammation', name: 'Pain & Inflammation' },
                    { id: 'muscle-relaxant', name: 'Muscle Relaxant' },
                    { id: 'osteoporosis', name: 'Osteoporosis' },
                    { id: 'arthritis', name: 'Arthritis' },
                ]
            },
            {
                id: 'respiratory',
                name: 'Respiratory',
                items: [
                    { id: 'fever-cough', name: 'Fever & Cough' },
                    { id: 'asthma', name: 'Asthma' },
                    { id: 'allergy', name: 'Allergy' },
                ]
            },
            {
                id: 'cardio-vascular',
                name: 'Cardio-Vascular',
                items: [
                    { id: 'hypertension', name: 'Hypertension' },
                    { id: 'cholesterol', name: 'Cholesterol Control' },
                    { id: 'heart-failure', name: 'Heart Failure' },
                ]
            },
        ]
    },
    {
        id: 'nutritions-supplements',
        name: 'Nutritions & Supplements',
        bgColor: 'bg-green-100',
        letterColor: 'text-green-600',
        isFeatured: true,
        subcategories: [
            {
                id: 'multivitamins',
                name: 'Multivitamins',
                items: [
                    { id: 'pregnancy-care', name: 'Pregnancy Care' },
                    { id: 'fish-oil-omega', name: 'Fish Oil & Omega 3' },
                    { id: 'calcium-minerals', name: 'Calcium & Minerals' },
                    { id: 'brain-memory', name: 'Brain & Memory' },
                    { id: 'bones-joints-care', name: 'Bones & Joints Care' },
                    { id: 'liver-care', name: 'Liver Care' },
                ]
            },
            {
                id: 'nutritional-drinks',
                name: 'Nutritional Drinks',
                items: [
                    { id: 'protein-shakes', name: 'Protein Shakes' },
                    { id: 'energy-drinks', name: 'Energy Drinks' },
                    { id: 'weight-gainers', name: 'Weight Gainers' },
                ]
            },
            {
                id: 'herbal-supplements',
                name: 'Herbal Supplements',
                items: [
                    { id: 'ginger-capsules', name: 'Ginger Capsules' },
                    { id: 'turmeric-pills', name: 'Turmeric Pills' },
                    { id: 'moringa', name: 'Moringa Powder' },
                ]
            },
        ]
    },
    {
        id: 'foods-beverages',
        name: 'Foods & Beverages',
        bgColor: 'bg-orange-100',
        letterColor: 'text-orange-600',
        isFeatured: true,
        subcategories: [
            {
                id: 'organic-foods',
                name: 'Organic Foods',
                items: [
                    { id: 'natural-honey', name: 'Natural Honey' },
                    { id: 'olive-oil', name: 'Extra Virgin Olive Oil' },
                    { id: 'organic-grains', name: 'Organic Grains' },
                ]
            },
            {
                id: 'beverages',
                name: 'Beverages',
                items: [
                    { id: 'green-tea', name: 'Green Tea' },
                    { id: 'herbal-tea', name: 'Herbal Tea' },
                    { id: 'detox-juice', name: 'Detox Juice' },
                ]
            },
            {
                id: 'healthy-snacks',
                name: 'Healthy Snacks',
                items: [
                    { id: 'dry-fruits', name: 'Dry Fruits' },
                    { id: 'organic-nuts', name: 'Organic Nuts' },
                    { id: 'seed-mixes', name: 'Seed Mixes' },
                ]
            },
        ]
    },
    {
        id: 'devices-appliances',
        name: 'Devices & Appliances',
        bgColor: 'bg-emerald-100',
        letterColor: 'text-emerald-600',
        isFeatured: true,
        subcategories: [
            {
                id: 'monitoring-devices',
                name: 'Monitoring Devices',
                items: [
                    { id: 'bp-monitors', name: 'Digital BP Monitors' },
                    { id: 'glucometers', name: 'Glucometers' },
                    { id: 'thermometers', name: 'Thermometers' },
                    { id: 'pulse-oximeters', name: 'Pulse Oximeters' },
                ]
            },
            {
                id: 'rehab-support',
                name: 'Rehab & Support',
                items: [
                    { id: 'knee-support', name: 'Knee Support' },
                    { id: 'back-braces', name: 'Back Braces' },
                    { id: 'walking-sticks', name: 'Walking Sticks' },
                ]
            },
        ]
    },
    {
        id: 'personal-care',
        name: 'Personal Care',
        bgColor: 'bg-pink-100',
        letterColor: 'text-pink-600',
        isFeatured: true,
        subcategories: [
            {
                id: 'skin-care',
                name: 'Skin Care',
                items: [
                    { id: 'moisturizers', name: 'Moisturizers' },
                    { id: 'sunblocks', name: 'Sunblocks' },
                    { id: 'face-wash', name: 'Face Wash' },
                    { id: 'anti-aging', name: 'Anti-aging' },
                ]
            },
            {
                id: 'hair-care',
                name: 'Hair Care',
                items: [
                    { id: 'anti-dandruff', name: 'Anti-dandruff Shampoo' },
                    { id: 'hair-serum', name: 'Hair Serum' },
                    { id: 'herbal-oils', name: 'Herbal Oils' },
                ]
            },
            {
                id: 'oral-care',
                name: 'Oral Care',
                items: [
                    { id: 'toothpaste', name: 'Toothpaste' },
                    { id: 'mouthwash', name: 'Mouthwash' },
                    { id: 'dental-floss', name: 'Dental Floss' },
                ]
            },
        ]
    },
    {
        id: 'baby-care',
        name: 'Baby Care',
        bgColor: 'bg-sky-100',
        letterColor: 'text-sky-600',
        isFeatured: true,
        subcategories: [
            {
                id: 'diapers-wipes',
                name: 'Diapers & Wipes',
                items: [
                    { id: 'newborn-diapers', name: 'Newborn Diapers' },
                    { id: 'baby-wipes', name: 'Baby Wipes' },
                    { id: 'diaper-rash-cream', name: 'Diaper Rash Cream' },
                ]
            },
            {
                id: 'baby-nutrition',
                name: 'Baby Nutrition',
                items: [
                    { id: 'infant-formula', name: 'Infant Formula' },
                    { id: 'baby-cereal', name: 'Baby Cereal' },
                    { id: 'gripe-water', name: 'Gripe Water' },
                ]
            },
            {
                id: 'baby-skin-care',
                name: 'Baby Skin Care',
                items: [
                    { id: 'baby-lotion', name: 'Baby Lotion' },
                    { id: 'baby-oil', name: 'Baby Oil' },
                    { id: 'baby-shampoo', name: 'Baby Shampoo' },
                ]
            },
        ]
    },
]

// Helper: find a category by its ID
export function findCategoryById(categoryId) {
    return CATEGORIES_DATA.find(c => c.id === categoryId)
}

// Helper: find a subcategory by its ID inside a category
export function findSubcategoryById(categoryId, subcategoryId) {
    const cat = findCategoryById(categoryId)
    if (!cat) return null
    return cat.subcategories.find(s => s.id === subcategoryId)
}

// Helper: get featured categories for homepage
export function getFeaturedCategories() {
    return CATEGORIES_DATA.filter(c => c.isFeatured)
}

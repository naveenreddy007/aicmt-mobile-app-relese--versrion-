-- Seed data for testing

-- Insert sample products
INSERT INTO products (name, code, description, features, specifications, price, image_url, category, is_active)
VALUES
    ('Biodegradable Shopping Bags', 'BSB-001', 'Eco-friendly shopping bags that decompose naturally.', 
     '["100% biodegradable", "Strong and durable", "Custom printing available", "Various sizes"]', 
     '{"material": "PLA and PBAT blend", "thickness": "25 microns", "sizes": ["small", "medium", "large"], "load_capacity": "5kg"}', 
     '₹12.99', '/images/shop/biodegradable-bags.png', 'bags', true),
    
    ('Compostable Food Containers', 'CFC-002', 'Food-safe containers perfect for takeaway and food delivery.', 
     '["Microwave safe", "Oil and water resistant", "No plastic or wax lining", "Suitable for hot and cold foods"]', 
     '{"material": "Bagasse", "sizes": ["8oz", "16oz", "32oz"], "temperature_range": "-20°C to 120°C", "certifications": ["ASTM D6400", "EN13432"]}', 
     '₹15.99', '/images/shop/compostable-containers.png', 'containers', true),
    
    ('Biodegradable Cutlery Set', 'BCS-003', 'Durable cutlery that breaks down naturally after disposal.', 
     '["Heat resistant", "Sturdy design", "No plastic additives", "Compostable in industrial facilities"]', 
     '{"material": "PLA", "items_per_set": 24, "includes": ["forks", "knives", "spoons"], "color": "natural"}', 
     '₹8.99', '/images/shop/biodegradable-cutlery.png', 'cutlery', true),
    
    ('Eco-Friendly Packaging Film', 'EPF-004', 'Transparent film for packaging that biodegrades in natural environments.', 
     '["Crystal clear", "Excellent barrier properties", "Printable surface", "Biodegrades in soil"]', 
     '{"material": "PBAT and PLA blend", "thickness": "15-30 microns", "width": "up to 1.2m", "transparency": "92%"}', 
     '₹29.99', '/images/shop/eco-packaging.png', 'packaging', true);

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, featured_image_url, status, published_at)
VALUES
    ('The Future of Sustainable Packaging', 'future-of-sustainable-packaging', 
     '# The Future of Sustainable Packaging\n\nSustainable packaging is rapidly evolving as businesses and consumers alike recognize the urgent need to reduce plastic waste and environmental impact. This blog explores the latest trends and innovations in eco-friendly packaging solutions.\n\n## Biodegradable Materials\n\nOne of the most significant advancements in sustainable packaging is the development of truly biodegradable materials. Unlike traditional plastics that can take hundreds of years to break down, these new materials decompose naturally within months under the right conditions.\n\n## Compostable Alternatives\n\nCompostable packaging goes a step further by not only breaking down but also providing nutrients to the soil. Materials like bagasse (sugarcane fiber), mushroom packaging, and seaweed-based films are gaining popularity for their minimal environmental footprint.\n\n## Circular Economy Approaches\n\nThe concept of a circular economy is central to the future of packaging. This involves designing products that can be reused, recycled, or composted, eliminating waste and pollution from the start.\n\n## Regulatory Changes\n\nGovernments worldwide are implementing stricter regulations on single-use plastics, driving innovation in the packaging industry. These policies are accelerating the transition to more sustainable alternatives.\n\n## Consumer Awareness\n\nIncreasing consumer awareness about environmental issues is putting pressure on brands to adopt more sustainable packaging solutions. Companies that embrace eco-friendly packaging often gain a competitive edge in the market.\n\n## Conclusion\n\nThe future of sustainable packaging looks promising, with continuous innovations addressing the environmental challenges posed by traditional packaging materials. As technology advances and awareness grows, we can expect even more creative and effective solutions to emerge.',
     'Explore the latest trends and innovations in sustainable packaging solutions that are shaping the future of the industry.',
     '/images/blog/sustainable-packaging-trends.png', 'published', '2023-11-15T10:00:00Z'),
    
    ('Biodegradable vs. Compostable: Understanding the Difference', 'biodegradable-vs-compostable', 
     '# Biodegradable vs. Compostable: Understanding the Difference\n\nThe terms "biodegradable" and "compostable" are often used interchangeably, but they represent different processes and outcomes. This blog post clarifies these important distinctions to help consumers make more informed choices.\n\n## What Does Biodegradable Mean?\n\nBiodegradable materials break down naturally through biological processes, returning to nature over time. However, there''s no specific timeframe for this process, and some "biodegradable" products may still take years or decades to fully decompose.\n\n## What Does Compostable Mean?\n\nCompostable materials not only break down but do so in a specific timeframe (typically around 90 days) and in specific composting conditions. Additionally, they leave no toxic residue and can actually benefit the soil as they decompose.\n\n## Key Differences\n\n1. **Timeframe**: Biodegradable has no time requirement, while compostable materials must break down within a specific period.\n2. **End Result**: Biodegradable materials simply break down, while compostable materials convert into nutrient-rich compost.\n3. **Certification**: Compostable products often meet specific standards (like ASTM D6400 or EN13432), while "biodegradable" has fewer regulatory definitions.\n4. **Environmental Impact**: Not all biodegradable materials are beneficial to the environment, whereas properly composted materials contribute positively to soil health.\n\n## Making Informed Choices\n\nWhen selecting products, look for specific certifications rather than vague claims. Products certified as compostable by recognized organizations have been tested to ensure they break down completely in composting facilities without leaving harmful residues.\n\n## Conclusion\n\nUnderstanding the difference between biodegradable and compostable is crucial for making environmentally responsible choices. While both options are generally better than non-degradable plastics, compostable materials typically offer superior environmental benefits when properly disposed of.',
     'Learn the crucial differences between biodegradable and compostable materials to make more informed environmental choices.',
     '/images/blog/biodegradable-vs-compostable.png', 'published', '2023-12-05T14:30:00Z');

-- Insert sample inquiries
INSERT INTO inquiries (name, email, company, phone, message, product_interest, status, notes)
VALUES
    ('Raj Patel', 'raj.patel@greenretail.com', 'Green Retail Solutions', '+91 98765 43210', 
     'We are interested in your biodegradable shopping bags for our retail chain. Could you please send us samples and bulk pricing information?', 
     'Biodegradable Shopping Bags', 'in_progress', 'Sent samples on 2023-12-10. Following up next week.'),
    
    ('Priya Sharma', 'priya@ecofooddelivery.in', 'Eco Food Delivery', '+91 87654 32109', 
     'Looking for compostable food containers for our food delivery service. Need approximately 10,000 units per month. Please provide details on customization options.', 
     'Compostable Food Containers', 'new', NULL),
    
    ('Amit Singh', 'amit.singh@hotelgroup.com', 'Sustainable Hospitality Group', '+91 76543 21098', 
     'Our hotel chain is transitioning to eco-friendly products. Interested in your full range of biodegradable products for our restaurants and room service.', 
     'Multiple Products', 'completed', 'Contract signed for 12-month supply. Initial order placed.'),
    
    ('Sarah Johnson', 'sarah@globalbrands.com', 'Global Brands Inc.', '+1 555-123-4567', 
     'We are a multinational company looking to replace our packaging with sustainable alternatives. Would like to discuss partnership opportunities.', 
     'Eco-Friendly Packaging Film', 'new', NULL);

-- Certifications table does not exist, skipping certification data

-- Testimonials table does not exist, skipping testimonials data

-- Insert sample SEO metadata
INSERT INTO seo_metadata (page_path, title, description, keywords, og_image)
VALUES
    ('/', 'AICMT International - Biodegradable Solutions for a Sustainable Future', 
     'AICMT International provides innovative biodegradable and compostable plastic alternatives for businesses committed to sustainability.', 
     ARRAY['biodegradable plastics', 'compostable packaging', 'sustainable solutions', 'eco-friendly products'], 
     '/images/banners/home-banner.jpg'),
    
    ('/products', 'Sustainable Products - AICMT International', 
     'Explore our range of biodegradable and compostable products designed for businesses transitioning to sustainable packaging solutions.', 
     ARRAY['biodegradable products', 'compostable packaging', 'eco-friendly alternatives', 'sustainable business'], 
     '/images/banners/products-banner.jpg'),
    
    ('/about', 'About AICMT International - Our Sustainability Journey', 
     'Learn about AICMT International''s mission to provide innovative biodegradable solutions and our commitment to environmental sustainability.', 
     ARRAY['about AICMT', 'sustainability mission', 'biodegradable innovation', 'eco-friendly company'], 
     '/images/banners/about-banner.jpg'),
    
    ('/blog', 'Sustainability Blog - AICMT International', 
     'Stay informed about the latest trends, innovations, and insights in sustainable packaging and environmental responsibility.', 
     ARRAY['sustainability blog', 'biodegradable news', 'environmental insights', 'packaging innovation'], 
     '/images/banners/blog-banner.jpg');

-- Populate stories and gallery data
\i supabase/migrations/populate_journey_milestones.sql
\i supabase/migrations/populate_team_members.sql
\i supabase/migrations/populate_achievements.sql
\i supabase/migrations/populate_impact_stories.sql
\i supabase/migrations/populate_gallery.sql

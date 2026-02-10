INSERT INTO public."attraction" (
    "Name",
    "Description",
    "Category",
    "Province",
    "ImageUrl",
    "Latitude",
    "Longitude",
    "DistanceKm",
    "Rating",
    "IsActive",
    "CreatedAt"
)
SELECT
    v."Name",
    v."Description",
    v."Category",
    v."Province",
    v."ImageUrl",
    v."Latitude",
    v."Longitude",
    v."DistanceKm",
    v."Rating",
    true,
    NOW()
FROM (
    VALUES
        (
            'Plaza de Mayo',
            'Historic square in Buenos Aires, site of important political events.',
            'culture',
            'Buenos Aires',
            'http://static.photos/cityscape/640x360/101',
            -34.6083,
            -58.3712,
            1.2,
            4.7
        ),
        (
            'Iguazu Falls',
            'Massive waterfalls on the border with Brazil, surrounded by rainforest.',
            'nature',
            'Misiones',
            'http://static.photos/nature/640x360/202',
            -25.6953,
            -54.4367,
            3.5,
            4.9
        ),
        (
            'Cafe Tortoni',
            'Historic cafe in Buenos Aires, famous for tango shows.',
            'food',
            'Buenos Aires',
            'http://static.photos/restaurant/640x360/303',
            -34.6087,
            -58.3782,
            0.8,
            4.5
        ),
        (
            'Cerro Fitz Roy',
            'Iconic mountain peak in Patagonia, popular for hiking.',
            'adventure',
            'Santa Cruz',
            'http://static.photos/outdoor/640x360/404',
            -49.2718,
            -73.0436,
            25.0,
            4.8
        ),
        (
            'Mendoza Wine Region',
            'World-renowned wine producing area with beautiful vineyards.',
            'food',
            'Mendoza',
            'http://static.photos/travel/640x360/505',
            -32.8895,
            -68.8458,
            15.5,
            4.6
        ),
        (
            'Quebrada de Humahuaca',
            'Colorful mountain valley with indigenous cultural heritage.',
            'nature',
            'Jujuy',
            'http://static.photos/abstract/640x360/606',
            -23.2054,
            -65.3487,
            8.7,
            4.7
        ),
        (
            'Teatro Colon',
            'World-class opera house in Buenos Aires with stunning architecture.',
            'culture',
            'Buenos Aires',
            'http://static.photos/indoor/640x360/707',
            -34.6011,
            -58.3830,
            1.5,
            4.8
        ),
        (
            'Glaciar Perito Moreno',
            'Massive glacier that is constantly advancing and calving.',
            'nature',
            'Santa Cruz',
            'http://static.photos/white/640x360/808',
            -50.4952,
            -73.0456,
            32.0,
            4.9
        )
) AS v(
    "Name",
    "Description",
    "Category",
    "Province",
    "ImageUrl",
    "Latitude",
    "Longitude",
    "DistanceKm",
    "Rating"
)
LEFT JOIN public."attraction" a ON a."Name" = v."Name"
WHERE a."AttractionId" IS NULL;
